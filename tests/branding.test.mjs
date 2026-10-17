import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");

test("SEX123.TOP is the public-facing publisher brand", () => {
  const index = read("index.html");
  const manifest = JSON.parse(read("manifest.json"));
  const config = JSON.parse(read("config.json"));
  assert.match(index, /<title>SEX123\.TOP · 永久地址发布页<\/title>/);
  assert.match(index, /id="hero-title"[^>]*>SEX123\.TOP<\/h1>/);
  assert.match(index, /aria-label="SEX123\.TOP 永久地址发布页"/);
  assert.equal(manifest.short_name, "SEX123.TOP");
  assert.match(manifest.name, /^SEX123\.TOP/);
  assert.equal(config.brand, "SEX123.TOP");
  assert.equal(config.projects[0].id, "ntrsp");
  assert.equal(config.projects[0].routes.length, 2);
});

test("secondary pages and PWA cache also use new brand", () => {
  assert.match(read("go.html"), /SEX123\.TOP/);
  assert.match(read("offline.html"), /SEX123\.TOP/);
  assert.match(read("sw.js"), /sex123-publisher-tabler-v2/);
  assert.match(read("README.md"), /^# SEX123\.TOP/m);
});
