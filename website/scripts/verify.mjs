import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import assert from "node:assert/strict";
import { resolve, dirname } from "node:path";
const docs = ["privacy", "terms", "support"].flatMap((kind) =>
  ["en", "zh-Hans"].map((lang) => `${kind}-${lang}.html`),
);
for (const [dir, base] of [
  ["dist", "/"],
  ["dist-pages", "/LumiEdit-Support/"],
]) {
  const root = resolve(dir);
  for (const path of ["index.html", "zh/index.html", ...docs]) {
    const html = readFileSync(`${dir}/${path}`, "utf8");
    assert(!/http-equiv="refresh"/i.test(html), `${path}: self redirect`);
    assert(html.includes('rel="canonical"'), `${path}: canonical`);
    if (docs.includes(path))
      assert.equal(
        html,
        readFileSync(`public/${path}`, "utf8"),
        `${path}: policy changed`,
      );
    for (const [, url] of html.matchAll(/(?:href|src)="([^"<>]+)"/g)) {
      if (/^(https?:|mailto:|data:|#)/.test(url)) continue;
      const clean = url.split("#")[0];
      if (clean.startsWith("/"))
        assert(clean.startsWith(base), `${path}: incorrect base ${url}`);
      let target = clean.startsWith("/")
        ? resolve(root, clean.slice(base.length))
        : resolve(dirname(`${root}/${path}`), clean);
      if (
        target.endsWith("/") ||
        (existsSync(target) && statSync(target).isDirectory())
      )
        target += "/index.html";
      assert(existsSync(target), `${path}: missing ${url}`);
    }
  }
  const en = readFileSync(`${dir}/index.html`, "utf8"),
    zh = readFileSync(`${dir}/zh/index.html`, "utf8");
  assert(
    en.includes("Find your") && zh.includes("让每一刻，"),
    "prerender missing",
  );
  assert(zh.includes('lang="zh-Hans"'), "Chinese lang missing");
  for (const f of readdirSync(`${dir}/assets`).filter((f) =>
    f.endsWith(".js"),
  )) {
    const js = readFileSync(`${dir}/assets/${f}`, "utf8");
    assert(
      !/GEMINI_API_KEY|GOOGLE_API_KEY|generativelanguage|googleusercontent|Verified: 0 Bytes|Exported 4096px/.test(
        js,
      ),
      "unsafe template residue",
    );
  }
}
console.log(
  "PASS: dual-base local links, six unchanged documents per target, prerendering, canonical, language, no redirect loops or template API residue.",
);
