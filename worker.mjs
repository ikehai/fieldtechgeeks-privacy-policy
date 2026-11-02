const PRIMARY = 'fieldtechgeeks.com';
const MANAGER = 'manager.fieldtechgeeks.com';
const BACKOFFICE = 'backoffice.fieldtechgeeks.com';
const ALIASES = new Map([
  ['fieldtechgeek.com', PRIMARY],
  ['www.fieldtechgeek.com', PRIMARY],
  ['www.fieldtechgeeks.com', PRIMARY],
  ['manager.fieldtechgeek.com', MANAGER],
  ['backoffice.fieldtechgeek.com', BACKOFFICE],
]);

function redirect(url, hostname, pathname = url.pathname) {
  const target = new URL(url);
  target.protocol = 'https:';
  target.host = hostname;
  target.pathname = pathname;
  return Response.redirect(target.href, 308);
}

export default {
  fetch(request, env) {
    const url = new URL(request.url);
    const canonical = ALIASES.get(url.hostname);
    if (canonical) return redirect(url, canonical);
    if (url.hostname !== PRIMARY) return redirect(url, PRIMARY, '/privacy-policy');
    if (url.protocol !== 'https:') return redirect(url, PRIMARY);

    if (url.pathname === '/privacy-policy' || url.pathname === '/privacy-policy/') {
      const asset = new URL('/', url);
      return env.ASSETS.fetch(new Request(asset, request));
    }
    if (url.pathname === '/styles.css') return env.ASSETS.fetch(request);

    for (const [prefix, hostname] of [['/backoffice', BACKOFFICE], ['/manager', MANAGER]]) {
      if (url.pathname === prefix || url.pathname.startsWith(prefix + '/')) {
        return redirect(url, hostname, url.pathname.slice(prefix.length) || '/');
      }
    }
    return redirect(url, MANAGER);
  },
};
