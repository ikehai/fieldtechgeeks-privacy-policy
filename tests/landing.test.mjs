import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { translations } from '../public/landing/constants/i18n.js';

test('landing-page copy has complete English and Spanish translations', () => {
  assert.deepEqual(Object.keys(translations.en).sort(), Object.keys(translations.es).sort());
  const html = readFileSync(new URL('../public/landing/index.html', import.meta.url), 'utf8');
  const keys = [...html.matchAll(/data-i18n(?:-label)?="([^"]+)"/g)].map(match => match[1]);
  for (const language of ['en', 'es']) {
    for (const key of keys) assert.ok(translations[language][key]?.trim(), `${language}.${key}`);
  }
});
