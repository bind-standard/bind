import { createGenerator, Config } from "ts-json-schema-generator";
import { writeFileSync, mkdirSync, readdirSync, readFileSync } from "fs";
import { join } from "path";

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
  "Risk",
  "Person",
  "PersonRole",
];

// Supporting types (used within resources)
const supportingTypes = [
  // Base types
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
  "GeoPoint",
  "Identifier",
  // Complex data types
  "HumanName",
  "GeoRegion",
  "MoneyWithConversion",
  "MultiCurrencyMoney",
  "DateTimePeriod",
  // Insurance domain types
  "FinancialRating",
  "InsuranceSpecialty",
  "CarrierAppointment",
  "SplitLimitComponent",
  "Deductible",
  "Premium",
  "PremiumBasis",
  "PremiumAdjustment",
  "PremiumInstallment",
  "PremiumAllocation",
  "Commission",
  "CommissionTier",
  "CommissionSplit",
  // Resource sub-types
  "Endorsement",
  "EndorsementChange",
  "CoverageLimit",
  "CoverageExtension",
  "Classification",
  "PremiumLineItem",
  "Subjectivity",
  "Claimant",
  "ClaimFinancials",
  "ClaimPayment",
  "RiskCharacteristic",
  "AssetValuation",
  "License",
  // Personal lines types
  "NamedDriver",
  "DrivingViolation",
  "Lienholder",
  "ScheduledItem",
];

const allTypes = [...resourceTypes, ...supportingTypes];

const schemasDir = join(__dirname, "..", "schemas");
const resourceSchemasDir = join(schemasDir, "resources");
const supportingSchemasDir = join(schemasDir, "supporting");

mkdirSync(resourceSchemasDir, { recursive: true });
mkdirSync(supportingSchemasDir, { recursive: true });

let successCount = 0;
let errorCount = 0;

for (const typeName of allTypes) {
  const config: Config = {
    path: join(__dirname, "..", "src", "types", "index.ts"),
    tsconfig: join(__dirname, "..", "tsconfig.json"),
    type: typeName,
    expose: "export",
    jsDoc: "extended",
    additionalProperties: false,
  };

  try {
    const schema = createGenerator(config).createSchema(typeName);

    // Add BIND-specific metadata
    (schema as any)["$id"] = `https://bind-standard.org/schema/${typeName}`;
    (schema as any)["title"] = typeName;

    const isResource = resourceTypes.includes(typeName);
    const outDir = isResource ? resourceSchemasDir : supportingSchemasDir;
    const outPath = join(outDir, `${typeName}.schema.json`);

    writeFileSync(outPath, JSON.stringify(schema, null, 2) + "\n");
    console.log(`  ✓ ${typeName}`);
    successCount++;
  } catch (err: any) {
    console.error(`  ✗ ${typeName}: ${err.message}`);
    errorCount++;
  }
}

console.log(
  `\nGenerated ${successCount} schemas (${errorCount} errors) → schemas/`
);

// Generate a master index of all schemas
const index = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "BIND Standard Schema Index",
  description:
    "Index of all BIND (Business Insurance Normalized Data) standard schemas.",
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

writeFileSync(
  join(schemasDir, "index.json"),
  JSON.stringify(index, null, 2) + "\n"
);
console.log("Generated schema index → schemas/index.json");
