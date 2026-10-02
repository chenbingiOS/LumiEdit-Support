import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync, writeFileSync } from "node:fs";
import documents from "../src/legal/documents.json";
import {
  LegalDocument,
  type DocumentKind,
  type DocumentLanguage,
} from "../src/legal/LegalDocument";

/** 从单一双语正文源生成六个历史地址；检查模式发现漂移即失败，不改写文件。 */
function generateDocuments() {
  const check = process.argv.includes("--check");
  for (const kind of Object.keys(documents) as DocumentKind[]) {
    for (const language of ["en", "zh-Hans"] as DocumentLanguage[]) {
      const doc = documents[kind][language];
      const url = `https://glowmuse.top/${kind}-${language}.html`;
      const page = (
        <html lang={language}>
          <head>
            <meta charSet="utf-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <title>{`${doc.title} · GlowMuse 微光修图`}</title>
            <meta name="description" content={doc.description} />
            <link rel="canonical" href={url} />
            <link
              rel="alternate"
              hrefLang="en"
              href={`https://glowmuse.top/${kind}-en.html`}
            />
            <link
              rel="alternate"
              hrefLang="zh-Hans"
              href={`https://glowmuse.top/${kind}-zh-Hans.html`}
            />
            <link
              rel="alternate"
              hrefLang="x-default"
              href={`https://glowmuse.top/${kind}-en.html`}
            />
            <meta property="og:title" content={`${doc.title} · GlowMuse`} />
            <meta property="og:description" content={doc.description} />
            <meta property="og:url" content={url} />
            <meta property="og:type" content="article" />
            <link rel="icon" href="favicon.svg" />
            <link rel="stylesheet" href="legal/reader.css" />
          </head>
          <body>
            <LegalDocument kind={kind} language={language} />
          </body>
        </html>
      );
      const html = "<!doctype html>\n" + renderToStaticMarkup(page) + "\n";
      const path = `public/${kind}-${language}.html`;
      if (check) {
        if (readFileSync(path, "utf8") !== html)
          throw new Error(
            `文档产物不同步：${path}，请运行 npm run legal:generate`,
          );
      } else writeFileSync(path, html);
    }
  }
  console.log(
    check ? "六份双语文档与正文源一致。" : "六份双语静态文档已生成。",
  );
}
generateDocuments();
