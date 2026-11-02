import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log(`Usage: npm run deploy -- [--dry-run]

Prerequisites: npm ci; Wrangler login or CLOUDFLARE_API_TOKEN; account
3cbca53455b84a03f36f56e0a5448c64 with both active domains.
Runs routing tests, then deploys the privacy site and canonical redirects.
Alternative: run the Deploy privacy policy workflow in ikehai/fieldtech.
Recovery: check out the previous policy commit and deploy again. Domain
aliases remain attached; review redirects before changing canonical URLs.`);
  process.exit(0);
}
if (args.some(arg => arg !== '--dry-run')) throw new Error('Only --dry-run and --help are supported');
const cwd = fileURLToPath(new URL('..', import.meta.url));
for (const command of [
  ['--test', 'tests/routing.test.mjs'],
  ['node_modules/wrangler/bin/wrangler.js', 'deploy', ...args],
]) {
  const result = spawnSync(process.execPath, command, {
    cwd, stdio: 'inherit',
    env: { ...process.env, CLOUDFLARE_ACCOUNT_ID: '3cbca53455b84a03f36f56e0a5448c64' },
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
