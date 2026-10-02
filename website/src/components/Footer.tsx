import type { Language } from "../types";
import { docUrl, homeUrl } from "../data/content";
export function Footer({ language }: { language: Language }) {
  const zh = language === "zh";
  return (
    <footer className="section-wrap footer">
      <div className="footer-top">
        <div>
          <a className="wordmark" href={homeUrl(language)}>
            GlowMuse
            <span className="brand-dot" />
          </a>
          <p>
            {zh
              ? "人像与日常照片，自有光彩。"
              : "A little light for your everyday photos."}
          </p>
        </div>
        <nav aria-label={zh ? "文档与语言" : "Documents and language"}>
          <a href={docUrl("support", language)}>
            {zh ? "帮助与支持" : "Support"}
          </a>
          <a href={docUrl("privacy", language)}>
            {zh ? "隐私政策" : "Privacy policy"}
          </a>
          <a href={docUrl("terms", language)}>
            {zh ? "用户协议" : "Terms of use"}
          </a>
          <a href={homeUrl(zh ? "en" : "zh")}>{zh ? "English" : "简体中文"}</a>
        </nav>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} Molly Lu.{" "}
          {zh ? "保留所有权利。" : "All rights reserved."}
        </span>
        <a href="mailto:zhengjianzhaokefu@163.com">zhengjianzhaokefu@163.com</a>
      </div>
    </footer>
  );
}
