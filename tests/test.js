const fs = require("fs");
const yaml = require("yaml");
const JsonSchema = require("@hyperjump/json-schema");
const { expect } = require("chai");
const dialect = require("../schemas/dialect/base.schema.json");
const vocabulary = require("../schemas/meta/base.schema.json");

// Listing schema variants
fs.readdirSync(`${__dirname}/../schemas`, { withFileTypes: true })
  .filter((entry) => entry.isFile() && /\.yaml$/.test(entry.name))
    .forEach((schemaFile) => {
        const testName = schemaFile.name.replaceAll("_"," ").replaceAll(".yaml","");
        const schemaFilePath = `${__dirname}/../schemas/${schemaFile.name}`;
        // Testing a schema variant
        describe(testName, () => {
          
          let metaSchema;
          before(async () => {
            JsonSchema.add(dialect);
            JsonSchema.add(vocabulary);
            JsonSchema.add(yaml.parse(fs.readFileSync(schemaFilePath, "utf8"), { prettyErrors: true }));
            metaSchema = await JsonSchema.get("https://spec.openapis.org/oas/3.1/schema/2022-02-27");
          });

          describe("Checking valid documents", () => {
            fs.readdirSync(`${__dirname}/../samples/valid`, { withFileTypes: true })
              .filter((entry) => entry.isFile() && /\.yaml$/.test(entry.name))
              .forEach((entry) => {
                const file = `${__dirname}/../samples/valid/${entry.name}`;
          
                it(`${entry.name} should be valid`, async () => {
                  const instance = yaml.parse(fs.readFileSync(file, "utf8"));
                  const output = await JsonSchema.validate(metaSchema, instance, JsonSchema.BASIC);
                  expect(output.valid).to.equal(true);
                });
              });
          });

          describe("Checking invalid documents", () => {
            fs.readdirSync(`${__dirname}/../samples/invalid`, { withFileTypes: true })
              .filter((entry) => entry.isFile() && /\.yaml$/.test(entry.name))
              .forEach((entry) => {
                const file = `${__dirname}/../samples/invalid/${entry.name}`;
          
                it(`${entry.name} should be invalid`, async () => {
                  const instance = yaml.parse(fs.readFileSync(file, "utf8"));
                  const output = await JsonSchema.validate(metaSchema, instance, JsonSchema.BASIC);
                  expect(output.valid).to.equal(false);
                });
              });
          });
        });
});
  