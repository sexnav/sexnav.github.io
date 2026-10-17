# SEX123 Navigation 镜像迁移记录

> 原则：先建立并验证新镜像，再切换 Gateway 线路池；保留所有旧项目与域名，不执行删除。

## 系统边界

- Gateway：`wwvvv/sex123`，主域名 `sex123.top`，负责品牌首页与导航镜像选择。
- Navigation：本仓库，负责项目导航和 `go.html` 的业务线路路由。
- 业务目的站：`ntrsp.com`（主）与 `439000.xyz`（备用），不是导航镜像。

## 镜像迁移状态（2026-10-17）

| 平台 | 保留的旧镜像 | 新镜像 | 进度 |
| --- | --- | --- | --- |
| GitHub Pages | ntrsp.github.io | sexnav.github.io | 账号已改为 sexnav；仓库仍需改名 |
| Vercel | ntrsp.vercel.app | sex123-nav.vercel.app | 新项目 sex123-nav 已部署 READY |
| Cloudflare Pages | ntrsp.pages.dev | sex123.pages.dev | 新项目 sex123 已连接 GitHub，生产部署成功 |
| Netlify | ntrsp.netlify.app | sex123.netlify.app | 新站点已创建并解除 SSO，首次部署/连接 Git 待完成 |

**Vercel 命名冲突：** `sex123.vercel.app` 已由 `wwvvv/sex123` 所属 Gateway 项目占用，暂时使用 `sex123-nav.vercel.app`，不转移原别名。

## 仍需完成

1. 在 GitHub 仓库 Settings → General → Repository name，将 `sexnav/ntrsp.github.io` 改名为 `sexnav/sexnav.github.io`。保持原仓库 ID、main 分支与历史。
2. 验证 `https://sexnav.github.io/`，如有必要在 Settings → Pages 配置 `main / (root)` 或现有 GitHub Actions 发布方式。
3. 在 Netlify 新站点 `sex123` 中连接 `sexnav/sexnav.github.io` 的 `main`，发布目录为仓库根目录 `.`，构建命令留空。
4. 核查仓库改名后 Vercel、Cloudflare Pages 的 GitHub 连接，确认新提交仍自动部署。
5. 检查所有新镜像首页、静态资源、导航卡片、GO 路由、PWA、HTTPS 和移动端。
6. 只有四镜像实际通过验收后，才更新 Gateway 镜像配置；旧项目和地址继续保留用于回退。

## 当前版本说明

新镜像目前部署的是迁移阶段的静态源码，**不代表 SEX123 导航 UI 与 GO 路由已经改造完成**。后续品牌和导航开发需独立验证。
