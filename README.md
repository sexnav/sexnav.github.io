# SEX123.TOP

**SEX123.TOP 永久地址发布页**，为 NTRSP 专属服务，支持主备业务域名自动测速、推荐本次较快线路、复制链接与手动切换。

此仓库负责四个平台一致的发布页；独立的 [sexnav/Gateway](https://github.com/sexnav/Gateway) 负责 `sex123.top` 第一层「立即进入」与镜像选择。

## 访问架构

```text
sex123.top                       品牌 Gateway（独立仓库）
  └── 点击「立即进入」：并发检测镜像
      ├── sex123.vercel.app        Vercel
      ├── sex123.pages.dev         Cloudflare Pages
      ├── sexnav.github.io         GitHub Pages
      └── sex123.netlify.app       Netlify
            └── SEX123.TOP 永久地址发布页（本仓库）
                  ├── ntrsp.com    NTRSP 主业务域名
                  └── 439000.xyz  NTRSP 备用业务域名
```

**名称说明：** 发布页的对外品牌统一为 **SEX123.TOP**，NTRSP 仅作为所服务的业务网站名称；历史仓库地址 `sexnav/sexnav.github.io` 和四平台镜像地址不因品牌调整而变更。

## 页面功能

- 页面加载后检测 NTRSP 主备 HTTPS 探测资源；展示推荐线路和其他手动入口。
- 展示本次资源响应延迟、重新检测、复制和手动进入按钮。
- 探测全失败时不强制跳转，保留两条业务线路。
- `config.json` 为业务线路的配置来源；PWA 不缓存业务地址配置，以免缓存过期 URL。
- **图片探测不是 Ping**，探测通过也不保证整个 WordPress 的登录、播放等业务都可用。

## UI 与技术

纯静态 HTML / JavaScript，前端使用 **[Tabler UI 1.6.1](https://tabler.io/)** 的 Card、Button、Badge、深色主题与响应式布局。编译后 CSS 固定在 `assets/vendor/tabler.min.css`，四平台使用各自的本地文件，无运行时第三方样式 CDN 依赖。

```bash
git clone https://github.com/sexnav/sexnav.github.io.git
cd sexnav.github.io
python3 -m http.server 8080
node --test tests/*.test.mjs
```

正式版由 `main` 自动发布到四镜像。项目品牌和架构变化保留 Git 提交记录，旧模板溯源参见 [MIRROR_MIGRATION.md](MIRROR_MIGRATION.md)。

## 许可证

原项目早期版本基于 [aidizhi/aidizhi.github.io](https://github.com/aidizhi/aidizhi.github.io)（MIT），原始版权声明保留于 [LICENSE](LICENSE)；Tabler MIT 许可证见 [TABLER-LICENSE.txt](assets/vendor/TABLER-LICENSE.txt)。
