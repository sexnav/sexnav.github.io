# SEX123.TOP 四平台镜像

本仓库发布 NTRSP 主备地址页，并由 `main` 同步到四个平台：

- GitHub Pages: https://sexnav.github.io/
- Vercel: https://sex123.vercel.app/
- Cloudflare Pages: https://sex123.pages.dev/
- Netlify: https://sex123.netlify.app/

入口域名 https://sex123.top/ 由 [sexnav/Gateway](https://github.com/sexnav/Gateway) 发布。入口页并发探测四个镜像，用户点击“立即进入”后跳到当前响应最快的镜像；镜像页再检测 NTRSP 主线路与备用线路。

## 发布约定

- 四个镜像根域直接显示 NTRSP 地址发布页。
- `?view=ntrsp`、`/ntrsp`、`/go` 与 `/go.html` 保留兼容。
- `_headers`、`_redirects` 与 `vercel.json` 分别覆盖 Cloudflare Pages、Netlify 和 Vercel。
- 静态资源使用内容哈希并长期缓存；HTML、配置和 Service Worker 始终重新验证。
- `main` 更新后，以四个平台各自的生产状态和页面验收结果为准。
