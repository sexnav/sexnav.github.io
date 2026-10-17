"use strict";
/* NTRSP Address Publisher: adapted from the existing SEX123 GO image-probe router. */
(() => {
  const $ = id => document.getElementById(id);
  const list = $("route-list");
  const recommendHost = $("recommend-domain");
  const recommendDetail = $("recommend-detail");
  const recommendState = $("recommend-state");
  const recommendEnter = $("recommend-enter");
  const recommendCopy = $("recommend-copy");
  const summary = $("check-summary");
  const refresh = $("refresh-routes");
  const mirrorLinks = $("mirror-links");
  const fallbackRoutes = [
    { id: "primary", name: "主线路", url: "https://ntrsp.com/", probeUrl: "https://ntrsp.com/wp-includes/images/w-logo-blue.png" },
    { id: "backup", name: "备用线路", url: "https://439000.xyz/", probeUrl: "https://439000.xyz/wp-includes/images/w-logo-blue.png" }
  ];
  const fallbackMirrors = [
    { name: "Vercel", url: "https://sex123.vercel.app/" },
    { name: "Cloudflare Pages", url: "https://sex123.pages.dev/" },
    { name: "GitHub Pages", url: "https://sexnav.github.io/" },
    { name: "Netlify", url: "https://sex123.netlify.app/" }
  ];
  let routes = fallbackRoutes;
  let checking = false;
  let generation = 0;
  let timeoutMs = 2800;

  const el = (tag, cls, value) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (value !== undefined) node.textContent = value;
    return node;
  };
  function https(raw) {
    try {
      const url = new URL(raw);
      return url.protocol === "https:" ? url : null;
    } catch { return null; }
  }
  function validRoute(route) {
    if (!route || typeof route.id !== "string") return false;
    const target = https(route.url), probe = https(route.probeUrl);
    return Boolean(target && probe && target.origin === probe.origin);
  }
  function renderMirrors(mirrors) {
    mirrorLinks.replaceChildren();
    for (const mirror of mirrors) {
      const url = https(mirror.url);
      if (!url) continue;
      const a = el("a", "", mirror.name || url.host);
      a.href = url.href;
      a.rel = "noopener noreferrer";
      a.target = "_blank";
      mirrorLinks.append(a);
    }
  }
  async function copy(text, button) {
    const original = button.textContent;
    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(text);
      button.textContent = "已复制 ✓";
    } catch {
      try {
        const input = el("textarea", "", text);
        input.value = text;
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.append(input);
        input.select();
        const ok = document.execCommand("copy");
        input.remove();
        button.textContent = ok ? "已复制 ✓" : "请手动复制";
      } catch { button.textContent = "请手动复制"; }
    }
    setTimeout(() => { button.textContent = original; }, 1800);
  }
  function resetRecommendation(message, state) {
    recommendHost.textContent = state === "loading" ? "正在检测线路…" : "暂无可确认的可用线路";
    recommendDetail.textContent = message;
    recommendState.textContent = state === "loading" ? "检测中" : "未确认";
    recommendState.className = "badge " + (state === "loading" ? "bg-secondary-lt text-secondary" : "bg-red-lt text-red");
    recommendEnter.removeAttribute("href");
    recommendEnter.setAttribute("aria-disabled", "true");
    recommendEnter.className = "btn btn-primary btn-lg disabled";
    recommendEnter.textContent = "请从下方手动选择 ↗";
    recommendCopy.disabled = true;
  }
  function showRecommendation(result) {
    recommendHost.textContent = new URL(result.route.url).host;
    recommendDetail.textContent = result.route.name + " · 本次探测约 " + result.ms + " ms · 可手动切换其他地址";
    recommendState.textContent = "本次响应最快";
    recommendState.className = "badge bg-green-lt text-green";
    recommendEnter.href = result.route.url;
    recommendEnter.removeAttribute("aria-disabled");
    recommendEnter.className = "btn btn-primary btn-lg";
    recommendEnter.textContent = "立即访问 ↗";
    recommendCopy.disabled = false;
    recommendCopy.onclick = () => copy(result.route.url, recommendCopy);
  }
  function renderRoutes(results = []) {
    list.replaceChildren();
    const ordered = [...routes].sort((a, b) => {
      const ar = results.find(r => r.route.id === a.id);
      const br = results.find(r => r.route.id === b.id);
      if (!ar && !br) return 0;
      if (!ar) return 1;
      if (!br) return -1;
      if (ar.ok !== br.ok) return ar.ok ? -1 : 1;
      return ar.ms - br.ms;
    });
    for (const route of ordered) {
      const result = results.find(r => r.route.id === route.id);
      const row = el("article", "card flex-column flex-sm-row align-items-start align-items-sm-center" + (result && result.ok && results.filter(r => r.ok).every(r => r.ms >= result.ms) ? " border-primary" : ""));
      const info = el("div", "card-body flex-grow-1");
      info.append(el("span", "badge bg-blue-lt text-blue mb-2", route.name || "访问线路"));
      info.append(el("div", "h3 mb-1 text-break", new URL(route.url).host));
      const state = el("div", "small " + (result ? (result.ok ? "text-green" : "text-red") : "text-secondary"),
        result ? (result.ok ? result.ms + " ms · 可访问探测资源" : "超时或未确认 · 可手动尝试") : "等待检测");
      info.append(state);
      const actions = el("div", "d-flex flex-wrap gap-2 p-3 align-items-center");
      const visit = el("a", "btn btn-sm btn-primary", "访问 ↗");
      visit.href = route.url;
      visit.rel = "noopener noreferrer";
      const copyButton = el("button", "btn btn-sm btn-outline-secondary", "复制");
      copyButton.type = "button";
      copyButton.addEventListener("click", () => copy(route.url, copyButton));
      actions.append(visit, copyButton);
      row.append(info, actions);
      list.append(row);
    }
  }
  function probe(route, timeout) {
    return new Promise(resolve => {
      const image = new Image();
      const started = performance.now();
      let done = false;
      let timer;
      const finish = ok => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        image.onload = null;
        image.onerror = null;
        resolve({ route, ok, ms: Math.max(1, Math.round(performance.now() - started)) });
      };
      timer = setTimeout(() => finish(false), timeout);
      image.onload = () => finish(true);
      image.onerror = () => finish(false);
      image.referrerPolicy = "no-referrer";
      const url = new URL(route.probeUrl);
      url.searchParams.set("_probe", Date.now() + "-" + Math.random().toString(36).slice(2));
      image.src = url.href;
    });
  }
  async function checkRoutes() {
    if (checking) return;
    checking = true;
    const run = ++generation;
    refresh.disabled = true;
    refresh.textContent = "检测中…";
    resetRecommendation("正在并发检查 NTRSP 主站与备用域名，请稍候。", "loading");
    summary.textContent = "检测中 · " + routes.length + " 条线路";
    renderRoutes();
    if (navigator.onLine === false) {
      resetRecommendation("设备报告网络离线，恢复网络后请重新检测。", "failed");
      summary.textContent = "网络离线";
      refresh.disabled = false;
      refresh.textContent = "↻ 重新检测";
      checking = false;
      return;
    }
    const results = await Promise.all(routes.map(route => probe(route, timeoutMs)));
    if (run !== generation) return;
    const good = results.filter(r => r.ok).sort((a, b) => a.ms - b.ms);
    renderRoutes(results);
    if (good.length) showRecommendation(good[0]);
    else resetRecommendation("所有探测资源均未确认可用，请尝试下方主站或备用地址。", "failed");
    summary.textContent = "检测完成 " + new Date().toLocaleTimeString("zh-CN", { hour12: false }) + " · " + good.length + "/" + routes.length + " 条线路可确认";
    refresh.disabled = false;
    refresh.textContent = "↻ 重新检测";
    checking = false;
  }
  async function initialize() {
    let mirrors = fallbackMirrors;
    let configFailed = false;
    try {
      const response = await fetch("/config.json", { cache: "no-store" });
      if (!response.ok) throw new Error("configuration fetch failed");
      const config = await response.json();
      const project = Array.isArray(config.projects) ? config.projects.find(p => p.id === "ntrsp" && p.enabled !== false) : null;
      if (!project || !Array.isArray(project.routes)) throw new Error("NTRSP routes missing");
      const configured = project.routes.filter(validRoute);
      if (!configured.length) throw new Error("No valid HTTPS routes");
      routes = configured;
      if (Array.isArray(config.mirrors)) mirrors = config.mirrors;
      if (Number.isFinite(config.probeTimeoutMs)) timeoutMs = Math.max(800, Math.min(6000, config.probeTimeoutMs));
    } catch { configFailed = true; }
    renderMirrors(mirrors);
    if (configFailed) summary.textContent = "配置未加载，使用预置主备地址";
    refresh.addEventListener("click", checkRoutes);
    renderRoutes();
    await checkRoutes();
    if (configFailed) summary.textContent += " · 配置未加载，使用预置地址";
  }
  initialize();
  if ("serviceWorker" in navigator && location.protocol === "https:") {
    window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
  }
})();
