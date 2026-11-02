import { translations } from './constants/i18n.js';

const toggle = document.querySelector('#language-toggle');
let language = 'en';
try { language = localStorage.getItem('fieldtechgeeks-language') ?? language; } catch { /* Storage is optional. */ }
if (language !== 'en' && language !== 'es') language = 'en';

function render(next) {
  language = next;
  const copy = translations[next];
  document.documentElement.lang = next;
  document.title = copy.title;
  document.querySelector('meta[name="description"]').content = copy.description;
  for (const element of document.querySelectorAll('[data-i18n]')) element.textContent = copy[element.dataset.i18n];
  for (const element of document.querySelectorAll('[data-i18n-label]')) element.setAttribute('aria-label', copy[element.dataset.i18nLabel]);
  toggle.textContent = copy.switchLanguage;
  toggle.lang = next === 'en' ? 'es' : 'en';
  toggle.setAttribute('aria-label', copy.switchLabel);
  toggle.hidden = false;
}

toggle.addEventListener('click', () => {
  render(language === 'en' ? 'es' : 'en');
  try { localStorage.setItem('fieldtechgeeks-language', language); } catch { /* Navigation works without storage. */ }
});
render(language);
