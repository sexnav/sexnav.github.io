import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const config = JSON.parse(read("config.json"));

test("NTRSP business routes have safe HTTPS URLs and same-origin probes", () => {
  assert.equal(config.schemaVersion, 1);
  const p = config.projects.find(p => p.id === "ntrsp");
  assert.ok(p);
  assert.equal(config.projects.length, 1);
  assert.equal(p.routes.length, 2);
  for (const route of p.routes) {
    const target = new URL(route.url), probe = new URL(route.probeUrl);
    assert.equal(target.protocol, "https:");
    assert.equal(probe.origin, target.origin);
  }
});

test("four independent mirror URLs use HTTPS", () => {
  const urls = config.mirrors.map(m => new URL(m.url));
  assert.equal(urls.length, 4);
  assert.equal(new Set(urls.map(u => u.origin)).size, urls.length);
  for (const url of urls) assert.equal(url.protocol, "https:");
});

test("all rendered UI comes from vendored Tabler, not handwritten CSS", () => {
  const pages = ["index.html", "offline.html", "go.html"];
  for (const page of pages) {
    const html = read(page);
    assert.match(html, /assets\/vendor\/tabler\.min\.css/);
    assert.match(html, /data-bs-theme="dark"/);
    assert.doesNotMatch(html, /<style\b/i);
    assert.doesNotMatch(html, /assets\/style\.css/);
  }
  assert.ok(existsSync(new URL("../assets/vendor/tabler.min.css", import.meta.url)));
  const css = read("assets/vendor/tabler.min.css");
  assert.ok(css.length > 40000, "Tabler CSS must be the real built package");
  assert.match(css, /--tblr-/);
  assert.ok(existsSync(new URL("../assets/vendor/TABLER-LICENSE.txt", import.meta.url)));
  assert.ok(!existsSync(new URL("../assets/style.css", import.meta.url)));
});

test("publisher page uses Tabler cards, buttons and status badges", () => {
  const html = read("index.html");
  assert.match(html, /class="card\b/);
  assert.match(html, /btn btn-primary/);
  assert.match(html, /badge bg-green-lt/);
  for (const id of ["route-list", "recommended-card", "recommend-enter", "recommend-copy", "refresh-routes", "mirror-links"]) {
    assert.ok(html.includes('id="' + id + '"'), id);
  }
  assert.match(html, /assets\/nav\.js/);
  assert.doesNotMatch(html, /project-grid|category-filters/);
});

test("old GO link redirects to publisher home without a custom stylesheet", () => {
  const html = read("go.html");
  assert.match(html, /noindex,nofollow/);
  assert.match(html, /url=\//);
  assert.ok(!existsSync(new URL("../assets/go.js", import.meta.url)));
});

test("PWA UI cache includes vendored CSS, but never caches business config", () => {
  const sw = read("sw.js");
  assert.match(sw, /\/assets\/vendor\/tabler\.min\.css/);
  assert.match(sw, /\/config\.json/);
  assert.match(sw, /cache: "no-store"/);
  assert.ok(!sw.includes('"/config.json",'));
  assert.doesNotMatch(sw, /\/assets\/style\.css/);
});
