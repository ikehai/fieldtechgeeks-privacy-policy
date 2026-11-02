# FieldTechGeeks website

The production privacy policy is https://fieldtechgeeks.com/privacy-policy.
Cloudflare Worker `fieldtech-privacy-policy` serves the source in `public/`.

The apex domain serves the landing page in `public/landing/`. `/manager` and
`/backoffice` redirect to the corresponding websites. Singular and www aliases
redirect permanently to the plural spelling, preserving paths and queries.

Landing-page translations and theme tokens live in `public/landing/constants/`.
See `docs/landing-page.md` for the design and app-link details.

## Update and publish

Edit `public/index.html` and `public/privacy-policy/index.html` together, run
`npm test`, and merge the update. In `ikehai/fieldtech`, run the **Deploy privacy
policy** GitHub Actions workflow with this repository's commit SHA or branch.
That workflow uses the existing Cloudflare deployment credentials.

For a local deployment, install Node.js and run `npm ci`, authenticate Wrangler
to the account that owns both domains, then run `npm run deploy`. Use
`npm run deploy -- --dry-run` to validate packaging without publishing, or
`npm run deploy -- --help` for prerequisites and recovery instructions.

## Legacy links

The GitHub Pages workflow publishes only `legacy/`. These pages redirect visitors
to the new policy and include a clickable fallback. JavaScript preserves query
strings and section anchors. The normal GitHub Pages service cannot return a
custom HTTP redirect status, so these use HTML redirects.

## Recovery

Redeploy the previous known-good commit to restore policy content and routing.
Check the primary policy, stylesheet, singular aliases, manager and backoffice
links, and HTTPS before publishing legacy redirects. The API and business data
are independent of this Worker.
