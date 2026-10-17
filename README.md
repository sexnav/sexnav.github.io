# SEX123 Navigation

**纯前端项目导航中心 + GO 智能线路路由**。与独立的 [SEX123 Gateway](https://github.com/wwvvv/sex123) 配合使用。

> 状态：**Navigation V1 已合并到 `main` 并部署到四个平台**。静态测试与 GO 路由行为测试通过；业务域名的真实可达性仍需在终端网络中验收。

## 访问架构

```text
sex123.top (独立 Gateway)
   └── 点击「立即进入」 → 智能选择 Navigation 镜像
       ├── https://sexnav.github.io/
       ├── https://sex123.vercel.app/
       ├── https://sex123.pages.dev/
       └── https://sex123.netlify.app/
             └── 项目卡片 → /go.html?project=ntrsp
                    ├── https://ntrsp.com/    主业务线路
                    └── https://439000.xyz/  备用业务线路
```

导航镜像与业务域名是两种不同的地址。四个平台发布的是同一份 Navigation 静态页面；`ntrsp.com` 和 `439000.xyz` 是 WordPress 业务站入口。

## V1 功能

- 响应式暗黑导航 UI、项目搜索与分类过滤。
- JSON 配置的多项目卡片与镜像列表，首个项目 NTRSP。
- 通用 GO Router：`/go.html?project=<id>`，仅允许配置中存在的项目，拒绝任意 URL 参数跳转。
- 并发探测业务线路上的 HTTPS 图片资源，在 2.5 秒内选择成功且响应较快的线路。
- 内置浏览器识别、手动线路选择、超时或资源探测失败时不强制跳转。
- PWA 静态 UI 缓存、离线提示；**不缓存项目配置或 GO 跳转页**，避免过期业务地址。
- 独立 SEO / CSP / 安全响应头，不再使用上游品牌、旧 APK 或旧邮件地址。

**测速说明**：浏览器的图片探测不等于 Ping，也不能保证 WordPress 的登录、播放等业务功能正常。项目配置中的 `probeUrl` 必须是真实存在、允许浏览器加载的同源图片；如果图片不存在或被反盗链拦截，GO 将显示手动线路选项，而不会盲目跳转。当前使用 WordPress 核心图片路径，正式验收时必须从实际网络验证。

## 目录

```text
index.html               项目导航主页
go.html                  通用 GO 跳转页
config.json              项目、镜像、主备业务域名
assets/style.css         视觉样式
assets/nav.js            项目列表、搜索、分类
assets/go.js             业务线路探测与跳转
assets/favicon.svg       品牌图标
manifest.json / sw.js    PWA 与离线缓存
offline.html             离线提示
_headers / vercel.json   各平台安全响应头
tests/*.test.mjs         静态配置、安全与 GO 路由行为回归
```

## 本地开发

```bash
git clone https://github.com/sexnav/sexnav.github.io.git
cd sexnav.github.io
python3 -m http.server 8080
# 浏览器打开 http://localhost:8080/
node --test tests/static.test.mjs
```

无需 Node 依赖、数据库、后台或构建工具；Node 仅用于运行测试。

## 新增项目

编辑 `config.json` 的 `projects` 数组，提供唯一 `id`、名称、分类和 HTTPS 业务线路。每条线路包含 `url` 与其同源的 `probeUrl`。前端不会执行配置之外的任意外链跳转。

## 部署与回退

`main` 为正式生产分支；功能分支完成测试后合并。Vercel、Cloudflare Pages、Netlify 的构建命令留空、发布目录 `.`；GitHub Pages 使用用户主页仓库 `sexnav/sexnav.github.io`。迁移记录见 [MIRROR_MIGRATION.md](MIRROR_MIGRATION.md)。

## 开源许可

本项目早期版本基于 [aidizhi/aidizhi.github.io](https://github.com/aidizhi/aidizhi.github.io)（MIT）改造，保留原始许可声明于 [LICENSE](LICENSE)，感谢原作者的静态发布页和线路跳转思路。
