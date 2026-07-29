/**
 * Export BW_PRODUCTS → wix-migration/catalog-export.csv
 * Run: node scripts/export-wix-catalog.js
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const code = fs.readFileSync(path.join(root, "products-data.js"), "utf8");
const m = code.match(/window\.BW_PRODUCTS\s*=\s*(\[[\s\S]*?\]);\s*\n/);
if (!m) {
  console.error("Could not parse BW_PRODUCTS from products-data.js");
  process.exit(1);
}
// eslint-disable-next-line no-eval
const products = eval(m[1]);

function csvEsc(s) {
  s = String(s ?? "");
  if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

const headers = [
  "sku",
  "name",
  "strength",
  "form",
  "category",
  "price_usd",
  "unit",
  "listed_on_site",
  "short_description",
  "description",
  "scientific_name",
  "molecular_weight",
  "formula",
  "sequence",
  "appearance",
  "storage",
  "research_notes",
  "image_primary",
  "image_secondary",
  "components",
  "wix_product_type",
  "ruo_disclaimer",
];

const ruo =
  "Research Use Only. Not for human or veterinary use. Not FDA approved. Not a drug, supplement, or compounded medication.";

const rows = products.map((p) => {
  const comps = (p.components || [])
    .map((c) => c.name + ": " + c.amount)
    .join(" | ");
  return [
    p.sku,
    p.name,
    p.strength || "",
    p.form || "",
    p.category || "",
    p.unitPrice,
    p.unit || "vial",
    p.listed === false ? "no" : "yes",
    p.shortDescription || "",
    p.description || "",
    p.scientificName || "",
    p.molecularWeight || "",
    p.formula || "",
    p.sequence || "",
    p.appearance || "",
    p.storage || "",
    p.researchNotes || "",
    p.image || "",
    (p.images && p.images[1]) || "",
    comps,
    "Physical",
    ruo,
  ]
    .map(csvEsc)
    .join(",");
});

const outDir = path.join(root, "wix-migration");
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, "catalog-export.csv");
fs.writeFileSync(outFile, headers.join(",") + "\n" + rows.join("\n"), "utf8");

const listed = products.filter((p) => p.listed !== false);
console.log("Wrote", outFile);
console.log("Total SKUs:", products.length, "| Listed:", listed.length, "| Hidden:", products.length - listed.length);
