import type { Language } from "../types";
export const APP_STORE_URL = "https://apps.apple.com/app/id6810123460";
// 构建和预渲染共用部署前缀；语言、图片与文档不依赖当前目录层级。
export const BASE = import.meta.env?.BASE_URL || process.env.SITE_BASE || "/";
export const docUrl = (kind: string, language: Language) =>
  `${BASE}${kind}-${language === "zh" ? "zh-Hans" : "en"}.html`;
export const homeUrl = (language: Language) =>
  `${BASE}${language === "zh" ? "zh/" : ""}`;
export const RELEASE = {
  verifiedOn: "2026-10-02",
  publicVersion: "1.0",
  backgroundBlur: false,
  comparison: false,
};
export const photos = [
  {
    id: "portrait2",
    en: "A little afternoon light",
    zh: "午后的微光",
    altEn: "Fictional woman in a white shirt on a leafy path",
    altZh: "穿白衬衫的虚构女性站在林荫小径",
  },
  {
    id: "coast",
    en: "Room to wander",
    zh: "向海而行",
    altEn: "Sunlight on a Mediterranean coastal village",
    altZh: "阳光照耀着地中海沿岸村庄",
  },
  {
    id: "stilllife",
    en: "Slow mornings",
    zh: "慢慢醒来的早晨",
    altEn: "Oranges and a glass of water on a café table",
    altZh: "咖啡桌上的橙子和一杯水",
  },
  {
    id: "street",
    en: "Take the long way",
    zh: "绕一点远路",
    altEn: "A blue bicycle beside a sunlit street",
    altZh: "阳光街巷旁的蓝色自行车",
  },
  {
    id: "pet",
    en: "Everyday company",
    zh: "日常的陪伴",
    altEn: "A golden retriever beside grasses and flowers",
    altZh: "草丛与花朵旁的金毛犬",
  },
];
export const FAQ_DATA = [
  {
    questionEn: "Which devices are supported?",
    questionZh: "支持哪些设备？",
    answerEn:
      "GlowMuse is an iPhone photo editor. The current App Store release requires iOS 15 or later. Check your local App Store for availability; the current listing may still be named Lumi Edit.",
    answerZh:
      "GlowMuse 是一款 iPhone 照片编辑 App。当前商店版本要求 iOS 15 或更新版本，具体以所在地区的 App Store 为准；当前商店名称可能仍显示为 Lumi Edit。",
  },
  {
    questionEn: "Are my photos uploaded?",
    questionZh: "照片会被上传吗？",
    answerEn:
      "Photo processing takes place on your device. Online help and legal pages require an internet connection. You choose whether to share an exported photo through the system share sheet.",
    answerZh:
      "照片处理在设备本地完成。在线帮助和协议页面需要联网；导出后是否通过系统分享发送照片，由你决定。",
  },
  {
    questionEn: "Does editing overwrite my original?",
    questionZh: "会覆盖原图吗？",
    answerEn:
      "Saving creates a new copy and leaves your original unchanged. You can compare with the original and undo or redo edits. Editing sessions are not automatically saved as projects.",
    answerZh:
      "保存时生成新副本，原图保持不变。编辑时可以对比原图、撤销和重做；编辑过程不会自动保存为项目。",
  },
  {
    questionEn: "Which formats and sizes can I export?",
    questionZh: "支持哪些格式和输出尺寸？",
    answerEn:
      "Choose JPEG, HEIC or PNG. The working image has a maximum long edge of 4096 pixels; larger originals are resized on import. Standard output is up to 2048 pixels on the long edge. Full size keeps the cropped working image size.",
    answerZh:
      "支持 JPEG、HEIC 和 PNG。工作图长边最高 4096 像素，更大的原图会在导入时缩小。标准输出长边最高 2048 像素，Full size 保留裁剪后的工作图尺寸。",
  },
];
