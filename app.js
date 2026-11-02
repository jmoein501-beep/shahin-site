/* ===== Shahin Mohammadi — demo platform ===== */
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const faNum = (n, d = 0) => new Intl.NumberFormat('fa-IR', { minimumFractionDigits: d, maximumFractionDigits: d }).format(n);
const enNum = (n, d = 0) => new Intl.NumberFormat('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }).format(n);
const fa = s => String(s).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
const pct = v => (v >= 0 ? '+' : '−') + faNum(Math.abs(v), 2) + '٪';
const faDate = (d, o = { day: 'numeric', month: 'long' }) => new Intl.DateTimeFormat('fa-IR-u-ca-persian', o).format(d);
function toast(msg) { const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; $('#toasts').appendChild(t); setTimeout(() => t.remove(), 3800); }
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const ls = { get(k, d) { try { const v = localStorage.getItem('sm_' + k); return v ? JSON.parse(v) : d; } catch { return d; } }, set(k, v) { try { localStorage.setItem('sm_' + k, JSON.stringify(v)); } catch { } } };

/* ===== photos ===== */
const PHOTOS = [
  { f: 'IMG_2082', pos: '50% 30%', cap: 'جلسه تحلیل روزانه با تیم' },
  { f: 'IMG_2551', pos: '62% 35%', cap: 'پشت میز معامله' },
  { f: 'IMG_1121', pos: '55% 28%', cap: 'بررسی بازار پیش از باز شدن سشن لندن' },
  { f: 'IMG_2097', pos: '72% 25%', cap: 'کلاس حضوری مدیریت ریسک' },
  { f: 'IMG_1213', pos: '50% 50%', cap: 'جلسه استراتژی با معامله‌گران' },
  { f: 'IMG_1811', pos: '50% 30%', cap: 'Space to Manage' },
  { f: 'IMG_1132', pos: '45% 40%', cap: 'اتاق تحلیل' },
  { f: 'IMG_1117', pos: '50% 45%', cap: 'دورهمی کامیونیتی' },
  { f: 'IMG_lounge', pos: '25% 42%', cap: 'لحظه‌ای مکث بین دو سشن' },
];
const img = p => `img/${p.f}.jpg`;

/* ===== market simulation ===== */
const SYMS = [
  { s: 'BTCUSDT', n: 'بیت‌کوین', c: 'crypto', p: 95800, d: 1, v: .012, cap: 1900 },
  { s: 'ETHUSDT', n: 'اتریوم', c: 'crypto', p: 3420, d: 2, v: .016, cap: 410 },
  { s: 'SOLUSDT', n: 'سولانا', c: 'crypto', p: 182.4, d: 2, v: .022, cap: 88 },
  { s: 'BNBUSDT', n: 'بایننس کوین', c: 'crypto', p: 648, d: 1, v: .012, cap: 94 },
  { s: 'XRPUSDT', n: 'ریپل', c: 'crypto', p: 2.312, d: 4, v: .02, cap: 132 },
  { s: 'TONUSDT', n: 'تون‌کوین', c: 'crypto', p: 5.12, d: 3, v: .024, cap: 13 },
  { s: 'DOGEUSDT', n: 'دوج‌کوین', c: 'crypto', p: .2140, d: 4, v: .028, cap: 31 },
  { s: 'ADAUSDT', n: 'کاردانو', c: 'crypto', p: .7910, d: 4, v: .024, cap: 28 },
  { s: 'AVAXUSDT', n: 'آوالانچ', c: 'crypto', p: 34.6, d: 2, v: .026, cap: 14 },
  { s: 'LINKUSDT', n: 'چین‌لینک', c: 'crypto', p: 19.8, d: 3, v: .024, cap: 12 },
  { s: 'TRXUSDT', n: 'ترون', c: 'crypto', p: .2510, d: 4, v: .014, cap: 22 },
  { s: 'DOTUSDT', n: 'پولکادات', c: 'crypto', p: 6.42, d: 3, v: .024, cap: 9 },
  { s: 'XAUUSD', n: 'طلا (انس)', c: 'commod', p: 4062.5, d: 2, v: .006 },
  { s: 'XAGUSD', n: 'نقره', c: 'commod', p: 48.62, d: 3, v: .01 },
  { s: 'BRENT', n: 'نفت برنت', c: 'commod', p: 66.4, d: 2, v: .009 },
  { s: 'US500', n: 'S&P 500', c: 'commod', p: 6782, d: 1, v: .005 },
  { s: 'NAS100', n: 'نزدک ۱۰۰', c: 'commod', p: 24950, d: 1, v: .007 },
  { s: 'DXY', n: 'شاخص دلار', c: 'commod', p: 99.12, d: 2, v: .003 },
  { s: 'EURUSD', n: 'یورو / دلار', c: 'forex', p: 1.16120, d: 5, v: .003 },
  { s: 'GBPUSD', n: 'پوند / دلار', c: 'forex', p: 1.33180, d: 5, v: .0035 },
  { s: 'USDJPY', n: 'دلار / ین', c: 'forex', p: 152.40, d: 3, v: .004 },
  { s: 'GBPJPY', n: 'پوند / ین', c: 'forex', p: 202.95, d: 3, v: .005 },
  { s: 'USDCAD', n: 'دلار / دلار کانادا', c: 'forex', p: 1.39850, d: 5, v: .003 },
  { s: 'AUDUSD', n: 'دلار استرالیا', c: 'forex', p: .65800, d: 5, v: .0035 },
  { s: 'USDCHF', n: 'دلار / فرانک', c: 'forex', p: .79900, d: 5, v: .003 },
];
const M = {};
const nice = s => s.endsWith('USDT') ? s.replace('USDT', '/USDT') : (/^[A-Z]{6}$/.test(s) ? s.slice(0, 3) + '/' + s.slice(3) : s);
SYMS.forEach((x, i) => {
  const r = rng(1000 + i * 77);
  const open = x.p * (1 + (r() - .5) * x.v * 2.2);
  const spark = []; let q = open;
  for (let k = 0; k < 48; k++) { q *= 1 + (r() - .5) * x.v * .35; spark.push(q); }
  spark[47] = x.p;
  M[x.s] = { ...x, price: x.p, open, high: Math.max(...spark, x.p), low: Math.min(...spark, x.p), spark, vol: (r() * 900 + 100) };
});
const chg = s => (M[s].price / M[s].open - 1) * 100;
const fp = (s, v = M[s].price) => enNum(v, M[s].d);
const listeners = new Set();
let tickN = 0;
function tick() {
  const t = ++tickN;
  for (const k in M) {
    const m = M[k];
    if (Math.random() < .7) {
      const drift = (m.p - m.price) / m.p * .02;
      m.price *= 1 + (Math.random() - .5) * m.v * .06 + drift;
      m.high = Math.max(m.high, m.price); m.low = Math.min(m.low, m.price);
      if (t % 5 < 1) { m.spark.push(m.price); m.spark.shift(); } else m.spark[m.spark.length - 1] = m.price;
    }
  }
  listeners.forEach(f => f());
}
setInterval(tick, 1400);

function history(sym, tf, n = 260) {
  const m = M[sym]; const r = rng(sym.length * 991 + tf);
  const step = m.v * Math.sqrt(tf / 86400) * .9;
  const bars = []; let c = m.price;
  const now = Math.floor(Date.now() / 1000 / tf) * tf;
  for (let i = 0; i < n; i++) {
    const o = c / (1 + (r() - .49) * step * 2);
    const h = Math.max(o, c) * (1 + r() * step * .6), l = Math.min(o, c) * (1 - r() * step * .6);
    bars.push({ time: now - i * tf, open: o, high: h, low: l, close: c, value: (r() * .8 + .2) * 1000, color: c >= o ? 'rgba(11,138,76,.35)' : 'rgba(209,55,45,.35)' });
    c = o;
  }
  return bars.reverse();
}
function sparkDraw(cv, data, color) {
  const dpr = devicePixelRatio || 1; const w = cv.clientWidth || 96, h = cv.clientHeight || 46;
  cv.width = w * dpr; cv.height = h * dpr; const g = cv.getContext('2d'); g.scale(dpr, dpr);
  const mn = Math.min(...data), mx = Math.max(...data); const X = i => i / (data.length - 1) * w, Y = v => h - 3 - (v - mn) / (mx - mn || 1) * (h - 6);
  g.beginPath(); data.forEach((v, i) => i ? g.lineTo(X(i), Y(v)) : g.moveTo(X(i), Y(v)));
  g.strokeStyle = color; g.lineWidth = 1.6; g.stroke();
  g.lineTo(w, h); g.lineTo(0, h); g.closePath(); const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, color + '33'); gr.addColorStop(1, color + '00'); g.fillStyle = gr; g.fill();
  g.beginPath(); g.arc(X(data.length - 1), Y(data[data.length - 1]), 2.6, 0, 7); g.fillStyle = color; g.fill();
}
const UP = '#0b8a4c', DOWN = '#d1372d';

/* ===== backend (db + user capability, local fallback) ===== */
const B = { db: null, user: null, uid: null, owner: false, canEdit: false };
async function initBackend() {
  if (!window.claude?.use) return;
  try {
    const [db, user] = await Promise.all([claude.use('db'), claude.use('user')]);
    B.db = db; B.user = user;
    if (user) { B.owner = !!user.isOwner?.(); B.canEdit = !!user.canEdit?.(); try { B.uid = await user.id(); } catch { } }
  } catch { }
  if (B.owner || B.canEdit) $('#adminLink').classList.remove('hidden');
  await loadMine();
  subscribeShared();
  renderAuthState();
  if (location.hash === '#admin' || location.hash === '#dashboard') route();
}
async function getMine(k, d) {
  if (B.db && B.uid) { try { const s = await B.db.doc(`data/users/${B.uid}/${k}`).get(); if (s.exists) return s.data().v; } catch { } }
  return ls.get(k, d);
}
const writing = {};
async function setMine(k, v) {
  ls.set(k, v);
  if (B.db && B.uid) {
    while (writing[k]) await writing[k];
    writing[k] = B.db.doc(`data/users/${B.uid}/${k}`).set({ v: JSON.parse(JSON.stringify(v)), at: Date.now() }).catch(() => { }).finally(() => { writing[k] = null; });
    await writing[k];
  }
}
const ME = { profile: null, watch: ['BTCUSDT', 'XAUUSD', 'EURUSD', 'ETHUSDT'], alerts: [], journal: [], courses: { c1: 64, c3: 20 }, notif: { signals: true, analysis: true, alerts: true, news: false } };
async function loadMine() {
  const [p, w, a, j, n] = await Promise.all([getMine('profile', null), getMine('watch', null), getMine('alerts', null), getMine('journal', null), getMine('notif', null)]);
  ME.profile = p; if (w) ME.watch = w; if (a) ME.alerts = a; if (j) ME.journal = j; else ME.journal = demoJournal(); if (n) ME.notif = n;
}
const SHARED = { signals: [], analyses: [], leads: [] };
function subscribeShared() {
  if (!B.db) return;
  const timer = setTimeout(() => { }, 10000);
  try {
    B.db.collection('signals').orderBy('at', 'desc').limit(50).onSnapshot(s => { clearTimeout(timer); SHARED.signals = s.docs.map(d => ({ ...d.data(), id: d.id, live: true })); renderSignals(); if (curView === 'admin') renderAdmin(); }, () => { });
    B.db.collection('analyses').orderBy('at', 'desc').limit(30).onSnapshot(s => { SHARED.analyses = s.docs.map(d => ({ ...d.data(), id: d.id, live: true })); renderBento(); if (curView === 'admin') renderAdmin(); }, () => { });
    if (B.owner || B.canEdit) B.db.collection('leads').limit(200).onSnapshot(s => { SHARED.leads = s.docs.map(d => ({ ...d.data(), id: d.id })).sort((a, b) => b.at - a.at); if (curView === 'admin') renderAdmin(); }, () => { });
  } catch { }
}

/* ===== router ===== */
let curView = 'home';
const VIEWS = ['home', 'login', 'dashboard', 'admin'];
const SECTIONS = ['about', 'analysis', 'market', 'signals', 'tools', 'academy', 'plans', 'contact'];
function go(v) { if (location.hash === '#' + v) route(); else location.hash = v; }
function route() {
  let h = location.hash.slice(1) || 'home';
  let sec = null;
  if (SECTIONS.includes(h)) { sec = h; h = 'home'; }
  if (!VIEWS.includes(h)) h = 'home';
  if (h === 'dashboard' && !ME.profile?.loggedIn) h = 'login';
  if (h === 'admin' && !(B.owner || B.canEdit)) h = 'home';
  curView = h;
  VIEWS.forEach(v => $('#view-' + v).classList.toggle('hidden', v !== h));
  $('#nav').classList.toggle('hidden', h !== 'home');
  $('#footer').classList.toggle('hidden', h !== 'home');
  $('#mobileMenu').classList.add('hidden');
  if (h !== 'home') $('#botHello').classList.add('hidden');
  if (h === 'login') renderAuth('phone');
  if (h === 'dashboard') renderDash(dashTab);
  if (h === 'admin') renderAdmin();
  if (h === 'home' && mainChart) setTimeout(() => mainChart.applyOptions({ width: $('#chart').clientWidth }), 30);
  if (sec) setTimeout(() => document.getElementById(sec)?.scrollIntoView({ behavior: 'smooth' }), 60);
  else if (h !== 'home') window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);
document.addEventListener('click', e => {
  const g = e.target.closest('[data-go]'); if (g) { e.preventDefault(); go(g.dataset.go); return; }
  const s = e.target.closest('[data-scroll]'); if (s) { e.preventDefault(); if (curView !== 'home') { location.hash = s.dataset.scroll; } else { document.getElementById(s.dataset.scroll)?.scrollIntoView({ behavior: 'smooth' }); $('#mobileMenu').classList.add('hidden'); } }
});
$('#menuBtn').addEventListener('click', () => { const mm = $('#mobileMenu'); mm.innerHTML = $$('.nav-links a').map(a => `<a data-scroll="${a.dataset.scroll}">${a.textContent}</a>`).join(''); mm.classList.toggle('hidden'); });

/* ===== hero + about photos ===== */
function initHero() {
  const box = $('#slides'), dots = $('#heroDots');
  box.innerHTML = PHOTOS.map((p, i) => `<div class="slide${i ? '' : ' on'}"><img src="${img(p)}" alt="${esc(p.cap)}" style="object-position:${p.pos}" ${i > 1 ? 'loading="lazy"' : ''}></div>`).join('');
  dots.innerHTML = PHOTOS.map((p, i) => `<button aria-label="عکس ${fa(i + 1)}" class="${i ? '' : 'on'}"></button>`).join('');
  let i = 0, timer;
  const show = k => { i = (k + PHOTOS.length) % PHOTOS.length; $$('.slide', box).forEach((s, j) => s.classList.toggle('on', j === i)); $$('button', dots).forEach((d, j) => d.classList.toggle('on', j === i)); $('#heroCap').textContent = `${fa(String(i + 1).padStart(2, '0'))} / ${fa(String(PHOTOS.length).padStart(2, '0'))} — ${PHOTOS[i].cap}`; };
  const auto = () => { clearInterval(timer); timer = setInterval(() => show(i + 1), 6000); };
  $$('button', dots).forEach((d, j) => d.addEventListener('click', () => { show(j); auto(); }));
  show(0); auto();
  // about photos (portrait-friendly order)
  const ap = $('#aboutPhotos'); const order = [5, 2, 3, 0, 8, 6, 1, 7, 4];
  ap.insertAdjacentHTML('afterbegin', order.map((k, j) => `<img src="${img(PHOTOS[k])}" alt="${esc(PHOTOS[k].cap)}" style="object-position:${PHOTOS[k].pos}" class="${j ? '' : 'on'}" loading="lazy">`).join(''));
  let a = 0; const ims = $$('img', ap);
  const ashow = () => { ims.forEach((m, j) => m.classList.toggle('on', j === a)); $('#aboutCap').textContent = PHOTOS[order[a]].cap; $('#aboutIdx').textContent = `${faNum(a + 1)} / ${faNum(ims.length)}`; };
  ashow(); setInterval(() => { a = (a + 1) % ims.length; ashow(); }, 4200);
}
function initCounters() {
  const els = $$('[data-count]');
  const run = el => { const to = +el.dataset.count, suf = el.dataset.suffix || ''; const t0 = performance.now(); const step = t => { const k = Math.min(1, (t - t0) / 1400); el.textContent = faNum(Math.round(to * (1 - Math.pow(1 - k, 3)))) + suf; if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); };
  els.forEach(el => el.textContent = faNum(+el.dataset.count) + (el.dataset.suffix || ''));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } }), { threshold: .6 });
  els.forEach(el => io.observe(el));
}

/* ===== ticker ===== */
const TK = ['BTCUSDT', 'XAUUSD', 'EURUSD', 'ETHUSDT', 'US500', 'GBPUSD', 'SOLUSDT', 'USDJPY', 'BRENT', 'DXY', 'XRPUSDT', 'NAS100', 'TONUSDT', 'XAGUSD'];
function renderTicker() {
  const one = TK.map(s => { const c = chg(s); return `<span class="tk"><b>${nice(s)}</b><span class="p ltr">${fp(s)}</span><span class="c ${c >= 0 ? 'up' : 'down'}">${pct(c)}</span></span>`; }).join('');
  $('#tickerRow').innerHTML = one + one;
}
listeners.add(() => { $$('#tickerRow .tk').forEach((el, i) => { const s = TK[i % TK.length]; const c = chg(s); el.querySelector('.p').textContent = fp(s); const ce = el.querySelector('.c'); ce.textContent = pct(c); ce.className = 'c ' + (c >= 0 ? 'up' : 'down'); }); });

/* ===== analyses ===== */
const now = Date.now(), H = 3600e3;
const DEMO_AN = [
  { id: 'a1', sym: 'BTCUSDT', cat: 'crypto', tf: '4H', bias: 'صعودی محتاط', at: now - 2 * H, photo: 'IMG_2082', title: 'بیت‌کوین در محدوده تصمیم: شکست سقف کانال یا برگشت به حمایت؟', sum: 'قیمت به سقف کانال صعودی چهارساعته رسیده و حجم معاملات در حال کاهش است. تا وقتی حمایت ۹۲٬۴۰۰ حفظ شود، سناریوی اصلی ادامه‌ی صعود است.', body: ['بیت‌کوین در تایم چهارساعته داخل یک کانال صعودی منظم حرکت می‌کند و حالا به سقف کانال رسیده است. واگرایی منفی خفیف در RSI و کاهش حجم در آخرین موج صعودی نشان می‌دهد خریداران کمی محتاط شده‌اند.', 'سناریوی اصلی: اصلاح کوتاه تا محدوده ۹۴٬۰۰۰ و سپس تلاش دوباره برای شکست ۹۸٬۶۰۰. بسته‌شدن کندل چهارساعته بالای این سطح، مسیر را تا ۱۰۱٬۲۰۰ باز می‌کند.', 'شرط باطل‌شدن: بسته‌شدن کندل روزانه زیر ۹۲٬۴۰۰ ساختار صعودی را می‌شکند و احتمال برگشت تا ۸۹٬۸۰۰ را بالا می‌برد.'], lv: { s1: 92400, s2: 89800, r1: 98600, r2: 101200 } },
  { id: 'a2', sym: 'XAUUSD', cat: 'gold', tf: '1D', bias: 'خنثی رو به صعود', at: now - 5 * H, title: 'طلا بعد از رکورد: اصلاح سالم یا شروع روند نزولی؟', sum: 'اصلاح طلا تا اینجا ساختار روند صعودی روزانه را نشکسته است. ناحیه ۴٬۰۰۵ تا ۴٬۰۲۰ مهم‌ترین حمایت برای خریداران است.', body: ['انس جهانی طلا پس از ثبت سقف تاریخی وارد فاز اصلاحی شده است. این اصلاح تا الان به میانگین متحرک ۲۰ روزه رسیده که در روندهای قوی معمولاً نقطه‌ی برگشت است.', 'تا وقتی قیمت بالای ۴٬۰۰۵ بسته شود، نگاه ما خرید در اصلاح است. اولین مقاومت ۴٬۱۲۰ و بعد از آن سقف قبلی است.', 'داده‌های تورم آمریکا و لحن فدرال رزرو در این هفته می‌تواند نوسان شدید ایجاد کند؛ حجم معاملات را کم نگه دار.'], lv: { s1: 4005, s2: 3960, r1: 4120, r2: 4180 } },
  { id: 'a3', sym: 'EURUSD', cat: 'forex', tf: '1H', bias: 'صعودی', at: now - 8 * H, title: 'یورو/دلار: نگاه به داده‌های تورم آمریکا', sum: 'شکست خط روند نزولی یک‌ساعته و تثبیت بالای ۱٫۱۶۰۰، سناریوی صعود تا ۱٫۱۶۸۰ را تقویت کرده است.', body: ['جفت‌ارز یورو/دلار خط روند نزولی دو هفته‌ی اخیر را شکسته و پولبک به آن را با موفقیت پشت سر گذاشته است.', 'هدف‌های اول و دوم ۱٫۱۶۴۰ و ۱٫۱۶۸۰ هستند. انتشار داده تورم آمریکا ممکن است حرکت را سرعت دهد یا خنثی کند.'], lv: { s1: 1.1590, s2: 1.1555, r1: 1.1640, r2: 1.1680 } },
  { id: 'a4', sym: 'ETHUSDT', cat: 'crypto', tf: '1D', bias: 'صعودی', at: now - 22 * H, title: 'اتریوم و نسبت ETH/BTC: آیا نوبت آلت‌کوین‌هاست؟', sum: 'نسبت ETH/BTC از کف چندماهه برگشته است. شکست ۳٬۵۰۰ می‌تواند شروع یک موج قوی‌تر برای اتریوم باشد.', body: ['نسبت اتریوم به بیت‌کوین پس از ماه‌ها افت، از یک ناحیه حمایتی مهم برگشته و کندل‌های روزانه نشانه‌ی ورود خریدار دارند.', 'تا وقتی ۳٬۲۸۰ حفظ شود، هدف‌های ۳٬۶۲۰ و ۳٬۷۸۰ در دسترس است.'], lv: { s1: 3280, s2: 3150, r1: 3500, r2: 3780 } },
  { id: 'a5', sym: 'US500', cat: 'index', tf: '1D', bias: 'صعودی', at: now - 30 * H, title: 'شاخص S&P 500 در فصل گزارش‌های مالی', sum: 'گزارش‌های بهتر از انتظار شرکت‌های بزرگ فناوری، شاخص را نزدیک سقف نگه داشته است. حمایت کلیدی ۶٬۶۸۰ است.', body: ['شاخص S&P 500 با کمک سهام بزرگ فناوری نزدیک سقف تاریخی معامله می‌شود.', 'افت زیر ۶٬۶۸۰ اولین نشانه‌ی ضعف خواهد بود؛ تا آن زمان روند صعودی معتبر است.'], lv: { s1: 6680, s2: 6590, r1: 6850, r2: 6920 } },
  { id: 'a6', sym: 'GBPJPY', cat: 'forex', tf: '4H', bias: 'نزولی', at: now - 46 * H, title: 'پوند/ین: الگوی سر و شانه در تایم ۴ساعته', sum: 'یک سر و شانه‌ی کلاسیک در حال تکمیل است. شکست خط گردن ۲۰۲٫۴۰ هدف ۲۰۰٫۸۰ را فعال می‌کند.', body: ['پوند/ین در تایم چهارساعته الگوی سر و شانه ساخته و حالا روی خط گردن است.', 'شکست و تثبیت زیر ۲۰۲٫۴۰ هدف اندازه‌گیری‌شده‌ی ۲۰۰٫۸۰ را فعال می‌کند. بازگشت بالای شانه‌ی راست (۲۰۴٫۴۰) الگو را باطل می‌کند.'], lv: { s1: 202.40, s2: 200.80, r1: 203.70, r2: 204.40 } },
];
let anFilter = 'all';
const allAnalyses = () => [...SHARED.analyses, ...DEMO_AN];
const CAT_FA = { forex: 'فارکس', crypto: 'کریپتو', gold: 'طلا', index: 'شاخص', commod: 'کالا' };
const ago = t => { const m = Math.round((Date.now() - t) / 60000); if (m < 60) return fa(Math.max(1, m)) + ' دقیقه پیش'; const h = Math.round(m / 60); if (h < 24) return fa(h) + ' ساعت پیش'; return fa(Math.round(h / 24)) + ' روز پیش'; };
function thumbCanvas(sym, seed) {
  const cv = document.createElement('canvas'); cv.width = 640; cv.height = 400; const g = cv.getContext('2d');
  g.fillStyle = '#f3f3f1'; g.fillRect(0, 0, 640, 400);
  g.strokeStyle = 'rgba(0,0,0,.05)'; for (let x = 0; x < 640; x += 40) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 400); g.stroke(); } for (let y = 0; y < 400; y += 40) { g.beginPath(); g.moveTo(0, y); g.lineTo(640, y); g.stroke(); }
  const bars = history(M[sym] ? sym : 'BTCUSDT', 3600 + seed, 46);
  const mn = Math.min(...bars.map(b => b.low)), mx = Math.max(...bars.map(b => b.high));
  const Y = v => 330 - (v - mn) / (mx - mn) * 250;
  bars.forEach((b, i) => { const x = 30 + i * 12.8; const up = b.close >= b.open; g.strokeStyle = g.fillStyle = up ? UP : DOWN; g.beginPath(); g.moveTo(x, Y(b.high)); g.lineTo(x, Y(b.low)); g.lineWidth = 1.4; g.stroke(); const t = Y(Math.max(b.open, b.close)), bt = Y(Math.min(b.open, b.close)); g.fillRect(x - 4, t, 8, Math.max(2, bt - t)); });
  g.font = '900 64px Vazirmatn, sans-serif'; g.fillStyle = 'rgba(0,0,0,.07)'; g.textAlign = 'left'; g.fillText(nice(sym), 26, 380);
  return cv;
}
function renderBento() {
  const list = allAnalyses().filter(a => anFilter === 'all' || a.cat === anFilter).slice(0, 5);
  const el = $('#bento'); el.innerHTML = '';
  if (!list.length) { el.innerHTML = '<p class="empty">برای این بازار هنوز تحلیلی منتشر نشده است.</p>'; return; }
  list.forEach((a, i) => {
    const b = document.createElement('button'); b.className = 'an' + (i === 0 ? ' feat' : ''); b.type = 'button';
    const tag = `<span class="badge ${a.bias?.includes('نزولی') ? 'down' : 'up'} sym"><span class="ltr">${esc(nice(a.sym))}</span> · ${esc(a.tf)}</span>`;
    b.innerHTML = `<div class="thumb">${i === 0 ? `<img src="img/${esc(a.photo || 'IMG_2082')}.jpg" alt="" style="object-position:50% 30%">` : ''}${tag}${i === 0 ? `<div class="over"><span class="badge brass">تحلیل ویژه</span><h3 style="margin-top:10px">${esc(a.title)}</h3><p>${esc(a.sum)}</p></div>` : ''}</div>
      <div class="body"><h3>${esc(a.title)}</h3><p>${esc(a.sum)}</p><div class="meta"><span>${CAT_FA[a.cat] || ''} · ${ago(a.at)}</span><span class="link">مشاهده تحلیل</span></div></div>`;
    if (i !== 0) b.querySelector('.thumb').prepend(thumbCanvas(a.sym, i * 31));
    b.addEventListener('click', () => openAnalysis(a));
    el.appendChild(b);
  });
}
$('#anFilters').addEventListener('click', e => { const c = e.target.closest('.chip'); if (!c) return; anFilter = c.dataset.f; $$('#anFilters .chip').forEach(x => x.setAttribute('aria-pressed', x === c)); renderBento(); });

/* modal */
let modalChart = null;
function openModal(html) { $('#modalIn').innerHTML = html; $('#modal').classList.remove('hidden'); document.body.style.overflow = 'hidden'; }
function closeModal() { $('#modal').classList.add('hidden'); document.body.style.overflow = ''; if (modalChart) { modalChart.remove(); modalChart = null; } }
$('#modalX').addEventListener('click', closeModal);
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); $('#bot').classList.add('hidden'); } });
function openAnalysis(a) {
  const d = M[a.sym]?.d ?? 2; const L = a.lv || {};
  openModal(`<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><span class="badge dark ltr">${esc(nice(a.sym))}</span><span class="badge mute">${esc(a.tf)}</span><span class="badge ${a.bias?.includes('نزولی') ? 'down' : 'up'}">جهت: ${esc(a.bias)}</span><span style="color:var(--muted);font-size:13px">${ago(a.at)} · شاهین محمدی</span></div>
    <h2 style="font-size:26px;margin-top:12px">${esc(a.title)}</h2>
    <div id="mchart"></div>
    <div class="levels"><div><span>حمایت ۱</span><b>${L.s1 != null ? enNum(L.s1, d > 3 ? 4 : d > 1 ? 1 : 0) : '—'}</b></div><div><span>حمایت ۲</span><b>${L.s2 != null ? enNum(L.s2, d > 3 ? 4 : d > 1 ? 1 : 0) : '—'}</b></div><div><span>مقاومت ۱</span><b>${L.r1 != null ? enNum(L.r1, d > 3 ? 4 : d > 1 ? 1 : 0) : '—'}</b></div><div><span>مقاومت ۲</span><b>${L.r2 != null ? enNum(L.r2, d > 3 ? 4 : d > 1 ? 1 : 0) : '—'}</b></div></div>
    ${(a.body || [a.sum]).map(p => `<p style="margin-top:12px;font-size:16px;line-height:2">${esc(p)}</p>`).join('')}
    <p class="demo-note" style="margin-top:18px">این تحلیل آموزشی است و توصیه به خرید یا فروش نیست. در این دمو، نمودار با داده‌ی شبیه‌سازی‌شده رسم شده است.</p>`);
  if (window.LightweightCharts && M[a.sym]) {
    const el = $('#mchart'); modalChart = LightweightCharts.createChart(el, chartOpts(el));
    const s = modalChart.addCandlestickSeries(candleOpts()); const bars = history(a.sym, a.tf === '1D' ? 86400 : a.tf === '4H' ? 14400 : 3600, 140); s.setData(bars);
    const pl = (p, t, c) => p != null && s.createPriceLine({ price: p, color: c, lineWidth: 1, lineStyle: 2, axisLabelVisible: true, title: t });
    pl(L.s1, 'S1', UP); pl(L.s2, 'S2', UP); pl(L.r1, 'R1', DOWN); pl(L.r2, 'R2', DOWN);
    modalChart.timeScale().fitContent();
  }
}

/* ===== orbit ===== */
const PLANETS = [
  { t: 'سیگنال‌ها', go: 'signals', r: 1, a: 20, b: 1 }, { t: 'تحلیل روزانه', go: 'analysis', r: 1, a: 200 },
  { t: 'داده بازار', go: 'market', r: 2, a: 80 }, { t: 'آکادمی', go: 'academy', r: 2, a: 250, b: 1 }, { t: 'ابزار ریسک', go: 'tools', r: 2, a: 160 },
  { t: 'کامیونیتی', go: 'contact', r: 3, a: 40 }, { t: 'اشتراک VIP', go: 'plans', r: 3, a: 130, b: 1 }, { t: 'دستیار AI', go: 'bot', r: 3, a: 220 }, { t: 'ژورنال معاملات', go: 'login', r: 3, a: 310 },
];
function initOrbit() {
  const box = $('#orbits'); const radii = [150, 225, 300];
  box.innerHTML = radii.map(r => `<div class="ring" style="width:${r * 2}px;height:${r * 2}px"></div>`).join('') + `<div class="orbit-center"><img src="img/IMG_1811.jpg" alt="شاهین محمدی"></div>` + PLANETS.map((p, i) => `<button class="planet${p.b ? ' b' : ''}" data-i="${i}"><i></i><span>${p.t}</span></button>`).join('');
  const els = $$('.planet', box);
  els.forEach(el => el.addEventListener('click', () => { const p = PLANETS[+el.dataset.i]; if (p.go === 'bot') openBot(); else if (p.go === 'login') go('login'); else document.getElementById(p.go).scrollIntoView({ behavior: 'smooth' }); }));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let t0 = performance.now();
  const loop = t => {
    const w = box.clientWidth, h = box.clientHeight, cx = w / 2, cy = h / 2; const sc = Math.min(1, w / 680);
    els.forEach((el, i) => { const p = PLANETS[i]; const sp = [0.012, 0.008, 0.005][p.r - 1]; const ang = (p.a + (reduce ? 0 : (t - t0) * sp * 0.06)) * Math.PI / 180; const R = radii[p.r - 1] * sc; const x = cx + Math.cos(ang) * R, y = cy + Math.sin(ang) * R * Math.cos(62 * Math.PI / 180) * 1.0; const depth = (Math.sin(ang) + 1) / 2; el.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%) scale(${.82 + depth * .3})`; el.style.opacity = .55 + depth * .45; el.style.zIndex = depth > .5 ? 5 : 2; });
    $$('.ring', box).forEach((r, k) => { r.style.width = r.style.height = radii[k] * 2 * sc + 'px'; });
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

/* ===== market UI ===== */
let mainChart, mainSeries, maS1, maS2, volS, curSym = 'BTCUSDT', curTf = 3600, curBars = [], showMA = true, showVol = false, curCat = 'crypto';
const chartOpts = el => ({ width: el.clientWidth, height: el.clientHeight, layout: { background: { color: '#ffffff' }, textColor: '#73736d', fontFamily: 'Vazirmatn, sans-serif' }, grid: { vertLines: { color: '#f1f1ee' }, horzLines: { color: '#f1f1ee' } }, rightPriceScale: { borderColor: '#e6e6e2' }, timeScale: { borderColor: '#e6e6e2', timeVisible: true }, crosshair: { mode: 1 } });
const candleOpts = () => ({ upColor: UP, downColor: DOWN, borderVisible: false, wickUpColor: UP, wickDownColor: DOWN });
function sma(bars, n) { const o = []; let s = 0; bars.forEach((b, i) => { s += b.close; if (i >= n) s -= bars[i - n].close; if (i >= n - 1) o.push({ time: b.time, value: s / n }); }); return o; }
function initChart() {
  if (!window.LightweightCharts) { $('#chart').innerHTML = '<p class="empty">نمودار بارگذاری نشد.</p>'; return; }
  const el = $('#chart'); mainChart = LightweightCharts.createChart(el, chartOpts(el));
  mainSeries = mainChart.addCandlestickSeries(candleOpts());
  maS1 = mainChart.addLineSeries({ color: '#a8863f', lineWidth: 1.5, priceLineVisible: false, lastValueVisible: false });
  maS2 = mainChart.addLineSeries({ color: '#000', lineWidth: 1.2, priceLineVisible: false, lastValueVisible: false });
  volS = mainChart.addHistogramSeries({ priceFormat: { type: 'volume' }, priceScaleId: 'v', visible: false });
  mainChart.priceScale('v').applyOptions({ scaleMargins: { top: .8, bottom: 0 } });
  new ResizeObserver(() => mainChart.applyOptions({ width: el.clientWidth })).observe(el);
  loadChart();
}
function loadChart() {
  if (!mainChart) return;
  curBars = history(curSym, curTf);
  const d = M[curSym].d; mainSeries.applyOptions({ priceFormat: { type: 'price', precision: d, minMove: 1 / 10 ** d } });
  mainSeries.setData(curBars); maS1.setData(sma(curBars, 20)); maS2.setData(sma(curBars, 50)); volS.setData(curBars.map(b => ({ time: b.time, value: b.value, color: b.color })));
  maS1.applyOptions({ visible: showMA }); maS2.applyOptions({ visible: showMA }); volS.applyOptions({ visible: showVol });
  mainChart.timeScale().setVisibleLogicalRange({ from: curBars.length - 110, to: curBars.length + 4 });
  $('#cSym').textContent = nice(curSym); updChartHead();
  $$('#mktTbl tbody tr').forEach(tr => tr.classList.toggle('sel', tr.dataset.s === curSym));
}
function updChartHead() { const c = chg(curSym); $('#cPrice').textContent = fp(curSym); const b = $('#cChg'); b.textContent = pct(c); b.className = 'badge ' + (c >= 0 ? 'up' : 'down'); }
listeners.add(() => {
  if (!mainSeries || !curBars.length) return;
  const last = { ...curBars[curBars.length - 1] }; const p = M[curSym].price;
  last.close = p; last.high = Math.max(last.high, p); last.low = Math.min(last.low, p); curBars[curBars.length - 1] = last; mainSeries.update(last); updChartHead();
});
$('#tfSeg').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; curTf = +b.dataset.tf; $$('#tfSeg button').forEach(x => x.setAttribute('aria-pressed', x === b)); loadChart(); });
$('#indSeg').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; if (b.dataset.ind === 'ma') showMA = !showMA; else showVol = !showVol; b.setAttribute('aria-pressed', b.dataset.ind === 'ma' ? showMA : showVol); loadChart(); });
const TILES = ['BTCUSDT', 'XAUUSD', 'EURUSD', 'US500'];
function renderTiles() {
  $('#mktTiles').innerHTML = TILES.map(s => `<button class="tile" data-s="${s}"><span class="s">${nice(s)}</span><canvas></canvas><span class="p ltr" style="text-align:start">${fp(s)}</span><span class="n">${M[s].n} · <span class="c"></span></span></button>`).join('');
  $$('#mktTiles .tile').forEach(t => t.addEventListener('click', () => { curSym = t.dataset.s; loadChart(); $('#chart').scrollIntoView({ behavior: 'smooth', block: 'center' }); }));
  updTiles();
}
function updTiles() { $$('#mktTiles .tile').forEach(t => { const s = t.dataset.s, c = chg(s); t.querySelector('.p').textContent = fp(s); const ce = t.querySelector('.c'); ce.textContent = pct(c); ce.className = 'c ' + (c >= 0 ? 'up' : 'down'); sparkDraw(t.querySelector('canvas'), M[s].spark, c >= 0 ? UP : DOWN); }); }
listeners.add(updTiles);
function renderTable() {
  const rows = SYMS.filter(x => x.c === curCat);
  $('#mktTbl tbody').innerHTML = rows.map(x => { const c = chg(x.s); return `<tr data-s="${x.s}" class="${x.s === curSym ? 'sel' : ''}"><td><div class="sym-cell"><span class="sym-ic">${x.s.slice(0, 3)}</span><div><b>${nice(x.s)}</b><small>${x.n}</small></div></div></td><td class="ltr p" style="text-align:right">${fp(x.s)}</td><td><span class="badge ${c >= 0 ? 'up' : 'down'} c">${pct(c)}</span></td><td><canvas style="width:70px;height:28px"></canvas></td></tr>`; }).join('');
  $$('#mktTbl tbody tr').forEach(tr => { tr.addEventListener('click', () => { curSym = tr.dataset.s; loadChart(); }); sparkDraw(tr.querySelector('canvas'), M[tr.dataset.s].spark, chg(tr.dataset.s) >= 0 ? UP : DOWN); });
}
listeners.add(() => { $$('#mktTbl tbody tr').forEach(tr => { const s = tr.dataset.s; const pe = tr.querySelector('.p'); const nv = fp(s); if (pe.textContent !== nv) { const up = M[s].price >= (+pe.dataset.v || 0); pe.textContent = nv; pe.dataset.v = M[s].price; pe.classList.remove('flash-up', 'flash-down'); void pe.offsetWidth; pe.classList.add(up ? 'flash-up' : 'flash-down'); } const c = chg(s), ce = tr.querySelector('.c'); ce.textContent = pct(c); ce.className = 'badge c ' + (c >= 0 ? 'up' : 'down'); }); });
$('#catSeg').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; curCat = b.dataset.cat; $$('#catSeg button').forEach(x => x.setAttribute('aria-pressed', x === b)); renderTable(); });
function renderHeat() {
  const cr = SYMS.filter(x => x.c === 'crypto').sort((a, b) => b.cap - a.cap);
  const span = cap => cap > 1000 ? 'grid-column:span 3;grid-row:span 2' : cap > 300 ? 'grid-column:span 2;grid-row:span 2' : cap > 60 ? 'grid-column:span 1;grid-row:span 1' : '';
  const col = c => { const k = Math.min(1, Math.abs(c) / 4); return c >= 0 ? `rgba(11,138,76,${.45 + k * .55})` : `rgba(209,55,45,${.45 + k * .55})`; };
  $('#heat').innerHTML = cr.map(x => { const c = chg(x.s); return `<div style="${span(x.cap)};background:${col(c)}">${x.s.replace('USDT', '')}<span>${(c >= 0 ? '+' : '') + c.toFixed(2)}%</span></div>`; }).join('');
}
setInterval(renderHeat, 5000);
function renderGauge(v = 62) {
  const lbl = v < 25 ? 'ترس شدید' : v < 45 ? 'ترس' : v < 55 ? 'خنثی' : v < 75 ? 'طمع' : 'طمع شدید';
  const a = Math.PI * (1 - v / 100); const x = 100 + Math.cos(a) * 72, y = 100 - Math.sin(a) * 72;
  const seg = (f, t, c) => { const a1 = Math.PI * (1 - f / 100), a2 = Math.PI * (1 - t / 100); return `<path d="M${100 + Math.cos(a1) * 84} ${100 - Math.sin(a1) * 84} A84 84 0 0 1 ${100 + Math.cos(a2) * 84} ${100 - Math.sin(a2) * 84}" stroke="${c}" stroke-width="14" fill="none"/>`; };
  $('#gauge').innerHTML = `<svg viewBox="0 0 200 116" width="230" role="img" aria-label="شاخص ترس و طمع ${v}">${seg(0, 24, '#d1372d')}${seg(25, 44, '#e9967a')}${seg(45, 54, '#cfcfca')}${seg(55, 74, '#7cc49b')}${seg(75, 100, '#0b8a4c')}<line x1="100" y1="100" x2="${x}" y2="${y}" stroke="#000" stroke-width="3" stroke-linecap="round"/><circle cx="100" cy="100" r="6" fill="#000"/></svg><b>${faNum(v)}</b><span class="badge up">${lbl}</span><span style="color:var(--muted);font-size:13px">دیروز ${faNum(58)} · هفته قبل ${faNum(47)}</span>`;
}
const SESS = [{ n: 'سیدنی', o: 21, c: 6 }, { n: 'توکیو', o: 0, c: 9 }, { n: 'لندن', o: 8, c: 17 }, { n: 'نیویورک', o: 13, c: 22 }];
function renderSess() {
  const d = new Date(); const u = d.getUTCHours() + d.getUTCMinutes() / 60;
  const isOn = s => s.o < s.c ? (u >= s.o && u < s.c) : (u >= s.o || u < s.c);
  const teh = new Intl.DateTimeFormat('fa-IR', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tehran' }).format(d);
  $('#nowClock').textContent = 'تهران ' + teh;
  const bar = s => s.o < s.c ? `<i class="${isOn(s) ? 'on' : ''}" style="left:${s.o / 24 * 100}%;width:${(s.c - s.o) / 24 * 100}%"></i>` : `<i class="${isOn(s) ? 'on' : ''}" style="left:${s.o / 24 * 100}%;width:${(24 - s.o) / 24 * 100}%"></i><i class="${isOn(s) ? 'on' : ''}" style="left:0;width:${s.c / 24 * 100}%"></i>`;
  $('#sess').innerHTML = SESS.map(s => `<div class="sess-row"><span>${s.n}</span><div class="sess-bar" style="direction:ltr">${bar(s)}<span class="sess-now" style="left:${u / 24 * 100}%"></span></div><span class="badge ${isOn(s) ? 'up' : 'mute'}">${isOn(s) ? 'باز' : 'بسته'}</span></div>`).join('') + `<p style="font-size:12.5px;color:var(--muted);margin-top:6px">نوار هر سشن ساعت کاری آن را در شبانه‌روز (UTC) نشان می‌دهد؛ خط قرمز زمان فعلی است. همپوشانی لندن و نیویورک پرنوسان‌ترین ساعت‌هاست.</p>`;
}
setInterval(renderSess, 30000);
const CAL = [
  { d: 0, t: '۱۷:۰۰', cur: 'USD', e: 'شاخص قیمت مصرف‌کننده (CPI) سالانه', i: 3, f: '۲٫۹٪', p: '۳٫۰٪' },
  { d: 0, t: '۱۸:۳۰', cur: 'USD', e: 'سخنرانی رئیس فدرال رزرو', i: 3, f: '—', p: '—' },
  { d: 1, t: '۱۶:۴۵', cur: 'EUR', e: 'تصمیم نرخ بهره بانک مرکزی اروپا', i: 3, f: '۲٫۰۰٪', p: '۲٫۰۰٪' },
  { d: 1, t: '۱۷:۰۰', cur: 'USD', e: 'مدعیان بیمه بیکاری هفتگی', i: 2, f: '۲۲۴K', p: '۲۲۱K' },
  { d: 2, t: '۱۰:۳۰', cur: 'GBP', e: 'تولید ناخالص داخلی فصلی', i: 2, f: '۰٫۳٪', p: '۰٫۲٪' },
  { d: 3, t: '۰۳:۳۰', cur: 'JPY', e: 'شاخص مدیران خرید (PMI) خدمات', i: 1, f: '۵۲٫۱', p: '۵۱٫۸' },
  { d: 4, t: '۱۷:۰۰', cur: 'USD', e: 'گزارش اشتغال غیرکشاورزی (NFP)', i: 3, f: '۱۴۵K', p: '۱۳۰K' },
];
function renderCal() { const base = new Date(); $('#calTbl tbody').innerHTML = CAL.map(c => { const d = new Date(base.getTime() + c.d * 86400e3); return `<tr><td>${faDate(d, { weekday: 'short', day: 'numeric', month: 'short' })} · ${c.t}</td><td><b class="ltr">${c.cur}</b></td><td>${c.e}</td><td><span class="imp" aria-label="اهمیت ${c.i} از ۳">${[1, 2, 3].map(k => `<i class="${k <= c.i ? 'on' : ''}"></i>`).join('')}</span></td><td>${c.f}</td><td style="color:var(--muted)">${c.p}</td></tr>`; }).join(''); }

/* ===== signals ===== */
const DEMO_SIG = [
  { id: 's1', m: 'forex', sym: 'EURUSD', side: 'buy', e1: 1.1595, e2: 1.1605, sl: 1.1560, tp: [1.1640, 1.1680, 1.1720], st: 'active', at: now - 1.5 * H, conf: 'بالا' },
  { id: 's2', m: 'gold', sym: 'XAUUSD', side: 'buy', e1: 4035, e2: 4045, sl: 4005, tp: [4080, 4120, 4180], st: 'tp1', at: now - 4 * H, conf: 'بالا' },
  { id: 's3', m: 'crypto', sym: 'BTCUSDT', side: 'buy', e1: 94800, e2: 95400, sl: 92900, tp: [97800, 99500, 102000], st: 'active', at: now - 3 * H, conf: 'متوسط' },
  { id: 's4', m: 'forex', sym: 'GBPJPY', side: 'sell', e1: 203.40, e2: 203.70, sl: 204.40, tp: [202.40, 201.60, 200.80], st: 'tp1', at: now - 7 * H, conf: 'متوسط' },
  { id: 's5', m: 'crypto', sym: 'ETHUSDT', side: 'buy', e1: 3360, e2: 3390, sl: 3280, tp: [3500, 3620, 3780], st: 'active', at: now - 2 * H, vip: true, conf: 'بالا' },
  { id: 's6', m: 'forex', sym: 'USDCAD', side: 'sell', e1: 1.4005, e2: 1.4015, sl: 1.4060, tp: [1.3960, 1.3920, 1.3870], st: 'pending', at: now - .5 * H, conf: 'متوسط' },
  { id: 's7', m: 'crypto', sym: 'SOLUSDT', side: 'sell', e1: 188, e2: 190, sl: 195, tp: [178, 170, 162], st: 'pending', at: now - 1 * H, vip: true, conf: 'متوسط' },
  { id: 's8', m: 'crypto', sym: 'TONUSDT', side: 'buy', e1: 5.00, e2: 5.08, sl: 4.78, tp: [5.40, 5.75, 6.20], st: 'active', at: now - 9 * H, vip: true, conf: 'بالا' },
];
const HIST = [
  ['XAUUSD', 'buy', 3985, 4062, '+۷۷۰ پیپ', 1], ['EURUSD', 'sell', 1.1688, 1.1642, '+۴۶ پیپ', 1], ['BTCUSDT', 'buy', 91200, 94850, '+۴٫۰٪', 1], ['GBPUSD', 'buy', 1.3290, 1.3262, '−۲۸ پیپ', 0], ['ETHUSDT', 'buy', 3210, 3395, '+۵٫۸٪', 1], ['USDJPY', 'sell', 153.10, 152.35, '+۷۵ پیپ', 1], ['SOLUSDT', 'buy', 176, 171.6, '−۲٫۵٪', 0], ['AUDUSD', 'buy', 0.6545, 0.6581, '+۳۶ پیپ', 1],
];
let sigFilter = 'all';
const ST = { active: ['فعال', 'up'], tp1: ['تارگت ۱ خورد', 'up'], tp2: ['تارگت ۲ خورد', 'up'], pending: ['در انتظار ورود', 'mute'], closed: ['بسته شد', 'mute'], sl: ['حد ضرر خورد', 'down'] };
const allSignals = () => [...SHARED.signals, ...DEMO_SIG];
const unlocked = () => !!ME.profile?.loggedIn;
function dec(sym) { return M[sym]?.d ?? 2; }
function sigCard(x) {
  const d = Math.min(dec(x.sym), 5); const buy = x.side === 'buy'; const st = ST[x.st] || ST.active;
  const p = M[x.sym]?.price ?? x.e1; const lo = buy ? x.sl : x.tp[0], hi = buy ? x.tp[0] : x.sl;
  let k = (p - lo) / (hi - lo); k = Math.max(0.02, Math.min(.98, k)); const pos = buy ? k : 1 - k;
  const lock = x.vip && !unlocked();
  return `<article class="sig" data-id="${esc(x.id)}">
    <div class="sig-h"><div><b>${esc(nice(x.sym))}</b><small>${CAT_FA[x.m] || ''} · ${ago(x.at)}${x.vip ? ' · VIP' : ''}${x.live ? ' · تازه' : ''}</small></div><span class="side ${buy ? 'buy' : 'sell'}">${buy ? 'خرید' : 'فروش'}</span></div>
    <div class="lv"><div><span>ورود</span><b style="font-size:${x.e2 ? '12px' : '14px'}">${enNum(x.e1, d)}${x.e2 ? '<br>' + enNum(x.e2, d) : ''}</b></div><div class="sl"><span>حد ضرر</span><b>${enNum(x.sl, d)}</b></div><div class="tp"><span>تارگت ۱</span><b>${enNum(x.tp[0], d)}</b></div><div class="tp"><span>تارگت ۲</span><b>${enNum(x.tp[1], d)}</b></div><div class="tp"><span>تارگت ۳</span><b>${enNum(x.tp[2], d)}</b></div><div><span>ریسک به ریوارد</span><b>1 : ${(Math.abs(x.tp[1] - x.e1) / Math.abs(x.e1 - x.sl)).toFixed(1)}</b></div></div>
    <div><div class="prog"><i style="left:${(buy ? pos : pos) * 100}%"></i></div><div class="prog-l"><span>${buy ? 'SL' : 'TP1'}</span><span class="cur">${fp(x.sym, p)}</span><span>${buy ? 'TP1' : 'SL'}</span></div></div>
    <div class="sig-f"><span class="badge ${st[1]}">${st[0]}</span><span>اطمینان: ${esc(x.conf || 'متوسط')}</span></div>
    ${lock ? `<div class="lock"><div><b>سیگنال VIP</b><p>برای دیدن جزئیات وارد حساب شو.</p><a class="btn sm" data-go="login">ورود و باز کردن سیگنال</a></div></div>` : ''}
  </article>`;
}
function renderSignals() {
  const list = allSignals().filter(x => sigFilter === 'all' || x.m === sigFilter);
  $('#sigGrid').innerHTML = list.length ? list.map(sigCard).join('') : '<p class="empty">سیگنالی در این بازار باز نیست.</p>';
}
listeners.add(() => { $$('#sigGrid .sig').forEach(el => { const x = allSignals().find(s => s.id === el.dataset.id); if (!x || !M[x.sym]) return; const buy = x.side === 'buy'; const p = M[x.sym].price; const lo = buy ? x.sl : x.tp[0], hi = buy ? x.tp[0] : x.sl; let k = (p - lo) / (hi - lo); k = Math.max(.02, Math.min(.98, k)); el.querySelector('.prog i').style.left = (buy ? k : 1 - k) * 100 + '%'; el.querySelector('.cur').textContent = fp(x.sym, p); }); });
$('#sigFilters').addEventListener('click', e => { const c = e.target.closest('.chip'); if (!c) return; sigFilter = c.dataset.f; $$('#sigFilters .chip').forEach(x => x.setAttribute('aria-pressed', x === c)); renderSignals(); });
function renderHist() { $('#histTbl tbody').innerHTML = HIST.map((h, i) => { const d = new Date(Date.now() - (i + 1) * 86400e3 * 1.6); const dd = dec(h[0]); return `<tr><td>${faDate(d)}</td><td><b class="ltr">${nice(h[0])}</b></td><td><span class="side ${h[1]}" style="font-size:12px;padding:2px 9px">${h[1] === 'buy' ? 'خرید' : 'فروش'}</span></td><td class="ltr" style="text-align:right">${enNum(h[2], dd)}</td><td class="ltr" style="text-align:right">${enNum(h[3], dd)}</td><td><span class="badge ${h[5] ? 'up' : 'down'}">${h[4]}</span></td></tr>`; }).join(''); }
function renderPerf() {
  const cv = $('#perfChart'); const v = [4.2, 6.8, -1.9, 5.1, 7.4, 3.2, -2.6, 8.1, 4.9, 6.3, 2.7, 5.6]; const lab = ['آبان', 'آذر', 'دی', 'بهمن', 'اسفند', 'فرو', 'ارد', 'خرد', 'تیر', 'مرد', 'شهر', 'مهر'];
  const dpr = devicePixelRatio || 1, w = cv.clientWidth, h = 70; cv.width = w * dpr; cv.height = h * dpr; const g = cv.getContext('2d'); g.scale(dpr, dpr);
  const mx = 9, zero = 44, bw = w / v.length;
  g.strokeStyle = '#e6e6e2'; g.beginPath(); g.moveTo(0, zero); g.lineTo(w, zero); g.stroke();
  v.forEach((x, i) => { const bh = Math.abs(x) / mx * 38; g.fillStyle = x >= 0 ? UP : DOWN; const X = w - (i + 1) * bw + bw * .2; g.beginPath(); g.roundRect ? g.roundRect(X, x >= 0 ? zero - bh : zero, bw * .6, bh, 3) : g.rect(X, x >= 0 ? zero - bh : zero, bw * .6, bh); g.fill(); g.fillStyle = '#73736d'; g.font = '10px Vazirmatn'; g.textAlign = 'center'; g.fillText(lab[i], X + bw * .3, 66); });
}

/* ===== tools ===== */
let curTool = 'size';
const TOOLS = {
  size: () => ({
    form: `<div class="field"><label for="t_bal">موجودی حساب (دلار)</label><input class="inp ltr" id="t_bal" type="number" value="5000" min="0"></div>
      <div class="row2"><div class="field"><label for="t_risk">ریسک هر معامله (٪)</label><input class="inp ltr" id="t_risk" type="number" value="1" step="0.1" min="0"></div>
      <div class="field"><label for="t_sl">فاصله حد ضرر (پیپ)</label><input class="inp ltr" id="t_sl" type="number" value="35" min="0"></div></div>
      <div class="field"><label for="t_pair">نماد</label><select class="inp" id="t_pair"><option value="10">EUR/USD، GBP/USD و جفت‌های .../USD</option><option value="jpy">USD/JPY و جفت‌های ین</option><option value="gold">XAU/USD طلا (هر پیپ ۰٫۱ دلار)</option></select><span class="hint">ارزش هر پیپ برای یک لات استاندارد محاسبه می‌شود.</span></div>`,
    calc() { const bal = +$('#t_bal').value, r = +$('#t_risk').value, sl = +$('#t_sl').value, pr = $('#t_pair').value; const pv = pr === 'jpy' ? 1000 / M.USDJPY.price : 10; const risk = bal * r / 100; const lot = sl > 0 ? risk / (sl * pv) : 0; return { big: enNum(lot, 2) + ' lot', lbl: 'حجم پیشنهادی معامله', rows: [['مبلغ در معرض ریسک', '$' + enNum(risk, 2)], ['ارزش هر پیپ در این حجم', '$' + enNum(lot * pv, 2)], ['میکرو لات', enNum(lot * 100, 0)], ['ارزش هر پیپ (۱ لات)', '$' + enNum(pv, 2)]] }; }
  }),
  fut: () => ({
    form: `<div class="seg" id="t_dir" role="group" aria-label="جهت"><button data-v="long" aria-pressed="true">لانگ</button><button data-v="short" aria-pressed="false">شورت</button></div>
      <div class="row2"><div class="field"><label for="t_en">قیمت ورود</label><input class="inp ltr" id="t_en" type="number" value="95000"></div><div class="field"><label for="t_fsl">حد ضرر</label><input class="inp ltr" id="t_fsl" type="number" value="93100"></div></div>
      <div class="row2"><div class="field"><label for="t_fbal">موجودی (USDT)</label><input class="inp ltr" id="t_fbal" type="number" value="2000"></div><div class="field"><label for="t_frisk">ریسک (٪)</label><input class="inp ltr" id="t_frisk" type="number" value="1.5" step="0.1"></div></div>
      <div class="field"><label for="t_lev">اهرم: <span id="t_levv">10</span>x</label><input id="t_lev" type="range" min="1" max="50" value="10" style="accent-color:#000"></div>`,
    calc() { const L = $('#t_dir [aria-pressed="true"]').dataset.v === 'long'; const en = +$('#t_en').value, sl = +$('#t_fsl').value, bal = +$('#t_fbal').value, r = +$('#t_frisk').value, lev = +$('#t_lev').value; $('#t_levv').textContent = lev; const dist = Math.abs(en - sl) / en; const risk = bal * r / 100; const size = dist > 0 ? risk / dist : 0; const margin = size / lev; const liq = L ? en * (1 - 1 / lev * .995) : en * (1 + 1 / lev * .995); const bad = L ? liq >= sl : liq <= sl; return { big: '$' + enNum(size, 0), lbl: 'اندازه پوزیشن (ارزش کل)', rows: [['مارجین لازم', '$' + enNum(margin, 2)], ['مبلغ ریسک', '$' + enNum(risk, 2)], ['فاصله تا حد ضرر', enNum(dist * 100, 2) + '%'], ['قیمت تقریبی لیکویید', enNum(liq, 1)]], warn: bad ? 'هشدار: قیمت لیکویید قبل از حد ضرر است. اهرم را کم کن.' : (margin > bal ? 'مارجین لازم از موجودی بیشتر است.' : '') }; }
  }),
  rr: () => ({
    form: `<div class="field"><label for="t_e">قیمت ورود</label><input class="inp ltr" id="t_e" type="number" value="4040"></div><div class="row2"><div class="field"><label for="t_s">حد ضرر</label><input class="inp ltr" id="t_s" type="number" value="4005"></div><div class="field"><label for="t_t">تارگت</label><input class="inp ltr" id="t_t" type="number" value="4120"></div></div>`,
    calc() { const e = +$('#t_e').value, s = +$('#t_s').value, t = +$('#t_t').value; const risk = Math.abs(e - s), rew = Math.abs(t - e); const rr = risk ? rew / risk : 0; const be = 1 / (1 + rr) * 100; return { big: '1 : ' + enNum(rr, 2), lbl: 'نسبت ریسک به ریوارد', rows: [['ریسک (فاصله تا حد ضرر)', enNum(risk, 2)], ['ریوارد (فاصله تا تارگت)', enNum(rew, 2)], ['حداقل نرخ برد برای سربه‌سر', enNum(be, 1) + '%']], warn: rr && rr < 1.5 ? 'نسبت زیر ۱٫۵ برای بیشتر سبک‌ها ضعیف است.' : '' }; }
  }),
  comp: () => ({
    form: `<div class="field"><label for="t_c0">سرمایه اولیه (دلار)</label><input class="inp ltr" id="t_c0" type="number" value="1000"></div><div class="row2"><div class="field"><label for="t_cr">سود ماهانه (٪)</label><input class="inp ltr" id="t_cr" type="number" value="4" step="0.5"></div><div class="field"><label for="t_cm">تعداد ماه</label><input class="inp ltr" id="t_cm" type="number" value="24" min="1" max="120"></div></div><div class="field"><label for="t_cadd">واریز ماهانه (دلار)</label><input class="inp ltr" id="t_cadd" type="number" value="100"></div>`,
    calc() { const c0 = +$('#t_c0').value, r = +$('#t_cr').value / 100, m = Math.min(120, +$('#t_cm').value), add = +$('#t_cadd').value; let v = c0; const pts = [v]; for (let i = 0; i < m; i++) { v = v * (1 + r) + add; pts.push(v); } const dep = c0 + add * m; return { big: '$' + enNum(v, 0), lbl: `ارزش حساب پس از ${faNum(m)} ماه`, rows: [['مجموع واریزی', '$' + enNum(dep, 0)], ['سود مرکب', '$' + enNum(v - dep, 0)]], pts, warn: 'سود ثابت ماهانه در بازار واقعی وجود ندارد؛ این فقط قدرت ترکیب را نشان می‌دهد.' }; }
  }),
};
function renderTool() {
  const T = TOOLS[curTool](); const body = $('#toolBody');
  body.innerHTML = `<form class="form" id="toolForm" onsubmit="return false">${T.form}</form><div class="result" id="toolRes" aria-live="polite"></div>`;
  const upd = () => { let r; try { r = T.calc(); } catch { return; } $('#toolRes').innerHTML = `<div><div class="lbl">${r.lbl}</div><div class="big ltr" style="text-align:right">${r.big}</div></div><div class="rows">${r.rows.map(x => `<div><span>${x[0]}</span><b class="ltr">${x[1]}</b></div>`).join('')}</div>${r.pts ? '<canvas id="compCv"></canvas>' : ''}${r.warn ? `<div style="font-size:13px;color:#f3c8c4">${r.warn}</div>` : ''}`; if (r.pts) { const cv = $('#compCv'); sparkDraw(cv, r.pts, '#a8863f'); } };
  body.addEventListener('input', upd);
  $('#t_dir')?.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; $$('#t_dir button').forEach(x => x.setAttribute('aria-pressed', x === b)); if (b.dataset.v === 'short') { $('#t_fsl').value = 96900; } else { $('#t_fsl').value = 93100; } upd(); });
  upd();
}
$('.tool-nav').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; curTool = b.dataset.tool; $$('.tool-nav button').forEach(x => x.setAttribute('aria-selected', x === b)); renderTool(); });

/* ===== academy + plans ===== */
const COURSES = [
  { id: 'c1', t: 'مسیر صفر تا معامله‌گر', lvl: 'مقدماتی', s: 42, h: 28, p: '۴٫۹ میلیون تومان', ph: 'IMG_2097', d: 'از مفاهیم پایه تا اولین معامله‌ی برنامه‌ریزی‌شده روی حساب دمو.' },
  { id: 'c2', t: 'پرایس اکشن و ساختار بازار', lvl: 'متوسط', s: 36, h: 24, p: '۶٫۵ میلیون تومان', ph: 'IMG_2551', d: 'سطوح عرضه و تقاضا، شکست ساختار، ورود دقیق و مدیریت پوزیشن.' },
  { id: 'c3', t: 'مدیریت سرمایه و روانشناسی', lvl: 'همه سطوح', s: 18, h: 11, p: '۲٫۹ میلیون تومان', ph: 'IMG_1121', d: 'حجم معامله، ژورنال‌نویسی، کنترل هیجان و ساختن برنامه معاملاتی.' },
  { id: 'c4', t: 'کریپتو، فیوچرز و آن‌چین', lvl: 'پیشرفته', s: 30, h: 21, p: '۷٫۸ میلیون تومان', ph: 'IMG_1213', d: 'معاملات فیوچرز با اهرم کنترل‌شده، فاندینگ و تحلیل داده‌های آن‌چین.' },
];
function renderCourses() { $('#courses').innerHTML = COURSES.map(c => `<article class="course"><div class="cv"><img src="img/${c.ph}.jpg" alt="" loading="lazy" style="object-position:50% 30%"><span class="badge ${c.lvl === 'پیشرفته' ? 'dark' : 'brass'} lvl">${c.lvl}</span></div><div class="bd"><h3>${c.t}</h3><p style="color:var(--muted);font-size:14px">${c.d}</p><ul><li>${faNum(c.s)} جلسه</li><li>${faNum(c.h)} ساعت</li><li>گواهی پایان دوره</li></ul><div class="ft"><b>${c.p}</b><button class="btn sm" data-go="login">ثبت‌نام</button></div></div></article>`).join(''); }
let bill = 'm';
const PLANS = [
  { n: 'رایگان', m: 0, f: ['تحلیل‌های عمومی هفتگی', 'داده بازار و تقویم اقتصادی', 'همه‌ی ابزارهای مدیریت ریسک', 'دستیار هوشمند آموزشی'], cta: 'ساخت حساب رایگان' },
  { n: 'حرفه‌ای', m: 1490000, f: ['سیگنال‌های فارکس و طلا', 'تحلیل روزانه با سطوح دقیق', 'هشدار قیمت و اعلان سیگنال', 'ژورنال معاملات و گزارش عملکرد'], cta: 'شروع اشتراک حرفه‌ای', pro: true },
  { n: 'VIP', m: 3900000, f: ['همه‌ی امکانات حرفه‌ای', 'سیگنال‌های VIP کریپتو', 'لایو هفتگی تحلیل بازار با شاهین', 'جلسه‌ی یک‌به‌یک ماهانه'], cta: 'عضویت VIP' },
];
function renderPlans() { $('#plansGrid').innerHTML = PLANS.map(p => { const v = bill === 'm' ? p.m : Math.round(p.m * 12 * .8 / 1000) * 1000; return `<div class="plan${p.pro ? ' pro' : ''}"><div style="display:flex;justify-content:space-between;align-items:center"><h3>${p.n}</h3>${p.pro ? '<span class="badge brass">محبوب‌ترین</span>' : ''}</div><div class="price">${v ? faNum(v) : 'رایگان'} ${v ? `<small>تومان / ${bill === 'm' ? 'ماه' : 'سال'}</small>` : ''}</div><ul>${p.f.map(x => `<li>${x}</li>`).join('')}</ul><button class="btn${p.pro ? '' : ' light'}" data-go="login">${p.cta}</button></div>`; }).join(''); }
$('#billSeg').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; bill = b.dataset.b; $$('#billSeg button').forEach(x => x.setAttribute('aria-pressed', x === b)); renderPlans(); });

/* ===== contact ===== */
$('#contactForm').addEventListener('submit', async e => {
  e.preventDefault(); const n = $('#cName').value.trim(), m = $('#cMsg').value.trim(), ph = $('#cPhone').value.trim();
  $('#cName').classList.toggle('err', !n); $('#cMsg').classList.toggle('err', !m);
  if (!n || !m) { $('#cErr').textContent = 'نام و متن پیام را وارد کن.'; return; }
  if (ph && !/^(\+98|0)?9\d{9}$/.test(ph.replace(/\s/g, '').replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))) { $('#cErr').textContent = 'شماره موبایل را به شکل ۰۹۱۲۳۴۵۶۷۸۹ وارد کن.'; $('#cPhone').classList.add('err'); return; }
  $('#cErr').textContent = ''; $('#cPhone').classList.remove('err');
  const lead = { name: n, phone: ph, topic: $('#cTopic').value, msg: m, at: Date.now() };
  let saved = false;
  if (B.db && B.uid) { try { await B.db.doc('leads/' + B.uid).set(lead); saved = true; } catch { } }
  const all = ls.get('leads', []); all.unshift(lead); ls.set('leads', all.slice(0, 20));
  e.target.reset(); toast(saved ? 'پیامت ثبت شد. به‌زودی با تو تماس می‌گیریم.' : 'پیامت ثبت شد (در این دمو روی همین مرورگر ذخیره شد).');
});

/* ===== auth ===== */
let authSlide = 0;
function initAuthSide() { const s = $('#authSide'); s.insertAdjacentHTML('afterbegin', [1, 3, 5, 0].map((k, j) => `<img src="${img(PHOTOS[k])}" alt="" style="object-position:${PHOTOS[k].pos}" class="${j ? '' : 'on'}">`).join('')); const ims = $$('img', s); setInterval(() => { authSlide = (authSlide + 1) % ims.length; ims.forEach((m, j) => m.classList.toggle('on', j === authSlide)); }, 5000); }
const toEn = s => s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
let otpTimer = null, pendingPhone = '';
function renderAuth(mode) {
  clearInterval(otpTimer);
  const box = $('#authBox');
  const tabs = sel => `<div class="tabs" role="tablist"><button role="tab" aria-selected="${sel === 'phone'}" data-m="phone">ورود با موبایل</button><button role="tab" aria-selected="${sel === 'email'}" data-m="email">ورود با ایمیل</button></div>`;
  const social = `<div class="or">یا</div><button class="btn light block" data-act="google"><svg width="18" height="18" viewBox="0 0 48 48"><path fill="#4285F4" d="M45 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.7-2.1 5-4.4 6.6v5.5h7.1c4.2-3.9 6.5-9.6 6.5-16.1z"/><path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.4l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.2-9H4.5v5.7C8.1 41.1 15.5 46 24 46z"/><path fill="#FBBC05" d="M11.8 28.2c-.4-1.3-.7-2.7-.7-4.2s.3-2.9.7-4.2v-5.7H4.5C3 17.1 2 20.4 2 24s1 6.9 2.5 9.9l7.3-5.7z"/><path fill="#EA4335" d="M24 10.8c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.2 29.9 2 24 2 15.5 2 8.1 6.9 4.5 14.1l7.3 5.7c1.7-5.2 6.5-9 12.2-9z"/></svg>ورود با گوگل</button>
    <p style="text-align:center;margin-top:18px;font-size:14.5px">حساب نداری؟ <button class="link" data-m="register">ثبت‌نام کن</button></p>`;
  if (mode === 'phone') box.innerHTML = `<h1>خوش برگشتی</h1><p class="sub">برای ورود یا ساخت حساب، شماره موبایلت را وارد کن.</p>${tabs('phone')}
    <form class="form" id="phoneForm" novalidate><div class="field"><label for="aPhone">شماره موبایل</label><div class="phone"><span>+98</span><input id="aPhone" inputmode="tel" placeholder="912 345 6789" autocomplete="tel-national" maxlength="13"></div></div><div class="err-msg" id="aErr" role="alert"></div><button class="btn block" type="submit">دریافت کد تأیید</button></form>${social}`;
  else if (mode === 'otp') box.innerHTML = `<h1>کد تأیید</h1><p class="sub">کد ۵ رقمی ارسال‌شده به <b class="ltr">0${esc(pendingPhone)}</b> را وارد کن. <button class="link" data-m="phone">ویرایش شماره</button></p>
    <form class="form" id="otpForm" novalidate><div class="otp">${[0, 1, 2, 3, 4].map(i => `<input inputmode="numeric" maxlength="1" aria-label="رقم ${fa(i + 1)}" id="o${i}" autocomplete="${i ? 'off' : 'one-time-code'}">`).join('')}</div><div class="err-msg" id="aErr" role="alert" style="text-align:center"></div><button class="btn block" type="submit">تأیید و ورود</button><p style="text-align:center;font-size:14px;color:var(--muted)" id="otpT"></p></form>
    <div class="demo-hint">در این دمو پیامک ارسال نمی‌شود؛ کد آزمایشی <b>۱۲۳۴۵</b> است.</div>`;
  else if (mode === 'email') box.innerHTML = `<h1>خوش برگشتی</h1><p class="sub">با ایمیل و رمز عبورت وارد شو.</p>${tabs('email')}
    <form class="form" id="emailForm" novalidate><div class="field"><label for="aEmail">ایمیل</label><input class="inp ltr" id="aEmail" type="email" autocomplete="email" placeholder="you@example.com"></div>
    <div class="field"><label for="aPass">رمز عبور</label><div class="pw"><input class="inp ltr" id="aPass" type="password" autocomplete="current-password"><button type="button" data-act="eye">نمایش</button></div></div>
    <div style="display:flex;justify-content:space-between;align-items:center"><label class="check"><input type="checkbox" id="aRem" checked> مرا به خاطر بسپار</label><button type="button" class="link" data-m="forgot" style="font-size:14px">فراموشی رمز</button></div>
    <div class="err-msg" id="aErr" role="alert"></div><button class="btn block" type="submit">ورود به حساب</button></form>${social}`;
  else if (mode === 'register') box.innerHTML = `<h1>ساخت حساب</h1><p class="sub">کمتر از یک دقیقه طول می‌کشد. اشتراک رایگان بلافاصله فعال می‌شود.</p>
    <form class="form" id="regForm" novalidate><div class="field"><label for="rName">نام و نام خانوادگی</label><input class="inp" id="rName" autocomplete="name"></div>
    <div class="row2"><div class="field"><label for="rPhone">موبایل</label><input class="inp ltr" id="rPhone" inputmode="tel" placeholder="09123456789" autocomplete="tel"></div><div class="field"><label for="rEmail">ایمیل</label><input class="inp ltr" id="rEmail" type="email" autocomplete="email"></div></div>
    <div class="field"><label for="rPass">رمز عبور</label><div class="pw"><input class="inp ltr" id="rPass" type="password" autocomplete="new-password"><button type="button" data-act="eye">نمایش</button></div><div class="meter" id="meter"><i></i><i></i><i></i><i></i></div><span class="hint" id="meterT">حداقل ۸ کاراکتر، شامل عدد و حرف بزرگ.</span></div>
    <div class="field"><label for="rLevel">سطح تجربه</label><select class="inp" id="rLevel"><option>تازه‌کار</option><option>کمتر از ۲ سال</option><option>حرفه‌ای</option></select></div>
    <label class="check"><input type="checkbox" id="rTerms"> قوانین و هشدار ریسک را خواندم و می‌پذیرم.</label>
    <div class="err-msg" id="aErr" role="alert"></div><button class="btn block" type="submit">ساخت حساب</button></form>
    <p style="text-align:center;margin-top:18px;font-size:14.5px">حساب داری؟ <button class="link" data-m="phone">وارد شو</button></p>`;
  else if (mode === 'forgot') box.innerHTML = `<h1>بازیابی رمز عبور</h1><p class="sub">ایمیلت را وارد کن تا لینک تعیین رمز جدید برایت ارسال شود.</p>
    <form class="form" id="forgotForm" novalidate><div class="field"><label for="fEmail">ایمیل</label><input class="inp ltr" id="fEmail" type="email"></div><div class="err-msg" id="aErr" role="alert"></div><button class="btn block" type="submit">ارسال لینک بازیابی</button></form>
    <p style="text-align:center;margin-top:18px"><button class="link" data-m="email">بازگشت به ورود</button></p>`;
  box.querySelectorAll('[data-m]').forEach(b => b.addEventListener('click', () => renderAuth(b.dataset.m)));
  box.querySelectorAll('[data-act="eye"]').forEach(b => b.addEventListener('click', () => { const i = b.previousElementSibling; i.type = i.type === 'password' ? 'text' : 'password'; b.textContent = i.type === 'password' ? 'نمایش' : 'پنهان'; }));
  box.querySelector('[data-act="google"]')?.addEventListener('click', async () => { let name = 'کاربر گوگل'; try { if (B.user?.me) { const me = await B.user.me(); name = me?.name || name; } } catch { } completeLogin({ name, email: 'demo@gmail.com', via: 'گوگل' }); });
  const err = m => { const e = $('#aErr'); if (e) e.textContent = m; };
  if (mode === 'phone') { const pi = $('#aPhone'); pi.focus(); $('#phoneForm').addEventListener('submit', e => { e.preventDefault(); let v = toEn(pi.value).replace(/\D/g, ''); if (v.startsWith('98')) v = v.slice(2); if (v.startsWith('0')) v = v.slice(1); if (!/^9\d{9}$/.test(v)) { err('شماره باید ۱۰ رقم و با ۹ شروع شود؛ مثل ۹۱۲۳۴۵۶۷۸۹.'); pi.parentElement.style.borderColor = 'var(--down)'; return; } pendingPhone = v; renderAuth('otp'); toast('کد تأیید ارسال شد (دمو: ۱۲۳۴۵)'); }); }
  if (mode === 'otp') {
    const ins = $$('.otp input'); ins[0].focus();
    ins.forEach((inp, i) => { inp.addEventListener('input', () => { inp.value = toEn(inp.value).replace(/\D/g, '').slice(-1); if (inp.value && i < 4) ins[i + 1].focus(); if (ins.every(x => x.value)) $('#otpForm').requestSubmit(); }); inp.addEventListener('keydown', e => { if (e.key === 'Backspace' && !inp.value && i) ins[i - 1].focus(); }); inp.addEventListener('paste', e => { const t = toEn(e.clipboardData.getData('text')).replace(/\D/g, '').slice(0, 5); if (t.length) { e.preventDefault(); t.split('').forEach((c, k) => ins[k] && (ins[k].value = c)); ins[Math.min(4, t.length)].focus(); if (t.length === 5) $('#otpForm').requestSubmit(); } }); });
    let left = 119; const tick = () => { const el = $('#otpT'); if (!el) return clearInterval(otpTimer); if (left > 0) { el.textContent = `ارسال دوباره کد تا ${fa(Math.floor(left / 60))}:${fa(String(left % 60).padStart(2, '0'))}`; left--; } else { el.innerHTML = '<button type="button" class="link" id="resend">ارسال دوباره کد</button>'; $('#resend').onclick = () => { left = 119; toast('کد دوباره ارسال شد (دمو: ۱۲۳۴۵)'); }; } };
    tick(); otpTimer = setInterval(tick, 1000);
    $('#otpForm').addEventListener('submit', e => { e.preventDefault(); const code = ins.map(x => x.value).join(''); if (code !== '12345') { err('کد واردشده درست نیست. دوباره امتحان کن.'); ins.forEach(x => { x.value = ''; x.style.borderColor = 'var(--down)'; }); ins[0].focus(); return; } completeLogin({ phone: '0' + pendingPhone, via: 'موبایل' }); });
  }
  if (mode === 'email') $('#emailForm').addEventListener('submit', e => { e.preventDefault(); const em = $('#aEmail').value.trim(), pw = $('#aPass').value; if (!/^\S+@\S+\.\S+$/.test(em)) { err('ایمیل معتبر نیست.'); $('#aEmail').classList.add('err'); return; } if (pw.length < 6) { err('رمز عبور حداقل ۶ کاراکتر است.'); $('#aPass').classList.add('err'); return; } completeLogin({ email: em, via: 'ایمیل' }); });
  if (mode === 'register') {
    const pw = $('#rPass'); pw.addEventListener('input', () => { const v = pw.value; const sc = (v.length >= 8) + /\d/.test(v) + /[A-Z]/.test(v) + /[^A-Za-z0-9]/.test(v); const cols = ['#d1372d', '#e9967a', '#a8863f', '#0b8a4c']; $$('#meter i').forEach((m, i) => m.style.background = i < sc ? cols[sc - 1] : ''); $('#meterT').textContent = ['خیلی ضعیف', 'ضعیف', 'متوسط', 'خوب', 'قوی'][sc] + (sc < 3 ? ' · عدد، حرف بزرگ و نماد اضافه کن.' : ''); });
    $('#regForm').addEventListener('submit', e => { e.preventDefault(); const n = $('#rName').value.trim(), ph = toEn($('#rPhone').value.trim()), em = $('#rEmail').value.trim(), p = pw.value; $$('#regForm .inp').forEach(i => i.classList.remove('err')); if (n.length < 3) { $('#rName').classList.add('err'); return err('نام کامل را وارد کن.'); } if (!/^09\d{9}$/.test(ph)) { $('#rPhone').classList.add('err'); return err('موبایل باید ۱۱ رقم و با ۰۹ شروع شود.'); } if (em && !/^\S+@\S+\.\S+$/.test(em)) { $('#rEmail').classList.add('err'); return err('ایمیل معتبر نیست.'); } if (p.length < 8) { pw.classList.add('err'); return err('رمز عبور حداقل ۸ کاراکتر است.'); } if (!$('#rTerms').checked) return err('برای ساخت حساب، پذیرش قوانین لازم است.'); completeLogin({ name: n, phone: ph, email: em, level: $('#rLevel').value, via: 'ثبت‌نام', isNew: true }); });
  }
  if (mode === 'forgot') $('#forgotForm').addEventListener('submit', e => { e.preventDefault(); const em = $('#fEmail').value.trim(); if (!/^\S+@\S+\.\S+$/.test(em)) return err('ایمیل معتبر نیست.'); $('#authBox').innerHTML = `<h1>ایمیل را بررسی کن</h1><p class="sub">اگر حسابی با <b class="ltr">${esc(em)}</b> وجود داشته باشد، لینک بازیابی تا چند دقیقه‌ی دیگر می‌رسد.</p><div class="demo-hint">در این دمو ایمیلی ارسال نمی‌شود.</div><button class="btn block" style="margin-top:18px" id="backLogin">بازگشت به ورود</button>`; $('#backLogin').onclick = () => renderAuth('email'); });
}
async function completeLogin(info) {
  const prev = ME.profile || {};
  ME.profile = { ...prev, name: info.name || prev.name || 'معامله‌گر', phone: info.phone || prev.phone || '', email: info.email || prev.email || '', level: info.level || prev.level || 'تازه‌کار', plan: prev.plan || 'VIP آزمایشی', planUntil: prev.planUntil || Date.now() + 14 * 86400e3, joined: prev.joined || Date.now(), loggedIn: true, via: info.via };
  await setMine('profile', ME.profile);
  renderAuthState(); renderSignals();
  toast(info.isNew ? 'حسابت ساخته شد. اشتراک VIP آزمایشی ۱۴ روزه فعال شد.' : 'وارد شدی. خوش برگشتی!');
  dashTab = 'home'; go('dashboard');
}
async function logout() { ME.profile = { ...(ME.profile || {}), loggedIn: false }; await setMine('profile', ME.profile); renderAuthState(); renderSignals(); toast('از حساب خارج شدی.'); go('home'); }
function renderAuthState() {
  const on = !!ME.profile?.loggedIn;
  $('#authBtn').classList.toggle('hidden', on); $('#userBtn').classList.toggle('hidden', !on);
  if (on) $('#userAv').textContent = (ME.profile.name || 'ش').trim()[0];
}

/* ===== dashboard ===== */
let dashTab = 'home';
const DTABS = [['home', 'پیشخوان'], ['signals', 'سیگنال‌های من'], ['watch', 'واچ‌لیست'], ['alerts', 'هشدار قیمت'], ['journal', 'ژورنال معاملات'], ['courses', 'دوره‌های من'], ['plan', 'اشتراک'], ['profile', 'پروفایل و تنظیمات']];
function demoJournal() { return [{ id: 1, sym: 'XAUUSD', side: 'buy', en: 3990, ex: 4055, size: .2, at: Date.now() - 6 * 86400e3, note: 'طبق سیگنال' }, { id: 2, sym: 'EURUSD', side: 'sell', en: 1.1690, ex: 1.1652, size: .5, at: Date.now() - 4 * 86400e3, note: '' }, { id: 3, sym: 'BTCUSDT', side: 'buy', en: 93200, ex: 92400, size: .05, at: Date.now() - 2 * 86400e3, note: 'حد ضرر' }]; }
function tradePnl(t) { const dir = t.side === 'buy' ? 1 : -1; const m = M[t.sym]; let mult = 1; if (!m) return 0; if (m.c === 'forex') mult = (t.sym.endsWith('JPY') ? 1000 : 100000); else if (t.sym === 'XAUUSD') mult = 100; return (t.ex - t.en) * dir * t.size * mult; }
function jStats() { const j = ME.journal; const p = j.map(tradePnl); const w = p.filter(x => x > 0), l = p.filter(x => x <= 0); const gw = w.reduce((a, b) => a + b, 0), gl = Math.abs(l.reduce((a, b) => a + b, 0)); return { n: j.length, wr: j.length ? w.length / j.length * 100 : 0, net: gw - gl, pf: gl ? gw / gl : gw ? Infinity : 0, pnls: p }; }
function dashNav(el, tabs, cur, fn) { el.innerHTML = `<a class="logo" data-go="home"><span class="logo-mark">SM</span><span>شاهین محمدی<small>داشبورد</small></span></a>` + tabs.map(([k, t]) => `<button data-t="${k}" aria-current="${k === cur}">${t}</button>`).join('') + `<div class="sp"></div><button data-go="home">بازگشت به سایت</button>${fn === renderDash ? '<button data-t="logout">خروج از حساب</button>' : ''}`; el.querySelectorAll('[data-t]').forEach(b => b.addEventListener('click', () => b.dataset.t === 'logout' ? logout() : fn(b.dataset.t))); }
function renderDash(tab = 'home') {
  dashTab = tab; if (!ME.profile?.loggedIn) return go('login');
  dashNav($('#sideNav'), DTABS, tab, renderDash);
  $('#mobDashNav').innerHTML = DTABS.map(([k, t]) => `<button class="chip" aria-pressed="${k === tab}" data-t="${k}">${t}</button>`).join('') + '<button class="chip" data-go="home">سایت</button>';
  $$('#mobDashNav [data-t]').forEach(b => b.addEventListener('click', () => renderDash(b.dataset.t)));
  const P = ME.profile; const el = $('#dashPanel'); const st = jStats();
  const top = (t, s, extra = '') => `<div class="dash-top"><div><h1>${t}</h1><p>${s}</p></div>${extra}</div>`;
  if (tab === 'home') {
    el.innerHTML = top(`سلام ${esc(P.name)}`, `امروز ${faDate(new Date(), { weekday: 'long', day: 'numeric', month: 'long' })} · عضو از ${faDate(new Date(P.joined), { day: 'numeric', month: 'long', year: 'numeric' })}`, `<a class="btn" data-go="signals">سیگنال‌های امروز</a>`) +
      `<div class="g4"><div class="plan-card"><span>اشتراک فعال</span><b>${esc(P.plan)}</b><span>تا ${faDate(new Date(P.planUntil))}</span></div>
      <div class="kpi"><b class="${st.net >= 0 ? 'up' : 'down'} ltr" style="text-align:right">${st.net >= 0 ? '+' : '−'}$${enNum(Math.abs(st.net), 0)}</b><span>سود/زیان خالص ژورنال</span></div>
      <div class="kpi"><b>${faNum(st.wr, 0)}٪</b><span>نرخ برد معاملات ثبت‌شده</span></div>
      <div class="kpi"><b>${faNum(ME.alerts.filter(a => !a.hit).length)}</b><span>هشدار قیمت فعال</span></div></div>
      <div class="g2"><div class="box"><h3>منحنی سرمایه <span class="badge mute">از ژورنال</span></h3><canvas id="eqCv" style="width:100%;height:180px"></canvas></div>
      <div class="box"><h3>واچ‌لیست <button class="link" data-dt="watch" style="font-size:13px">مدیریت</button></h3><div id="miniWatch"></div></div></div>
      <div class="box" style="margin-top:14px"><h3>آخرین سیگنال‌ها <button class="link" data-dt="signals" style="font-size:13px">همه</button></h3><div class="sig-grid" id="dashSig"></div></div>`;
    eqDraw(); miniWatch(); $('#dashSig').innerHTML = allSignals().slice(0, 3).map(sigCard).join('');
  } else if (tab === 'signals') {
    el.innerHTML = top('سیگنال‌های من', 'همه‌ی سیگنال‌های باز، شامل VIP. وضعیت هر سیگنال با قیمت لحظه‌ای به‌روز می‌شود.') + `<div class="sig-grid" id="dashSig"></div>`;
    $('#dashSig').innerHTML = allSignals().map(sigCard).join('');
  } else if (tab === 'watch') {
    el.innerHTML = top('واچ‌لیست', 'نمادهایی که دنبال می‌کنی. روی هر ردیف بزن تا نمودارش را در صفحه اصلی ببینی.') + `<div class="box"><form class="inline-form" id="wForm"><div class="field"><label for="wSym">افزودن نماد</label><select class="inp" id="wSym">${SYMS.filter(x => !ME.watch.includes(x.s)).map(x => `<option value="${x.s}">${nice(x.s)} — ${x.n}</option>`).join('')}</select></div><button class="btn">افزودن</button></form></div><div class="box" style="margin-top:14px"><table class="tbl" id="wTbl"><thead><tr><th>نماد</th><th>قیمت</th><th>تغییر</th><th>بالا/پایین روز</th><th></th></tr></thead><tbody></tbody></table></div>`;
    const draw = () => { $('#wTbl tbody').innerHTML = ME.watch.length ? ME.watch.map(s => { const c = chg(s); return `<tr data-s="${s}"><td><div class="sym-cell"><span class="sym-ic">${s.slice(0, 3)}</span><div><b>${nice(s)}</b><small>${M[s].n}</small></div></div></td><td class="ltr p" style="text-align:right">${fp(s)}</td><td><span class="badge ${c >= 0 ? 'up' : 'down'}">${pct(c)}</span></td><td class="ltr" style="text-align:right;color:var(--muted)">${fp(s, M[s].high)} / ${fp(s, M[s].low)}</td><td><button class="x" data-rm="${s}" aria-label="حذف">×</button></td></tr>`; }).join('') : '<tr><td colspan="5" class="empty">واچ‌لیست خالی است. از فرم بالا نماد اضافه کن.</td></tr>'; };
    draw(); dashLive = draw;
    $('#wForm').addEventListener('submit', async e => { e.preventDefault(); const s = $('#wSym').value; if (!s) return; ME.watch.push(s); await setMine('watch', ME.watch); toast(nice(s) + ' به واچ‌لیست اضافه شد.'); renderDash('watch'); });
    $('#wTbl').addEventListener('click', async e => { const r = e.target.closest('[data-rm]'); if (r) { ME.watch = ME.watch.filter(x => x !== r.dataset.rm); await setMine('watch', ME.watch); renderDash('watch'); return; } const tr = e.target.closest('tr[data-s]'); if (tr) { curSym = tr.dataset.s; go('market'); setTimeout(loadChart, 100); } });
  } else if (tab === 'alerts') {
    el.innerHTML = top('هشدار قیمت', 'وقتی قیمت به سطح دلخواهت برسد، همین‌جا اعلان می‌گیری.') + `<div class="box"><form class="inline-form" id="aForm"><div class="field"><label for="alSym">نماد</label><select class="inp" id="alSym">${SYMS.map(x => `<option value="${x.s}">${nice(x.s)}</option>`).join('')}</select></div><div class="field"><label for="alCond">شرط</label><select class="inp" id="alCond"><option value="above">بالاتر از</option><option value="below">پایین‌تر از</option></select></div><div class="field"><label for="alPrice">قیمت</label><input class="inp ltr" id="alPrice" type="number" step="any"></div><button class="btn">ثبت هشدار</button></form><p class="hint" id="alHint" style="margin-top:8px;color:var(--muted);font-size:13px"></p></div><div class="box" style="margin-top:14px"><h3>هشدارهای من</h3><div id="alList"></div></div>`;
    const hint = () => { const s = $('#alSym').value; $('#alHint').textContent = 'قیمت فعلی ' + nice(s) + ': ' + fp(s); if (!$('#alPrice').value) $('#alPrice').placeholder = fp(s).replace(/,/g, ''); }; $('#alSym').addEventListener('change', hint); hint();
    const draw = () => { $('#alList').innerHTML = ME.alerts.length ? ME.alerts.map((a, i) => `<div class="list-row"><div><b class="ltr">${nice(a.sym)}</b> ${a.cond === 'above' ? 'بالاتر از' : 'پایین‌تر از'} <b class="ltr">${fp(a.sym, a.price)}</b><div style="font-size:12.5px;color:var(--muted)">قیمت فعلی <span class="ltr">${fp(a.sym)}</span></div></div><div style="display:flex;gap:8px;align-items:center"><span class="badge ${a.hit ? 'up' : 'mute'}">${a.hit ? 'فعال شد' : 'در انتظار'}</span><button class="x" data-rm="${i}" aria-label="حذف">×</button></div></div>`).join('') : '<p class="empty">هنوز هشداری نساختی.</p>'; };
    draw(); dashLive = draw;
    $('#aForm').addEventListener('submit', async e => { e.preventDefault(); const p = +$('#alPrice').value; if (!p) { $('#alPrice').classList.add('err'); return; } ME.alerts.unshift({ sym: $('#alSym').value, cond: $('#alCond').value, price: p, hit: false, at: Date.now() }); await setMine('alerts', ME.alerts); toast('هشدار ثبت شد.'); renderDash('alerts'); });
    $('#alList').addEventListener('click', async e => { const r = e.target.closest('[data-rm]'); if (!r) return; ME.alerts.splice(+r.dataset.rm, 1); await setMine('alerts', ME.alerts); renderDash('alerts'); });
  } else if (tab === 'journal') {
    el.innerHTML = top('ژورنال معاملات', 'هر معامله را ثبت کن تا نرخ برد، پرافیت فکتور و منحنی سرمایه‌ات را ببینی.') +
      `<div class="g4"><div class="kpi"><b>${faNum(st.n)}</b><span>تعداد معاملات</span></div><div class="kpi"><b>${faNum(st.wr, 0)}٪</b><span>نرخ برد</span></div><div class="kpi"><b class="${st.net >= 0 ? 'up' : 'down'} ltr" style="text-align:right">${st.net >= 0 ? '+' : '−'}$${enNum(Math.abs(st.net), 0)}</b><span>سود/زیان خالص</span></div><div class="kpi"><b class="ltr" style="text-align:right">${st.pf === Infinity ? '∞' : enNum(st.pf, 2)}</b><span>پرافیت فکتور</span></div></div>
      <div class="g2"><div class="box"><h3>ثبت معامله</h3><form class="form" id="jForm"><div class="row2"><div class="field"><label for="jSym">نماد</label><select class="inp" id="jSym">${SYMS.map(x => `<option value="${x.s}">${nice(x.s)}</option>`).join('')}</select></div><div class="field"><label for="jSide">جهت</label><select class="inp" id="jSide"><option value="buy">خرید</option><option value="sell">فروش</option></select></div></div><div class="row2"><div class="field"><label for="jEn">قیمت ورود</label><input class="inp ltr" id="jEn" type="number" step="any" required></div><div class="field"><label for="jEx">قیمت خروج</label><input class="inp ltr" id="jEx" type="number" step="any" required></div></div><div class="row2"><div class="field"><label for="jSize">حجم (لات / تعداد)</label><input class="inp ltr" id="jSize" type="number" step="any" value="0.1"></div><div class="field"><label for="jNote">یادداشت</label><input class="inp" id="jNote"></div></div><button class="btn">ثبت در ژورنال</button></form></div><div class="box"><h3>منحنی سرمایه</h3><canvas id="eqCv" style="width:100%;height:220px"></canvas></div></div>
      <div class="box" style="margin-top:14px;overflow:auto"><table class="tbl"><thead><tr><th>تاریخ</th><th>نماد</th><th>جهت</th><th>ورود</th><th>خروج</th><th>حجم</th><th>نتیجه</th><th>یادداشت</th><th></th></tr></thead><tbody id="jBody"></tbody></table></div>`;
    $('#jBody').innerHTML = ME.journal.length ? ME.journal.slice().sort((a, b) => b.at - a.at).map(t => { const p = tradePnl(t); return `<tr><td>${faDate(new Date(t.at))}</td><td><b class="ltr">${nice(t.sym)}</b></td><td>${t.side === 'buy' ? 'خرید' : 'فروش'}</td><td class="ltr" style="text-align:right">${t.en}</td><td class="ltr" style="text-align:right">${t.ex}</td><td class="ltr" style="text-align:right">${t.size}</td><td><span class="badge ${p >= 0 ? 'up' : 'down'} ltr">${p >= 0 ? '+' : '−'}$${enNum(Math.abs(p), 0)}</span></td><td style="color:var(--muted)">${esc(t.note)}</td><td><button class="x" data-rm="${t.id}" aria-label="حذف">×</button></td></tr>`; }).join('') : '<tr><td colspan="9" class="empty">اولین معامله‌ات را ثبت کن.</td></tr>';
    eqDraw();
    $('#jSym').addEventListener('change', () => { const s = $('#jSym').value; $('#jEn').placeholder = $('#jEx').placeholder = fp(s).replace(/,/g, ''); });
    $('#jForm').addEventListener('submit', async e => { e.preventDefault(); const en = +$('#jEn').value, ex = +$('#jEx').value; if (!en || !ex) return; ME.journal.push({ id: Date.now(), sym: $('#jSym').value, side: $('#jSide').value, en, ex, size: +$('#jSize').value || 0, note: $('#jNote').value.trim().slice(0, 120), at: Date.now() }); await setMine('journal', ME.journal); toast('معامله ثبت شد.'); renderDash('journal'); });
    $('#jBody').addEventListener('click', async e => { const r = e.target.closest('[data-rm]'); if (!r) return; ME.journal = ME.journal.filter(t => String(t.id) !== r.dataset.rm); await setMine('journal', ME.journal); renderDash('journal'); });
  } else if (tab === 'courses') {
    el.innerHTML = top('دوره‌های من', 'پیشرفت تو در هر دوره.') + `<div class="g2e">${COURSES.map(c => { const pr = ME.courses[c.id] || 0; return `<div class="box"><div style="display:flex;gap:14px;align-items:center"><img src="img/${c.ph}.jpg" alt="" style="width:84px;height:84px;border-radius:14px;object-fit:cover;object-position:50% 30%"><div style="flex:1"><h3 style="margin-bottom:6px">${c.t}</h3><div class="pbar"><i style="width:${pr}%"></i></div><p style="font-size:13px;color:var(--muted);margin-top:6px">${pr ? faNum(pr) + '٪ تکمیل · ' + faNum(Math.round(c.s * pr / 100)) + ' از ' + faNum(c.s) + ' جلسه' : 'هنوز شروع نکردی'}</p></div></div><button class="btn ${pr ? '' : 'light'} sm" style="margin-top:12px" data-course="${c.id}">${pr ? 'ادامه یادگیری' : 'شروع دوره'}</button></div>`; }).join('')}</div>`;
    $$('[data-course]').forEach(b => b.addEventListener('click', () => { const id = b.dataset.course; ME.courses[id] = Math.min(100, (ME.courses[id] || 0) + 8); toast('جلسه بعدی به‌عنوان دیده‌شده علامت خورد.'); renderDash('courses'); }));
  } else if (tab === 'plan') {
    el.innerHTML = top('اشتراک', 'وضعیت اشتراک و تمدید.') + `<div class="g2e"><div class="plan-card"><span>پلن فعلی</span><b>${esc(P.plan)}</b><span>اعتبار تا ${faDate(new Date(P.planUntil), { day: 'numeric', month: 'long', year: 'numeric' })}</span><div class="pbar" style="background:rgba(255,255,255,.15);margin-top:8px"><i style="background:#fff;width:${Math.max(4, Math.min(100, (P.planUntil - Date.now()) / (14 * 86400e3) * 100))}%"></i></div></div><div class="box"><h3>تمدید یا ارتقا</h3><p style="color:var(--muted);font-size:14.5px">پرداخت در نسخه نهایی به درگاه بانکی متصل می‌شود.</p><div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap"><button class="btn" id="upVip">تمدید VIP یک‌ماهه</button><button class="btn light" id="upPro">تغییر به حرفه‌ای</button></div></div></div>`;
    $('#upVip').onclick = async () => { P.plan = 'VIP'; P.planUntil = Math.max(P.planUntil, Date.now()) + 30 * 86400e3; await setMine('profile', P); toast('اشتراک VIP تمدید شد (دمو، بدون پرداخت).'); renderDash('plan'); };
    $('#upPro').onclick = async () => { P.plan = 'حرفه‌ای'; await setMine('profile', P); toast('پلن به حرفه‌ای تغییر کرد (دمو).'); renderDash('plan'); };
  } else if (tab === 'profile') {
    el.innerHTML = top('پروفایل و تنظیمات', 'اطلاعات حساب و اعلان‌ها.') + `<div class="g2e"><div class="box"><h3>اطلاعات حساب</h3><form class="form" id="pForm"><div class="field"><label for="pName">نام</label><input class="inp" id="pName" value="${esc(P.name)}"></div><div class="field"><label for="pPhone">موبایل</label><input class="inp ltr" id="pPhone" value="${esc(P.phone)}"></div><div class="field"><label for="pEmail">ایمیل</label><input class="inp ltr" id="pEmail" value="${esc(P.email)}"></div><div class="field"><label for="pRisk">ریسک پیش‌فرض هر معامله</label><select class="inp" id="pRisk">${['۰٫۵٪', '۱٪', '۱٫۵٪', '۲٪'].map(r => `<option ${P.risk === r ? 'selected' : ''}>${r}</option>`).join('')}</select></div><button class="btn">ذخیره تغییرات</button></form></div>
      <div class="box"><h3>اعلان‌ها</h3>${[['signals', 'سیگنال جدید'], ['analysis', 'تحلیل جدید'], ['alerts', 'هشدار قیمت'], ['news', 'خبرهای مهم اقتصادی']].map(([k, t]) => `<div class="toggle"><label for="n_${k}">${t}</label><input type="checkbox" class="switch" id="n_${k}" data-n="${k}" ${ME.notif[k] ? 'checked' : ''}></div>`).join('')}<p style="font-size:13px;color:var(--muted);margin-top:12px">${B.db && B.uid ? 'تنظیمات و داده‌هایت در فضای خصوصی حسابت ذخیره می‌شود.' : 'در این حالت داده‌ها روی همین مرورگر ذخیره می‌شوند.'}</p><button class="btn light block" style="margin-top:14px" id="logoutBtn">خروج از حساب</button></div></div>`;
    $('#pForm').addEventListener('submit', async e => { e.preventDefault(); P.name = $('#pName').value.trim() || P.name; P.phone = $('#pPhone').value.trim(); P.email = $('#pEmail').value.trim(); P.risk = $('#pRisk').value; await setMine('profile', P); renderAuthState(); toast('تغییرات ذخیره شد.'); });
    $$('[data-n]').forEach(c => c.addEventListener('change', async () => { ME.notif[c.dataset.n] = c.checked; await setMine('notif', ME.notif); }));
    $('#logoutBtn').onclick = logout;
  }
  el.querySelectorAll('[data-dt]').forEach(b => b.addEventListener('click', () => renderDash(b.dataset.dt)));
  if (!['watch', 'alerts'].includes(tab)) dashLive = null;
  window.scrollTo(0, 0);
}
let dashLive = null;
listeners.add(() => { if (curView === 'dashboard' && dashLive) dashLive(); if (curView === 'dashboard' && dashTab === 'home') miniWatch(); checkAlerts(); });
function miniWatch() { const el = $('#miniWatch'); if (!el) return; el.innerHTML = ME.watch.slice(0, 5).map(s => { const c = chg(s); return `<div class="list-row"><b class="ltr">${nice(s)}</b><span class="ltr num">${fp(s)}</span><span class="badge ${c >= 0 ? 'up' : 'down'}">${pct(c)}</span></div>`; }).join('') || '<p class="empty">واچ‌لیست خالی است.</p>'; }
function eqDraw() { const cv = $('#eqCv'); if (!cv) return; const st = jStats(); const sorted = ME.journal.slice().sort((a, b) => a.at - b.at); let v = 10000; const pts = [v]; sorted.forEach(t => { v += tradePnl(t); pts.push(v); }); if (pts.length < 2) pts.push(v); sparkDraw(cv, pts, pts[pts.length - 1] >= pts[0] ? UP : DOWN); }
let alertBusy = false;
async function checkAlerts() { if (alertBusy || !ME.alerts.length) return; let ch = false; ME.alerts.forEach(a => { if (a.hit || !M[a.sym]) return; const p = M[a.sym].price; if ((a.cond === 'above' && p >= a.price) || (a.cond === 'below' && p <= a.price)) { a.hit = true; ch = true; toast(`هشدار قیمت: ${nice(a.sym)} به ${fp(a.sym, a.price)} رسید.`); } }); if (ch) { alertBusy = true; await setMine('alerts', ME.alerts); alertBusy = false; } }

/* ===== admin ===== */
let adminTab = 'signal';
const ATABS = [['signal', 'انتشار سیگنال'], ['analysis', 'انتشار تحلیل'], ['leads', 'پیام‌های کاربران'], ['content', 'محتوای منتشرشده']];
function renderAdmin(tab = adminTab) {
  adminTab = tab; dashNav($('#adminNav'), ATABS, tab, renderAdmin);
  $('#mobAdminNav').innerHTML = ATABS.map(([k, t]) => `<button class="chip" aria-pressed="${k === tab}" data-t="${k}">${t}</button>`).join('') + '<button class="chip" data-go="home">سایت</button>';
  $$('#mobAdminNav [data-t]').forEach(b => b.addEventListener('click', () => renderAdmin(b.dataset.t)));
  const el = $('#adminPanel'); const canWrite = !!B.db;
  const top = (t, s) => `<div class="dash-top"><div><h1>${t}</h1><p>${s}</p></div><span class="badge ${canWrite ? 'up' : 'mute'}">${canWrite ? 'متصل به پایگاه داده' : 'پایگاه داده در دسترس نیست'}</span></div>`;
  const symOpts = SYMS.map(x => `<option value="${x.s}">${nice(x.s)}</option>`).join('');
  if (tab === 'signal') {
    el.innerHTML = top('انتشار سیگنال', 'سیگنال منتشرشده بلافاصله برای همه‌ی بازدیدکننده‌ها در بخش سیگنال‌ها نمایش داده می‌شود.') + `<div class="g2"><div class="box"><form class="form" id="sgForm" novalidate><div class="row2"><div class="field"><label for="sgSym">نماد</label><select class="inp" id="sgSym">${symOpts}</select></div><div class="field"><label for="sgSide">جهت</label><select class="inp" id="sgSide"><option value="buy">خرید</option><option value="sell">فروش</option></select></div></div><div class="row2"><div class="field"><label for="sgE1">ورود از</label><input class="inp ltr" id="sgE1" type="number" step="any"></div><div class="field"><label for="sgE2">ورود تا (اختیاری)</label><input class="inp ltr" id="sgE2" type="number" step="any"></div></div><div class="row2"><div class="field"><label for="sgSl">حد ضرر</label><input class="inp ltr" id="sgSl" type="number" step="any"></div><div class="field"><label for="sgConf">اطمینان</label><select class="inp" id="sgConf"><option>بالا</option><option>متوسط</option><option>پایین</option></select></div></div><div class="row2"><div class="field"><label for="sgT1">تارگت ۱</label><input class="inp ltr" id="sgT1" type="number" step="any"></div><div class="field"><label for="sgT2">تارگت ۲</label><input class="inp ltr" id="sgT2" type="number" step="any"></div></div><div class="row2"><div class="field"><label for="sgT3">تارگت ۳</label><input class="inp ltr" id="sgT3" type="number" step="any"></div><div class="field"><label for="sgSt">وضعیت</label><select class="inp" id="sgSt"><option value="active">فعال</option><option value="pending">در انتظار ورود</option><option value="tp1">تارگت ۱ خورد</option></select></div></div><label class="check"><input type="checkbox" id="sgVip"> فقط برای مشترکین VIP</label><div class="err-msg" id="sgErr" role="alert"></div><button class="btn" ${canWrite ? '' : 'disabled'}>انتشار سیگنال</button></form></div><div class="box"><h3>پیش‌نمایش</h3><div id="sgPrev"></div></div></div>`;
    const read = () => { const s = $('#sgSym').value; const n = id => +$(id).value || 0; return { id: 'prev', m: M[s].c === 'crypto' ? 'crypto' : s === 'XAUUSD' ? 'gold' : 'forex', sym: s, side: $('#sgSide').value, e1: n('#sgE1') || M[s].price, e2: n('#sgE2') || null, sl: n('#sgSl'), tp: [n('#sgT1'), n('#sgT2'), n('#sgT3')], st: $('#sgSt').value, conf: $('#sgConf').value, vip: $('#sgVip').checked, at: Date.now() }; };
    const prev = () => { const x = read(); $('#sgPrev').innerHTML = x.sl && x.tp[0] ? sigCard({ ...x, vip: false }) : `<p class="empty">قیمت فعلی ${nice(x.sym)}: <span class="ltr">${fp(x.sym)}</span><br>حد ضرر و تارگت‌ها را وارد کن تا پیش‌نمایش ساخته شود.</p>`; };
    $('#sgForm').addEventListener('input', prev); prev();
    $('#sgForm').addEventListener('submit', async e => { e.preventDefault(); const x = read(); const buy = x.side === 'buy'; if (!x.sl || !x.tp[0] || !x.tp[1] || !x.tp[2]) return $('#sgErr').textContent = 'حد ضرر و هر سه تارگت را وارد کن.'; if (buy ? !(x.sl < x.e1 && x.tp[0] > x.e1) : !(x.sl > x.e1 && x.tp[0] < x.e1)) return $('#sgErr').textContent = buy ? 'در سیگنال خرید، حد ضرر باید زیر ورود و تارگت بالای ورود باشد.' : 'در سیگنال فروش، حد ضرر باید بالای ورود و تارگت زیر ورود باشد.'; $('#sgErr').textContent = ''; const { id, ...doc } = x; doc.at = Date.now(); try { await B.db.collection('signals').add(doc); toast('سیگنال منتشر شد.'); e.target.reset(); prev(); } catch (er) { $('#sgErr').textContent = 'انتشار انجام نشد: ' + (er?.code === 'invalid_argument' ? 'دسترسی نوشتن نداری.' : 'دوباره امتحان کن.'); } });
  } else if (tab === 'analysis') {
    el.innerHTML = top('انتشار تحلیل', 'تحلیل منتشرشده در بالای بخش تحلیل‌ها قرار می‌گیرد.') + `<div class="box"><form class="form" id="anForm" novalidate><div class="field"><label for="anTitle">عنوان</label><input class="inp" id="anTitle" maxlength="120"></div><div class="row2"><div class="field"><label for="anSym">نماد</label><select class="inp" id="anSym">${symOpts}</select></div><div class="field"><label for="anTf">تایم‌فریم</label><select class="inp" id="anTf"><option>1H</option><option selected>4H</option><option>1D</option></select></div></div><div class="row2"><div class="field"><label for="anBias">جهت</label><select class="inp" id="anBias"><option>صعودی</option><option>نزولی</option><option>خنثی</option><option>صعودی محتاط</option></select></div><div class="field"><label for="anCat">بازار</label><select class="inp" id="anCat"><option value="forex">فارکس</option><option value="crypto">کریپتو</option><option value="gold">طلا</option><option value="index">شاخص</option></select></div></div><div class="field"><label for="anSum">خلاصه (یک تا دو جمله)</label><textarea class="inp" id="anSum" rows="2" maxlength="300"></textarea></div><div class="field"><label for="anBody">متن کامل (هر پاراگراف در یک خط)</label><textarea class="inp" id="anBody" rows="6"></textarea></div><div class="row2"><div class="field"><label for="anS1">حمایت ۱</label><input class="inp ltr" id="anS1" type="number" step="any"></div><div class="field"><label for="anR1">مقاومت ۱</label><input class="inp ltr" id="anR1" type="number" step="any"></div></div><div class="row2"><div class="field"><label for="anS2">حمایت ۲</label><input class="inp ltr" id="anS2" type="number" step="any"></div><div class="field"><label for="anR2">مقاومت ۲</label><input class="inp ltr" id="anR2" type="number" step="any"></div></div><div class="err-msg" id="anErr" role="alert"></div><button class="btn" ${canWrite ? '' : 'disabled'}>انتشار تحلیل</button></form></div>`;
    $('#anForm').addEventListener('submit', async e => { e.preventDefault(); const t = $('#anTitle').value.trim(), s = $('#anSum').value.trim(); if (t.length < 8 || s.length < 10) return $('#anErr').textContent = 'عنوان و خلاصه را کامل بنویس.'; const n = id => $(id).value ? +$(id).value : null; const doc = { title: t, sum: s, body: $('#anBody').value.split('\n').map(x => x.trim()).filter(Boolean).slice(0, 12), sym: $('#anSym').value, tf: $('#anTf').value, bias: $('#anBias').value, cat: $('#anCat').value, lv: { s1: n('#anS1'), s2: n('#anS2'), r1: n('#anR1'), r2: n('#anR2') }, at: Date.now() }; try { await B.db.collection('analyses').add(doc); toast('تحلیل منتشر شد.'); e.target.reset(); } catch { $('#anErr').textContent = 'انتشار انجام نشد. دسترسی نوشتن را بررسی کن.'; } });
  } else if (tab === 'leads') {
    el.innerHTML = top('پیام‌های کاربران', 'پیام‌های فرم تماس. هر کاربر یک پیام فعال دارد و پیام جدیدش جایگزین قبلی می‌شود.') + `<div class="box">${SHARED.leads.length ? SHARED.leads.map(l => `<div class="list-row" style="align-items:flex-start"><div><b>${esc(l.name)}</b> <span class="badge mute">${esc(l.topic)}</span><p style="margin-top:6px">${esc(l.msg)}</p><span style="font-size:12.5px;color:var(--muted)" class="ltr">${esc(l.phone)}</span></div><span style="font-size:12.5px;color:var(--muted);white-space:nowrap">${ago(l.at)}</span></div>`).join('') : '<p class="empty">هنوز پیامی نرسیده است. پیام‌های فرم تماس اینجا نمایش داده می‌شوند.</p>'}</div>`;
  } else if (tab === 'content') {
    el.innerHTML = top('محتوای منتشرشده', 'سیگنال‌ها و تحلیل‌هایی که از این پنل منتشر کرده‌ای.') + `<div class="g2e"><div class="box"><h3>سیگنال‌ها</h3>${SHARED.signals.length ? SHARED.signals.map(s => `<div class="list-row"><div><b class="ltr">${nice(s.sym)}</b> · ${s.side === 'buy' ? 'خرید' : 'فروش'} <span class="badge ${ST[s.st]?.[1] || 'mute'}">${ST[s.st]?.[0] || ''}</span><div style="font-size:12.5px;color:var(--muted)">${ago(s.at)}</div></div><div style="display:flex;gap:6px"><select class="select" data-st="${s.id}">${Object.entries(ST).map(([k, v]) => `<option value="${k}" ${k === s.st ? 'selected' : ''}>${v[0]}</option>`).join('')}</select><button class="x" data-del-s="${s.id}" aria-label="حذف">×</button></div></div>`).join('') : '<p class="empty">هنوز سیگنالی منتشر نکرده‌ای.</p>'}</div><div class="box"><h3>تحلیل‌ها</h3>${SHARED.analyses.length ? SHARED.analyses.map(a => `<div class="list-row"><div><b>${esc(a.title)}</b><div style="font-size:12.5px;color:var(--muted)">${ago(a.at)}</div></div><button class="x" data-del-a="${a.id}" aria-label="حذف">×</button></div>`).join('') : '<p class="empty">هنوز تحلیلی منتشر نکرده‌ای.</p>'}</div></div>`;
    el.querySelectorAll('[data-st]').forEach(s => s.addEventListener('change', async () => { try { await B.db.doc('signals/' + s.dataset.st).update({ st: s.value }); toast('وضعیت سیگنال به‌روز شد.'); } catch { toast('به‌روزرسانی انجام نشد.'); } }));
    el.querySelectorAll('[data-del-s]').forEach(b => b.addEventListener('click', async () => { try { await B.db.doc('signals/' + b.dataset.delS).delete(); toast('سیگنال حذف شد.'); } catch { } }));
    el.querySelectorAll('[data-del-a]').forEach(b => b.addEventListener('click', async () => { try { await B.db.doc('analyses/' + b.dataset.delA).delete(); toast('تحلیل حذف شد.'); } catch { } }));
  }
}

/* ===== AI assistant ===== */
let sampleFn, botHist = [], botBusy = false;
function openBot() { $('#bot').classList.remove('hidden'); $('#botHello').classList.add('hidden'); $('.bot-fab .badge-n')?.remove(); if (!botHist.length) addMsg('ai', 'سلام! من دستیار هوشمند آکادمی شاهین محمدی هستم. درباره مفاهیم ترید، مدیریت ریسک، کار با سیگنال‌ها و دوره‌ها بپرس. پاسخ‌هایم آموزشی است و توصیه خرید یا فروش نیست.'); $('#botIn').focus(); }
function addMsg(who, text) { const d = document.createElement('div'); d.className = 'msg ' + who; d.textContent = text; $('#botMsgs').appendChild(d); $('#botMsgs').scrollTop = 1e9; return d; }
$('#botFab').addEventListener('click', () => { if ($('#bot').classList.contains('hidden')) openBot(); else $('#bot').classList.add('hidden'); });
$('#helloGo').addEventListener('click', openBot); $('#helloX').addEventListener('click', () => $('#botHello').classList.add('hidden')); $('#botX').addEventListener('click', () => $('#bot').classList.add('hidden'));
$('#botSugg').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { $('#botIn').value = b.textContent; $('#botForm').requestSubmit(); } });
const FALLBACK = [[/حد ضرر|استاپ|sl/i, 'حد ضرر را جایی بگذار که اگر قیمت به آن رسید، دلیل ورودت باطل شده باشد؛ مثلاً کمی آن‌طرف آخرین کف یا سقف معتبر. بعد حجم معامله را طوری حساب کن که فاصله تا حد ضرر حداکثر ۱ تا ۲ درصد سرمایه را درگیر کند. ابزار «محاسبه حجم معامله» در همین سایت این کار را انجام می‌دهد.'], [/ریوارد|ریسک به/i, 'ریسک به ریوارد یعنی نسبت ضرر احتمالی به سود احتمالی. اگر حد ضررت ۲۰ پیپ و تارگتت ۴۰ پیپ باشد، نسبت ۱ به ۲ است و با نرخ برد حدود ۳۴٪ هم سربه‌سر می‌شوی. ابزار «ریسک به ریوارد» را امتحان کن.'], [/دوره|شروع|تازه/i, 'اگر تازه‌کاری، از «مسیر صفر تا معامله‌گر» شروع کن و همزمان «مدیریت سرمایه و روانشناسی» را ببین. بعد از چند ماه تمرین روی دمو، «پرایس اکشن و ساختار بازار» قدم بعدی است.']];
$('#botForm').addEventListener('submit', async e => {
  e.preventDefault(); const q = $('#botIn').value.trim(); if (!q || botBusy) return; $('#botIn').value = ''; addMsg('me', q); botHist.push({ role: 'user', content: q });
  botBusy = true; const out = addMsg('ai', 'در حال فکر کردن…');
  if (sampleFn === undefined) { try { sampleFn = window.claude?.use ? await claude.use('sample') : null; } catch { sampleFn = null; } }
  if (sampleFn) {
    const snap = ['BTCUSDT', 'ETHUSDT', 'XAUUSD', 'EURUSD', 'US500'].map(s => `${nice(s)}: ${fp(s)} (${chg(s).toFixed(2)}%)`).join(' | ');
    const sys = `تو «دستیار هوشمند آکادمی شاهین محمدی» هستی، روی وب‌سایت یک تحلیلگر بازارهای مالی (فارکس، طلا، کریپتو). فقط به فارسی روان و صمیمی جواب بده، کوتاه (حداکثر ۱۲۰ کلمه)، بدون مارک‌داون و بدون ستاره. نقش تو آموزشی است: مفاهیم ترید، مدیریت ریسک، روانشناسی، کار با بخش‌های سایت (تحلیل‌ها، داده بازار، سیگنال‌ها، ابزارهای محاسبه حجم/فیوچرز/ریسک به ریوارد/رشد مرکب، آکادمی با دوره‌های: مسیر صفر تا معامله‌گر، پرایس اکشن و ساختار بازار، مدیریت سرمایه و روانشناسی، کریپتو فیوچرز و آن‌چین، اشتراک‌های رایگان/حرفه‌ای/VIP). هرگز توصیه‌ی مشخص خرید یا فروش یا وعده‌ی سود نده؛ اگر کسی پرسید «الان بخرم؟» توضیح بده که تصمیم با خودش است و چطور با مدیریت ریسک فکر کند. قیمت‌های نمایشی فعلی سایت (شبیه‌سازی‌شده در دمو): ${snap}.`;
    const msgs = botHist.slice(-10).map((m, i, a) => i === a.length - 1 ? { role: 'user', content: sys + '\n\nسؤال کاربر: ' + m.content } : m);
    try { const r = await sampleFn(msgs, { modelTier: 'quick', cache: false, onText: ({ text }) => { out.textContent = text; $('#botMsgs').scrollTop = 1e9; } }); out.textContent = r.text.replace(/\*\*/g, ''); botHist.push({ role: 'assistant', content: r.text }); }
    catch (er) { if (er?.code === 'not_granted') sampleFn = null; out.textContent = fallback(q); botHist.push({ role: 'assistant', content: out.textContent }); }
  } else { await new Promise(r => setTimeout(r, 600)); out.textContent = fallback(q); botHist.push({ role: 'assistant', content: out.textContent }); }
  botBusy = false;
});
function fallback(q) { for (const [re, a] of FALLBACK) if (re.test(q)) return a; return 'سؤال خوبی است. در این حالت دستیار هوشمند به مدل زبانی وصل نیست؛ می‌توانی از بخش ابزارها برای محاسبه ریسک استفاده کنی یا از فرم تماس سؤالت را برای تیم شاهین بفرستی.'; }
setTimeout(() => { if (curView === 'home' && $('#bot').classList.contains('hidden')) $('#botHello').classList.remove('hidden'); }, 2500);
$('#botHello').classList.add('hidden');

/* ===== boot ===== */
ME.journal = demoJournal();
initHero(); initCounters(); renderTicker(); renderBento(); initOrbit(); renderTiles(); renderTable(); initChart(); renderHeat(); renderGauge(); renderSess(); renderCal();
renderSignals(); renderHist(); renderPerf(); renderTool(); renderCourses(); renderPlans(); initAuthSide();
(async () => { const p = ls.get('profile', null); if (p) ME.profile = p; renderAuthState(); route(); initBackend(); })();
