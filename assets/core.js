/* Core: helpers, state + persistence, routing, overlays and shared UI pieces.
   Pages register themselves in PAGES; clicks go through ACTIONS, forms through FORMS (see main.js). */

const STORE_KEY = 'hamsanat-demo-v1';
const PAGES = {}, ACTIONS = {}, FORMS = {};
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ---------- text, numbers, dates ---------- */
const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const fa = v => String(v).replace(/\d/g, d => FA_DIGITS[d]);
const faNum = n => new Intl.NumberFormat('fa-IR').format(n);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = s => String(s ?? '').toLowerCase()
  .replace(/ي/g, 'ی').replace(/ك/g, 'ک')
  .replace(/[۰-۹]/g, d => FA_DIGITS.indexOf(d))
  .replace(/[‌‎‏\s\-_.،,]+/g, '');

const DAY = 864e5;
const fmtDate = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric', month: '2-digit', day: '2-digit' });
const fmtLong = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { day: 'numeric', month: 'long', year: 'numeric' });
const fmtDay = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { day: 'numeric' });
const fmtMonth = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { month: 'long' });
const fmtWeekday = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { weekday: 'long' });
const fmtTime = new Intl.DateTimeFormat('fa-IR', { hour: '2-digit', minute: '2-digit' });
const jDate = t => fmtDate.format(new Date(t));
const jLong = t => fmtLong.format(new Date(t));
const jTime = t => fmtTime.format(new Date(t));
const jYear = () => parseInt(new Intl.DateTimeFormat('en-u-ca-persian', { year: 'numeric' }).format(new Date()), 10) || 1405;
const daysSince = t => Math.floor((Date.now() - t) / DAY);

function timeAgo(t) {
  const m = Math.round((Date.now() - t) / 6e4);
  if (m < 1) return 'همین حالا';
  if (m < 60) return `${fa(m)} دقیقه پیش`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${fa(h)} ساعت پیش`;
  const d = Math.floor(h / 24);
  if (d === 1) return 'دیروز';
  return d < 30 ? `${fa(d)} روز پیش` : jDate(t);
}
function until(t) {
  const d = Math.ceil((t - Date.now()) / DAY);
  if (d <= 0) return 'امروز';
  return d === 1 ? 'فردا' : `${fa(d)} روز دیگر`;
}

/* ---------- state ---------- */
let state = loadState();
const ui = {
  page: 'dashboard', slide: 0,
  needs: { q: '', cat: 'all', kind: 'all', mine: false },
  export: { q: '', market: 'all', cat: 'all' },
  desk: { q: '', status: 'all', cat: 'all' },
  expert: { q: '', status: 'open', cat: 'all', priority: 'all' },
  events: { type: 'all' }
};
const role = () => (ui.page === 'expert' ? 'expert' : 'company');
const ROLE_LABEL = { company: 'ورود به‌عنوان شرکت', expert: 'ورود به‌عنوان کارشناس شهرک' };

function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    if (s && s.version === 1) return s;
  } catch (e) { /* storage blocked or corrupt: start fresh */ }
  return seedState();
}
function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* demo keeps working in memory */ }
}

const companyOf = x => COMPANIES[x.company];
const myCases = () => state.cases.filter(c => c.company === ME);
const findNeed = id => state.needs.find(x => x.id === id);
const findCase = id => state.cases.find(x => x.id === id);
const findProduct = id => state.products.find(x => x.id === id);
const findEvent = id => state.events.find(x => x.id === id);
const extractTags = text => KEYWORDS.filter(k => norm(text).includes(norm(k)));

function notify(forRole, n) {
  state.notifications.unshift({ id: 'n' + (++state.seq.notif), role: forRole, at: Date.now(), read: false, ...n });
}

/* ---------- business rules (all simple and rule-based, no AI) ---------- */
function matchesFor(item, limit = 3) {
  const mine = companyOf(item);
  return state.needs
    .filter(x => x.kind !== item.kind && x.cat === item.cat && x.company !== item.company)
    .map(x => {
      const other = companyOf(x), reasons = [`هم‌دسته در «${NEED_CATS[x.cat].label}»`];
      let score = 30;
      const shared = x.tags.filter(t => item.tags.includes(t));
      if (shared.length) { score += Math.min(40, shared.length * 20); reasons.push(`کلیدواژه مشترک: ${shared.join('، ')}`); }
      if (other.city === mine.city) { score += 12; reasons.push(`هر دو در ${other.city}؛ حمل و هماهنگی ساده‌تر`); }
      const [need, offer] = item.kind === 'need' ? [item, x] : [x, item];
      if (need.amount && offer.amount && need.unit === offer.unit) {
        if (offer.amount >= need.amount) { score += 10; reasons.push(`ظرفیت اعلام‌شده (${faNum(offer.amount)} ${offer.unit}) مقدار نیاز (${faNum(need.amount)}) را پوشش می‌دهد`); }
        else reasons.push(`ظرفیت اعلام‌شده (${faNum(offer.amount)}) بخشی از نیاز (${faNum(need.amount)}) را پوشش می‌دهد`);
      }
      if (other.complete) { score += 4; reasons.push('پروفایل شرکت کامل است'); }
      return { item: x, score: Math.min(96, score), reasons };
    })
    .filter(m => m.score >= 40)
    .sort((a, b) => b.score - a.score || b.item.created - a.item.created)
    .slice(0, limit);
}
const matchLevel = s => (s >= 75 ? ['تطابق بالا', 'green'] : s >= 55 ? ['تطابق خوب', 'blue'] : ['تطابق اولیه', 'gray']);

function followUps() {
  return state.cases
    .filter(c => c.status !== 'closed' && c.status !== 'answered')
    .map(c => {
      const reasons = [], idle = daysSince(c.updated), sla = PRIORITIES[c.priority].sla;
      if (c.priority === 'urgent') reasons.push('اولویت فوری');
      if (c.status === 'new' && daysSince(c.created) >= 1) reasons.push(`${fa(daysSince(c.created))} روز بدون اقدام`);
      else if (idle > sla) reasons.push(`${fa(idle)} روز بدون به‌روزرسانی؛ سررسید ${fa(sla)} روز`);
      return { c, reasons };
    })
    .filter(x => x.reasons.length);
}

function createCase({ cat, title, desc, priority, note = '' }) {
  const now = Date.now(), me = COMPANIES[ME];
  const c = {
    id: `HS-${jYear()}-${String(++state.seq.case).padStart(4, '0')}`, company: ME, cat, title, desc, note, priority,
    status: 'new', assignee: UNITS[0], location: `${me.park} — ${me.plot}`, created: now, updated: now,
    history: [{ at: now, kind: 'status', status: 'new', role: 'company', by: USERS.company.name, text: 'پرونده ثبت شد.' }], notes: []
  };
  state.cases.unshift(c);
  notify('expert', { icon: CASE_CATS[cat].icon, tone: priority === 'urgent' ? 'red' : 'blue', text: `پرونده جدید ${c.id} از «${me.name}» ثبت شد.`, link: { page: 'expert', open: c.id } });
  save();
  return c;
}

function changeStatus(c, status, text, actor) {
  c.status = status; c.updated = Date.now();
  const by = actor === 'expert' ? `${USERS.expert.name} — میز خدمت` : USERS.company.name;
  c.history.push({ at: c.updated, kind: 'status', status, role: actor, by, text: text || `وضعیت به «${STATUS[status].label}» تغییر کرد.` });
  if (actor === 'expert' && c.company === ME) {
    notify('company', { icon: 'message', tone: STATUS[status].tone, text: `پرونده ${c.id} به «${STATUS[status].label}» تغییر کرد.`, link: { page: 'desk', open: c.id } });
  }
  if (actor === 'company') {
    notify('expert', { icon: 'inbox', tone: 'blue', text: `شرکت وضعیت پرونده ${c.id} را «${STATUS[status].label}» کرد.`, link: { page: 'expert', open: c.id } });
  }
  save();
}

/* ---------- search ---------- */
function searchAll(q) {
  const n = norm(q);
  if (n.length < 2) return [];
  const has = (...f) => f.some(v => norm(v).includes(n));
  const out = [], expert = role() === 'expert';
  state.needs.forEach(x => has(x.title, companyOf(x).name, x.desc) && out.push({ group: 'نیازها و فرصت‌ها', ...NEED_CATS[x.cat], title: x.title, meta: companyOf(x).name, page: 'needs', open: x.id }));
  state.products.forEach(p => has(p.name, companyOf(p).name) && out.push({ group: 'محصولات صادراتی', ...PRODUCT_CATS[p.cat], title: p.name, meta: companyOf(p).name, page: 'export', open: p.id }));
  state.cases.filter(c => expert || c.company === ME).forEach(c => has(c.id, c.title, companyOf(c).name) && out.push({ group: 'پرونده‌ها', ...CASE_CATS[c.cat], title: c.title, meta: `${c.id} · ${STATUS[c.status].label}`, page: expert ? 'expert' : 'desk', open: c.id }));
  state.events.forEach(e => has(e.title, e.desc) && out.push({ group: 'آموزش و رویدادها', ...EVENT_TYPES[e.type], title: e.title, meta: jLong(e.date), page: 'events', open: e.id }));
  return out.slice(0, 9);
}

/* ---------- routing ---------- */
const NAV = [
  { key: 'dashboard', label: 'داشبورد', icon: 'home' },
  { key: 'needs', label: 'نیازمندی‌ها و فرصت‌ها', icon: 'box' },
  { key: 'export', label: 'صادرات و بازارهای بین‌المللی', icon: 'globe' },
  { key: 'services', label: 'خدمات و مجوزها', icon: 'file' },
  { key: 'events', label: 'آموزش و رویدادها', icon: 'calendar' },
  { key: 'desk', label: 'پیگیری مشکلات', icon: 'wrench' },
  { key: 'profile', label: 'پروفایل شرکت', icon: 'building' }
];
let pendingOpen = null;
const pageFromHash = () => { const p = location.hash.replace(/^#\/?/, '').split('/')[0]; return PAGES[p] ? p : 'dashboard'; };

function go(page, open = null) {
  if (!PAGES[page]) page = 'dashboard';
  closeOverlay(); closePopovers();
  if (location.hash !== '#/' + page) { pendingOpen = open; location.hash = '#/' + page; return; }
  renderPage(page, ui.page === page);
  if (open) openItem(open);
}
function onHashChange() {
  const page = pageFromHash(), open = pendingOpen;
  pendingOpen = null;
  closeOverlay(); closePopovers();
  renderPage(page);
  if (open) openItem(open);
}
function openItem(id) {
  if (/^[NO]-/.test(id)) return openNeed(id);
  if (id.startsWith('P-')) return openProduct(id);
  if (id.startsWith('E-')) return openEvent(id);
  if (id.startsWith('HS-')) return role() === 'expert' ? openExpertCase(id) : openCase(id);
  if (id === 'assessment') return openAssessmentResult();
  if (id === 'new-need') return openNeedForm('need');
  if (id === 'new-offer') return openNeedForm('offer');
  if (id === 'new-case') return openCaseForm();
  if (id === 'new-permit') return openCaseForm({ cat: 'permit' });
  if (id === 'assess') return openAssessmentForm();
}

function renderPage(page, keepScroll = false) {
  ui.page = page;
  const P = PAGES[page];
  $('#view').innerHTML = `<div class="page page-${page}">${P.render()}</div>${footerNote()}`;
  if (P.after) P.after();
  renderChrome();
  document.body.classList.remove('nav-open');
  document.title = `${P.title} — هم‌صنعت خوزستان (نسخه نمایشی)`;
  if (!keepScroll) window.scrollTo({ top: 0, behavior: 'auto' });
}
/* Re-render the current page after a state change, keeping scroll and the focused input. */
function rerender() {
  const a = document.activeElement, id = a && a.id && $('#view').contains(a) ? a.id : null;
  const pos = id && 'selectionStart' in a ? a.selectionStart : null;
  renderPage(ui.page, true);
  if (id) {
    const el = document.getElementById(id);
    if (el) { el.focus({ preventScroll: true }); if (pos != null) try { el.setSelectionRange(pos, pos); } catch (e) { /* not a text field */ } }
  }
  refreshOverlay();
}

/* ---------- header, sidebar, popovers ---------- */
const navItem = n => `<a class="nav-item ${ui.page === n.key ? 'active' : ''}" href="#/${n.key}">${icon(n.icon)}<span>${n.label}</span>${n.badge ? `<b class="nav-badge" title="پرونده‌های نیازمند پیگیری">${fa(n.badge)}</b>` : ''}</a>`;

function renderChrome() {
  const r = role(), u = USERS[r];
  $('#sidebar').innerHTML = `<nav class="nav">${NAV.map(navItem).join('')}
      <div class="nav-sep"><span>میز کارشناسی</span></div>
      ${navItem({ key: 'expert', label: 'پنل کارشناس', icon: 'userCheck', badge: followUps().length })}</nav>
    <div class="side-foot">${SKYLINE}<p>با هم برای<br>توسعه صنعت خوزستان</p>${WAVE}</div>`;
  $('#roleSwitch').innerHTML = ['company', 'expert'].map(k => `<button class="${r === k ? 'on' : ''}" data-action="role" data-role="${k}" aria-pressed="${r === k}">${icon(k === 'company' ? 'factory' : 'userCheck')}<span>${ROLE_LABEL[k]}</span></button>`).join('');
  const unread = state.notifications.filter(n => n.role === r && !n.read).length;
  $('#bellBtn').innerHTML = icon('bell') + (unread ? `<span class="bell-count">${fa(unread)}</span>` : '');
  $('#bellBtn').setAttribute('aria-label', unread ? `اعلان‌ها (${fa(unread)} خوانده‌نشده)` : 'اعلان‌ها');
  $('#userChip').innerHTML = `<span class="avatar ${r}">${u.initials}</span><span class="who"><strong>${u.name}</strong><small>${r === 'company' ? COMPANIES[ME].name : u.title}</small></span>${icon('chevDown')}`;
  if (!$('#notifPop').hidden) renderNotifs();
}

function renderNotifs() {
  const r = role(), list = state.notifications.filter(n => n.role === r);
  $('#notifPop').innerHTML = `<div class="pop-head"><strong>اعلان‌ها</strong>${list.some(n => !n.read) ? '<button class="link" data-action="read-all">خواندن همه</button>' : ''}</div>
    <div class="pop-list">${list.length ? list.slice(0, 8).map(n => `<button class="notif ${n.read ? '' : 'unread'}" data-action="notif" data-id="${n.id}">${iconTile(n.icon, n.tone, 'sm')}<span class="n-body"><span class="n-text">${withCodes(n.text)}</span><small>${timeAgo(n.at)}</small></span></button>`).join('') : '<p class="pop-empty">اعلانی ندارید.</p>'}</div>
    <p class="pop-foot">اعلان‌ها نمونه‌اند و فقط داخل همین دمو ساخته می‌شوند.</p>`;
}
function renderUserMenu() {
  const r = role(), u = USERS[r], other = r === 'company' ? 'expert' : 'company';
  $('#userPop').innerHTML = `<div class="user-card"><span class="avatar lg ${r}">${u.initials}</span><div><strong>${u.name}</strong><small>${r === 'company' ? `${u.title} · ${COMPANIES[ME].name}` : `${u.title} · ${u.unit}`}</small></div></div>
    <button class="menu-item" data-action="role" data-role="${other}">${icon(other === 'expert' ? 'userCheck' : 'factory')}${ROLE_LABEL[other]}</button>
    ${r === 'company' ? `<a class="menu-item" href="#/profile">${icon('building')}پروفایل شرکت</a>` : ''}
    <button class="menu-item danger" data-action="reset">${icon('reset')}بازنشانی داده‌های دمو</button>
    <p class="menu-note">ورود و نقش‌ها در این نسخه نمایشی‌اند.</p>`;
}
function togglePop(id) {
  const el = $('#' + id), open = el.hidden;
  closePopovers();
  if (!open) return;
  (id === 'notifPop' ? renderNotifs : renderUserMenu)();
  el.hidden = false;
}
function closePopovers() {
  $$('.popover').forEach(p => { p.hidden = true; });
  $('#searchResults').hidden = true;
}

/* ---------- overlays (modal + side drawer) and toasts ---------- */
const overlay = { key: null, reopen: null };
/* key identifies what is shown: re-opening the same key (after a state change) keeps the scroll position. */
function openPanel({ kind = 'modal', size = 'md', key = '', title, sub = '', body, footer = '', reopen = null }) {
  const root = $('#overlay'), again = !root.hidden && !!key && overlay.key === key;
  const scroll = again ? $('.panel-body', root).scrollTop : 0;
  root.innerHTML = `<div class="scrim" data-action="close"></div>
    <section class="panel panel-${kind} size-${size}" role="dialog" aria-modal="true" aria-label="${esc(title)}" tabindex="-1">
      <header class="panel-head"><div class="panel-title"><h2>${esc(title)}</h2>${sub ? `<div class="panel-sub">${sub}</div>` : ''}</div>
        <button class="icon-btn" data-action="close" aria-label="بستن">${icon('x')}</button></header>
      <div class="panel-body">${body}</div>
      ${footer ? `<footer class="panel-foot">${footer}</footer>` : ''}
    </section>`;
  const wasHidden = root.hidden;
  root.hidden = false;
  overlay.key = key; overlay.reopen = reopen;
  document.body.classList.add('locked');
  if (again) $('.panel-body', root).scrollTop = scroll;
  if (wasHidden) { root.classList.remove('show'); requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('show'))); }
  else root.classList.add('show');
  if (!again) $('.panel', root).focus({ preventScroll: true });
}
function closeOverlay() {
  const root = $('#overlay');
  if (root.hidden) return;
  root.hidden = true; root.classList.remove('show'); root.innerHTML = '';
  overlay.key = null; overlay.reopen = null;
  document.body.classList.remove('locked');
}
function refreshOverlay() { if (overlay.reopen) overlay.reopen(); }

function toast(msg, tone = 'ok') {
  const el = document.createElement('div');
  el.className = `toast toast-${tone}`;
  el.innerHTML = `${icon(tone === 'ok' ? 'checkCircle' : tone === 'warn' ? 'alert' : 'info')}<span>${msg}</span>`;
  $$('#toasts .toast').slice(0, -1).forEach(t => t.remove()); // keep at most two on screen
  $('#toasts').appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('show')));
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 350); }, 3800);
}

/* ---------- small shared UI pieces ---------- */
const toneCls = t => `tone-${t}`;
const iconTile = (ic, tone, size = '') => `<span class="itile ${toneCls(tone)} ${size}">${icon(ic)}</span>`;
const code = id => `<bdi class="code" dir="ltr">${esc(id)}</bdi>`;
const withCodes = text => esc(text).replace(/HS-\d{4}-\d{4}/g, m => code(m));
const statusPill = k => `<span class="pill ${toneCls(STATUS[k].tone)}"><i class="dot"></i>${STATUS[k].label}</span>`;
const prioPill = k => `<span class="prio ${toneCls(PRIORITIES[k].tone)}">${icon('flag')}${PRIORITIES[k].label}</span>`;
const catChip = (map, k) => `<span class="chip-cat ${toneCls(map[k].tone)}">${icon(map[k].icon)}${map[k].label}</span>`;
const demoTag = (text = 'داده نمایشی') => `<span class="demo-tag">${icon('info')}${text}</span>`;
const newBadge = t => (Date.now() - t < 3 * DAY ? '<span class="badge-new">جدید</span>' : '');
const kindBadge = k => (k === 'need' ? '<span class="kind kind-need">نیاز</span>' : '<span class="kind kind-offer">عرضه / فرصت</span>');

function stepper(status) {
  const cur = STATUS[status].step;
  return `<ol class="stepper">${STATUSES.map((s, i) => `<li class="${i < cur ? 'done' : i === cur ? 'current' : ''}"><span class="st-dot">${i < cur ? icon('check') : fa(i + 1)}</span><span class="st-label">${s.label}</span></li>`).join('')}</ol>`;
}
function miniSteps(status) {
  const cur = STATUS[status].step;
  return `<span class="mini-steps" title="مرحله ${fa(cur + 1)} از ۵">${STATUSES.map((s, i) => `<i class="${i <= cur ? 'on' : ''}"></i>`).join('')}</span>`;
}
const pageHead = (title, sub, actions = '') => `<div class="page-head"><div><h1>${title}</h1><p>${sub}</p></div>${actions ? `<div class="page-actions">${actions}</div>` : ''}</div>`;
const emptyState = (text, action = '') => `<div class="empty">${icon('search')}<p>${text}</p>${action}</div>`;
const chip = (label, active, action, attrs = '', count = null) => `<button class="fchip ${active ? 'on' : ''}" data-action="${action}" ${attrs} aria-pressed="${active}">${label}${count != null ? `<b>${fa(count)}</b>` : ''}</button>`;
const footerNote = () => `<footer class="foot-note">${icon('info')}<span>نمونه اولیه «هم‌صنعت خوزستان» برای ارائه به شرکت شهرک‌های صنعتی خوزستان. همه نام‌ها، اعداد، وضعیت‌ها و نتایج فرضی‌اند و به هیچ سامانه یا داده رسمی متصل نیستند.</span></footer>`;

/* ---------- form helpers ---------- */
function field(name, label, control, { hint = '', group = false, cls = '' } = {}) {
  const lab = group ? `<span class="label" id="l-${name}">${label}</span>` : `<label for="f-${name}">${label}</label>`;
  return `<div class="field ${cls}" data-field="${name}">${lab}${control}${hint ? `<p class="hint">${hint}</p>` : ''}<p class="field-error" role="alert"></p></div>`;
}
const textInput = (name, attrs = '') => `<input id="f-${name}" name="${name}" ${attrs}>`;
const textArea = (name, attrs = '') => `<textarea id="f-${name}" name="${name}" ${attrs}></textarea>`;
const selectBox = (name, options, value = '') => `<select id="f-${name}" name="${name}">${options.map(([v, l]) => `<option value="${v}" ${v === value ? 'selected' : ''}>${l}</option>`).join('')}</select>`;
const segmented = (name, options, value) => `<div class="seg" role="radiogroup" aria-labelledby="l-${name}">${options.map(([v, l, ic]) => `<label class="seg-opt"><input type="radio" name="${name}" value="${v}" ${v === value ? 'checked' : ''}><span>${ic ? icon(ic) : ''}${l}</span></label>`).join('')}</div>`;
const tilePicker = (name, options, value) => `<div class="tile-pick" role="radiogroup" aria-labelledby="l-${name}">${options.map(([v, l, ic, tone]) => `<label class="tp-opt ${toneCls(tone)}"><input type="radio" name="${name}" value="${v}" ${v === value ? 'checked' : ''}><span>${icon(ic)}${l}</span></label>`).join('')}</div>`;

/* Shows Persian per-field errors; returns true when the form is valid. */
function validate(form, rules) {
  const errs = {};
  for (const [name, check] of Object.entries(rules)) {
    const el = form.elements[name], v = el ? String(el.value ?? '').trim() : '';
    const msg = check(v);
    if (msg) errs[name] = msg;
  }
  $$('.field', form).forEach(f => {
    const msg = errs[f.dataset.field];
    f.classList.toggle('has-error', !!msg);
    const p = $('.field-error', f);
    if (p) p.innerHTML = msg ? `${icon('alert')}${msg}` : '';
  });
  const first = Object.keys(errs)[0];
  if (first) {
    const el = form.elements[first];
    (el && el.focus ? el : $(`[data-field="${first}"] input`, form))?.focus();
  }
  return !first;
}
const required = msg => v => (v ? '' : msg);
