import { useRef, useState, useEffect } from "react";
import { X, ArrowUpRight } from "lucide-react";
import { photos } from "../data/content";
import type { Language } from "../types";
import { Photo } from "./Photo";
export function GallerySection({ language }: { language: Language }) {
  const zh = language === "zh";
  const [selected, setSelected] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const previous = useRef<HTMLElement | null>(null);
  // 原生 dialog 提供焦点约束与 Escape；关闭时还原滚动和发起按钮焦点。
  useEffect(() => {
    if (selected) {
      previous.current = document.activeElement as HTMLElement;
      dialog.current?.showModal();
      const old = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = old;
        previous.current?.focus();
      };
    }
  }, [selected]);
  const close = () => {
    dialog.current?.close();
    setSelected(null);
  };
  return (
    <section id="gallery" className="section-wrap gallery-section">
      <div className="gallery-heading">
        <div>
          <p className="eyebrow">
            {zh ? "日常，值得留存" : "Ordinary days, worth keeping"}
          </p>
          <h2>{zh ? "光与生活的片段。" : "Notes from everyday life."}</h2>
        </div>
        <p>
          {zh
            ? "合成演示照片，仅呈现摄影灵感；不是用户作品或 App 编辑前后效果。"
            : "Synthetic demo photographs for visual inspiration. These are not user submissions or before-and-after App results."}
        </p>
      </div>
      <div className="gallery-grid">
        {photos.map((p, i) => (
          <button
            className={`gallery-item item-${i}`}
            key={p.id}
            onClick={() => setSelected(p.id)}
            aria-label={`${zh ? "放大" : "Enlarge"}: ${zh ? p.zh : p.en}`}
          >
            <Photo id={p.id} language={language} />
            <span className="gallery-caption">
              <span>{zh ? p.zh : p.en}</span>
              <ArrowUpRight size={18} />
            </span>
          </button>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="lightbox"
        aria-label={zh ? "照片预览" : "Photo preview"}
        onCancel={close}
        onClose={() => setSelected(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <button
          className="close-button"
          onClick={close}
          aria-label={zh ? "关闭预览" : "Close preview"}
        >
          <X />
        </button>
        {selected && (
          <>
            <Photo id={selected} language={language} eager />
            <p>
              {zh
                ? "合成演示照片 · 摄影灵感"
                : "Synthetic demo photo · Visual inspiration"}
            </p>
          </>
        )}
      </dialog>
    </section>
  );
}
