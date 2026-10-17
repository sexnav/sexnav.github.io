# SEX123 Navigation 镜像迁移与验收

更新时间：2026-10-17。原则：不删除旧镜像，不在新站验收前切换 Gateway 线路池。

## 系统边界

- Gateway：`wwvvv/sex123`，永久域名 `sex123.top`，负责品牌首页及导航镜像选择。
- Navigation：`sexnav/sexnav.github.io`，负责项目导航和 GO 智能路由。
- NTRSP 业务域名：`ntrsp.com` 主线路、`439000.xyz` 备用线路，均不是导航镜像。

## 四镜像状态

| 平台 | 新镜像 | 已核实 | 保留的旧镜像 |
| --- | --- | --- | --- |
| GitHub Pages | https://sexnav.github.io | 仓库已改名，Pages 构建成功 | ntrsp.github.io |
| Vercel | https://sex123.vercel.app | sex123-nav 项目，生产部署 READY、域名已验证 | ntrsp.vercel.app |
| Cloudflare Pages | https://sex123.pages.dev | sex123 项目，生产部署成功；需持续验证仓库改名后 Git webhook | ntrsp.pages.dev |
| Netlify | https://sex123.netlify.app | 已核对 Netlify sex123 站点（ID 288a4bfe-94aa-452d-8176-800443632015），公开访问限制已关闭；待首次 Deploy 确认 | ntrsp.netlify.app |

Vercel 还保留 `sex123-nav.vercel.app` 作为额外备用别名。`sex123.vercel.app` 已不再由 Gateway 占用。

## 迁移验收标准

1. 所有新镜像能在浏览器直接访问，HTTPS 有效，首页与资源返回正常。
2. 四平台生产部署同一个 Git 提交，并在下一次 `main` 更新后继续自动部署。
3. 导航页完成独立品牌化、项目卡片、`go.html?project=ntrsp` 主备业务线路检测、PWA 及手机端测试。
4. Gateway 的 `sex123.top` 从旧 Vercel 项目迁移到独立 Gateway 项目，需在 Gateway 验证后执行。
5. 只有新导航镜像全部验收通过后，才把新域名加入 Gateway 的生产线路池。
6. 旧项目和域名继续保留用于回退，不删除。

## 当前风险

- Netlify 站点已重新定位，尚无可验证的部署 ID；需确认 Git 连接及首次 Deploy。
- 原导航仓库目前仍是参考项目静态页面，导航中心与多项目 GO 路由尚待实施。
- 浏览器端跨域测速只能测量探测资源，不保证业务站完整可用，必须提供手动回退。
