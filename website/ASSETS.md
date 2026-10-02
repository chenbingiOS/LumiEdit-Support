# 素材与替换说明

`public/photos/` 的 portrait2、coast、stilllife、street、pet 均复用开发者项目在 2026-10-01 通过 OpenAI image_gen 生成的合成演示照片；不含真实私人照片，不是用户投稿，也不是 App 处理结果。既有源记录为 LumiPortrait 的 `release/glowmuse-screenshots-20261001/asset-prompts.json`；本目录 `asset-provenance.json` 保存原始 PNG 哈希与尺寸。

本轮仅作尺寸压缩和 WebP / JPEG 编码，生成 640px、1200px 响应式资源；无调色、磨皮或效果伪造。生产页面明确标注“合成演示照片”，画廊进一步说明不是 App 前后效果。

`public/images/` 继承既有政策／帮助站素材，正文和引用不变。历史 acne 图片保留以兼容既有路径，不放进首页营销。

字体 Outfit 来自 npm @fontsource/outfit 5.2.8，许可见 OUTFIT-LICENSE.txt。favicon 使用文字 G 与既有暖橙圆点，不引入第三方标志。所有图片、字体均本地托管，不请求随机图片 API 或 Google 字体。

## 后续替换

1. 真实 App 截图：需对应正式公开版本，使用已获授权的素材，不使用虚构控件。当前没有展示 1.1 草稿截图。
2. 编辑前后对比：需要同一源图、对齐构图、真实 App 导出及版本记录；当前关闭。
3. 新摄影素材：确认可用于公开官网并可再分发后，放入 public/photos，更新来源、替代文本与尺寸。
4. 社交分享图目前使用合成海岸照片。若提供品牌专用横版图，可在预渲染脚本中替换 og:image。
