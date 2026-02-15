import { readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

const schemasDir = join(__dirname, "..", "schemas");
const schemaDirs = [join(schemasDir, "resources"), join(schemasDir, "supporting")];

interface SchemaProperty {
  type?: string;
  description?: string;
  $ref?: string;
  const?: unknown;
  properties?: Record<string, SchemaProperty>;
  items?: SchemaProperty;
}

interface SchemaDefinition {
  type?: string;
  description?: string;
  properties?: Record<string, SchemaProperty>;
}

interface Schema {
  $ref?: string;
  definitions?: Record<string, SchemaDefinition>;
}

let errorCount = 0;

function reportError(typeName: string, message: string): void {
  console.error(`  ✗ ${typeName}: ${message}`);
  errorCount++;
}

for (const dir of schemaDirs) {
  const files = readdirSync(dir).filter((f) => f.endsWith(".schema.json"));

  for (const file of files) {
    const typeName = basename(file, ".schema.json");
    const schema: Schema = JSON.parse(readFileSync(join(dir, file), "utf-8"));

    // Resolve the root definition
    const rootRefName = schema.$ref ? schema.$ref.replace("#/definitions/", "") : typeName;
    const rootDef = schema.definitions?.[rootRefName];

    if (!rootDef) {
      reportError(typeName, "root definition not found");
      continue;
    }

    // Check root type has a description
    if (!rootDef.description) {
      reportError(typeName, "missing root description (add JSDoc to the type)");
    }

    // Check each property has a description
    if (rootDef.properties) {
      for (const [propName, prop] of Object.entries(rootDef.properties)) {
        // Skip const fields (e.g. resourceType discriminators) — they're self-documenting
        if (prop.const !== undefined) continue;

        if (!prop.description) {
          reportError(typeName, `property "${propName}" is missing a description`);
        }
      }
    }
  }
}

if (errorCount > 0) {
  console.error(`\n${errorCount} documentation issue(s) found.`);
  console.error("Add JSDoc comments to the TypeScript source types to fix these.");
  process.exit(1);
} else {
  console.log("All schema types and properties are documented.");
}
