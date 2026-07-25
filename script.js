const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reducedMotion) {
  document.documentElement.classList.add('js');
  document.querySelectorAll('.tilt-card, .interactive-visual').forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const bounds = element.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      element.style.setProperty('--rotate-x', `${-y * 7}deg`);
      element.style.setProperty('--rotate-y', `${x * 7}deg`);
      element.style.setProperty('--x', `${(x + .5) * 100}%`);
      element.style.setProperty('--y', `${(y + .5) * 100}%`);
    });
    element.addEventListener('pointerleave', () => {
      element.style.setProperty('--rotate-x', '0deg');
      element.style.setProperty('--rotate-y', '0deg');
    });
  });
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.target.classList.toggle('in-view', entry.isIntersecting)), { threshold: .16 });
  document.querySelectorAll('.section, .hero, .contact').forEach((section) => observer.observe(section));
}
