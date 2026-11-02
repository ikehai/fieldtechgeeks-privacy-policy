import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import worker from '../worker.mjs';

const noAssets = { ASSETS: { fetch() { throw new Error('Redirect must precede asset serving'); } } };
for (const [host, canonical] of [
  ['fieldtechgeek.com', 'fieldtechgeeks.com'],
  ['www.fieldtechgeek.com', 'fieldtechgeeks.com'],
  ['www.fieldtechgeeks.com', 'fieldtechgeeks.com'],
  ['manager.fieldtechgeek.com', 'manager.fieldtechgeeks.com'],
  ['backoffice.fieldtechgeek.com', 'backoffice.fieldtechgeeks.com'],
]) {
  test(`${host} preserves encoded paths and queries on the canonical domain`, async () => {
    const response = await worker.fetch(new Request(`https://${host}/request/a%2Fb?from=old&next=//other.example`), noAssets);
    assert.equal(response.status, 308);
    assert.equal(response.headers.get('Location'), `https://${canonical}/request/a%2Fb?from=old&next=//other.example`);
  });
}
for (const path of ['/privacy-policy', '/privacy-policy/']) {
  test(`${path} serves the actual policy at the primary host`, async () => {
    const response = await worker.fetch(new Request(`https://fieldtechgeeks.com${path}`), {
      ASSETS: { fetch(request) {
        assert.equal(new URL(request.url).pathname, '/');
        return new Response('FieldTechGeeks policy');
      } },
    });
    assert.equal(response.status, 200);
    assert.equal(await response.text(), 'FieldTechGeeks policy');
  });
}
test('policy stylesheet is served without a redirect', async () => {
  const response = await worker.fetch(new Request('https://fieldtechgeeks.com/styles.css'), {
    ASSETS: { fetch() { return new Response('body {}'); } },
  });
  assert.equal(await response.text(), 'body {}');
});
for (const [path, expected] of [
  ['/', 'https://manager.fieldtechgeeks.com/'],
  ['/manager', 'https://manager.fieldtechgeeks.com/'],
  ['/manager/request/123', 'https://manager.fieldtechgeeks.com/request/123'],
  ['/backoffice', 'https://backoffice.fieldtechgeeks.com/'],
  ['/backoffice/jobs/123', 'https://backoffice.fieldtechgeeks.com/jobs/123'],
  ['//other.example', 'https://manager.fieldtechgeeks.com//other.example'],
]) {
  test(`primary ${path} opens the correct app without an external redirect`, async () => {
    const response = await worker.fetch(new Request(`https://fieldtechgeeks.com${path}?tab=photos`), noAssets);
    assert.equal(response.headers.get('Location'), expected + '?tab=photos');
    assert.equal(response.status, 308);
  });
}
test('plain HTTP becomes HTTPS before serving policy content', async () => {
  const response = await worker.fetch(new Request('http://fieldtechgeeks.com/privacy-policy'), noAssets);
  assert.equal(response.headers.get('Location'), 'https://fieldtechgeeks.com/privacy-policy');
});
test('both policy sources match and retain the published app identity', () => {
  const root = readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');
  const nested = readFileSync(new URL('../public/privacy-policy/index.html', import.meta.url), 'utf8');
  assert.equal(root, nested.replace('../styles.css', './styles.css'));
  assert.match(root, /<h1>FieldTechGeeks<\/h1>/);
  assert.doesNotMatch(root, /Ikehai|FieldTrack/);
  assert.match(root, /com\.d8ydev\.fieldtech/);
});
