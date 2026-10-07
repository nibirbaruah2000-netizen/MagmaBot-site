const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

$('#year').textContent = new Date().getFullYear();

const menuToggle = $('.menu-toggle');
const mobileMenu = $('.mobile-menu');
menuToggle?.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  mobileMenu.setAttribute('aria-hidden', String(!open));
});
$$('.mobile-menu a').forEach((link) => link.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
$$('.reveal').forEach((element) => observer.observe(element));

const modules = {
  moderation: {
    label: 'MODERATION', title: 'Keep the signal clean.', command: ':warn @member reason', logs: [
      ['READY', 'gateway heartbeat received', 'green'], ['AUTH', 'owner permissions verified', 'orange'], ['SYNC', '48 commands available', 'blue'], ['CORE', 'MagmaBot is listening...', 'purple']
    ]
  },
  music: {
    label: 'MUSIC', title: 'Make the room move.', command: ':play a late night mix', logs: [
      ['QUEUE', 'Lavalink node connected', 'blue'], ['SEARCH', 'found 12 playable results', 'orange'], ['PLAY', 'Now Playing • Magma Mix', 'green'], ['CORE', 'controls posted to channel', 'purple']
    ]
  },
  economy: {
    label: 'ECONOMY', title: 'Give your community a reason to return.', command: ':balance', logs: [
      ['LEDGER', 'MagmaCash database synced', 'gold'], ['USER', 'balance request authenticated', 'blue'], ['CASH', 'wallet returned: 12,480 MC', 'green'], ['CORE', 'economy loop is healthy', 'purple']
    ]
  },
  premium: {
    label: 'PREMIUM', title: 'See the community behind the noise.', command: ':lb messages', logs: [
      ['PRO', 'premium guild license verified', 'orange'], ['TRACK', 'invite + message data refreshed', 'blue'], ['VOICE', 'voice time indexed: 284h', 'green'], ['CORE', 'leaderboard ready to serve', 'purple']
    ]
  }
};

const title = $('#terminal-title');
const moduleLabel = $('#terminal-module');
const input = $('#command-input');
const log = $('#terminal-log');
const setModule = (name) => {
  const data = modules[name];
  if (!data) return;
  moduleLabel.textContent = data.label;
  title.textContent = data.title;
  input.value = data.command;
  log.innerHTML = data.logs.map(([tag, text, color], index) => `<p><span class="muted">14:0${index + 2}:0${index + 8}</span> <b class="${color}">${tag}</b> ${text}</p>`).join('');
  $$('.module').forEach((button) => button.classList.toggle('active', button.dataset.module === name));
};
$$('.module').forEach((button) => button.addEventListener('click', () => setModule(button.dataset.module)));

$('#run-command')?.addEventListener('click', () => {
  const command = input.value.trim() || ':help';
  const now = new Date().toLocaleTimeString([], { hour12: false });
  log.insertAdjacentHTML('beforeend', `<p><span class="muted">${now}</span> <b class="orange">EXEC</b> ${command.replace(/</g, '&lt;')}</p>`);
  log.scrollTop = log.scrollHeight;
});
input?.addEventListener('keydown', (event) => { if (event.key === 'Enter') $('#run-command').click(); });

const status = $('.status-pill');
setInterval(() => {
  const dot = status?.querySelector('i');
  if (dot) dot.style.opacity = dot.style.opacity === '0.35' ? '1' : '0.35';
}, 1900);
