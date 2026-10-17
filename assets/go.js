"use strict";
(() => {
  const title = document.getElementById("go-title");
  const status = document.getElementById("go-status");
  const options = document.getElementById("route-options");
  const progress = document.getElementById("go-progress");
  const params = new URLSearchParams(location.search);
  const projectId = params.get("project");
  const timeoutMs = 2500;
  const inApp = /micromessenger|wechat|\bqq\/(?!.*qqbrowser)|douyin|aweme|snssdk|kuaishou|weibo|alipayclient|dingtalk|baiduboxapp|xiaohongshu|xhs/i.test(navigator.userAgent || "");

  function text(message, percent) {
    status.textContent = message;
    if (typeof percent === "number") progress.style.width = percent + "%";
  }
  function validUrl(raw) {
    try {
      const u = new URL(raw);
      return u.protocol === "https:" ? u : null;
    } catch { return null; }
  }
  function readHistory(key) {
    try { return JSON.parse(localStorage.getItem(key) || "{}") || {}; }
    catch { return {}; }
  }
  function record(key, routeId, ok, ms) {
    try {
      const history = readHistory(key);
      const row = history[routeId] || { successes: 0, failures: 0 };
      if (ok) { row.successes += 1; row.lastLatency = ms; row.lastSuccess = Date.now(); }
      else row.failures += 1;
      history[routeId] = row;
      localStorage.setItem(key, JSON.stringify(history));
    } catch { /* Storage may be unavailable. */ }
  }
  function renderRoutes(routes) {
    options.replaceChildren();
    for (const route of routes) {
      const a = document.createElement("a");
      a.className = "route-option";
      a.href = route.url;
      a.rel = "noreferrer";
      const details = document.createElement("span");
      const label = document.createElement("strong");
      label.textContent = route.name || "业务线路";
      const host = document.createElement("small");
      host.textContent = new URL(route.url).host;
      const arrow = document.createElement("span");
      arrow.className = "route-arrow";
      arrow.textContent = "↗";
      details.append(label, host);
      a.append(details, arrow);
      options.append(a);
    }
  }
  function probe(route) {
    return new Promise(resolve => {
      const start = performance.now();
      const img = new Image();
      let finished = false;
      let timer;
      const finish = (ok) => {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        img.onload = null;
        img.onerror = null;
        const ms = Math.max(1, Math.round(performance.now() - start));
        resolve({ route, ok, ms });
      };
      timer = setTimeout(() => finish(false), timeoutMs);
      img.onload = () => finish(true);
      img.onerror = () => finish(false);
      img.referrerPolicy = "no-referrer";
      const probeUrl = new URL(route.probeUrl);
      probeUrl.searchParams.set("_probe", String(Date.now()) + Math.random().toString(36).slice(2));
      img.src = probeUrl.href;
    });
  }

  async function start() {
    if (!projectId || !/^[a-z0-9-]{1,40}$/.test(projectId)) {
      title.textContent = "项目地址无效";
      text("请从导航中心选择项目后再进入。", 100);
      options.replaceChildren();
      return;
    }
    try {
      const response = await fetch("/config.json", { cache: "no-store" });
      if (!response.ok) throw new Error("config");
      const config = await response.json();
      const project = Array.isArray(config.projects) && config.projects.find(p => p.id === projectId && p.enabled !== false);
      if (!project || !Array.isArray(project.routes)) throw new Error("project");
      const routes = project.routes.filter(r => {
        const target = validUrl(r.url);
        const probeUrl = validUrl(r.probeUrl);
        return r.id && target && probeUrl && target.origin === probeUrl.origin;
      });
      if (!routes.length) throw new Error("routes");
      title.textContent = "正在进入 " + project.name;
      renderRoutes(routes);
      if (inApp) {
        text("当前可能是 App 内置浏览器。建议复制下方线路到系统浏览器打开。", 100);
        return;
      }
      if (navigator.onLine === false) {
        text("当前设备处于离线状态，请恢复网络后重试或手动选择。", 100);
        return;
      }
      text("正在并发检查 " + routes.length + " 条业务线路…", 45);
      const historyKey = "sex123-routes-v1:" + project.id;
      const results = await Promise.all(routes.map(probe));
      for (const result of results) record(historyKey, result.route.id, result.ok, result.ms);
      const successful = results.filter(r => r.ok);
      if (!successful.length) {
        text("未能确认线路可用性（可能是探测资源被拦截），请手动选择线路。", 100);
        return;
      }
      const history = readHistory(historyKey);
      successful.sort((a, b) => {
        const aLast = history[a.route.id]?.lastSuccess || 0;
        const bLast = history[b.route.id]?.lastSuccess || 0;
        const aPenalty = aLast && Date.now() - aLast < 7 * 86400000 ? -30 : 0;
        const bPenalty = bLast && Date.now() - bLast < 7 * 86400000 ? -30 : 0;
        return (a.ms + aPenalty) - (b.ms + bPenalty);
      });
      const winner = successful[0];
      text("已找到可用线路：" + winner.route.name + "（约 " + winner.ms + "ms），正在进入…", 100);
      setTimeout(() => location.replace(winner.route.url), 350);
    } catch {
      title.textContent = "暂时无法自动进入";
      text("项目配置不可用，请返回导航中心或尝试其他导航镜像。", 100);
      options.replaceChildren();
    }
  }
  start();
})();
