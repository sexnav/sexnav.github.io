# NTRSP 永久地址发布页

这是 **SEX123 双层智能入口系统的第二层**。用户从 Gateway 选择最快可访问的平台镜像，进入本站后，浏览器自动检测 NTRSP 的业务主备域名，推荐可用且本次静态资源响应较快的地址。

## 两层架构

```text
sex123.top  →  点击「立即进入」→  四平台镜像并发探测
    ├─ sex123.vercel.app
    ├─ sex123.pages.dev
    ├─ sexnav.github.io
    └─ sex123.netlify.app
          ↓
    NTRSP 永久地址发布页（本仓库）
          ↓
    ntrsp.com / 439000.xyz（业务主备域名）
```

**[sexnav/Gateway](https://github.com/sexnav/Gateway)** 是独立的品牌入口仓库；本仓库只维护 NTRSP 永久地址发布页。用户在本页查看推荐结果并主动点击业务域名，不进行无人确认的业务跳转。

## 前端 UI 复用

**不再自行编写卡片、按钮、标签、布局 CSS。** 本页使用 [Tabler UI](https://tabler.io/)（MIT）正式版 **1.6.1** 的原生卡片、按钮、标签、深色模式及响应式工具类。

- `assets/vendor/tabler.min.css` 为经 npm 发布包固定版本提取的编译后 CSS，静态部署到全部四个镜像。
- `assets/vendor/TABLER-LICENSE.txt` 保留 Tabler MIT 版权声明。
- 不使用第三方 CSS CDN 作为运行依赖，避免四镜像共用 CDN 故障点。
- 删除旧手写的 `assets/style.css`、`assets/go.js`；旧 `go.html` 仅保留兼容跳转到首页。
- `assets/nav.js` 保留上一版真实线路探测与复制逻辑，页面渲染改为 Tabler 组件结构。

### 功能

自动检测、推荐线路、按本次探测延迟排序、重新检测、复制链接、手动进入、离线与超时回退。**图片资源探测不等于完整网站可用性检测。**

## 本地预览

```bash
git clone https://github.com/sexnav/sexnav.github.io.git
cd sexnav.github.io
python3 -m http.server 8080
node --test tests/*.test.mjs
```

页面为纯静态 HTML/CSS/Vanilla JS；Tabler CSS 已包含在仓库中，无需浏览器加载外部样式 CDN。

### UI 版本更新

仅升级源码包版本并重新从 `@tabler/core` 官方发布物提取 CSS，不修改一套自研设计系统。当前用 `feat/tabler-publisher-ui` 分支验收，合并后四个托管平台由同一 `main` 自动发布。

## 版权

早期版本源于 [aidizhi/aidizhi.github.io](https://github.com/aidizhi/aidizhi.github.io)（MIT），保留仓库根目录 [LICENSE](LICENSE)；Tabler UI 许可证见 `assets/vendor/TABLER-LICENSE.txt`。

## Tabler 本地化校验

版本 `@tabler/core@1.6.1`，从官方 npm 发布包提取编译后的 `assets/vendor/tabler.min.css`（635,394 bytes），并保存到 Git 仓库。四个平台均直接加载本地 CSS，不需要访问 jsDelivr / unpkg。旧手写样式已删除。此版本先在开发分支验证，正式镜像暂时不变。
