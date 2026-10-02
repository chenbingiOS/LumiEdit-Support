# 正式站协议部署 · 2026-10-02

- 目标：Cloudflare Worker `glowmuse-site`，正式域名 `glowmuse.top` 和 `www.glowmuse.top`。
- 发布时间：2026-10-02 12:43:50（UTC+8）。
- 新版本：`d9ebcae3-78c7-491b-ae63-93005f02cc70`，远程 deployment 已确认 100% 流量。
- Deployment：`1786f091-e18a-4aa9-a793-f3f8c3cdf195`。
- 发布前版本：`79b957a2-db27-408e-b6b9-e6eade533fcf`。需要回滚时可按 Cloudflare 版本回滚流程选择该版本；本次未执行回滚。

## 发布与验证

从本工程 `website/dist` 经项目固定版本 Wrangler 发布。TypeScript、正文与两个构建的一致性、4 项回归、全站链接检查及 dry-run 均通过。此次上传 11 个新增／变更资源，其余复用。

正式 HTTPS 普通请求（未使用指定 IP 或绕过证书校验）检查了六个文档、reader.css、reader.js 及两个首页，最终全部 HTTP 200，正文与本地产物逐字节一致，安全响应头存在。详细哈希见 `production-verification.json`。初次请求曾出现一次 TLS 超时及 HTML 注入差异，最终普通请求重验通过，未将初次失败结果冒充成功。

真实正式域名浏览器在 390px 宽度下检查中文隐私（17 条）和用户协议（12 条），页面无横向溢出，底部真实链接跳转成功。截图为 `screenshots/production-privacy-mobile.png` 和 `production-terms-mobile.png`。这是浏览器移动视口结果；iOS 真机 WKWebView 由用户随后验收。

## 域名级 RUM 自动注入

上线核对发现 Cloudflare 在 HTML 尾部额外注入 `static.cloudflareinsights.com` 脚本，与本网站无行为分析脚本的约定不符。读取目标域名 `rum` 设置返回 off，但实际响应仍含脚本；为该域名显式写入 `rum=off` 后，重新加载仅保留本站 `legal/reader.js`，全部被检 HTML 与本地产物恢复一致。

仅调整 glowmuse.top 的网页 RUM 设置，没有关闭 Worker 运行日志、链路追踪或安全功能，也未修改其他域名的 Web Analytics。域名设置独立于 Worker 版本，代码回滚不会自动回滚该设置。

## 范围

本次用户授权为发布正式域名，已完成。没有推送 GitHub 或触发 Pages 镜像发布，没有修改 iOS 代码和 App Store 配置。源码及本地 Pages 产物保留在当前工作区；之前文档中的“未部署”是当时状态，当前正式站以本记录为准。

参考：[Wrangler 命令](https://developers.cloudflare.com/workers/wrangler/commands/workers/)、[回滚说明](https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/)、[Cloudflare 自动 RUM 说明](https://developers.cloudflare.com/speed/observatory/rum-beacon/)。
