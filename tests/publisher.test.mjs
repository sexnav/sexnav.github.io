import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
const script = readFileSync(new URL("../assets/nav.js", import.meta.url), "utf8");
const config = JSON.parse(readFileSync(new URL("../config.json", import.meta.url), "utf8"));
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function boot({ allFail = false, offline = false, configFail = false } = {}) {
  const nodes = new Map();
  const node = () => ({
    textContent: "", className: "", style: {}, children: [], handlers: {}, disabled: false,
    append(...items) { this.children.push(...items); },
    replaceChildren(...items) { this.children = items; },
    addEventListener(event, callback) { this.handlers[event] = callback; },
    setAttribute(key, value) { this[key] = value; },
    removeAttribute(key) { delete this[key]; },
    select() {}, remove() {}
  });
  const document = {
    body: node(),
    createElement: node,
    getElementById(id) {
      if (!nodes.has(id)) nodes.set(id, node());
      return nodes.get(id);
    },
    execCommand: () => true
  };
  let fetchCount = 0;
  const context = {
    document, URL, Date, Math, setTimeout, clearTimeout,
    navigator: { onLine: !offline },
    location: { protocol: "http:" },
    window: { addEventListener() {} },
    performance: { now: () => Date.now() },
    fetch: async () => {
      fetchCount++;
      return configFail ? { ok: false } : { ok: true, json: async () => config };
    },
    Image: class {
      set src(url) {
        const delay = url.includes("439000.xyz") ? 12 : 42;
        setTimeout(() => {
          if (allFail) this.onerror?.();
          else this.onload?.();
        }, delay);
      }
    }
  };
  vm.runInNewContext(script, context);
  return { nodes, getFetchCount: () => fetchCount };
}
test("homepage auto-probes both NTRSP business domains and recommends the faster one", async () => {
  const app = boot();
  await sleep(120);
  assert.equal(app.nodes.get("recommend-domain").textContent, "439000.xyz");
  assert.equal(app.nodes.get("recommend-enter").href, "https://439000.xyz/");
  assert.equal(app.nodes.get("route-list").children.length, 2);
  assert.match(app.nodes.get("check-summary").textContent, /2\/2/);
});
test("probe failure never redirects and leaves manual links available", async () => {
  const app = boot({ allFail: true });
  await sleep(120);
  assert.equal(app.nodes.get("recommend-enter").href, undefined);
  assert.equal(app.nodes.get("route-list").children.length, 2);
  const rows = app.nodes.get("route-list").children;
  assert.equal(rows[0].children[1].children[0].href, "https://ntrsp.com/");
  assert.equal(rows[1].children[1].children[0].href, "https://439000.xyz/");
});
test("refresh button triggers a new measurement without losing route list", async () => {
  const app = boot();
  await sleep(120);
  app.nodes.get("refresh-routes").handlers.click();
  await sleep(120);
  assert.equal(app.nodes.get("route-list").children.length, 2);
  assert.equal(app.nodes.get("refresh-routes").disabled, false);
});
test("config request failure keeps preconfigured safe manual addresses", async () => {
  const app = boot({ configFail: true });
  await sleep(120);
  assert.equal(app.nodes.get("route-list").children.length, 2);
  assert.equal(app.getFetchCount(), 1);
  assert.match(app.nodes.get("check-summary").textContent, /配置未加载/);
});
test("offline browser retains manual links and disables automatic recommendation", async () => {
  const app = boot({ offline: true });
  await sleep(40);
  assert.equal(app.nodes.get("recommend-enter").href, undefined);
  assert.equal(app.nodes.get("route-list").children.length, 2);
});
