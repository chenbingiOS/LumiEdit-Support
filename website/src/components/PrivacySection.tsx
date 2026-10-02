import type { Language } from "../types";
import { docUrl } from "../data/content";
export function PrivacySection({ language }: { language: Language }) {
  const zh = language === "zh";
  return (
    <section id="privacy" className="section-wrap privacy-section">
      <div>
        <p className="eyebrow">{zh ? "安心创作" : "Space to create"}</p>
        <h2>{zh ? "照片留在你的手中。" : "Your photos. Your space."}</h2>
      </div>
      <div className="privacy-copy">
        <p>
          {zh
            ? "照片处理在设备本地完成。保存时生成新副本，保留原图；只在需要的功能中请求照片和相机权限。"
            : "Photo processing stays on your device. Save a new copy and keep the original. Photo and camera access are requested only for the features you choose."}
        </p>
        <p>
          {zh
            ? "在线帮助与协议需要网络连接，分享照片由你决定。"
            : "Online help and legal pages use an internet connection. Sharing a photo is your choice."}
        </p>
        <a href={docUrl("privacy", language)}>
          {zh ? "阅读完整隐私政策" : "Read our privacy policy"}{" "}
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
