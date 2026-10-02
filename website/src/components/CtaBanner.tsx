import type { Language } from "../types";
import { DownloadLink } from "./DownloadLink";
export function CtaBanner({ language }: { language: Language }) {
  const zh = language === "zh";
  return (
    <section className="section-wrap">
      <div className="cta-banner">
        <p className="eyebrow">
          GlowMuse · {zh ? "微光修图" : "Made for your moments"}
        </p>
        <h2>
          {zh
            ? `下一张照片，
从一点微光开始。`
            : `A softer light.
A fresh perspective.`}
        </h2>
        <p>
          {zh
            ? "留住日常，再添一点自己的色彩。"
            : "Keep the moment. Make it feel like you."}
        </p>
        <DownloadLink language={language} />
      </div>
    </section>
  );
}
