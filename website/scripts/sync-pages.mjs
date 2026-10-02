import {
  cpSync,
  readFileSync,
  writeFileSync,
  existsSync,
  rmSync,
  readdirSync,
} from "node:fs";
import { resolve } from "node:path";
// 只清理清单记录的生成文件；源代码、历史图片与未登记文件不受影响。
const root = resolve(".."),
  manifest = resolve(root, ".pages-manifest.json");
const files = [];
function walk(dir, prefix = "") {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const rel = prefix + e.name;
    if (e.isDirectory()) walk(`${dir}/${e.name}`, rel + "/");
    else if (!["_headers", "_redirects"].includes(e.name)) files.push(rel);
  }
}
walk("dist-pages");
if (existsSync(manifest))
  for (const file of JSON.parse(readFileSync(manifest, "utf8"))) {
    if (
      file.includes("..") ||
      file.startsWith("/") ||
      file.startsWith("website/")
    )
      throw Error("Invalid manifest");
    if (!files.includes(file)) rmSync(resolve(root, file), { force: true });
  }
for (const file of files) {
  const target = resolve(root, file);
  cpSync(`dist-pages/${file}`, target, { recursive: true });
}
writeFileSync(resolve(root, ".nojekyll"), "");
writeFileSync(manifest, JSON.stringify(files.sort(), null, 2) + "\n");
