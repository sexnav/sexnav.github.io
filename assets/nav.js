"use strict";
(() => {
  const grid = document.getElementById("project-grid");
  const filters = document.getElementById("category-filters");
  const count = document.getElementById("project-count");
  const search = document.getElementById("project-search");
  const mirrors = document.getElementById("mirror-links");
  let projects = [];
  let selectedCategory = "全部";
  let keyword = "";

  const el = (tag, cls, value) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (value !== undefined) node.textContent = value;
    return node;
  };
  const validUrl = (raw) => {
    try {
      const u = new URL(raw);
      return u.protocol === "https:" ? u.href : null;
    } catch { return null; }
  };
  const validProject = (p) => p && p.enabled !== false &&
    typeof p.id === "string" && /^[a-z0-9-]{1,40}$/.test(p.id) &&
    typeof p.name === "string" && Array.isArray(p.routes) &&
    p.routes.some(r => validUrl(r.url));

  function drawFilters() {
    filters.replaceChildren();
    const categories = ["全部", ...new Set(projects.map(p => p.category || "其他"))];
    for (const category of categories) {
      const btn = el("button", "filter" + (selectedCategory === category ? " active" : ""), category);
      btn.type = "button";
      btn.setAttribute("aria-pressed", String(selectedCategory === category));
      btn.addEventListener("click", () => {
        selectedCategory = category;
        drawFilters();
        drawProjects();
      });
      filters.append(btn);
    }
  }

  function drawProjects() {
    const filtered = projects.filter(p => (selectedCategory === "全部" || (p.category || "其他") === selectedCategory) &&
      (p.name + " " + (p.description || "") + " " + (p.tagline || "")).toLocaleLowerCase().includes(keyword));
    grid.replaceChildren();
    count.textContent = String(projects.length).padStart(2, "0");
    if (!filtered.length) {
      grid.append(el("div", "empty-state", "没有找到匹配的项目，请调整搜索或分类。"));
      return;
    }
    for (const p of filtered) {
      const card = el("article", "project-card");
      const top = el("div", "project-top");
      const icon = el("div", "project-icon", String(p.icon || p.name.slice(0, 1)).slice(0, 2));
      if (/^#[0-9a-fA-F]{6}$/.test(p.accent || "")) {
        icon.style.background = "linear-gradient(145deg," + p.accent + ",#7736ab)";
      }
      top.append(icon, el("span", "project-category", p.category || "其他"));
      const title = el("h3", "", p.name);
      const tagline = el("p", "tagline", p.tagline || "项目网站");
      const description = el("p", "description", p.description || "");
      const bottom = el("div", "project-bottom");
      const routes = p.routes.filter(r => validUrl(r.url));
      bottom.append(el("span", "route-count", routes.length + " 条已配置线路"));
      const link = el("a", "enter-link", "智能进入 ↗");
      link.href = "/go.html?project=" + encodeURIComponent(p.id);
      link.setAttribute("aria-label", "智能进入 " + p.name);
      bottom.append(link);
      card.append(top, title, tagline, description, bottom);
      grid.append(card);
    }
  }

  function drawMirrors(items) {
    mirrors.replaceChildren();
    for (const mirror of items || []) {
      const href = validUrl(mirror.url);
      if (!href) continue;
      const a = el("a", "", mirror.name || new URL(href).host);
      a.href = href;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      mirrors.append(a);
    }
  }

  search.addEventListener("input", () => {
    keyword = search.value.trim().toLocaleLowerCase();
    drawProjects();
  });

  fetch("/config.json", { cache: "no-store" })
    .then(response => {
      if (!response.ok) throw new Error("配置请求失败");
      return response.json();
    })
    .then(data => {
      if (!Array.isArray(data.projects)) throw new Error("项目配置格式错误");
      projects = data.projects.filter(validProject);
      drawFilters();
      drawProjects();
      drawMirrors(data.mirrors);
    })
    .catch(() => {
      grid.replaceChildren(el("div", "empty-state", "项目列表暂时无法加载。请刷新页面，或通过永久入口切换其他镜像。"));
      count.textContent = "—";
    });

  if ("serviceWorker" in navigator && location.protocol === "https:") {
    window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
  }
})();
