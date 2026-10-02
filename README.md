# GlowMuse 官网

官网源码、完整双语协议与发布入口现统一维护在本仓库。

- 正式站：<https://glowmuse.top/>，中文 <https://glowmuse.top/zh/>。
- GitHub Pages：<https://chenbingios.github.io/LumiEdit-Support/>，**完整静态镜像**，保留历史六个文档 URL；不再自动跳转。镜像 canonical / hreflang 指向正式站，没有 CNAME。
- 源码：`website/`，React 19 + Vite + TypeScript，构建时预渲染英文和中文 HTML。无需 API Key、Express、数据库或登录服务。
- 仓库根目录 HTML、assets、photos、zh 等为 Pages 生成产物，不直接修改。

## 安装与验证

Node.js 22.12 或更新版本。本轮使用 Node 26.4.0、npm 11.17.0；依赖锁定在 `website/package-lock.json`。

```sh
cd website
npm ci --ignore-scripts --no-audit --no-fund
npm run dev
npm run typecheck
npm run build
npm run build:pages
npm run verify
npm run preview -- --port 4173
```

`build` → `website/dist`（主域根路径）；`build:pages` → `website/dist-pages`（`/LumiEdit-Support/` 子路径）。两者分别生成 `/` 与 `/zh/`，不使用全站 SPA 兜底。`verify` 检查文档原文、资源与导航路径、预渲染和跳转风险。

## 唯一发布入口

```sh
cd website
npm run typecheck
npm run build
npm run build:pages
npm run verify
npm run sync:pages
npm run deploy:check
# 审阅差异并提交推送网站仓库 main，然后发布已验证的 dist
npm run deploy
```

Cloudflare 发布使用本目录 `wrangler.jsonc`，目标为已有 `glowmuse-site`，根域名与 www 绑定保持不变。www → 根域名的 301 为已有区域规则，独立于本项目，保留路径与查询参数。Wrangler 认证使用开发机外部配置，不提交凭据。dry-run 不等于线上发布成功。

GitHub Pages 沿用 main 根目录发布；`sync:pages` 按 `.pages-manifest.json` 同步镜像并仅清理先前登记的生成文件，不清理未登记的历史文件。Pages 不需要额外构建依赖。每次发布后确认 Pages 构建成功，再检查实际线上文件。

**停止用 iOS 仓库的 `release/site`、`scripts/prepare-release-site.py` 或 `npm --prefix release run deploy` 发布主站。** 那套旧流程会生成旧索引并覆盖新官网。旧部署记录仅用于历史审计。本仓库已接管官网发布；本次没有修改或推送 iOS 工程。

## 内容与素材维护

- 营销文案：`website/src/components/`；公共事实与 URL：`website/src/data/content.ts`。
- 六个已审阅文档：`website/public/{privacy,terms,support}-{en,zh-Hans}.html`。任何政策变更需要单独审阅；不能用简短弹窗替换正文。
- 素材说明：`website/ASSETS.md`；设计：`website/DESIGN.md`；验证：`website/VALIDATION.md`。
- 上次核实（2026-10-02）中美商店公开版均为 1.0，iOS 15+。美国名称为 Lumi Edit – Photo Editor，中国名称为微光修图，下载 ID 6810123460。上线事实需重新查询，后台草稿不是公开版证据。
- 背景虚化及前后效果展示默认关闭；没有真实、可公开的同源 App 导出对比前，不启用。网站不会模拟 App 编辑或保存照片。
- 不放置账户凭据、管理接口、用户照片或私有数据；无分析追踪和表单收集。

## 后台边界

公开官网保持纯静态。未来管理页面应在独立私有项目、独立子域名下部署，并通过 Cloudflare Access 认证；管理写 API 与公开只读目录 API 分离。D1 / R2 是否启用、管理员名单、发布与回滚流程须在后台任务中明确。本仓库不创建后台业务、admin 入口或额外收费资源。

## 回滚

保留发布前的 Git 提交与 Cloudflare 版本号。在需要回滚时，使用项目固定的 Wrangler 查看并选择已验证版本回滚；GitHub Pages 使用 Git revert 恢复相关源码与生成产物，再正常推送，避免重写 main 历史。不要通过 iOS 旧脚本覆盖新站作为日常回滚方式。
