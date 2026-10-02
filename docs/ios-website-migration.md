# 官网与 iOS 工程分离 · 2026-10-02

## 本次范围

迁移前，官网 React／Vite 源码、双语预渲染、Pages 同步和 Cloudflare 配置已在本仓库 `website/`。本次接管剩余交接文件并从 iOS 工作区移除旧站点，避免两个发布入口互相覆盖。

- 将 iOS 的 `docs/brand-website/stitch-prompt.md` 原样迁入本仓库同路径。
- 移除 iOS 的 `release/site/`、`release/package.json`、`release/package-lock.json` 和 `release/wrangler.jsonc`。这些旧文件仍可从 iOS Git 历史追溯，不覆盖本仓库较新的首页、路由或响应头配置。
- 移除旧 `prepare-release-site.py` 和网页生成测试；iOS 改用 `prepare-app-documents.py`、`test-app-documents.py`，保留联系资料、合法公开地址、幂等同步和漂移拒绝检查，不再输出 HTML 或读取网站仓库。
- 更新 iOS 静态检查、送审资料检查及维护说明。应用资源、公开 URL、发行主体资料和历史商店记录保持原样。两端政策变更须分别审阅；不再声称 iOS 静态检查自动保证网页正文同步。
- 本仓库 `website/` 的现有源码、素材、六份文档、Cloudflare 配置和根目录 Pages 产物保持原样；唯一维护和发布流程见根目录 README。

## 本次验证

- 官网 `npm ci --ignore-scripts --no-audit --no-fund`、`npm run typecheck`、`npm run build`、`npm run build:pages`、`npm run verify` 全部通过。检查两个部署根路径的链接、双语预渲染、六份文档与构建产物一致性及跳转风险。
- `npm run deploy:check` 通过，仅 Wrangler dry-run，没有发布远端。
- iOS `./verify.sh static`、`./verify.sh lint`、`python3 scripts/prepare-app-documents.py --check --require-publisher` 通过；4 项应用文档 Python 回归通过，包含隔离副本漂移失败、修复及不生成网站的检查。
- 迁移前后哈希核对：Support 102 个受保护文件、iOS 570 个源码／资源／工程配置和发行资料文件均未变化。六份旧站文档与 Support 对应文件仅有既存的 `</head>` 换行差异；两张消除示意图字节一致，无正文或素材丢失。
- 两仓库 `git diff --check` 通过。

本次为本地目录和工具职责整理，未修改 App 产品行为；未执行 iOS 编译、应用单元测试、模拟器／真机或浏览器交互回归。未同步 Pages 生成产物、提交、推送、部署或修改 App Store。此前线上结果见 `website/VALIDATION.md`，不作为本次重新验证的结果。构建出现 Node 的 `module.register()` 废弃提示，但构建退出状态均为成功。

## 同轮补充清理

剩余两个 HTML 原型、光斑 CSS 令牌及 Cloudflare 管理后台方案已迁至 `archive/ios-web-20261002/`，四个移动文件及相邻设计图副本的摘要已校验。原生设计图仍留在 iOS 文档。旧网站 Node 依赖、Wrangler 本机状态、域名和协议部署验证目录移入 `.local-migration/ios-web-20261002/`，已由 Git 忽略，不进入公开页面。

iOS 第一方维护目录不再包含 HTML/CSS/JavaScript/TypeScript 网页源码或 Node/Wrangler 发布配置。Pods/Vendor 内部依赖资源、原生设计图、App 的在线协议路由和历史测试报告不作为独立网站删除。两仓库此次只本地整理和提交，不发布线上。

最终追加验证：iOS Debug 模拟器构建、16 项 HomeLayoutTests、1 项双语在线协议界面用例均通过，0 失败；最终 static/lint 与严格发行资料检查通过。迁出旧生成器的 4 项 Python 回归及归档快照同步检查通过。日志和结果包在 iOS 工程 output/validation/web-separation-20261002/。迁移改动将分别本地提交；没有推送、重新部署、修改商店或验证真机。上文“未执行应用测试”“未提交”描述前一阶段，不代表最终结果。
