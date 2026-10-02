/* 只增强阅读操作；不存储偏好、不发送请求，失败时保留原生链接和完整正文。 */
(() => {
  const zh = document.documentElement.lang === "zh-Hans";
  document.querySelectorAll("[data-enhanced]").forEach((element) => {
    element.hidden = false;
  });
  const sizeButton = document.querySelector("[data-text-size]");
  sizeButton?.addEventListener("click", () => {
    const large = document.documentElement.classList.toggle("large-text");
    sizeButton.setAttribute("aria-pressed", String(large));
    sizeButton.textContent = zh
      ? large
        ? "默认字号"
        : "加大字号"
      : large
        ? "Default text"
        : "Larger text";
  });
  document
    .querySelector("[data-print]")
    ?.addEventListener("click", () => window.print());
  const copyButton = document.querySelector("[data-copy-email]");
  copyButton?.addEventListener("click", async () => {
    const status = document.querySelector("[data-copy-status]");
    copyButton.disabled = true;
    try {
      if (!navigator.clipboard?.writeText) throw new Error("剪贴板不可用");
      await navigator.clipboard.writeText("zhengjianzhaokefu@163.com");
      status.textContent = zh ? "邮箱已复制。" : "Email address copied.";
    } catch {
      // 内嵌网页可能不允许剪贴板写入；给出可选择的原文，不误报成功。
      status.textContent = zh
        ? "未能复制，请长按上方邮箱地址进行复制。"
        : "Could not copy. Select the email address above to copy it.";
    } finally {
      copyButton.disabled = false;
    }
  });
  const mobileToc = document.querySelector(".mobile-toc");
  mobileToc?.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      // 先收起目录再让浏览器处理锚点，避免滚动后高度变化导致标题偏移。
      mobileToc.open = false;
    }),
  );
  // 桌面目录仅标记最近的可见章节；正文和目录导航均不依赖此增强功能。
  if ("IntersectionObserver" in window) {
    const links = [...document.querySelectorAll(".desktop-toc a")];
    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];
        if (!current) return;
        for (const link of links) {
          if (link.hash === `#${current.target.id}`)
            link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        }
      },
      { rootMargin: "-5% 0px -65% 0px" },
    );
    document
      .querySelectorAll(".document-section")
      .forEach((section) => observer.observe(section));
  }
})();
