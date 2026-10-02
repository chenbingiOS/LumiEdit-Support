import { BASE, photos } from "../data/content";
import type { Language } from "../types";
// 所有摄影素材均为有来源记录的合成图，只呈现摄影氛围，不声称为 App 导出。
export function Photo({
  id,
  language,
  eager = false,
  className = "",
}: {
  id: string;
  language: Language;
  eager?: boolean;
  className?: string;
}) {
  const photo = photos.find((p) => p.id === id)!;
  return (
    <picture>
      <source
        type="image/webp"
        srcSet={`${BASE}photos/${id}-640.webp 640w, ${BASE}photos/${id}-1200.webp 1200w`}
        sizes="(max-width: 767px) 100vw, 50vw"
      />
      <img
        src={`${BASE}photos/${id}.jpg`}
        width="1200"
        height="1600"
        alt={language === "zh" ? photo.altZh : photo.altEn}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        className={className}
      />
    </picture>
  );
}
