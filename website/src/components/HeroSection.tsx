import type { Language } from "../types";
import { Photo } from "./Photo";
import { DownloadLink } from "./DownloadLink";
export function HeroSection({ language }: { language: Language }) {
  const zh = language === "zh";
  return (
    <section className="hero section-wrap">
      <div className="hero-copy">
        <p className="eyebrow">
          {zh
            ? "属于日常的 iPhone 修图工具"
            : "An iPhone photo editor for everyday life"}
        </p>
        <h1>
          {zh ? (
            <>
              让每一刻，
              <br />
              <span>自有光彩。</span>
            </>
          ) : (
            <>
              Find your
              <br />
              <span>light.</span>
            </>
          )}
        </h1>
        <p className="intro">
          {zh
            ? "为人像与日常照片调整光线、探索色彩，细细修饰值得保留的瞬间。"
            : "Thoughtful photo editing for portraits and everyday moments. Shape light, explore color, and refine the little details."}
        </p>
        <DownloadLink language={language} />
        <p className="store-note">
          {zh
            ? "同一款 App，新的名字。当前商店可能仍显示为 Lumi Edit。"
            : "Same app, a new name. The current store listing may still say Lumi Edit."}
        </p>
        <p className="store-regions">
          {zh ? "选择商店地区：" : "Choose a store region: "}
          <a href="https://apps.apple.com/cn/app/id6810123460">
            {zh ? "中国大陆" : "China mainland"}
          </a>
          <span aria-hidden="true"> · </span>
          <a href="https://apps.apple.com/us/app/id6810123460">
            {zh ? "美国" : "United States"}
          </a>
        </p>
        <div className="hero-notes">
          <span>{zh ? "设备本地处理" : "On-device editing"}</span>
          <span>{zh ? "另存副本，保留原图" : "Your originals stay yours"}</span>
        </div>
      </div>
      <figure className="hero-image">
        <Photo id="portrait2" language={language} eager />
        <figcaption>
          <span>01 / {zh ? "光，在身边" : "Light, all around"}</span>
          <span>{zh ? "合成演示照片" : "Synthetic demo photo"}</span>
        </figcaption>
      </figure>
    </section>
  );
}
