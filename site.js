const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.mobile-menu');
toggle?.addEventListener('click', () => {
  const open = menu?.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(Boolean(open)));
});
menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => menu.classList.remove('open')));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
