import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export function initMotion(): void {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const preloader = document.querySelector<HTMLElement>('.preloader');
  const skip = document.querySelector<HTMLButtonElement>('[data-skip-intro]');
  if (preloader) {
    const seen = sessionStorage.getItem('portfolio-intro-seen');
    const close = () => {
      gsap.to(preloader, { clipPath: 'inset(0 0 100% 0)', duration: 0.48, ease: 'power3.inOut', onComplete: () => preloader.remove() });
      sessionStorage.setItem('portfolio-intro-seen', '1');
    };
    if (seen || reduce) { preloader.remove(); }
    else {
      skip?.addEventListener('click', close, { once: true });
      gsap.fromTo('.preloader > span', { yPercent: 110 }, { yPercent: 0, duration: 0.58, ease: 'power3.out', delay: 0.06 });
      gsap.delayedCall(0.82, close);
    }
  }
  if (reduce) return;

  const smooth = window.matchMedia('(min-width: 900px)').matches;
  let lenis: Lenis | undefined;
  let rafId = 0;
  if (smooth) {
    lenis = new Lenis({ duration: 1.05, smoothWheel: true, anchors: true });
    const raf = (time: number) => { lenis?.raf(time); rafId = requestAnimationFrame(raf); };
    rafId = requestAnimationFrame(raf);
    lenis.on('scroll', ScrollTrigger.update);
  }
  gsap.from('.name-line', { yPercent: 115, duration: 1.08, ease: 'power3.out', stagger: 0.11, delay: 0.72 });
  const monogramPaths = gsap.utils.toArray<SVGPathElement>('.hero-mark svg path');
  monogramPaths.forEach((path) => { const length = path.getTotalLength(); path.style.strokeDasharray = `${length} ${length}`; path.style.strokeDashoffset = `${length}`; });
  gsap.to(monogramPaths, { strokeDashoffset: 0, duration: 1.25, ease: 'power2.inOut', stagger: 0.09, delay: 0.94 });
  gsap.from('.hero-topline, .hero-role, .hero-cta, .hero-bottom', { y: 16, opacity: 0, duration: 0.72, ease: 'power3.out', stagger: 0.08, delay: 0.96 });
  gsap.utils.toArray<HTMLElement>('.section-heading, .intro-grid, .facts-strip, .experience-item, .pipeline-wrap, .asta-details, .project-points, .student-grid, .skill-row, .education-grid').forEach((element) => {
    gsap.from(element, { y: 28, opacity: 0, duration: 0.78, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 88%', once: true } });
  });
  const pipeline = document.querySelector<SVGPathElement>('.pipeline-progress');
  if (pipeline) {
    const length = pipeline.getTotalLength();
    gsap.set(pipeline, { strokeDasharray: length, strokeDashoffset: length });
    gsap.to(pipeline, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.pipeline-wrap', start: 'top 70%', end: 'bottom 45%', scrub: 0.5 } });
    gsap.from('.pipeline-nodes g', { opacity: 0.25, scale: 0.84, transformOrigin: 'center', stagger: 0.14, scrollTrigger: { trigger: '.pipeline-wrap', start: 'top 69%', once: true } });
  }
  gsap.to('.ooda-arrow', { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut', stagger: 0.12, scrollTrigger: { trigger: '.ooda-wheel', start: 'top 78%', once: true } });
  gsap.to('.contact h2', { x: 12, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'bottom bottom', scrub: 0.6 } });
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1080px)', () => {
    const pin = ScrollTrigger.create({ trigger: '.experience', start: 'top top+=100', end: 'bottom bottom', pin: '.experience .section-heading' });
    return () => pin.kill();
  });
  const cleanup = () => {
    lenis?.destroy(); cancelAnimationFrame(rafId); mm.revert(); ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  };
  window.addEventListener('pagehide', cleanup, { once: true });
}
