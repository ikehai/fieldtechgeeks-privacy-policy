# Landing page design

Purpose: help property managers, office staff, and technicians reach the right
application. The public brand is FieldTechGeeks.

The palette comes from the established mobile and manager theme: navy #162C43,
amber #F4A623, pale amber #FFF4DE, white #FFFFFF, background #F5F7FA, and secondary
text #667085. Tokens live in `public/landing/constants/theme.css`.

Use the existing Avenir Next/system sans-serif stack, with a 58px desktop headline,
25px portal headings, and 16px body text. Align the content to one left edge. The
layout is a compact brand header, a short introduction, two portal choices, a
smaller mobile section, and a quiet footer.

The design emphasizes the work destinations rather than a generic marketing
hero. It uses the existing app mark, functional building/office icons, and a navy
mobile section. No stock photos, invented metrics, animation, or external fonts.

## Content and behavior

The homepage is `public/landing/index.html`; the Worker serves it at `/`. Manager
and backoffice links keep their existing custom domains. All current singular,
legacy, and privacy-policy routes retain their behavior. Installed mobile apps
keep using the existing API host.

English is the default. A language button switches every visible label to Spanish
and remembers the preference when browser storage is available. Strings live in
`public/landing/constants/i18n.js`; page navigation works with JavaScript disabled.

The Android button links to the verified FieldTechGeeks Google Play listing. The
iPhone button requests access through the existing contact email because the app
does not yet have a public App Store listing. Replace that link when a public or
TestFlight invitation URL is supplied. No invitation is sent by loading the page.

Validate keyboard navigation, language switching, portal links, policy links, and
320px/390px/768px/desktop layouts. Check contrast, reduced motion, and overflow.
Deploy through the existing Deploy privacy policy workflow in `ikehai/fieldtech`.
