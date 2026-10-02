import React from "react";
import documents from "./documents.json";

/** 协议类型对应既有地址，避免设备和语言切换产生另一套正文。 */
export type DocumentKind = keyof typeof documents;
/** 页面语言直接对应历史文件名，浏览器不需要脚本才能识别语言。 */
export type DocumentLanguage = "en" | "zh-Hans";

/** 将正文中的网址和邮箱转为安全链接，其余内容由框架转义。 */
function LinkedText({ text }: { text: string }) {
  return text
    .split(/(https:\/\/[^\s<>，。；]+|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,})/g)
    .map((part, index) =>
      /^(https:\/\/|[\w.+-]+@)/.test(part) ? (
        <a
          key={index}
          href={part.startsWith("https://") ? part : `mailto:${part}`}
        >
          {part}
        </a>
      ) : (
        part
      ),
    );
}

/** 将帮助中的连续编号步骤转换为有序列表，保留普通条款段落和原文次序。 */
function DocumentParagraphs({ paragraphs }: { paragraphs: string[] }) {
  const blocks: React.ReactNode[] = [];
  for (let index = 0; index < paragraphs.length; index += 1) {
    if (/^\d+\.\s/.test(paragraphs[index])) {
      const start = Number.parseInt(paragraphs[index], 10);
      const items: string[] = [];
      while (index < paragraphs.length && /^\d+\.\s/.test(paragraphs[index])) {
        items.push(paragraphs[index].replace(/^\d+\.\s*/, ""));
        index += 1;
      }
      blocks.push(
        <ol key={index} start={start} className="instruction-steps">
          {items.map((text, item) => (
            <li key={item}>
              <LinkedText text={text} />
            </li>
          ))}
        </ol>,
      );
      index -= 1;
    } else
      blocks.push(
        <p key={index}>
          <LinkedText text={paragraphs[index]} />
        </p>,
      );
  }
  return <>{blocks}</>;
}

/** 输出完整静态正文与真实链接；增强控件默认隐藏，脚本失败不影响阅读。 */
export function LegalDocument({
  kind,
  language,
}: {
  kind: DocumentKind;
  language: DocumentLanguage;
}) {
  const zh = language === "zh-Hans";
  const doc = documents[kind][language];
  const formal = kind !== "support";
  const articleNumber = (index: number) =>
    zh
      ? `第${["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十三", "十四", "十五", "十六", "十七"][index]}条`
      : `${index + 1}.`;
  const other = zh ? "en" : "zh-Hans";
  const home = zh ? "zh/index.html" : "index.html";
  // 日期来自正文元数据，避免下次修订只更新一个日期字段。
  const updatedLabel = new Intl.DateTimeFormat(zh ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${doc.updated}T00:00:00Z`));
  const label = (cn: string, en: string) => (zh ? cn : en);
  const navigation = (className: string) => (
    <nav className={className} aria-label={label("文档导航", "Documents")}>
      {(["privacy", "terms", "support"] as DocumentKind[]).map((item) => (
        <a
          key={item}
          href={`${item}-${language}.html`}
          aria-current={item === kind ? "page" : undefined}
        >
          {documents[item][language].title}
        </a>
      ))}
    </nav>
  );
  const toc = (className: string) => (
    <ol className={className}>
      {doc.sections.map((section, index) => (
        <li key={section.id}>
          <a href={`#${section.id}`}>
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            {section.title}
          </a>
        </li>
      ))}
    </ol>
  );
  return (
    <>
      <a className="skip-link" href="#document">
        {label("跳到正文", "Skip to content")}
      </a>
      <header className="site-header" id="top">
        <div className="header-inner">
          <a
            className="brand"
            href={home}
            aria-label={label("GlowMuse 官网首页", "GlowMuse homepage")}
          >
            GlowMuse<span>微光修图</span>
          </a>
          {navigation("desktop-navigation")}
          <a
            className="language-switch"
            href={`${kind}-${other}.html`}
            hrefLang={other}
            lang={other}
          >
            {zh ? "English" : "简体中文"}
            <span aria-hidden="true"> ↗</span>
          </a>
        </div>
      </header>
      <div className="document-layout">
        <aside
          className="sidebar"
          aria-label={label("章节目录", "Table of contents")}
        >
          <p className="eyebrow">{label("隐私与支持", "Privacy & support")}</p>
          <p className="toc-heading">{label("本页内容", "On this page")}</p>
          {toc("desktop-toc")}
          <div className="sidebar-contact">
            <span>{label("需要帮助？", "Need a hand?")}</span>
            <a href={`#contact`}>
              {label("联系支持", "Contact support")}{" "}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </aside>
        <main
          id="document"
          tabIndex={-1}
          className={formal ? "formal-document" : undefined}
        >
          <header className="document-header">
            <p className="eyebrow">
              {formal
                ? label("法律文件", "LEGAL DOCUMENT")
                : label("使用帮助", "APP SUPPORT")}
            </p>
            <h1>{doc.displayTitle}</h1>
            <p className="document-description">{doc.description}</p>
            <div className="document-meta">
              <span>
                {formal
                  ? label("修订日期", "Revised")
                  : label("更新日期", "Last updated")}{" "}
                <time dateTime={doc.updated}>{updatedLabel}</time>
              </span>
              <span>{label("提供者", "Provided by")} Molly Lu</span>
            </div>
          </header>
          {formal ? (
            <section className="legal-notice" aria-labelledby="notice-title">
              <h2 id="notice-title">{label("重要提示", "Important notice")}</h2>
              {doc.notices.map((notice, index) => (
                <p key={notice}>
                  {index === 0 ? <strong>{notice}</strong> : notice}
                </p>
              ))}
            </section>
          ) : (
            <section
              className="reading-summary"
              aria-labelledby="summary-title"
            >
              <div className="summary-heading">
                <h2 id="summary-title">
                  {label("先了解这几件事", "A few things to know")}
                </h2>
                <span>{label("阅读摘要", "At a glance")}</span>
              </div>
              <ul>
                {doc.summary.map(([title, text], index) => (
                  <li key={title}>
                    <span className="summary-number" aria-hidden="true">
                      0{index + 1}
                    </span>
                    <div>
                      <strong>{title}</strong>
                      <p>{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="summary-note">
                {label(
                  "摘要帮助快速理解，完整说明以下方正文为准。",
                  "This summary is a quick guide. Please read the complete document below.",
                )}
              </p>
            </section>
          )}
          <details className="mobile-toc">
            <summary>
              {label("本页目录", "On this page")}
              <span>
                {doc.sections.length} {label("个章节", "sections")}
              </span>
            </summary>
            {toc("mobile-toc-list")}
          </details>
          <div className="reading-tools" data-enhanced hidden>
            <span>{label("阅读设置", "Reading tools")}</span>
            <button type="button" data-text-size aria-pressed="false">
              {label("加大字号", "Larger text")}
            </button>
            <button type="button" className="print-button" data-print>
              {label("打印", "Print")}
            </button>
          </div>
          <article className="document-body" aria-label={doc.title}>
            {doc.sections.map((section, index) => (
              <section
                className="document-section"
                id={section.id}
                key={section.id}
              >
                <h2>
                  <span
                    className="section-number"
                    aria-hidden={formal ? undefined : true}
                  >
                    {formal
                      ? articleNumber(index)
                      : String(index + 1).padStart(2, "0")}
                  </span>
                  {section.title}
                </h2>
                {formal ? (
                  section.paragraphs.map((paragraph, clause) => (
                    <p className="legal-clause" key={clause}>
                      <span className="clause-number">
                        {index + 1}.{clause + 1}
                      </span>
                      <span>
                        <LinkedText text={paragraph} />
                      </span>
                    </p>
                  ))
                ) : (
                  <DocumentParagraphs paragraphs={section.paragraphs} />
                )}
                {kind === "support" && section.id === "healing" && (
                  <figure className="healing-example">
                    <div>
                      {["before", "after"].map((state) => (
                        <div key={state}>
                          <img
                            src={`images/healing-${state}.jpg`}
                            alt={label(
                              state === "before"
                                ? "消除笔操作示意：处理前"
                                : "消除笔操作示意：处理后",
                              `Healing Brush illustration: ${state}`,
                            )}
                            width="480"
                            height="288"
                            loading="lazy"
                          />
                          <span>
                            {label(
                              state === "before" ? "处理前" : "处理后",
                              state === "before" ? "Before" : "After",
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                    <figcaption>
                      {label(
                        "操作示意，实际效果因照片而异。",
                        "Illustration only. Results vary by photo.",
                      )}
                    </figcaption>
                  </figure>
                )}
                {section.id === "contact" && (
                  <div className="contact-actions">
                    <a
                      className="email-button"
                      href="mailto:zhengjianzhaokefu@163.com"
                    >
                      {label("发送邮件", "Send an email")}{" "}
                      <span aria-hidden="true">↗</span>
                    </a>
                    <button type="button" data-copy-email data-enhanced hidden>
                      {label("复制邮箱", "Copy email")}
                    </button>
                    <span role="status" aria-live="polite" data-copy-status />
                  </div>
                )}
              </section>
            ))}
          </article>
          <footer className="document-footer">
            <p>© 2026 Molly Lu · GlowMuse</p>
            <div>
              <a href={home}>{label("访问官网", "Visit our website")}</a>
              <a href="#top">{label("返回顶部", "Back to top")} ↑</a>
            </div>
          </footer>
        </main>
      </div>
      {navigation("mobile-navigation")}
      <script src="legal/reader.js" defer />
    </>
  );
}
