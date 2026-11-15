(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pre = document.querySelector('.preloader');
  if (!window.gsap || !window.ScrollTrigger || reduce) { if (pre) pre.remove(); return; }
  gsap.registerPlugin(ScrollTrigger);
  const root = document.documentElement;
  root.classList.add('gsap');

  const q = (s, c = document) => [...c.querySelectorAll(s)];
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const desktop = matchMedia('(min-width: 761px)').matches;

  /* ---------- smooth scroll (Lenis) ---------- */
  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.25, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    window.__lenis = lenis;
    lenis.stop();
    q('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -10, duration: 1.6 });
    }));
  }

  /* ---------- text splitting ---------- */
  const split = (el, mode = 'chars') => {
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    const parts = [];
    (function walk(node) {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.nodeValue.split(/(\s+)/).forEach((tok) => {
            if (!tok) return;
            if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span');
            w.className = 'sw';
            w.setAttribute('aria-hidden', 'true');
            if (mode === 'words') { w.textContent = tok; parts.push(w); }
            else [...tok].forEach((ch) => { const c = document.createElement('span'); c.className = 'sc'; c.textContent = ch; w.appendChild(c); parts.push(c); });
            frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    })(el);
    return parts;
  };

  /* ---------- ambient layers: grain, cursor ---------- */
  const grain = document.createElement('div'); grain.className = 'grain'; grain.setAttribute('aria-hidden', 'true'); document.body.append(grain);
  const bar = document.createElement('div'); bar.className = 'scroll-progress'; bar.setAttribute('aria-hidden', 'true'); document.body.prepend(bar);
  gsap.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.2 } });

  if (fine) {
    const dot = document.createElement('div'); dot.className = 'cursor-dot';
    const ring = document.createElement('div'); ring.className = 'cursor-ring'; ring.innerHTML = '<span></span>';
    const glow = document.createElement('div'); glow.className = 'cursor-glow';
    [dot, ring, glow].forEach((e) => e.setAttribute('aria-hidden', 'true'));
    document.body.append(glow, ring, dot);
    gsap.set([dot, ring, glow], { xPercent: -50, yPercent: -50, opacity: 0 });
    const dx = gsap.quickTo(dot, 'x', { duration: 0.08 }), dy = gsap.quickTo(dot, 'y', { duration: 0.08 });
    const rx = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3.out' }), ry = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3.out' });
    const gx = gsap.quickTo(glow, 'x', { duration: 1.2, ease: 'power3.out' }), gy = gsap.quickTo(glow, 'y', { duration: 1.2, ease: 'power3.out' });
    let shown = false;
    const show = (e) => {
      // the native cursor is only hidden while the custom one is visible
      document.body.classList.add('has-cursor');
      gsap.killTweensOf([dot, ring, glow], 'opacity');
      gsap.set([dot, ring], { x: e.clientX, y: e.clientY });
      gsap.to([dot, ring], { opacity: 1, duration: 0.25 });
      gsap.to(glow, { opacity: 1, duration: 0.8 });
      shown = true;
    };
    const hide = () => {
      shown = false;
      document.body.classList.remove('has-cursor');
      gsap.to([dot, ring, glow], { opacity: 0, duration: 0.25 });
    };
    addEventListener('pointermove', (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      if (!shown) show(e);
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); gx(e.clientX); gy(e.clientY);
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', hide);
    addEventListener('blur', hide);
    document.addEventListener('visibilitychange', () => { if (document.hidden) hide(); });
    const label = ring.firstElementChild;
    const hover = (sel, text) => q(sel).forEach((el) => {
      el.addEventListener('pointerenter', () => { ring.classList.add('is-hover'); if (text) { label.textContent = text; ring.classList.add('has-label'); } });
      el.addEventListener('pointerleave', () => { ring.classList.remove('is-hover', 'has-label'); label.textContent = ''; });
    });
    hover('a, button', '');
    hover('.project', 'OPEN');
    hover('.hero-portrait', '');
  }

  /* ---------- preloader ---------- */
  const heroH1 = document.querySelector('.hero h1');
  const heroChars = split(heroH1);
  gsap.set(heroChars, { yPercent: 125, rotate: 8 });
  gsap.set(['.hero .availability', '.hero .eyebrow', '.hero .intro', '.hero-actions > *', '.quick-facts > div', '.hero-portrait', '.nav'], { opacity: 0 });

  const master = gsap.timeline();
  if (pre) {
    const count = pre.querySelector('.pl-count');
    const plChars = split(pre.querySelector('.pl-name'));
    gsap.set(plChars, { yPercent: 120 });
    const n = { v: 0 };
    master
      .to(plChars, { yPercent: 0, stagger: 0.04, duration: 0.9, ease: 'expo.out' }, 0)
      .to(n, { v: 100, duration: 1.7, ease: 'power2.inOut', onUpdate: () => { count.textContent = String(Math.round(n.v)).padStart(3, '0'); } }, 0)
      .to(pre.querySelector('.pl-bar i'), { scaleX: 1, duration: 1.7, ease: 'power2.inOut' }, 0)
      .to([count, plChars], { opacity: 0, yPercent: -40, duration: 0.5, ease: 'power2.in', stagger: 0 }, 1.9)
      .to(pre, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, 2.2)
      .add(() => { pre.remove(); lenis && lenis.start(); }, 3.3);
  } else { lenis && lenis.start(); }

  /* ---------- hero intro ---------- */
  const heroAt = pre ? 2.6 : 0.1;
  master
    .to('.nav', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, heroAt)
    .to('.hero .availability', { opacity: 1, duration: 0.8 }, heroAt)
    .to('.hero .eyebrow', { opacity: 1, duration: 0.8 }, heroAt + 0.1)
    .to(heroChars, { yPercent: 0, rotate: 0, stagger: 0.045, duration: 1.4, ease: 'expo.out' }, heroAt + 0.15)
    .to('.hero .intro', { opacity: 1, duration: 1 }, heroAt + 0.7)
    .fromTo('.hero-actions > *', { y: 26 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out' }, heroAt + 0.9)
    .fromTo('.quick-facts > div', { y: 26 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out' }, heroAt + 1)
    .fromTo('.hero-portrait', { scale: 0.9, y: 60, clipPath: 'inset(100% 0 0 0 round 24px)' }, { opacity: 1, scale: 1, y: 0, clipPath: 'inset(0% 0 0 0 round 24px)', duration: 1.6, ease: 'expo.out', clearProps: 'clipPath' }, heroAt + 0.2)
    .from('.floating-card', { opacity: 0, y: 40, duration: 1, ease: 'power3.out' }, heroAt + 1.2);

  q('.quick-facts b').forEach((b) => {
    const node = b.firstChild;
    const m = node && node.nodeType === 3 && node.nodeValue.match(/^(\D*)(\d+)(\D*)$/);
    if (!m) return;
    const s = { v: 0 };
    node.nodeValue = m[1] + '0' + m[3];
    master.to(s, { v: +m[2], duration: 1.8, ease: 'power2.out', onUpdate: () => { node.nodeValue = m[1] + Math.round(s.v) + m[3]; } }, heroAt + 1);
  });
  gsap.to('.floating-card', { y: -10, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });

  /* ---------- section headings: char reveal ---------- */
  q('.section-heading h2, .contact h2').forEach((h) => {
    const chars = split(h);
    gsap.set(chars, { yPercent: 125, rotate: 6 });
    ScrollTrigger.create({ trigger: h, start: 'top 88%', once: true, onEnter: () => gsap.to(chars, { yPercent: 0, rotate: 0, stagger: 0.03, duration: 1.2, ease: 'expo.out' }) });
  });

  /* ---------- about copy: scroll-scrubbed word fill ---------- */
  q('.about-content p').forEach((p) => {
    const words = split(p, 'words');
    gsap.set(words, { opacity: 0.16 });
    gsap.to(words, { opacity: 1, stagger: 0.5, ease: 'none', scrollTrigger: { trigger: p, start: 'top 82%', end: 'bottom 48%', scrub: 0.6 } });
  });

  /* ---------- generic reveals ---------- */
  const skip = '.hero, .section-heading, .about-content';
  const reveals = q('.reveal').filter((el) => !el.closest(skip) && !el.matches(skip));
  gsap.set(reveals, { opacity: 0, y: 60 });
  ScrollTrigger.batch(reveals, {
    start: 'top 90%', once: true,
    onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.12, overwrite: true, clearProps: 'all' }),
  });
  q('.section-heading .eyebrow, .section-lede').forEach((el) => {
    gsap.from(el, { opacity: 0, y: 24, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });

  /* ---------- capability band, skills, timeline ---------- */
  gsap.from('.capability-grid > div', { y: 40, opacity: 0, stagger: 0.12, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.capability-band', start: 'top 88%', once: true } });
  q('.skill-card').forEach((card) => {
    gsap.from(q('li', card), { x: -16, opacity: 0, stagger: 0.07, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 85%', once: true } });
  });
  q('.timeline article').forEach((row) => {
    gsap.from(q('p:first-child, h3, span, .role-note, b', row), { x: -30, opacity: 0, stagger: 0.07, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: row, start: 'top 90%', once: true } });
  });

  /* ---------- projects: inner parallax, node pop, spotlight ---------- */
  q('.project').forEach((card) => {
    const art = card.querySelector('.project-art');
    if (art) {
      const bits = q('.core, .node, em', art);
      if (bits.length) gsap.from(bits, { scale: 0.5, opacity: 0, stagger: 0.07, duration: 1, ease: 'back.out(1.7)', scrollTrigger: { trigger: card, start: 'top 80%', once: true } });
    }
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
    });
  });

  /* ---------- marquees: drift + scroll-velocity boost ---------- */
  q('.marquee').forEach((m) => {
    const track = m.firstElementChild;
    const dir = m.classList.contains('reverse') ? 1 : -1;
    const loop = gsap.fromTo(track, { xPercent: dir === -1 ? 0 : -50 }, { xPercent: dir === -1 ? -50 : 0, duration: 38, ease: 'none', repeat: -1 });
    ScrollTrigger.create({
      trigger: m, start: 'top bottom', end: 'bottom top',
      onUpdate: (self) => {
        const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 350, 7);
        gsap.to(loop, { timeScale: boost, duration: 0.25, overwrite: true });
        gsap.to(loop, { timeScale: 1, duration: 1.2, delay: 0.25, overwrite: false });
      },
    });
  });

  /* ---------- nav: hide on scroll down, show on scroll up ---------- */
  const navShell = document.querySelector('.nav-shell');
  let lastY = 0;
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (self) => {
      const y = self.scroll();
      const down = y > lastY && y > 240;
      if (!navShell.classList.contains('nav-open')) gsap.to(navShell, { yPercent: down ? -130 : 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
      lastY = y;
    },
  });

  /* ---------- desktop-only: parallax, hero mouse tilt, magnetic ---------- */
  if (desktop) {
    gsap.to('.hero-watermark', { yPercent: 40, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-copy', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-portrait', { yPercent: -10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    q('.ambient i').forEach((blob, i) => gsap.to(blob, { y: (i % 2 ? -1 : 1) * 260, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 1.2 } }));

    if (fine) {
      const portrait = document.querySelector('.hero-portrait .portrait');
      const rotX = gsap.quickTo(portrait, 'rotationX', { duration: 0.8, ease: 'power3.out' });
      const rotY = gsap.quickTo(portrait, 'rotationY', { duration: 0.8, ease: 'power3.out' });
      const wmX = gsap.quickTo('.hero-watermark', 'x', { duration: 1.4, ease: 'power3.out' });
      gsap.set(portrait, { transformPerspective: 900 });
      document.querySelector('.hero').addEventListener('pointermove', (e) => {
        const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
        rotY(nx * 14); rotX(-ny * 12); wmX(-nx * 60);
      });
      document.querySelector('.hero').addEventListener('pointerleave', () => { rotX(0); rotY(0); wmX(0); });

      q('.button, .nav-cta, .arrow-link, .contact-panel > a').forEach((el) => {
        const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
        el.addEventListener('pointermove', (e) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - r.left - r.width / 2) * 0.3);
          yTo((e.clientY - r.top - r.height / 2) * 0.4);
        });
        el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
      });
    }
  }

  addEventListener('load', () => ScrollTrigger.refresh());
})();
