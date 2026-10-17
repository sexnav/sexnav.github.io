# NTRSP 永久地址发布页

这是 **SEX123.TOP 双层智能入口系统的第二层**，四个平台部署相同的 NTRSP 地址发布页，页面自动检测业务主备域名，并展示本次探测响应较快的推荐线路。

> 当前状态：**NTRSP 地址发布页已合并至 `main` 并同步部署到 Vercel、Cloudflare Pages、GitHub Pages、Netlify**。`sex123.top` 仍由旧 Vercel 项目托管，尚未切换到新 Gateway。

## 双层访问流程

```text
sex123.top
  └─ 点击「立即进入」
       └─ Gateway 并发探测四个平台的静态图片，选择可用且响应较快的镜像
          ├─ sex123.vercel.app
          ├─ sex123.pages.dev
          ├─ sexnav.github.io
          └─ sex123.netlify.app
               └─ NTRSP 永久地址发布页（本仓库）
                    ├─ ntrsp.com   主线路
                    └─ 439000.xyz 备用线路
```

## 仓库分工

- [sexnav/Gateway](https://github.com/sexnav/Gateway)：独立的 SEX123 品牌入口，负责第一层镜像选择。
- [sexnav/sexnav.github.io](https://github.com/sexnav/sexnav.github.io)：本仓库，负责第二层 NTRSP 主备业务域名检测、推荐与手动切换。

## 页面功能

- 进入镜像自动并发测速，推荐成功加载探测图片且本次响应时间较短的线路。
- 推荐地址、测速延迟、全部地址列表、重新检测、复制、手动访问。
- 探测全部失败时不自动跳转，保留两条业务线路供用户尝试。
- `config.json` 集中维护主备域名和四平台镜像；前端仅允许 HTTPS 和同源探测资源。
- PWA 缓存页面 UI，不缓存业务域名配置，避免旧地址长期残留。
- 保留 `/go.html?project=ntrsp` 旧版快速跳转页面兼容入口，正式用户从首页测速页进入。

**注意**：浏览器图片探测不是 Ping，也不保证 WordPress 的登录、播放器、文章页全部可用。由于当前外部环境无法独立确认 `ntrsp.com` 和 `439000.xyz` 的探测图片是否可访问，必须在真实用户网络中完成端到端验收；检测失败时会提供手动入口。

## 运行与测试

```bash
git clone https://github.com/sexnav/sexnav.github.io.git
cd sexnav.github.io
python3 -m http.server 8080
node --test tests/*.test.mjs
```

纯 HTML/CSS/Vanilla JS，无数据库、无后端、无构建步骤。GitHub Pages、Vercel、Cloudflare Pages、Netlify 从同一 `main` 分支自动发布，生产发布目录为仓库根目录。

## 开源来源

仓库最早基于 [aidizhi/aidizhi.github.io](https://github.com/aidizhi/aidizhi.github.io) 的 MIT 模板改造，保留 [LICENSE](LICENSE) 中的原始许可与作者信息。历史版本与部署记录见 [MIRROR_MIGRATION.md](MIRROR_MIGRATION.md)。
