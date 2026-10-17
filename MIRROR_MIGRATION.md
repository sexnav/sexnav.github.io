# SEX123 Navigation 镜像迁移记录

> 迁移原则：先建立并验证新镜像，再切换 Gateway 线路池；保留所有旧项目与域名，不执行删除。

## 系统边界

- Gateway: `wwvvv/sex123`，主域名 `sex123.top`，负责品牌首页和选择导航镜像。
- Navigation: 本仓库，负责项目导航及 `go.html` 业务线路路由。
- 业务站点：`ntrsp.com`（主）与 `439000.xyz`（备用），不属于导航镜像。

## 当前与目标

| 平台 | 现有镜像 | 新镜像 |
| --- | --- | --- |
| GitHub Pages | ntrsp.github.io | sexnav.github.io |
| Vercel | ntrsp.vercel.app | 待定（sex123.vercel.app 已被 Gateway 项目占用） |
| Cloudflare Pages | ntrsp.pages.dev | sex123.pages.dev |
| Netlify | ntrsp.netlify.app | sex123.netlify.app |

## 发布与验收

1. 将 GitHub 仓库 `sexnav/ntrsp.github.io` 改名为 `sexnav/sexnav.github.io`，保持仓库 ID、main 分支和 Git 历史。
2. 验证 `https://sexnav.github.io/` 的首页和资源。
3. 核对 Vercel / Cloudflare / Netlify 的 GitHub 仓库连接与生产部署。
4. 对每个新镜像测试首页、导航卡片、GO 跳转、HTTPS、PWA、移动端。
5. 只有在新镜像实际可访问且行为一致后，才更新 Gateway 的镜像线路配置。
6. 原镜像继续保留用于回退，不删除仓库、项目或域名。

## 注意

`sex123.vercel.app` 已由独立 Gateway 所属 Vercel 项目占用。未经迁移确认，不要转移该别名，也不要将 `sex123.top` 绑定到 Navigation。
