# SEX123 Navigation

> 纯前端多项目导航中心 · 多平台镜像 · GO 智能线路选择（规划与迁移中）

**SEX123 Navigation** 是 [SEX123.TOP](https://sex123.top/) 永久入口体系的第二层项目。它负责展示项目网站，并在用户选择项目后，通过独立的 GO Router 选择可用的业务线路。

本仓库由 [sexnav](https://github.com/sexnav) 维护，目前处于 **静态站迁移完成、导航功能改造准备阶段**。现有线上页面仍可能包含上游模板的品牌信息和跳转地址；请勿将原模板线路视为 SEX123 已上线的业务线路。

## 架构与仓库分工

```text
sex123.top                       独立 Gateway / 品牌首页
  │ 「立即进入」：选择可用导航镜像
  ▼
SEX123 Navigation                本仓库的同一份静态代码
  ├─ sexnav.github.io
  ├─ sex123.vercel.app
  ├─ sex123.pages.dev
  └─ sex123.netlify.app
       │ 用户选择项目
       ▼
     GO Router                   项目级主备业务线路（待改造）
       ├─ NTRSP 主站：ntrsp.com
       └─ NTRSP 备用：439000.xyz
```

| 职责 | 仓库 | 说明 |
| --- | --- | --- |
| 品牌 Gateway | [wwvvv/sex123](https://github.com/wwvvv/sex123) | `sex123.top` 的独立入口页、镜像检查、进入导航中心 |
| 项目导航 | **[sexnav/sexnav.github.io](https://github.com/sexnav/sexnav.github.io)** | 项目卡片、类别、GO 路由与静态导航资源 |
| 业务网站 | 独立部署 | `ntrsp.com` 和 `439000.xyz` 是 NTRSP 业务线路，不是本仓库的镜像 |

## 导航镜像

以下为计划长期使用的地址。**部署成功仅代表静态镜像已发布，不代表新版导航页面及全部功能已经完成验收。**

| 托管平台 | 地址 | 已知状态 |
| --- | --- | --- |
| GitHub Pages | [sexnav.github.io](https://sexnav.github.io/) | 仓库改名成功，Pages 部署正常 |
| Vercel | [sex123.vercel.app](https://sex123.vercel.app/) | 新项目 `sex123-nav` 绑定成功、生产部署已验证 |
| Cloudflare Pages | [sex123.pages.dev](https://sex123.pages.dev/) | GitHub 自动部署已验证 |
| Netlify | [sex123.netlify.app](https://sex123.netlify.app/) | 镜像项目已配置，首次正式发布及同步验证中 |

额外回退地址：`sex123-nav.vercel.app`。旧 `ntrsp.*` 项目暂不删除。详细迁移记录见 [MIRROR_MIGRATION.md](MIRROR_MIGRATION.md)。

## 技术方案

- 纯静态 HTML5、CSS3、Vanilla JavaScript，前期不引入数据库或服务端 API。
- 一份 Navigation 源码，连接 GitHub Pages / Vercel / Cloudflare Pages / Netlify 自动部署。
- Gateway 与 Navigation 独立发布；镜像切换不影响业务 WordPress 站点。
- 项目目录、主备业务线路将集中到 JSON 配置文件维护。
- GO Router 计划支持并发静态资源检查、超时回退、历史成功线路记录以及内置浏览器提示。
- 浏览器资源探测只能辅助判断可访问性，不能保证目标业务流程完全健康；保留手动切换入口。
- PWA 与缓存仍在改造评估中，避免缓存陈旧业务地址。

## 项目阶段

| 阶段 | 范围 | 状态 |
| --- | --- | --- |
| 0 | 源码迁移、GitHub 账号与仓库更名、镜像初始化 | 基本完成 |
| 1 | 清理旧品牌及无关文件、统一配置、设计 Navigation UI | 待实施 |
| 2 | 多项目导航卡片及 `go.html?project=...` 业务线路选择 | 待实施 |
| 3 | Gateway「立即进入」选择最快可用导航镜像 | 待实施（位于独立 Gateway 仓库） |
| 4 | 四镜像浏览器回归、PWA、安全与性能优化 | 待完整验收 |

## 开发与预览

```bash
git clone https://github.com/sexnav/sexnav.github.io.git
cd sexnav.github.io
python3 -m http.server 8080
```

浏览器打开 `http://localhost:8080/`。

当前仓库来自纯静态模板，本地预览不要求构建。生产部署使用 `main` 分支，具体部署状态请以各平台控制台为准。

## 开源来源与许可

本仓库早期版本基于 [aidizhi/aidizhi.github.io](https://github.com/aidizhi/aidizhi.github.io) 修改，感谢上游作者提供的发布页模板和多线路跳转思路。原始作者的版权与 MIT 许可声明保留于仓库 [LICENSE](LICENSE)。

此 README 描述 **SEX123 的现行定位与开发计划**，不再将上游项目的站点、邮箱、业务地址或功能声明误作本项目现有服务。
