const nav = document.querySelector('.nav-shell');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 18), { passive: true });

const reveal = new IntersectionObserver((entries) => entries.forEach(({ target, isIntersecting }) => {
  if (isIntersecting) { target.classList.add('show'); reveal.unobserve(target); }
}), { threshold: .14 });
document.querySelectorAll('.reveal').forEach((item) => reveal.observe(item));

const links = [...document.querySelectorAll('.nav-links a')];
const sections = links.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
const activeNav = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (!entry.isIntersecting) return;
  links.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
}), { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
sections.forEach((section) => activeNav.observe(section));

document.querySelectorAll('.project').forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = card.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - .5;
    const y = (event.clientY - box.top) / box.height - .5;
    card.style.transform = `translateY(-7px) perspective(950px) rotateX(${-y * 2.5}deg) rotateY(${x * 2.5}deg)`;
  });
  card.addEventListener('pointerleave', () => card.style.transform = '');
});
