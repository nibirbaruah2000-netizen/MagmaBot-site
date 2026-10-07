const STATUS_FEED = '/status.json';
const BOT_ID = '1537424885230608425';
const title = document.querySelector('#bot-status-title');
const badge = document.querySelector('#status-badge');
const ring = document.querySelector('#health-ring');
const icon = document.querySelector('#health-icon');
const copy = document.querySelector('#status-copy');
const checked = document.querySelector('#last-checked');
const gateway = document.querySelector('#gateway-status');
const gatewayDot = document.querySelector('#gateway-dot');
const music = document.querySelector('#music-status');
const musicDot = document.querySelector('#music-dot');
const history = document.querySelector('#history-state');
const historyTime = document.querySelector('#history-time');

function paint(state) {
  const normalized = ['online', 'offline', 'degraded'].includes(state?.bot) ? state.bot : 'unknown';
  const labels = { online: ['Operational', 'ONLINE', 'MagmaBot is connected and responding normally.'], offline: ['Offline', 'OFFLINE', 'MagmaBot is not currently connected to Discord.'], degraded: ['Degraded', 'DEGRADED', 'MagmaBot is reachable, but one or more services need attention.'], unknown: ['Awaiting signal', 'UNKNOWN', 'The public monitor has not reported a current state yet.'] };
  const [heading, badgeText, message] = labels[normalized];
  title.textContent = heading;
  badge.innerHTML = `<i></i> ${badgeText}`;
  badge.className = `health-badge ${normalized}`;
  ring.className = `health-ring ${normalized}`;
  icon.textContent = normalized === 'online' ? '✓' : normalized === 'offline' ? '×' : normalized === 'degraded' ? '!' : '↻';
  copy.textContent = message;
  const gatewayState = normalized === 'online' ? 'Operational' : normalized === 'offline' ? 'Offline' : normalized === 'degraded' ? 'Degraded' : 'Unknown';
  gateway.textContent = gatewayState;
  gatewayDot.className = `service-dot ${normalized}`;
  music.textContent = state?.music || 'Unknown';
  musicDot.className = `service-dot ${String(state?.music || 'unknown').toLowerCase()}`;
  history.textContent = badgeText[0] + badgeText.slice(1).toLowerCase();
  historyTime.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

async function checkStatus() {
  try {
    const response = await fetch(`${STATUS_FEED}?bot=${BOT_ID}&t=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Status feed returned ${response.status}`);
    const data = await response.json();
    if (data.bot_id && String(data.bot_id) !== BOT_ID) throw new Error('Status feed bot ID mismatch');
    paint(data);
  } catch (error) {
    paint({ bot: 'unknown', music: 'Unknown' });
    copy.textContent = 'The monitor feed is unavailable. Configure status.json or connect your VPS monitor.';
  } finally {
    checked.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
checkStatus();
setInterval(checkStatus, 30000);
