import type { Language } from "../types";
import { Photo } from "./Photo";
const stories = [
  {
    id: "coast",
    n: "01",
    tag: ["LIGHT & COLOR", "光线与色彩"],
    title: ["Light, just right.", "让光线，恰到好处。"],
    body: [
      "Bring out the feeling of the moment. Fine-tune exposure, brightness, contrast and color temperature, then compare with your original.",
      "从曝光、亮度、对比度到色温，按自己的节奏细细调整。随时对比原图，留下记忆中的光。",
    ],
    detail: ["Exposure · Temperature · Color", "曝光 · 色温 · 色彩"],
  },
  {
    id: "stilllife",
    n: "02",
    tag: ["YOUR KIND OF COLOR", "你的色彩偏好"],
    title: ["A look that feels like you.", "找到属于你的色调。"],
    body: [
      "Explore portrait, warm and cool, and film filters. Keep the intensity subtle or turn it up, and save your favorites for next time.",
      "探索人像、冷暖与胶片滤镜，自由调整强度。把喜欢的风格加入收藏，下次继续用。",
    ],
    detail: ["Adjustable filters · Favorites", "可调强度滤镜 · 收藏"],
  },
  {
    id: "street",
    n: "03",
    tag: ["COMPOSE WITH CARE", "用心构图"],
    title: ["Make room for what matters.", "把目光，留给主角。"],
    body: [
      "Crop, rotate and reframe. Try a new composition, undo a step, or start again. Save a new copy when it feels right.",
      "裁剪、旋转，重新安排画面。试一个新的构图，撤销一步，或再做一次。满意后另存新副本。",
    ],
    detail: ["Crop · Rotate · Undo & redo", "裁剪 · 旋转 · 撤销与重做"],
  },
];
export function FeatureStories({ language }: { language: Language }) {
  const i = language === "zh" ? 1 : 0;
  return (
    <section id="features" className="section-wrap stories">
      <div className="section-heading">
        <p className="eyebrow">
          {i
            ? "一点调整，很多可能"
            : "A little adjustment. A lot of possibility."}
        </p>
        <h2>{i ? "照片里，有你的目光。" : "Your eye. Your edit."}</h2>
      </div>
      {stories.map((s) => (
        <article className="story" key={s.id}>
          <figure>
            <Photo id={s.id} language={language} />
            <figcaption>
              {i
                ? "合成演示照片 · 摄影氛围展示"
                : "Synthetic demo photo · Visual inspiration"}
            </figcaption>
          </figure>
          <div className="story-copy">
            <p className="eyebrow">
              <span className="number">{s.n}</span>
              {s.tag[i]}
            </p>
            <h3>{s.title[i]}</h3>
            <p>{s.body[i]}</p>
            <p className="story-detail">{s.detail[i]}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
