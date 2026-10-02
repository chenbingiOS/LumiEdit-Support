import React from "react";
import { renderToString } from "react-dom/server";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import App from "../src/App";
import { BASE } from "../src/data/content";
import type { Language } from "../src/types";
// 生成可独立抓取和刷新访问的两种语言页面，主域名 canonical 始终一致。
const out = process.argv[2] || "dist";
const template = readFileSync(`${out}/index.html`, "utf8");
for (const language of ["en", "zh"] as Language[]) {
  const zh = language === "zh";
  const lang = zh ? "zh-Hans" : "en";
  const suffix = zh ? "zh/" : "";
  const title = zh
    ? "GlowMuse 微光修图 — 让每一刻，自有光彩"
    : "GlowMuse — Find your light | iPhone photo editor";
  const desc = zh
    ? "为人像与日常照片调整光线、探索色彩。GlowMuse 微光修图，在 iPhone 本地编辑并保存新副本。"
    : "Thoughtful photo editing for portraits and everyday moments. Explore light, color and composition with GlowMuse for iPhone.";
  const canonical = `https://glowmuse.top/${suffix}`;
  const meta = `<meta name="description" content="${desc}"/><link rel="canonical" href="${canonical}"/><link rel="alternate" hreflang="en" href="https://glowmuse.top/"/><link rel="alternate" hreflang="zh-Hans" href="https://glowmuse.top/zh/"/><link rel="alternate" hreflang="x-default" href="https://glowmuse.top/"/><meta property="og:title" content="${title}"/><meta property="og:description" content="${desc}"/><meta property="og:url" content="${canonical}"/><meta property="og:type" content="website"/><meta property="og:locale" content="${zh ? "zh_CN" : "en_US"}"/><meta property="og:image" content="https://glowmuse.top/photos/coast.jpg"/><meta name="twitter:card" content="summary_large_image"/><link rel="icon" type="image/svg+xml" href="${BASE}favicon.svg"/>`;
  const html = template
    .replace('lang="en"', `lang="${lang}"`)
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace("<!--seo-->", meta)
    .replace(
      '<div id="root"></div>',
      `<div id="root">${renderToString(<App language={language} />)}</div>`,
    );
  mkdirSync(`${out}/${suffix}`, { recursive: true });
  writeFileSync(`${out}/${suffix}index.html`, html);
}
