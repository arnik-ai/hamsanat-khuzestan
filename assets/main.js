/* Wiring: one delegated listener per event type, the global search, and start-up. */

ACTIONS.close = () => closeOverlay();
ACTIONS.go = el => go(el.dataset.page, el.dataset.open || null);
ACTIONS.open = el => openItem(el.dataset.id);
ACTIONS['toggle-notifs'] = () => togglePop('notifPop');
ACTIONS['toggle-usermenu'] = () => togglePop('userPop');
ACTIONS['toggle-nav'] = () => document.body.classList.toggle('nav-open');
ACTIONS.role = el => {
  const to = el.dataset.role, changed = to !== role();
  closePopovers();
  go(to === 'expert' ? 'expert' : 'dashboard');
  if (changed) toast(to === 'expert' ? 'اکنون به‌عنوان کارشناس شهرک وارد شده‌اید و درخواست‌های همه شرکت‌ها را می‌بینید.' : 'اکنون به‌عنوان شرکت وارد شده‌اید.', 'info');
};
ACTIONS['read-all'] = () => {
  state.notifications.forEach(n => { if (n.role === role()) n.read = true; });
  save(); renderChrome(); renderNotifs();
};
ACTIONS.notif = el => {
  const n = state.notifications.find(x => x.id === el.dataset.id);
  if (!n) return;
  n.read = true; save(); closePopovers();
  if (n.link) go(n.link.page, n.link.open || null); else renderChrome();
};
ACTIONS.reset = () => {
  closePopovers();
  openPanel({
    size: 'sm', key: 'reset', title: 'بازنشانی داده‌های دمو',
    body: '<p class="prose">همه ثبت‌ها و تغییرات این جلسه پاک می‌شود و دمو به داده‌های نمونه اولیه برمی‌گردد. برای شروع یک ارائه تازه مناسب است.</p>',
    footer: `<button class="btn btn-primary" data-action="reset-yes">${icon('reset')}بازنشانی</button><button class="btn btn-ghost" data-action="close">انصراف</button>`
  });
};
ACTIONS['reset-yes'] = () => {
  try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ }
  state = seedState();
  Object.assign(ui.needs, { q: '', cat: 'all', kind: 'all', mine: false });
  Object.assign(ui.export, { q: '', market: 'all', cat: 'all' });
  Object.assign(ui.desk, { q: '', status: 'all', cat: 'all' });
  Object.assign(ui.expert, { q: '', status: 'open', cat: 'all', priority: 'all' });
  ui.events.type = 'all';
  save();
  go('dashboard');
  renderPage('dashboard');
  toast('داده‌های دمو به حالت اولیه برگشت.');
};

/* ---------- global search ---------- */
let srItems = [], srIndex = -1;
function renderSearch() {
  const q = $('#searchInput').value, box = $('#searchResults');
  srItems = searchAll(q); srIndex = -1;
  if (norm(q).length < 2) { box.hidden = true; return; }
  let html = '', group = '';
  srItems.forEach((r, i) => {
    if (r.group !== group) { group = r.group; html += `<div class="sr-group">${group}</div>`; }
    html += `<button class="sr-item" data-action="sr" data-i="${i}">${iconTile(r.icon, r.tone, 'sm')}<span><strong>${esc(r.title)}</strong><small>${withCodes(r.meta)}</small></span></button>`;
  });
  box.innerHTML = html || `<p class="sr-empty">نتیجه‌ای برای «${esc(q)}» پیدا نشد.</p>`;
  box.hidden = false;
}
ACTIONS.sr = el => {
  const r = srItems[+el.dataset.i];
  $('#searchInput').value = '';
  $('#searchResults').hidden = true;
  $('#searchInput').blur();
  go(r.page, r.open);
};

/* ---------- delegated listeners ---------- */
const setFilter = el => { const [pg, key] = el.dataset.filter.split('.'); ui[pg][key] = el.value; };

document.addEventListener('click', e => {
  const t = e.target;
  if (!t.closest('.pop-wrap') && !t.closest('#search')) closePopovers();
  if (t.closest('.nav-item')) document.body.classList.remove('nav-open');
  const el = t.closest('[data-action]');
  if (!el || el.disabled) return;
  const fn = ACTIONS[el.dataset.action];
  if (fn) { e.preventDefault(); fn(el, e); }
});

document.addEventListener('submit', e => {
  const form = e.target.closest('form[data-form]');
  if (!form) return;
  e.preventDefault();
  if (FORMS[form.dataset.form]) FORMS[form.dataset.form](form);
});

function clearFieldError(form, el) {
  const f = $(`[data-field="${el.name}"]`, form);
  if (f) f.classList.remove('has-error');
}
document.addEventListener('input', e => {
  const el = e.target;
  if (el.id === 'searchInput') return renderSearch();
  if (el.dataset.filter && el.tagName === 'INPUT') {
    setFilter(el);
    const P = PAGES[ui.page];
    if (P.results && $('#results')) $('#results').innerHTML = P.results(); else rerender();
    return;
  }
  const form = el.closest('form[data-form]');
  if (form) { clearFieldError(form, el); const hook = FORMS[form.dataset.form + 'Input']; if (hook) hook(form, el); }
});
document.addEventListener('change', e => {
  const el = e.target;
  if (el.dataset.filter && el.tagName === 'SELECT') { setFilter(el); return rerender(); }
  if (el.dataset.change && ACTIONS[el.dataset.change]) return ACTIONS[el.dataset.change](el);
  if (el.name === 'assignee' && overlay.key && overlay.key.startsWith('xcase:')) return FORMS.assigneeChange(el);
  const form = el.closest('form[data-form]');
  if (form) { clearFieldError(form, el); const hook = FORMS[form.dataset.form + 'Input']; if (hook) hook(form, el); }
});

document.addEventListener('keydown', e => {
  const open = !$('#overlay').hidden;
  if (e.key === 'Escape') {
    if (open) closeOverlay(); else { closePopovers(); document.body.classList.remove('nav-open'); }
    return;
  }
  if (e.key === 'Tab' && open) {
    const f = $$('#overlay .panel button, #overlay .panel [href], #overlay .panel input, #overlay .panel select, #overlay .panel textarea').filter(x => !x.disabled && x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement.classList.contains('panel'))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    return;
  }
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-action][tabindex]:not(button)')) { e.preventDefault(); e.target.click(); return; }
  if (e.key === '/' && !open && !e.target.closest('input, textarea, select')) { e.preventDefault(); $('#searchInput').focus(); }
});

$('#searchInput').addEventListener('keydown', e => {
  const items = $$('#searchResults .sr-item');
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    if (!items.length) return;
    e.preventDefault();
    srIndex = (srIndex + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
    items.forEach((x, i) => x.classList.toggle('active', i === srIndex));
    items[srIndex].scrollIntoView({ block: 'nearest' });
  } else if (e.key === 'Enter') {
    e.preventDefault();
    const it = items[srIndex >= 0 ? srIndex : 0];
    if (it) it.click();
  }
});
$('#searchInput').addEventListener('focus', () => { if (norm($('#searchInput').value).length >= 2) renderSearch(); });

/* Two windows of the demo (e.g. company + expert side by side) stay in sync. */
window.addEventListener('storage', e => {
  if (e.key !== STORE_KEY) return;
  state = loadState();
  renderPage(ui.page, true);
});
window.addEventListener('hashchange', onHashChange);

/* ---------- start ---------- */
$('#brandMark').innerHTML = icon('factory');
$('#searchIco').innerHTML = icon('search');
if (!location.hash) history.replaceState(null, '', '#/dashboard');
renderPage(pageFromHash());
