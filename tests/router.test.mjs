import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
const code = readFileSync(new URL("../assets/go.js", import.meta.url), "utf8");
const config = JSON.parse(readFileSync(new URL("../config.json", import.meta.url), "utf8"));
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

function launch({ project = "ntrsp", ua = "Mozilla/5.0 Chrome/130.0", imageOk = true } = {}) {
  const nodes = new Map();
  const makeNode = () => ({
    textContent: "", className: "", style: {}, children: [],
    append(...items) { this.children.push(...items); },
    replaceChildren(...items) { this.children = items; }
  });
  const document = {
    getElementById(id) {
      if (!nodes.has(id)) nodes.set(id, makeNode());
      return nodes.get(id);
    },
    createElement() { return makeNode(); }
  };
  const storage = new Map();
  let redirected = null;
  let requests = 0;
  const context = {
    document,
    navigator: { userAgent: ua, onLine: true },
    location: { search: "?project=" + encodeURIComponent(project), replace(url) { redirected = url; } },
    fetch: async () => { requests++; return { ok: true, json: async () => config }; },
    localStorage: { getItem: key => storage.get(key) || null, setItem: (key, val) => storage.set(key, val) },
    URL, URLSearchParams, performance: { now: () => Date.now() },
    setTimeout, clearTimeout,
    Image: class {
      set src(value) {
        setTimeout(() => {
          if (imageOk && value.includes("ntrsp.com")) this.onload?.();
          else this.onerror?.();
        }, 15);
      }
    }
  };
  vm.runInNewContext(code, context);
  return { nodes, getRedirect: () => redirected, getRequests: () => requests };
}
test("GO chooses a successfully probed route", async () => {
  const run = launch();
  await wait(520);
  assert.equal(run.getRedirect(), "https://ntrsp.com/");
  assert.equal(run.nodes.get("route-options").children.length, 2);
});
test("GO refuses unknown projects rather than accepting arbitrary redirect URLs", async () => {
  const run = launch({ project: "https://evil.example" });
  await wait(40);
  assert.equal(run.getRedirect(), null);
  assert.equal(run.getRequests(), 0);
});
test("GO leaves manual options visible when probes fail", async () => {
  const run = launch({ imageOk: false });
  await wait(80);
  assert.equal(run.getRedirect(), null);
  assert.equal(run.nodes.get("route-options").children.length, 2);
  assert.match(run.nodes.get("go-status").textContent, /手动选择/);
});
test("GO does not auto-redirect in embedded app browsers", async () => {
  const run = launch({ ua: "Mozilla/5.0 MicroMessenger" });
  await wait(40);
  assert.equal(run.getRedirect(), null);
  assert.match(run.nodes.get("go-status").textContent, /App 内置浏览器/);
});
