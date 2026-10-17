import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const config = JSON.parse(read("config.json"));

test("projects have safe ids and configured HTTPS routes", () => {
  assert.equal(config.schemaVersion, 1);
  assert.ok(config.projects.length >= 1);
  const ids = new Set();
  for (const project of config.projects) {
    assert.match(project.id, /^[a-z0-9-]{1,40}$/);
    assert.ok(!ids.has(project.id));
    ids.add(project.id);
    assert.ok(project.routes.length >= 1);
    for (const route of project.routes) {
      const url = new URL(route.url);
      const probe = new URL(route.probeUrl);
      assert.equal(url.protocol, "https:");
      assert.equal(probe.origin, url.origin);
    }
  }
});
test("mirror URLs are HTTPS and unique", () => {
  const urls = config.mirrors.map(m => new URL(m.url));
  assert.ok(urls.length >= 4);
  assert.equal(new Set(urls.map(u => u.origin)).size, urls.length);
  for (const url of urls) assert.equal(url.protocol, "https:");
});
test("navigation files are present and free from legacy branding", () => {
  const paths = ["index.html","go.html","assets/style.css","assets/nav.js","assets/go.js","manifest.json","sw.js","offline.html","_headers","vercel.json"];
  for (const path of paths) {
    assert.ok(existsSync(new URL("../" + path, import.meta.url)), path);
    const content = read(path);
    assert.ok(!/aidizhi|455555\.xyz|爱播爱播/i.test(content), path);
  }
  assert.match(read("index.html"), /assets\/nav\.js/);
  assert.match(read("go.html"), /assets\/go\.js/);
  assert.match(read("go.html"), /noindex/);
});
test("router never accepts arbitrary redirect query values", () => {
  const router = read("assets/go.js");
  assert.match(router, /projectId/);
  assert.match(router, /config\.projects\.find/);
  assert.match(router, /target\.origin === probeUrl\.origin/);
  assert.doesNotMatch(router, /params\.get\(["']url["']\)/);
});
test("service worker never caches business route configuration", () => {
  const worker = read("sw.js");
  assert.match(worker, /\/config\.json/);
  assert.match(worker, /cache: "no-store"/);
  assert.ok(!worker.includes('"/config.json", "/go.html"'));
});
