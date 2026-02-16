import { copyFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const schemasDir = join(__dirname, "..", "schemas");
const siteDir = join(__dirname, "..", "site");
const resourceSchemasDir = join(schemasDir, "resources");
const supportingSchemasDir = join(schemasDir, "supporting");
const resourcePagesDir = join(siteDir, "resources");
const dataTypePagesDir = join(siteDir, "data-types");

// All known BIND supporting/data-type names (used for linking)
const supportingTypeNames = new Set<string>();

// Resource categories for the index page and sidebar
const resourceCategories: { name: string; items: string[] }[] = [
  { name: "Infrastructure", items: ["Bundle"] },
  { name: "Parties", items: ["Insured", "Organization", "Person", "PersonRole"] },
  { name: "Workflow", items: ["Submission", "Quote"] },
  { name: "Contract", items: ["Policy", "Coverage"] },
  { name: "Risk & Property", items: ["Risk", "Location"] },
  { name: "Claims", items: ["Claim"] },
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SchemaProperty {
  type?: string;
  $ref?: string;
  description?: string;
  enum?: string[];
  const?: string | number | boolean;
  format?: string;
  items?: SchemaProperty;
  properties?: Record<string, SchemaProperty>;
  required?: string[];
  default?: unknown;
  minimum?: number;
  maximum?: number;
  examples?: unknown[];
  additionalProperties?: boolean;
}

interface SchemaDefinition extends SchemaProperty {
  type: string;
  properties?: Record<string, SchemaProperty>;
  required?: string[];
  description?: string;
  examples?: unknown[];
}

interface Schema {
  $ref?: string;
  definitions?: Record<string, SchemaDefinition>;
  title?: string;
  $id?: string;
}

// Tree node for the Vue component
interface TreeNode {
  name: string;
  card: string;
  type: string;
  typeUrl?: string;
  description: string;
  children?: TreeNode[];
  required?: boolean;
  isArray?: boolean;
  terminologyUrl?: string;
}

// ---------------------------------------------------------------------------
// Terminology extraction from TypeScript source
// ---------------------------------------------------------------------------

const TERMINOLOGY_PLAYGROUND_BASE = "https://playground.bind-standard.org/terminology";

/**
 * Parse all @terminology annotations from TypeScript source files.
 * Returns a map: "InterfaceName.propertyName" → playground URL
 */
function buildTerminologyMap(): Map<string, string> {
  const srcDir = resolve(__dirname, "..", "src", "types");
  const map = new Map<string, string>();

  for (const file of readdirSync(srcDir)) {
    if (!file.endsWith(".ts")) continue;
    const content = readFileSync(join(srcDir, file), "utf-8");

    // Match interface blocks and their properties with @terminology annotations
    const interfaceRegex = /export\s+interface\s+(\w+)[\s\S]*?^\}/gm;
    let ifaceMatch: RegExpExecArray | null;

    while ((ifaceMatch = interfaceRegex.exec(content)) !== null) {
      const ifaceName = ifaceMatch[1];
      const ifaceBody = ifaceMatch[0];

      // Find JSDoc blocks with @terminology followed by a property name
      const propRegex =
        /@terminology\s+(https:\/\/bind\.codes\/(\w+))\s+\w+[\s\S]*?\n\s+(\w+)\s*[?:].*?;/g;
      let propMatch: RegExpExecArray | null;

      while ((propMatch = propRegex.exec(ifaceBody)) !== null) {
        const codeSetId = propMatch[2];
        const propName = propMatch[3];
        const url = `${TERMINOLOGY_PLAYGROUND_BASE}/${codeSetId}`;
        map.set(`${ifaceName}.${propName}`, url);
      }
    }
  }

  return map;
}

const terminologyMap = buildTerminologyMap();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function loadSchema(filePath: string): Schema {
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

function resolveRefName(ref: string): string {
  return ref.replace("#/definitions/", "");
}

function isKnownDataType(name: string): boolean {
  return supportingTypeNames.has(name);
}

function typeUrl(typeName: string): string | undefined {
  if (isKnownDataType(typeName)) {
    return `/data-types/${typeName}`;
  }
  const resourceNames = resourceCategories.flatMap((c) => c.items);
  if (resourceNames.includes(typeName)) {
    return `/resources/${typeName}`;
  }
  return undefined;
}

function formatEnumValues(values: string[]): string {
  return values.map((v) => `${v}`).join(" | ");
}

function firstSentence(desc: string | undefined): string {
  if (!desc) return "";
  const match = desc.match(/^(.+?\.)\s/);
  return match ? match[1] : desc.split("\n")[0];
}

// ---------------------------------------------------------------------------
// Schema → Tree nodes
// ---------------------------------------------------------------------------

function walkProperties(
  props: Record<string, SchemaProperty>,
  requiredFields: string[],
  definitions: Record<string, SchemaDefinition>,
  parentTypeName?: string,
): TreeNode[] {
  const nodes: TreeNode[] = [];

  for (const [propName, prop] of Object.entries(props)) {
    const isRequired = requiredFields.includes(propName);
    const isArray = prop.type === "array";

    // Cardinality
    let card: string;
    if (isRequired) {
      card = isArray ? "1..*" : "1..1";
    } else {
      card = isArray ? "0..*" : "0..1";
    }

    // Type display and URL
    let typeDisplay: string;
    let url: string | undefined;

    if (prop.const !== undefined) {
      typeDisplay = `"${prop.const}"`;
    } else if (prop.enum) {
      typeDisplay = formatEnumValues(prop.enum);
    } else if (prop.$ref) {
      const refName = resolveRefName(prop.$ref);
      typeDisplay = refName;
      url = typeUrl(refName);
    } else if (isArray && prop.items) {
      if (prop.items.$ref) {
        const refName = resolveRefName(prop.items.$ref);
        typeDisplay = refName;
        url = typeUrl(refName);
      } else if (prop.items.type === "string") {
        typeDisplay = "string[]";
      } else if (prop.items.type) {
        typeDisplay = `${prop.items.type}[]`;
      } else {
        typeDisplay = "array";
      }
    } else if (prop.type) {
      typeDisplay = prop.type;
    } else if (prop.properties) {
      typeDisplay = "(object)";
    } else {
      typeDisplay = "";
    }

    const desc = firstSentence(prop.description);

    // Build children from inline objects
    let children: TreeNode[] | undefined;

    if (prop.properties && !prop.$ref) {
      const childRequired = prop.required || [];
      children = walkProperties(prop.properties, childRequired, definitions, parentTypeName);
    }

    if (isArray && prop.items && prop.items.properties && !prop.items.$ref) {
      const childRequired = prop.items.required || [];
      children = walkProperties(prop.items.properties, childRequired, definitions, parentTypeName);
    }

    // Look up terminology URL
    const termUrl = parentTypeName
      ? terminologyMap.get(`${parentTypeName}.${propName}`)
      : undefined;

    const node: TreeNode = {
      name: propName,
      card,
      type: typeDisplay,
      description: desc,
      required: isRequired || undefined,
      isArray: isArray || undefined,
    };
    if (url) node.typeUrl = url;
    if (termUrl) node.terminologyUrl = termUrl;
    if (children && children.length > 0) node.children = children;

    nodes.push(node);
  }

  return nodes;
}

// ---------------------------------------------------------------------------
// Page generation
// ---------------------------------------------------------------------------

function generateDetailPage(
  typeName: string,
  schema: Schema,
  _fromSection: "resources" | "data-types",
): string {
  const rootRef = schema.$ref ? resolveRefName(schema.$ref) : typeName;
  const definitions = schema.definitions || {};
  const rootDef = definitions[rootRef];

  if (!rootDef) {
    console.error(`  ✗ ${typeName}: root definition not found`);
    return `# ${typeName}\n\nSchema definition not found.\n`;
  }

  const lines: string[] = [];

  // Title
  lines.push(`# ${typeName}`);
  lines.push("");

  // Description
  if (rootDef.description) {
    lines.push(rootDef.description.split("\n\n")[0]);
    lines.push("");
  }

  // Structure tree (Vue component)
  if (rootDef.properties) {
    lines.push("## Structure");
    lines.push("");

    const requiredFields = rootDef.required || [];
    const treeData = walkProperties(rootDef.properties, requiredFields, definitions, typeName);
    const rootDesc = rootDef.description ? firstSentence(rootDef.description) : "";

    // Emit as a Vue component with JSON props
    // We use the script setup pattern in the markdown
    lines.push(`<script setup>`);
    lines.push(`const treeData = ${JSON.stringify(treeData)};`);
    lines.push(`</script>`);
    lines.push("");
    lines.push(
      `<StructureTree :data="treeData" rootName="${typeName}" rootDescription="${escapeAttr(rootDesc)}" />`,
    );
    lines.push("");
  }

  // Terminology Browser section for Coding and CodeableConcept
  if (typeName === "Coding") {
    lines.push("## Terminology Browser");
    lines.push("");
    lines.push(
      "The `system` field references a BIND code set URI (e.g. `https://bind.codes/LineOfBusiness`). " +
        "You can browse all available code sets and their values in the " +
        "[Terminology Browser](https://playground.bind-standard.org/terminology/).",
    );
    lines.push("");
    lines.push(
      "To look up a specific code set, navigate to " +
        "`https://playground.bind-standard.org/terminology/{CodeSetId}` — for example, " +
        "[LineOfBusiness](https://playground.bind-standard.org/terminology/LineOfBusiness).",
    );
    lines.push("");
  } else if (typeName === "CodeableConcept") {
    lines.push("## Terminology Browser");
    lines.push("");
    lines.push(
      "Each `Coding` within a CodeableConcept references a code set via its `system` URI. " +
        "Browse all BIND code sets and their values in the " +
        "[Terminology Browser](https://playground.bind-standard.org/terminology/).",
    );
    lines.push("");
  }

  // Example
  if (rootDef.examples && rootDef.examples.length > 0) {
    lines.push("## Example");
    lines.push("");
    lines.push("```json");
    lines.push(JSON.stringify(rootDef.examples[0], null, 2));
    lines.push("```");
    lines.push("");
  }

  // JSON Schema link
  lines.push("## JSON Schema");
  lines.push("");
  lines.push(`Full JSON Schema: [\`${typeName}.schema.json\`](/schema/${typeName}.schema.json)`);
  lines.push("");

  return lines.join("\n");
}

function escapeAttr(s: string): string {
  return s.replace(/"/g, "&quot;").replace(/\n/g, " ");
}

// ---------------------------------------------------------------------------
// Index pages
// ---------------------------------------------------------------------------

function generateResourceIndex(resourceSchemas: Map<string, Schema>): string {
  const lines: string[] = [];

  lines.push("# Resources");
  lines.push("");
  lines.push(
    "BIND resources are the core building blocks of the standard. Each resource represents a distinct concept in insurance.",
  );
  lines.push("");

  for (const cat of resourceCategories) {
    lines.push(`## ${cat.name}`);
    lines.push("");
    lines.push("| Resource | Description |");
    lines.push("|----------|-------------|");

    for (const name of cat.items) {
      const schema = resourceSchemas.get(name);
      let desc = "";
      if (schema) {
        const rootRef = schema.$ref ? resolveRefName(schema.$ref) : name;
        const rootDef = schema.definitions?.[rootRef];
        if (rootDef?.description) {
          desc = firstSentence(rootDef.description);
        }
      }
      lines.push(`| [${name}](/resources/${name}) | ${desc} |`);
    }

    lines.push("");
  }

  return lines.join("\n");
}

function generateDataTypesIndex(supportingSchemas: Map<string, Schema>): string {
  const lines: string[] = [];

  lines.push("# Data Types");
  lines.push("");
  lines.push(
    "Data types are reusable structures shared across BIND resources. They represent common concepts like monetary values, coded references, addresses, and time periods.",
  );
  lines.push("");

  lines.push("| Data Type | Description |");
  lines.push("|-----------|-------------|");

  const sorted = [...supportingSchemas.entries()].sort((a, b) => a[0].localeCompare(b[0]));

  for (const [name, schema] of sorted) {
    const rootRef = schema.$ref ? resolveRefName(schema.$ref) : name;
    const rootDef = schema.definitions?.[rootRef];
    const desc = rootDef?.description ? firstSentence(rootDef.description) : "";
    lines.push(`| [${name}](/data-types/${name}) | ${desc} |`);
  }

  lines.push("");

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Sidebar config
// ---------------------------------------------------------------------------

interface SidebarItem {
  text: string;
  link?: string;
  items?: SidebarItem[];
}

function generateSidebarConfig(supportingNames: string[]): Record<string, SidebarItem[]> {
  const resourceSidebar: SidebarItem[] = [{ text: "Resource Index", link: "/resources/" }];

  for (const cat of resourceCategories) {
    resourceSidebar.push({
      text: cat.name,
      items: cat.items.map((name) => ({
        text: name,
        link: `/resources/${name}`,
      })),
    });
  }

  const dataTypeSidebar: SidebarItem[] = [{ text: "Data Types Index", link: "/data-types/" }];

  const sorted = [...supportingNames].sort();
  for (const name of sorted) {
    dataTypeSidebar.push({
      text: name,
      link: `/data-types/${name}`,
    });
  }

  return {
    "/resources/": resourceSidebar,
    "/data-types/": dataTypeSidebar,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  console.log("Generating BIND documentation pages...\n");

  mkdirSync(resourcePagesDir, { recursive: true });
  mkdirSync(dataTypePagesDir, { recursive: true });

  // Load supporting schemas first (for type linking)
  const supportingSchemas = new Map<string, Schema>();
  for (const file of readdirSync(supportingSchemasDir)) {
    if (!file.endsWith(".schema.json")) continue;
    const name = basename(file, ".schema.json");
    supportingTypeNames.add(name);
    supportingSchemas.set(name, loadSchema(join(supportingSchemasDir, file)));
  }

  // Load resource schemas
  const resourceSchemas = new Map<string, Schema>();
  for (const file of readdirSync(resourceSchemasDir)) {
    if (!file.endsWith(".schema.json")) continue;
    const name = basename(file, ".schema.json");
    resourceSchemas.set(name, loadSchema(join(resourceSchemasDir, file)));
  }

  // Generate resource detail pages
  let successCount = 0;
  for (const [name, schema] of resourceSchemas) {
    const md = generateDetailPage(name, schema, "resources");
    writeFileSync(join(resourcePagesDir, `${name}.md`), md);
    console.log(`  ✓ resources/${name}.md`);
    successCount++;
  }

  // Generate data-type detail pages
  for (const [name, schema] of supportingSchemas) {
    const md = generateDetailPage(name, schema, "data-types");
    writeFileSync(join(dataTypePagesDir, `${name}.md`), md);
    console.log(`  ✓ data-types/${name}.md`);
    successCount++;
  }

  // Generate resource index
  const resourceIndexMd = generateResourceIndex(resourceSchemas);
  writeFileSync(join(resourcePagesDir, "index.md"), resourceIndexMd);
  console.log(`  ✓ resources/index.md`);

  // Generate data-types index
  const dataTypesIndexMd = generateDataTypesIndex(supportingSchemas);
  writeFileSync(join(dataTypePagesDir, "index.md"), dataTypesIndexMd);
  console.log(`  ✓ data-types/index.md`);

  // Generate sidebar config
  const sidebar = generateSidebarConfig([...supportingTypeNames]);
  writeFileSync(
    join(siteDir, ".vitepress", "sidebar.json"),
    `${JSON.stringify(sidebar, null, 2)}\n`,
  );
  console.log(`  ✓ .vitepress/sidebar.json`);

  // Copy schema files into public dir so they're served as static assets
  const publicSchemaDir = join(siteDir, "public", "schema");
  mkdirSync(publicSchemaDir, { recursive: true });

  for (const [name] of resourceSchemas) {
    copyFileSync(
      join(resourceSchemasDir, `${name}.schema.json`),
      join(publicSchemaDir, `${name}.schema.json`),
    );
  }
  for (const [name] of supportingSchemas) {
    copyFileSync(
      join(supportingSchemasDir, `${name}.schema.json`),
      join(publicSchemaDir, `${name}.schema.json`),
    );
  }
  console.log(`  ✓ public/schema/ (${resourceSchemas.size + supportingSchemas.size} files)`);

  console.log(`\nGenerated ${successCount} documentation pages.`);
}

main();
