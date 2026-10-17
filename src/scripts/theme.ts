export function initTheme(): void {
  const root = document.documentElement;
  const button = document.querySelector<HTMLButtonElement>('.theme-toggle');
  const stored = localStorage.getItem('portfolio-theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const apply = (dark: boolean) => {
    root.dataset.theme = dark ? 'dark' : 'light';
    button?.setAttribute('aria-pressed', String(dark));
    button?.setAttribute('aria-label', dark ? (root.lang === 'fr' ? 'Activer le thème clair' : 'Switch to light theme') : (root.lang === 'fr' ? 'Activer le thème sombre' : 'Switch to dark theme'));
    document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', dark ? '#191312' : '#f6efe9');
  };
  apply(stored ? stored === 'dark' : systemDark);
  button?.addEventListener('click', () => {
    const dark = root.dataset.theme !== 'dark';
    localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light');
    apply(dark);
  });
}
