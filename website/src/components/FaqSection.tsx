import { FAQ_DATA } from "../data/content";
import type { Language } from "../types";
export function FaqSection({ language }: { language: Language }) {
  const zh = language === "zh";
  return (
    <section id="faq" className="section-wrap faq-section">
      <div>
        <p className="eyebrow">{zh ? "开始之前" : "Before you begin"}</p>
        <h2>{zh ? "你可能想知道。" : "A few things to know."}</h2>
      </div>
      <div>
        {FAQ_DATA.map((f, i) => (
          <details key={i}>
            <summary>
              {zh ? f.questionZh : f.questionEn}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{zh ? f.answerZh : f.answerEn}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
