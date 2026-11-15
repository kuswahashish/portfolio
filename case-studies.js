(() => {
  const DATA = {
    '01': {
      stats: [['55/94','commits on WhatsApp service'],['3','channels: WhatsApp, SMS, email'],['9','event-driven services']],
      title: 'Maxis CPaaS — WhatsApp, SMS & Email',
      role: 'Core contributor · top committer on the WhatsApp service · Ecosmob',
      summary: 'The messaging layer of Ecosmob’s multi-tenant cloud PBX and contact-center suite, so tenants can reach their customers over WhatsApp, SMS, and email from one unified inbox.',
      built: [
        'WhatsApp service: Meta Cloud API onboarding, phone numbers, templates (create, edit, search), messages, and webhooks.',
        'Twilio SMS with inbound webhook handling that survives concurrent duplicate deliveries, plus permanent-vs-retryable error classification.',
        'BullMQ and Redis campaign sending, and a shared cross-channel campaigns table.',
        'Event-driven microservices: the outbox relay with its shared core kit, the campaign engine API and scheduler, and the delivery-status event handler.',
        'A standalone Gupshup demo covering partner config, tenant onboarding, templates, and webhook logs (sole author).',
      ],
      how: [
        'Store first, answer second: webhooks are persisted before the 2xx response.',
        'Jobs travel on RabbitMQ, facts on Kafka, linked by a transactional outbox.',
        'Idempotency keys end to end, database-per-tenant, and provider code isolated at the edge so new providers plug in.',
      ],
      chips: ['Node.js', 'TypeScript', 'RabbitMQ', 'Kafka', 'MongoDB', 'MariaDB', 'Redis', 'BullMQ', 'Meta Cloud API', 'Gupshup', 'Twilio'],
    },
    '02': {
      stats: [['24','API modules'],['~90%','line coverage'],['~410','of 566 API commits']],
      title: 'Skywire — Hotline Admin Platform',
      role: 'Primary backend contributor · ~410 of 566 API commits · Ecosmob',
      summary: 'A multi-tenant admin platform for hotline and call services, with a React admin UI and a cron service for scheduled work and call analytics.',
      built: [
        'A 24-module HMVC API: tenants, users, roles and permissions, hotline/IVR menus, conference rooms, podcasts with aggregated feeds, preset-caller options, DID phone inventory, voicemail, and audit logs.',
        'Google and Microsoft SSO with HttpOnly cookie sessions and tenant-scoped RBAC, including per-tenant seeded roles.',
        'CDR reporting with asynchronous CSV export delivered by email.',
      ],
      how: [
        'FreeSWITCH events flow over RabbitMQ into MongoDB call records, with live per-tenant concurrency in Redis and minute-to-month rollups in PostgreSQL.',
        'Cron jobs are gated by a primary-server flag for active/passive HA, with a Postgres advisory lock on podcast publishing.',
        'About 90% line coverage with enforced thresholds, and a Jenkins pipeline with SonarQube gates and Trivy image scanning.',
      ],
      chips: ['Node.js', 'TypeScript', 'Express', 'PostgreSQL', 'MongoDB', 'Redis', 'RabbitMQ', 'React', 'Vitest', 'Jenkins'],
    },
    '03': {
      stats: [['5','services behind a gateway'],['7','modules delivered'],['2','client apps: web, mobile']],
      title: 'Anantha — Learning Management System',
      role: 'Backend engineer · Tridhya Tech',
      summary: 'A five-service learning platform behind an API gateway, used by web and mobile clients.',
      built: [
        'Modules for users, roles and permissions, attendance, courses, ticketing, notifications, and offline exams.',
        'Microservice APIs consumed by Next.js and Flutter clients.',
      ],
      how: ['Five independent services fronted by an API gateway, with shared auth and permission checks.'],
      chips: ['Node.js', 'Microservices', 'API Gateway', 'Next.js', 'Flutter'],
    },
    '04': {
      stats: [['3','user experiences'],['2','integrations: AAA, Razorpay'],['Led','backend delivery']],
      title: 'Xifi — Janwani',
      role: 'Backend lead · Tridhya Tech',
      summary: 'A connected-services platform with consumer, distributor, and owner experiences.',
      built: [
        'Led backend delivery across all three user experiences.',
        'Integrated an AAA controller and Razorpay payment flows for subscriptions and transactions.',
      ],
      how: ['Payment and network-access flows tied together so a successful payment provisions the subscription.'],
      chips: ['Node.js', 'Razorpay', 'React', 'Flutter'],
    },
    '05': {
      stats: [['3','core areas: DIDs, SIP, billing'],['JWT','auth with RBAC'],['React','team API contracts']],
      title: 'Fuse2 — VoIP Services Platform',
      role: 'Backend engineer · Tridhya Tech',
      summary: 'Backend operations for a VoIP product.',
      built: ['Services for DID management, SIP trunks, subscriptions, and customer operations.', 'Secure REST APIs with JWT and role-based access control.'],
      how: ['API contracts agreed with the React team for end-to-end features.'],
      chips: ['Node.js', 'React', 'VoIP', 'JWT'],
    },
    '06': {
      stats: [['100s','devices managed'],['Kafka','event-driven pipeline'],['CDR','call record management']],
      title: '8 Ventures — PBX & CDR Management',
      role: 'Backend engineer · Tridhya Tech',
      summary: 'PBX and call-detail-record management for hundreds of devices.',
      built: ['PBX and CDR management services handling hundreds of devices.'],
      how: ['Event-driven processing on Kafka infrastructure.'],
      chips: ['Node.js', 'Kafka', 'PBX'],
    },
  };

  const ORDER = Object.keys(DATA);
  const modal = document.getElementById('case');
  if (!modal) return;
  const panel = modal.querySelector('.case-panel');
  const scroller = modal.querySelector('.case-scroll');
  const $ = (id) => document.getElementById(id);
  const cards = [...document.querySelectorAll('.project')];
  const cardFor = (n) => cards.find((c) => c.querySelector('.number')?.textContent.trim() === n);
  const animated = () => window.gsap && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = null, opener = null;

  const splitChars = (el) => {
    const text = el.textContent;
    el.setAttribute('aria-label', text);
    el.replaceChildren();
    return text.split(/(\s+)/).flatMap((tok) => {
      if (/^\s*$/.test(tok)) { el.append(' '); return []; }
      const w = Object.assign(document.createElement('span'), { className: 'sw' });
      w.setAttribute('aria-hidden', 'true');
      const cs = [...tok].map((ch) => Object.assign(document.createElement('span'), { className: 'sc', textContent: ch }));
      w.append(...cs); el.append(w);
      return cs;
    });
  };

  let artTl = null;
  const playArt = (art) => {
    artTl && artTl.kill();
    const clone = art.firstElementChild;
    if (!clone || !animated()) return;
    const core = clone.querySelector('.core'), nodes = [...clone.querySelectorAll('.node')], lines = [...clone.querySelectorAll('.line')], tags = [...clone.querySelectorAll('em')];
    artTl = gsap.timeline();
    if (core) artTl.from(core, { scale: 0.3, opacity: 0, duration: 0.9, ease: 'back.out(1.8)' }, 0.1);
    if (lines.length) artTl.from(lines, { scaleX: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' }, 0.25);
    if (nodes.length) artTl.from(nodes, { scale: 0, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'back.out(2)' }, 0.5);
    if (tags.length) artTl.from(tags, { opacity: 0, y: 10, duration: 0.6, stagger: 0.08 }, 0.7);
    // ambient loops
    if (core) artTl.to(core, { scale: 1.07, duration: 1.8, ease: 'sine.inOut', yoyo: true, repeat: -1 }, 1.2);
    nodes.forEach((nd, k) => artTl.to(nd, { x: (k % 2 ? -1 : 1) * 9, y: (k < 2 ? -1 : 1) * 8, duration: 2.2 + k * 0.35, ease: 'sine.inOut', yoyo: true, repeat: -1 }, 1.2));
    lines.forEach((ln, k) => artTl.to(ln, { opacity: 0.35, duration: 1.4 + k * 0.2, ease: 'sine.inOut', yoyo: true, repeat: -1 }, 1.2));
  };

  const fill = (n, dir = 0) => {
    const d = DATA[n];
    current = n;
    $('case-num').textContent = n;
    $('case-eyebrow').textContent = 'CASE STUDY / ' + n;
    const title = $('case-title'); title.textContent = d.title;
    $('case-role').textContent = d.role;
    $('case-summary').textContent = d.summary;
    $('case-count').textContent = ORDER.indexOf(n) + 1 + ' / ' + ORDER.length;
    const mk = (tag, text, cls) => Object.assign(document.createElement(tag), { textContent: text, className: cls || '' });
    $('case-built').replaceChildren(...d.built.map((t) => mk('li', t)));
    $('case-how').replaceChildren(...d.how.map((t) => mk('li', t)));
    $('case-chips').replaceChildren(...d.chips.map((t) => mk('span', t)));
    $('case-stats').replaceChildren(...d.stats.map(([v, l]) => {
      const box = document.createElement('div');
      box.append(mk('b', v), mk('small', l));
      return box;
    }));
    const art = $('case-art');
    const src = cardFor(n)?.querySelector('.project-art');
    art.replaceChildren();
    if (src) {
      const c = src.cloneNode(true);
      // drop inline styles left behind by page animations so the clone starts clean
      [c, ...c.querySelectorAll('*')].forEach((e) => e.removeAttribute('style'));
      art.className = 'case-art'; art.append(c);
    } else {
      art.className = 'case-art case-art-plain';
      art.append(Object.assign(document.createElement('div'), { className: 'case-orbit', innerHTML: '<i></i><i></i><i></i><b></b>' }));
    }
    scroller.scrollTop = 0;
    art.firstElementChild && (art.firstElementChild.style.transform = '');
    if (!animated()) return;
    const chars = splitChars(title);
    const num = $('case-num');
    const items = [...scroller.querySelectorAll('.case-summary, .case-stats > div, .case-cols h4, .case-cols li, .chips span, .case-nav')];
    gsap.killTweensOf([chars, num, items, art]);
    gsap.fromTo(art, { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' });
    playArt(art);
    gsap.fromTo(num, { x: -30 * (dir || 1), opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: 'expo.out' });
    gsap.fromTo(chars, { yPercent: 120, rotate: 5 }, { yPercent: 0, rotate: 0, stagger: 0.025, duration: 1.1, ease: 'expo.out', delay: 0.1 });
    gsap.fromTo('#case-eyebrow, #case-role', { opacity: 0, x: 20 * (dir || 1) }, { opacity: 1, x: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out', delay: 0.15 });
    gsap.fromTo(items, { y: 26, x: 18 * dir, opacity: 0 }, { y: 0, x: 0, opacity: 1, stagger: 0.035, duration: 0.8, ease: 'power3.out', delay: 0.25 });
    scroller.querySelectorAll('.case-stats b').forEach((b) => {
      const m = b.textContent.match(/^(\D*)(\d+)(\D*)$/);
      if (!m) return;
      const o = { v: 0 };
      b.textContent = m[1] + '0' + m[3];
      gsap.to(o, { v: +m[2], duration: 1.4, delay: 0.5, ease: 'power2.out', onUpdate: () => { b.textContent = m[1] + Math.round(o.v) + m[3]; } });
    });
  };

  // scroll-linked header: art drifts and fades as the panel scrolls
  let raf = 0;
  scroller.addEventListener('scroll', () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const st = scroller.scrollTop, inner = $('case-art').firstElementChild;
      if (inner) { inner.style.transform = 'translate3d(0,' + st * 0.38 + 'px,0) scale(' + (1 + st / 2200) + ')'; inner.style.opacity = Math.max(0, 1 - st / 320); }
    });
  }, { passive: true });

  // panel spotlight follows the pointer
  panel.addEventListener('pointermove', (e) => {
    const r = panel.getBoundingClientRect();
    panel.style.setProperty('--mx', e.clientX - r.left + 'px');
    panel.style.setProperty('--my', e.clientY - r.top + 'px');
  });

  const open = (card) => {
    const n = card.querySelector('.number')?.textContent.trim();
    if (!DATA[n]) return;
    opener = card;
    modal.classList.remove('is-closing');
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('is-open');
    document.documentElement.classList.add('case-open');
    window.__lenis && window.__lenis.stop();
    fill(n);
    if (animated()) gsap.fromTo(panel, { y: 90, opacity: 0, scale: 0.94, rotateX: 6, transformPerspective: 1200 }, { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 0.95, ease: 'expo.out', clearProps: 'transform' });
    panel.focus({ preventScroll: true });
  };
  const finishClose = () => {
    modal.classList.remove('is-open', 'is-closing');
    modal.setAttribute('aria-hidden', 'true');
    artTl && artTl.kill();
    gsap && gsap.set(panel, { clearProps: 'all' });
  };
  const close = () => {
    if (!modal.classList.contains('is-open') || modal.classList.contains('is-closing')) return;
    document.documentElement.classList.remove('case-open');
    window.__lenis && window.__lenis.start();
    (cardFor(current) || opener)?.focus({ preventScroll: true });
    if (!animated()) { finishClose(); return; }
    modal.classList.add('is-closing');
    gsap.to(panel, { y: 50, opacity: 0, scale: 0.96, duration: 0.4, ease: 'power3.in', onComplete: finishClose });
  };
  const step = (dir) => {
    if (!animated()) { fill(ORDER[(ORDER.indexOf(current) + dir + ORDER.length) % ORDER.length], dir); return; }
    const next = ORDER[(ORDER.indexOf(current) + dir + ORDER.length) % ORDER.length];
    gsap.to(scroller, { x: -50 * dir, opacity: 0, duration: 0.25, ease: 'power2.in', onComplete: () => {
      fill(next, dir);
      gsap.fromTo(scroller, { x: 50 * dir, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, ease: 'expo.out' });
    } });
  };

  cards.forEach((card) => {
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-haspopup', 'dialog');
    card.addEventListener('click', (e) => { if (!e.target.closest('a')) open(card); });
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(card); } });
  });
  modal.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) close();
    else if (e.target.closest('[data-prev]')) step(-1);
    else if (e.target.closest('[data-next]')) step(1);
  });
  addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'Tab') {
      const f = [...modal.querySelectorAll('button')];
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
})();
