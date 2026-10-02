# 发布验证 · 2026-10-02

## 源码与构建

- 压缩包 25 个条目先检查绝对路径、父目录穿越、符号链接和单文件大小，后解压；未执行模板 clean 脚本。
- 删除未使用的 Gemini、Express、dotenv、motion 依赖及模拟保存／隐私检测／简版政策组件；生产代码无 API Key 注入，无在线编辑和照片上传。
- 固定依赖后 `npm ci --ignore-scripts --no-audit --no-fund`、严格 TypeScript 检查、两种 base 的生产构建、预渲染与 verify、Pages 同步及 Wrangler dry-run 均通过。
- 生产依赖 npm audit：0 漏洞。本轮未作完整渗透测试或浏览器全矩阵测试。
- 双语隐私、协议、帮助六份文件与旧仓库逐字比较，仅移除 GitHub 专用 meta refresh，其他字节保持一致。
- README 明确网站仓库接管发布，不能再用 iOS release/site 旧脚本覆盖主站；iOS 仓库本轮未改动。

## 实际浏览器检查

在生产构建预览上执行：1440×1000、768×1024、390×844，均无横向溢出；首屏、功能、画廊和隐私区域视觉核对。图片无加载错误，浏览器无 error/warn。

已操作中英文链接、中文直接刷新、移动菜单展开／锚点导航、原生 FAQ 展开、画廊预览、Escape／关闭按钮、关闭后焦点恢复、完整中文隐私政策导航。GitHub `/LumiEdit-Support/` 与中文子路径也执行了切换及直接刷新。

## App Store 外部行为

2026-10-02 Apple Lookup API 中美地区均确认 ID 6810123460、公开 1.0、iOS 15+；中国名称“微光修图”，美国名称“Lumi Edit – Photo Editor”。没有读取或修改 App Store Connect 字段、构建或审核状态。

全球下载链接和美国链接在本次网络中的浏览器及普通 curl 会跳到中国区 Today 页；**不将此记为产品详情访问通过**。保留用户指定的全球入口，并增加明确地区链接。实际点击中国大陆链接到达同一 ID 的“微光修图 App - App Store”详情页。未执行手机原生商店安装或其他地区真机验证。

## 发布后检查

- 功能提交 `4f7cdde5e10815293a4ae8aff9fdce011ee4f1c7` 已推送 main。
- GitHub Pages 构建部署成功：https://github.com/chenbingiOS/LumiEdit-Support/actions/runs/36952472532 ，镜像已实际替换。
- Cloudflare Worker `glowmuse-site` 已发布，版本 `79b957a2-db27-408e-b6b9-e6eade533fcf`。发布前版本 `744c93ed-0e05-44ea-901d-c3cd2b95392a`。
- 普通系统 DNS + curl HTTPS，未使用 `--resolve`、未禁用证书验证：主站及 Pages 各八页，共十六页均为 200、TLS 校验结果 0、响应字节与构建产物完全一致。
- HTTP → HTTPS、www → 主域（保留路径和查询参数）、历史 `/LumiEdit-Support/` 文档路由、`/zh` → `/zh/` 均 301，缺失路径 404。JS 和 WebP 请求 200，主站 CSP 与缓存响应头生效。
- 线上浏览器确认主站英文桌面、中文手机、语言切换和直接刷新、移动菜单、画廊预览与 Escape；Pages 中文子路径直接刷新正常，canonical 指向主站。官网没有浏览器 error/warn；切换到 Apple 外站时 Apple 自身 logger 出现 warning，单独记录，不算官网报错。
- 保存了实际线上桌面和手机截图。验证不涵盖所有国家网络、iPhone 原生商店安装或完整辅助技术审计。
