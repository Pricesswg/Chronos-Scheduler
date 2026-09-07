// Translation coverage: every inline key (it/en/fr/de in src/i18n.ts) must
// exist in each overlay (es/pt/nl/pl), overlays must not carry dead keys,
// placeholders like {n} must match the Italian source, and every Help recipe
// must have its four strings. Exit code 1 on any gap, so it can run in CI.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const src = join(dirname(fileURLToPath(import.meta.url)), "..", "src");
const i18n = readFileSync(join(src, "i18n.ts"), "utf8");
const inlineKeys = new Set([...i18n.matchAll(/"([a-z0-9_.]+)":\s*\{/g)].map((m) => m[1]));
const italian = new Map([...i18n.matchAll(/^  "([^"]+)": \{ it: "((?:[^"\\]|\\.)*)"/gm)].map((m) => [m[1], m[2]]));
const placeholders = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",");

let ok = true;
const fail = (msg) => { ok = false; console.error("  " + msg); };

for (const lang of ["es", "pt", "nl", "pl"]) {
  const text = readFileSync(join(src, "i18n", `${lang}.ts`), "utf8");
  const overlay = new Map([...text.matchAll(/^  "([^"]+)": "((?:[^"\\]|\\.)*)",?$/gm)].map((m) => [m[1], m[2]]));
  const missing = [...inlineKeys].filter((k) => !overlay.has(k)).sort();
  const extra = [...overlay.keys()].filter((k) => !inlineKeys.has(k)).sort();
  const mismatched = [...overlay].filter(([k, v]) => italian.has(k) && placeholders(italian.get(k)) !== placeholders(v)).map(([k]) => k);
  if (missing.length) fail(`${lang}: ${missing.length} missing key(s): ${missing.slice(0, 5).join(", ")}${missing.length > 5 ? ", …" : ""}`);
  if (extra.length) fail(`${lang}: ${extra.length} key(s) not in the source: ${extra.slice(0, 5).join(", ")}`);
  if (mismatched.length) fail(`${lang}: placeholder mismatch in ${mismatched.slice(0, 5).join(", ")}`);
  if (!missing.length && !extra.length && !mismatched.length) console.log(`  ${lang}: ${overlay.size} keys ok`);
}

const help = readFileSync(join(src, "screens", "help.ts"), "utf8");
const recipes = [...help.matchAll(/^    id: "([a-z0-9_]+)",$/gm)].map((m) => m[1]);
for (const id of recipes) {
  for (const part of ["title", "when", "howto", "preset_name"]) {
    if (!i18n.includes(`"recipe.${id}.${part}"`)) fail(`recipe ${id}: missing recipe.${id}.${part}`);
  }
}
console.log(`  ${recipes.length} recipes, ${inlineKeys.size} inline keys`);
console.log(ok ? "i18n: OK" : "i18n: FAILED");
process.exit(ok ? 0 : 1);
