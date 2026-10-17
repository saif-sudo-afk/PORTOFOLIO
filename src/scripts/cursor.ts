export function initCursor(): void {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const dot = document.querySelector<HTMLElement>('.cursor-dot');
  const ring = document.querySelector<HTMLElement>('.cursor-ring');
  if (!dot || !ring) return;
  document.body.classList.add('has-custom-cursor');
  let x = 0; let y = 0;
  window.addEventListener('pointermove', (event) => {
    x = event.clientX; y = event.clientY;
    document.body.classList.add('cursor-ready');
    dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    ring.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }, { passive: true });
  document.querySelectorAll<HTMLElement>('a, button, [data-cursor]').forEach((element) => {
    element.addEventListener('pointerenter', () => document.body.classList.add('cursor-hover'));
    element.addEventListener('pointerleave', () => document.body.classList.remove('cursor-hover'));
  });
  document.querySelectorAll<HTMLElement>('.magnetic').forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const bounds = element.getBoundingClientRect();
      const dx = (event.clientX - bounds.left - bounds.width / 2) * 0.1;
      const dy = (event.clientY - bounds.top - bounds.height / 2) * 0.1;
      element.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    });
    element.addEventListener('pointerleave', () => { element.style.transform = ''; });
  });
}
