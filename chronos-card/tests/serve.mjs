// Static server for the layout probe: the built bundle under /www and the
// fixtures under /fixtures. No dependencies, so CI needs nothing extra.
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const roots = {
  "/www/": join(here, "..", "..", "custom_components", "chronos", "www"),
  "/fixtures/": join(here, "fixtures"),
};
const types = { ".js": "text/javascript", ".mjs": "text/javascript", ".html": "text/html; charset=utf-8", ".json": "application/json", ".css": "text/css", ".png": "image/png", ".svg": "image/svg+xml" };

createServer(async (req, res) => {
  let url = (req.url || "/").split("?")[0];
  if (url === "/") url = "/fixtures/harness.html";
  const prefix = Object.keys(roots).find((p) => url.startsWith(p));
  if (!prefix || url.includes("..")) { res.writeHead(404); return res.end(); }
  try {
    const body = await readFile(join(roots[prefix], url.slice(prefix.length)));
    res.writeHead(200, { "content-type": types[extname(url)] || "application/octet-stream", "cache-control": "no-store" });
    res.end(body);
  } catch {
    res.writeHead(404); res.end();
  }
}).listen(Number(process.env.PORT) || 8917);
