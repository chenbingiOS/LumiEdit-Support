# 从 iOS 工程迁出的网页设计与后台方案

这些文件于 2026-10-02 从 LumiPortrait 迁出：两个 HTML 交互原型、光斑面板 CSS 令牌、Cloudflare 后台管理方案。它们是历史参考，不是当前官网的发布源。对应 PNG/SVG 图片是原生界面设计资产的副本，原件仍在 iOS 文档中。

当前官网唯一源码入口为 ../../website/；这里不进入 website/public、dist 或 Pages 同步清单。后台方案仅供规划，不意味着已有部署。迁移文件摘要见 migration-manifest.json。

旧 iOS release/node_modules、.wrangler 和域名／协议部署的本机验证产物移至本仓库 .local-migration/ios-web-20261002/，已忽略，不提交或发布。旧官网源码、生成器、测试和部署配置也已从 iOS 当前提交原样迁入本归档；所需双语文档、演示图和发行资料仅作为快照，应用原件保留。可以在本归档执行 python3 scripts/test-release-site.py 与 python3 scripts/prepare-release-site.py --check --require-publisher 检查历史内容。禁止使用归档内旧 Wrangler 配置部署现有主站，当前官网唯一发布入口是 website/。
