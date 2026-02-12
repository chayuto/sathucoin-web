import { readFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, "..");

// Load locale files
const en = JSON.parse(readFileSync(join(root, "src/i18n/locales/en.json"), "utf-8"));
const th = JSON.parse(readFileSync(join(root, "src/i18n/locales/th.json"), "utf-8"));

// Flatten nested keys: { a: { b: "v" } } => ["a.b"]
function flattenKeys(obj, prefix = "") {
  const keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null) {
      keys.push(...flattenKeys(value, full));
    } else {
      keys.push(full);
    }
  }
  return keys;
}

// Recursively find all .js/.jsx files in src/
function findSourceFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (entry === "node_modules" || entry === "i18n" || entry === "test") continue;
      files.push(...findSourceFiles(full));
    } else if ([".js", ".jsx"].includes(extname(entry))) {
      files.push(full);
    }
  }
  return files;
}

// Extract t("key") calls from source
function extractKeys(content) {
  const keys = new Set();
  // Match t("key") and t('key')
  const regex = /\bt\(\s*["']([^"']+)["']\s*\)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    keys.add(match[1]);
  }
  return keys;
}

const enKeys = new Set(flattenKeys(en));
const thKeys = new Set(flattenKeys(th));

const srcDir = join(root, "src");
const sourceFiles = findSourceFiles(srcDir);

const usedKeys = new Set();
for (const file of sourceFiles) {
  const content = readFileSync(file, "utf-8");
  for (const key of extractKeys(content)) {
    usedKeys.add(key);
  }
}

let hasError = false;

// Check for keys used in code but missing from locale files
const missingFromEn = [];
const missingFromTh = [];
for (const key of usedKeys) {
  if (!enKeys.has(key)) missingFromEn.push(key);
  if (!thKeys.has(key)) missingFromTh.push(key);
}

if (missingFromEn.length > 0) {
  hasError = true;
  console.error("\nKeys used in code but missing from en.json:");
  for (const key of missingFromEn.sort()) {
    console.error(`  - ${key}`);
  }
}

if (missingFromTh.length > 0) {
  hasError = true;
  console.error("\nKeys used in code but missing from th.json:");
  for (const key of missingFromTh.sort()) {
    console.error(`  - ${key}`);
  }
}

// Check for keys in locale files not used in code
const unusedEn = [];
const unusedTh = [];
for (const key of enKeys) {
  if (!usedKeys.has(key)) unusedEn.push(key);
}
for (const key of thKeys) {
  if (!usedKeys.has(key)) unusedTh.push(key);
}

if (unusedEn.length > 0) {
  console.warn("\nKeys in en.json not found in code (may be unused):");
  for (const key of unusedEn.sort()) {
    console.warn(`  - ${key}`);
  }
}

if (unusedTh.length > 0) {
  console.warn("\nKeys in th.json not found in code (may be unused):");
  for (const key of unusedTh.sort()) {
    console.warn(`  - ${key}`);
  }
}

// Check for keys present in one locale but not the other
const missingInTh = [];
const missingInEn = [];
for (const key of enKeys) {
  if (!thKeys.has(key)) missingInTh.push(key);
}
for (const key of thKeys) {
  if (!enKeys.has(key)) missingInEn.push(key);
}

if (missingInTh.length > 0) {
  hasError = true;
  console.error("\nKeys in en.json but missing from th.json:");
  for (const key of missingInTh.sort()) {
    console.error(`  - ${key}`);
  }
}

if (missingInEn.length > 0) {
  hasError = true;
  console.error("\nKeys in th.json but missing from en.json:");
  for (const key of missingInEn.sort()) {
    console.error(`  - ${key}`);
  }
}

if (hasError) {
  console.error("\ni18n validation failed.");
  process.exit(1);
} else {
  console.log("i18n validation passed. All keys are consistent.");
}
