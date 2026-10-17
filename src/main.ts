import './styles/index.css';
import fr from './content/fr.json';
import en from './content/en.json';
import { initMotion } from './scripts/motion';
import { initTheme } from './scripts/theme';
import { initCursor } from './scripts/cursor';

type Locale = typeof fr;
type PathValue = string | string[] | object;
const translations: Record<'fr' | 'en', Locale> = { fr, en };
const params = new URLSearchParams(location.search);
const storedLanguage = localStorage.getItem('portfolio-language');
const language = (params.get('lang') === 'en' || params.get('lang') === 'fr' ? params.get('lang') : storedLanguage === 'en' ? 'en' : 'fr') as 'fr' | 'en';
const copy = translations[language];
const baseUrl = import.meta.env.BASE_URL;

function get(path: string): PathValue {
  return path.split('.').reduce<PathValue>((value, key) => (value as Record<string, PathValue>)?.[key], copy);
}
function escapeHtml(value: unknown): string {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);
}
function trustedInline(value: unknown): string {
  return String(value)
    .replace(/<br\s*\/?\s*>/gi, '<br>')
    .replace(/<span\s+aria-hidden="true"\s*>/gi, '<span aria-hidden="true">')
    .replace(/<\/span\s*>/gi, '</span>')
    .replace(/<(?!br\s*\/?>|span aria-hidden="true"\s*>|\/span\s*>)[^>]*>/gi, '');
}
function setText(selector: string, value: unknown, inline = false): void {
  document.querySelectorAll<HTMLElement>(selector).forEach((node) => {
    if (inline) node.innerHTML = trustedInline(value);
    else node.textContent = String(value);
  });
}

function renderExperience(): void {
  const list = get('experience') as Array<{ date: string; place: string; company: string; role: string; department: string; certificate: string; points: string[] }>;
  const labels = language === 'fr' ? ['EXPÉRIENCE', 'MISSION', 'ATTESTATION'] : ['EXPERIENCE', 'ROLE', 'CERTIFICATE'];
  const target = document.querySelector('[data-render="experience"]');
  if (!target) return;
  target.innerHTML = list.map((item, index) => `<article class="experience-item"><div class="experience-marker"><span>0${index + 1}</span><i></i></div><div class="experience-date"><span>${escapeHtml(item.date)}</span>${item.place ? `<small>${escapeHtml(item.place)}</small>` : ''}</div><div class="experience-main"><p class="mono-label">${labels[0]}</p><h3>${escapeHtml(item.company)}</h3><p class="role-line">${escapeHtml(item.role)}${item.department ? ` <span>· ${escapeHtml(item.department)}</span>` : ''}</p><ul>${item.points.map((point) => `<li>${escapeHtml(point)}</li>`).join('')}</ul></div><div class="experience-cert"><span class="mono-label">${labels[2]}</span><span>${escapeHtml(item.certificate)}</span></div></article>`).join('');
}

function renderSkills(): void {
  const groups = (get('skills.groups') as Array<{ name: string; items: string }>);
  const target = document.querySelector('[data-render="skills"]');
  if (target) target.innerHTML = groups.map((group, index) => `<article class="skill-row"><span class="skill-index-no">0${index + 1}</span><h3>${escapeHtml(group.name)}</h3><p>${escapeHtml(group.items)}</p><span class="skill-arrow" aria-hidden="true">↗</span></article>`).join('');
  const tools = get('skills.tools') as string[];
  const marquee = document.querySelector('[data-render="marquee"]');
  if (marquee) {
    const run = [...tools, ...tools];
    marquee.innerHTML = run.map((tool, index) => `<span>${escapeHtml(tool)}<i aria-hidden="true">${index % 3 === 1 ? '—' : '·'}</i></span>`).join('');
    marquee.setAttribute('aria-hidden', 'true');
  }
}

function renderEducation(): void {
  const data = get('education.entries') as Array<{ date: string; title: string; school: string; detail?: string }>;
  const target = document.querySelector('[data-render="education"]');
  if (target) target.innerHTML = data.map((entry) => `<article class="education-item"><span class="mono-label">${escapeHtml(entry.date)}</span><h4>${escapeHtml(entry.title)}</h4><p>${escapeHtml(entry.school)}</p>${entry.detail ? `<small>${escapeHtml(entry.detail)}</small>` : ''}</article>`).join('');
  const languages = get('education.languagesList') as Array<{ name: string; level: string }>;
  const languageList = document.querySelector('[data-render="languages"]');
  if (languageList) languageList.innerHTML = languages.map((item) => `<div><span>${escapeHtml(item.name)}</span><small>${escapeHtml(item.level)}</small></div>`).join('');
}

function render(): void {
  document.documentElement.lang = language;
  document.title = copy.meta.title;
  const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
  const ogDescription = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
  const twitterTitle = document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]');
  if (description) description.content = copy.meta.description;
  if (ogTitle) ogTitle.content = copy.meta.title;
  if (ogDescription) ogDescription.content = copy.meta.description;
  if (twitterTitle) twitterTitle.content = copy.meta.title;
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((node) => {
    const value = get(node.dataset.i18n ?? '');
    if (typeof value === 'string') node.innerHTML = trustedInline(value);
  });
  document.querySelectorAll<HTMLElement>('[data-content]').forEach((node) => {
    const value = get(node.dataset.content ?? '');
    if (typeof value === 'string') node.innerHTML = trustedInline(value);
  });
  setText('[data-node="recon"]', (get('asta.phases') as string[])[0]);
  setText('[data-node="scan"]', (get('asta.phases') as string[])[1]);
  setText('[data-node="analysis"]', (get('asta.phases') as string[])[2]);
  setText('[data-node="exploit"]', (get('asta.phases') as string[])[3]);
  setText('[data-node="post"]', (get('asta.phases') as string[])[4]);
  setText('[data-ooda="observe"]', (get('asta.ooda') as string[])[0]);
  setText('[data-ooda="orient"]', (get('asta.ooda') as string[])[1]);
  setText('[data-ooda="decide"]', (get('asta.ooda') as string[])[2]);
  setText('[data-ooda="act"]', (get('asta.ooda') as string[])[3]);
  const phases = document.querySelector('[data-render="phases"]');
  if (phases) phases.innerHTML = (get('asta.phases') as string[]).map((phase, index) => `<div><span>0${index + 1}</span>${escapeHtml(phase)}</div>`).join('');
  for (const [key, selector] of [['asta-points', 'asta.points'], ['student-points', 'student.points']] as const) {
    const target = document.querySelector(`[data-render="${key}"]`);
    const points = get(selector) as string[];
    if (target) target.innerHTML = points.map((point) => `<li>${escapeHtml(point)}</li>`).join('');
  }
  renderExperience(); renderSkills(); renderEducation();
  document.querySelectorAll<HTMLAnchorElement>('[data-cv-download]').forEach((link) => { link.href = `${baseUrl}assets/Saif_Eddine_Bahiri_CV_${language.toUpperCase()}.pdf`; });
  document.querySelector<HTMLAnchorElement>('[data-i18n="contact.viewCv"]')?.setAttribute('href', `${baseUrl}cv.html`);
  const toggle = document.querySelector<HTMLAnchorElement>('.language-toggle');
  if (toggle) {
    toggle.textContent = language === 'fr' ? 'EN' : 'FR';
    toggle.href = `?lang=${language === 'fr' ? 'en' : 'fr'}`;
    toggle.setAttribute('aria-label', language === 'fr' ? 'Switch to English' : 'Passer en français');
  }
  const email = get('contact.email') as string;
  const phone = get('contact.phone') as string;
  const emailLink = document.querySelector<HTMLAnchorElement>('[data-contact-email]');
  if (emailLink) { emailLink.href = `mailto:${email}`; emailLink.firstChild!.textContent = `${email} `; }
  const phoneLink = document.querySelector<HTMLAnchorElement>('[data-contact-phone]');
  if (phoneLink) { phoneLink.href = `tel:${phone.replaceAll(' ', '')}`; phoneLink.textContent = phone; }
  const mark = document.querySelector<HTMLElement>('[data-year]');
  if (mark) mark.textContent = String(new Date().getFullYear());
}

render();
localStorage.setItem('portfolio-language', language);
initTheme();
initMotion();
initCursor();

const menuToggle = document.querySelector<HTMLButtonElement>('.menu-toggle');
const mobileMenu = document.querySelector<HTMLElement>('#mobile-menu');
menuToggle?.addEventListener('click', () => {
  if (!mobileMenu) return;
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? (language === 'fr' ? 'Fermer le menu' : 'Close menu') : (language === 'fr' ? 'Ouvrir le menu' : 'Open menu'));
  mobileMenu.hidden = !open;
});
mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  mobileMenu.hidden = true;
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

const copyButton = document.querySelector<HTMLButtonElement>('[data-copy-email]');
copyButton?.addEventListener('click', async () => {
  const status = document.querySelector<HTMLElement>('.copy-status');
  const email = get('contact.email') as string;
  try {
    await navigator.clipboard.writeText(email);
    if (status) status.textContent = get('contact.copySuccess') as string;
  } catch {
    if (status) status.textContent = get('contact.copyError') as string;
  }
});

const sections = [...document.querySelectorAll<HTMLElement>('main section[id]')];
const navLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-nav]')];
new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle('is-active', link.dataset.nav === entry.target.id));
  });
}, { rootMargin: '-38% 0px -55% 0px' }).observe(sections[0]);
sections.slice(1).forEach((section) => new IntersectionObserver((entries) => {
  entries.forEach((entry) => { if (entry.isIntersecting) navLinks.forEach((link) => link.classList.toggle('is-active', link.dataset.nav === entry.target.id)); });
}, { rootMargin: '-38% 0px -55% 0px' }).observe(section));

const progress = document.querySelector<HTMLElement>('.scroll-progress');
const updateProgress = () => {
  const height = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.transform = `scaleX(${height > 0 ? window.scrollY / height : 0})`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();
