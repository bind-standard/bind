"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_json_schema_generator_1 = require("ts-json-schema-generator");
const fs_1 = require("fs");
const path_1 = require("path");
// All BIND resource types (top-level resources with resourceType discriminator)
const resourceTypes = [
    "Insured",
    "Submission",
    "Quote",
    "Policy",
    "Coverage",
    "Claim",
    "Organization",
    "Location",
];
// Supporting types (used within resources)
const supportingTypes = [
    "Resource",
    "Meta",
    "Coding",
    "CodeableConcept",
    "Reference",
    "Period",
    "Money",
    "Quantity",
    "Address",
    "ContactPoint",
    "Attachment",
    "Endorsement",
    "CoverageLimit",
    "CoverageExtension",
    "Classification",
    "PremiumLineItem",
    "Subjectivity",
    "Claimant",
    "ClaimFinancials",
    "ClaimPayment",
];
const allTypes = [...resourceTypes, ...supportingTypes];
const schemasDir = (0, path_1.join)(__dirname, "..", "schemas");
const resourceSchemasDir = (0, path_1.join)(schemasDir, "resources");
const supportingSchemasDir = (0, path_1.join)(schemasDir, "supporting");
(0, fs_1.mkdirSync)(resourceSchemasDir, { recursive: true });
(0, fs_1.mkdirSync)(supportingSchemasDir, { recursive: true });
let successCount = 0;
let errorCount = 0;
for (const typeName of allTypes) {
    const config = {
        path: (0, path_1.join)(__dirname, "..", "src", "types", "index.ts"),
        tsconfig: (0, path_1.join)(__dirname, "..", "tsconfig.json"),
        type: typeName,
        expose: "export",
        jsDoc: "extended",
        additionalProperties: false,
    };
    try {
        const schema = (0, ts_json_schema_generator_1.createGenerator)(config).createSchema(typeName);
        // Add BIND-specific metadata
        schema["$id"] = `https://bind-standard.org/schema/${typeName}`;
        schema["title"] = typeName;
        const isResource = resourceTypes.includes(typeName);
        const outDir = isResource ? resourceSchemasDir : supportingSchemasDir;
        const outPath = (0, path_1.join)(outDir, `${typeName}.schema.json`);
        (0, fs_1.writeFileSync)(outPath, JSON.stringify(schema, null, 2) + "\n");
        console.log(`  ✓ ${typeName}`);
        successCount++;
    }
    catch (err) {
        console.error(`  ✗ ${typeName}: ${err.message}`);
        errorCount++;
    }
}
console.log(`\nGenerated ${successCount} schemas (${errorCount} errors) → schemas/`);
// Generate a master index of all schemas
const index = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "BIND Standard Schema Index",
    description: "Index of all BIND (Business Insurance Normalized Data) standard schemas.",
    resources: resourceTypes.map((t) => ({
        name: t,
        schema: `resources/${t}.schema.json`,
        uri: `https://bind-standard.org/schema/${t}`,
    })),
    supporting: supportingTypes.map((t) => ({
        name: t,
        schema: `supporting/${t}.schema.json`,
        uri: `https://bind-standard.org/schema/${t}`,
    })),
};
(0, fs_1.writeFileSync)((0, path_1.join)(schemasDir, "index.json"), JSON.stringify(index, null, 2) + "\n");
console.log("Generated schema index → schemas/index.json");
//# sourceMappingURL=generate-schemas.js.map