function closeIntro(preloader: HTMLElement): void {
  preloader.classList.add('is-leaving');
  sessionStorage.setItem('portfolio-intro-seen', '1');
  window.setTimeout(() => preloader.remove(), 500);
}

function animateHero(): void {
  document.querySelectorAll<HTMLElement>('.name-line').forEach((line, index) => {
    line.animate([{ transform: 'translateY(112%)' }, { transform: 'translateY(0)' }], {
      duration: 950, delay: 180 + index * 110, easing: 'cubic-bezier(.22,.75,.25,1)', fill: 'both',
    });
  });
  document.querySelectorAll<HTMLElement>('.hero-topline, .hero-role, .hero-cta, .hero-bottom').forEach((element, index) => {
    element.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }], {
      duration: 650, delay: 360 + index * 75, easing: 'cubic-bezier(.22,.75,.25,1)', fill: 'both',
    });
  });
  document.querySelectorAll<SVGPathElement>('.hero-mark svg path').forEach((path, index) => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length} ${length}`;
    path.style.strokeDashoffset = `${length}`;
    path.animate([{ strokeDashoffset: length }, { strokeDashoffset: 0 }], {
      duration: 1200, delay: 500 + index * 90, easing: 'ease-in-out', fill: 'forwards',
    });
  });
}

function animateOnScroll(): void {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = [...document.querySelectorAll<HTMLElement>('.section-heading, .intro-grid, .facts-strip, .experience-item, .asta-intro, .pipeline-wrap, .asta-details, .ooda-wheel, .student-grid, .skill-row, .education-grid')];
  if (reduce || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const index = targets.indexOf(entry.target as HTMLElement);
      (entry.target as HTMLElement).animate([{ opacity: 0, transform: 'translateY(22px)' }, { opacity: 1, transform: 'translateY(0)' }], {
        duration: 620, delay: Math.min(index % 5, 4) * 45, easing: 'cubic-bezier(.22,.75,.25,1)',
      });
      if ((entry.target as HTMLElement).matches('.ooda-wheel')) {
        document.querySelectorAll<SVGPathElement>('.ooda-arrow').forEach((path, order) => {
          const length = path.getTotalLength();
          path.style.strokeDasharray = `${length} ${length}`;
          path.style.strokeDashoffset = `${length}`;
          path.animate([{ strokeDashoffset: length }, { strokeDashoffset: 0 }], { duration: 1400, delay: order * 110, easing: 'ease-in-out', fill: 'forwards' });
        });
      }
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.04 });
  targets.forEach((target) => observer.observe(target));
}

async function initDesktopMotion(): Promise<void> {
  const [{ default: gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
    import('gsap'), import('gsap/ScrollTrigger'), import('lenis'),
  ]);
  gsap.registerPlugin(ScrollTrigger);
  const lenis = new Lenis({ duration: 1.05, smoothWheel: true, anchors: true });
  let rafId = 0;
  const raf = (time: number) => { lenis.raf(time); rafId = requestAnimationFrame(raf); };
  rafId = requestAnimationFrame(raf);
  lenis.on('scroll', ScrollTrigger.update);

  gsap.utils.toArray<HTMLElement>('.section-heading, .intro-grid, .facts-strip, .experience-item, .pipeline-wrap, .asta-details, .project-points, .student-grid, .skill-row, .education-grid').forEach((element) => {
    gsap.from(element, { y: 28, opacity: 0, duration: .78, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 88%', once: true } });
  });
  const pipeline = document.querySelector<SVGPathElement>('.pipeline-progress');
  if (pipeline) {
    const length = pipeline.getTotalLength();
    gsap.set(pipeline, { strokeDasharray: length, strokeDashoffset: length });
    gsap.to(pipeline, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.pipeline-wrap', start: 'top 70%', end: 'bottom 45%', scrub: .5 } });
    gsap.from('.pipeline-nodes g', { opacity: .25, scale: .84, transformOrigin: 'center', stagger: .14, scrollTrigger: { trigger: '.pipeline-wrap', start: 'top 69%', once: true } });
  }
  gsap.to('.ooda-arrow', { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut', stagger: .12, scrollTrigger: { trigger: '.ooda-wheel', start: 'top 78%', once: true } });
  gsap.to('.contact h2', { x: 12, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'bottom bottom', scrub: .6 } });

  const media = gsap.matchMedia();
  media.add('(min-width: 1080px)', () => {
    const pin = ScrollTrigger.create({ trigger: '.experience', start: 'top top+=100', end: 'bottom bottom', pin: '.experience .section-heading' });
    return () => pin.kill();
  });
  window.addEventListener('pagehide', () => {
    media.revert(); lenis.destroy(); cancelAnimationFrame(rafId); ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }, { once: true });
}

export function initMotion(): void {
  const preloader = document.querySelector<HTMLElement>('.preloader');
  const skip = document.querySelector<HTMLButtonElement>('[data-skip-intro]');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (preloader) {
    const seen = sessionStorage.getItem('portfolio-intro-seen');
    if (seen || reduce) preloader.remove();
    else {
      const finish = () => closeIntro(preloader);
      skip?.addEventListener('click', finish, { once: true });
      window.setTimeout(finish, 850);
    }
  }
  if (reduce) return;
  animateHero();
  if (window.matchMedia('(min-width: 900px)').matches) void initDesktopMotion();
  else animateOnScroll();
}
