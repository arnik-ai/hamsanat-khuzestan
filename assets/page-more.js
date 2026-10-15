/* Lighter sidebar sections: services & permits, training & events, company profile.
   They reuse the same forms and data as the main pages, so nothing here is decorative. */

/* ---------- services & permits ---------- */
PAGES.services = {
  title: 'خدمات و مجوزها',
  render() {
    const recent = myCases().filter(c => c.cat !== 'export').sort((a, b) => b.updated - a.updated).slice(0, 4);
    return pageHead('خدمات و مجوزها', 'درخواست‌های مرتبط با مجوزها و خدمات زیربنایی را از یک جا ثبت کنید؛ پیگیری همه آن‌ها در میز خدمت انجام می‌شود.') +
      `<div class="notice tone-amber">${icon('info')}<span>در این نسخه نمایشی، درخواست‌ها فقط داخل همین دمو ثبت و پیگیری می‌شوند و به هیچ سامانه رسمی متصل نیستند. زمان‌های رسیدگی هم نمونه‌اند.</span></div>
      <div class="svc-grid">${SERVICES.map(s => {
        const cat = CASE_CATS[s.cat];
        return `<article class="svc card">
          <div class="svc-top">${iconTile(cat.icon, cat.tone, 'lg')}${catChip(CASE_CATS, s.cat)}</div>
          <h3>${s.title}</h3><p>${s.desc}</p>
          <div class="svc-foot"><span class="meta"><span>${icon('clock')}حدود ${fa(s.eta)} روز کاری</span></span>
            <button class="btn btn-soft btn-sm" data-action="new-case" data-cat="${s.cat}" data-title="${esc(s.title)}">ثبت درخواست</button></div>
        </article>`;
      }).join('')}</div>
      <section class="card svc-recent">
        <div class="card-head"><h2>درخواست‌های اخیر شما</h2><a class="link" href="#/desk">پیگیری در میز خدمت${icon('chevLeft')}</a></div>
        <ul class="rows">${recent.map(c => `<li><button class="row-btn" data-action="open" data-id="${c.id}">${iconTile(CASE_CATS[c.cat].icon, CASE_CATS[c.cat].tone, 'sm')}
          <span class="row-main"><strong>${esc(c.title)}</strong><small>${code(c.id)} · ${jDate(c.created)}</small></span>${statusPill(c.status)}</button></li>`).join('')}</ul>
      </section>`;
  }
};

/* ---------- training & events ---------- */
const EVENT_TABS = [['all', 'همه'], ['expo', 'رویداد و نشست'], ['training', 'آموزش'], ['notice', 'اطلاعیه']];
const eventMatches = (e, t) => t === 'all' || e.type === t || (t === 'expo' && e.type === 'meeting');

function eventCard(e) {
  const reg = state.registrations[e.id], d = new Date(e.date), left = e.seats ? e.seats - e.taken - (reg ? 1 : 0) : null;
  const act = e.type === 'notice'
    ? `<button class="btn btn-ghost btn-sm" data-action="open" data-id="${e.id}">مطالعه اطلاعیه</button>`
    : reg ? `<span class="pill tone-green">${icon('check')}ثبت‌نام شدید</span><button class="link" data-action="unregister" data-id="${e.id}">لغو</button>`
      : `<button class="btn btn-primary btn-sm" data-action="register" data-id="${e.id}">ثبت‌نام</button>`;
  return `<article class="ecard card">
    <div class="edate ${toneCls(EVENT_TYPES[e.type].tone)}"><b>${fmtDay.format(d)}</b><span>${fmtMonth.format(d)}</span><small>${fmtWeekday.format(d)}</small></div>
    <div class="ebody">
      <div class="ncard-top">${catChip(EVENT_TYPES, e.type)}<span class="muted">${until(e.date)}</span></div>
      <h3>${esc(e.title)}</h3>
      <div class="meta"><span>${icon('pin')}${esc(e.place)}</span>${e.type !== 'notice' ? `<span>${icon(e.mode === 'آنلاین' ? 'globe' : 'users')}${e.mode}</span>` : ''}${left != null ? `<span>${icon('users')}${fa(left)} جای خالی</span>` : ''}</div>
      <p class="edesc">${esc(e.desc)}</p>
    </div>
    <div class="eact">${act}<button class="link" data-action="open" data-id="${e.id}">جزئیات${icon('chevLeft')}</button></div>
  </article>`;
}

PAGES.events = {
  title: 'آموزش و رویدادها',
  render() {
    const t = ui.events.type, list = state.events.filter(e => eventMatches(e, t)).sort((a, b) => a.date - b.date);
    const regs = state.events.filter(e => state.registrations[e.id]).length;
    return pageHead('آموزش و رویدادها', 'نمایشگاه‌ها، نشست‌های تخصصی، دوره‌های آموزشی و اطلاعیه‌های شهرک‌ها؛ ثبت‌نام شما در همین دمو نگه داشته می‌شود.',
      regs ? `<span class="pill tone-green">${icon('check')}${fa(regs)} ثبت‌نام فعال</span>` : '') +
      `<div class="fchips">${EVENT_TABS.map(([k, l]) => chip(l, t === k, 'ev-tab', `data-val="${k}"`, state.events.filter(e => eventMatches(e, k)).length)).join('')}${demoTag('رویدادها نمونه‌اند')}</div>
      <div class="elist">${list.map(eventCard).join('')}</div>`;
  }
};

ACTIONS['ev-tab'] = el => { ui.events.type = el.dataset.val; rerender(); };
ACTIONS.register = el => {
  const e = findEvent(el.dataset.id);
  state.registrations[e.id] = Date.now();
  notify('company', { icon: 'calendar', tone: 'orange', text: `ثبت‌نام شما در «${e.title}» انجام شد.`, link: { page: 'events', open: e.id } });
  save();
  rerender();
  toast(`ثبت‌نام در «${e.title}» انجام شد (نمایشی).`);
};
ACTIONS.unregister = el => {
  delete state.registrations[el.dataset.id];
  save();
  rerender();
  toast('ثبت‌نام لغو شد.', 'info');
};

function openEvent(id) {
  const e = findEvent(id);
  if (!e) return toast('این رویداد پیدا نشد.', 'warn');
  const reg = state.registrations[e.id], d = new Date(e.date), taken = (e.taken || 0) + (reg ? 1 : 0);
  openPanel({
    size: 'md', key: 'event:' + id, reopen: () => openEvent(id), title: e.title,
    sub: `${catChip(EVENT_TYPES, e.type)}${demoTag(e.type === 'notice' ? 'اطلاعیه نمونه' : 'رویداد نمونه')}`,
    body: `<div class="kv">
        <div><div class="k">تاریخ</div><div class="v">${fmtWeekday.format(d)} ${jLong(e.date)}</div></div>
        <div><div class="k">زمان باقی‌مانده</div><div class="v">${until(e.date)}</div></div>
        <div><div class="k">محل</div><div class="v">${esc(e.place)}</div></div>
        <div><div class="k">نحوه برگزاری</div><div class="v">${e.mode}</div></div>
      </div>
      <div class="sec"><p class="prose">${esc(e.desc)}</p></div>
      ${e.seats ? `<div class="sec"><div class="progress"><i style="width:${Math.round(taken / e.seats * 100)}%"></i></div><p class="small-note">${fa(taken)} نفر از ظرفیت ${fa(e.seats)} نفر ثبت‌نام کرده‌اند (نمایشی).</p></div>` : ''}`,
    footer: e.type === 'notice' ? '<button class="btn btn-ghost" data-action="close">بستن</button>'
      : reg ? `<button class="btn btn-done" disabled>${icon('check')}ثبت‌نام شدید</button><button class="btn btn-ghost" data-action="unregister" data-id="${e.id}">لغو ثبت‌نام</button>`
        : `<button class="btn btn-primary" data-action="register" data-id="${e.id}">${icon('check')}ثبت‌نام</button><button class="btn btn-ghost" data-action="close">بستن</button>`
  });
}

/* ---------- company profile ---------- */
PAGES.profile = {
  title: 'پروفایل شرکت',
  render() {
    const c = COMPANIES[ME], prods = state.products.filter(p => p.company === ME), needs = state.needs.filter(x => x.company === ME), cases = myCases();
    return pageHead('پروفایل شرکت', 'اطلاعات پایه شرکت که در تطبیق نیازها، صادرات و میز خدمت به کار می‌رود.') +
      `<section class="card prof-head">
        <span class="prof-logo">${icon('factory')}</span>
        <div class="prof-id"><h2>${c.name}</h2><p>${c.field}</p>
          <div class="meta"><span>${icon('pin')}${c.park} — ${c.plot}</span><span>${icon('calendar')}تأسیس ${fa(c.founded)}</span><span>${icon('users')}${fa(c.staff)} نفر</span><span>${icon('user')}${USERS.company.name}، ${USERS.company.title}</span></div></div>
        <div class="prof-side">${demoTag('شرکت فرضی')}<div class="std">${c.certs.map(s => `<span class="tag hit">${icon('shield')}${s}</span>`).join('')}</div></div>
      </section>
      <div class="prof-grid">
        <section class="card"><div class="card-head"><h2>محصولات صادراتی</h2><a class="link" href="#/export">صادرات${icon('chevLeft')}</a></div>
          <ul class="rows">${prods.map(p => `<li><button class="row-btn" data-action="open" data-id="${p.id}">${iconTile(PRODUCT_CATS[p.cat].icon, PRODUCT_CATS[p.cat].tone, 'sm')}<span class="row-main"><strong>${esc(p.name)}</strong><small>ظرفیت: ${esc(p.capacity)}</small></span><span class="flags">${p.markets.map(m => flag(m, 'sm')).join('')}</span></button></li>`).join('')}</ul></section>
        <section class="card"><div class="card-head"><h2>نیازها و فرصت‌های ثبت‌شده</h2><button class="link" data-action="my-needs">همه${icon('chevLeft')}</button></div>
          <ul class="rows">${needs.slice(0, 4).map(x => `<li><button class="row-btn" data-action="open" data-id="${x.id}">${iconTile(NEED_CATS[x.cat].icon, NEED_CATS[x.cat].tone, 'sm')}<span class="row-main"><strong>${esc(x.title)}</strong><small>${timeAgo(x.created)}</small></span>${kindBadge(x.kind)}</button></li>`).join('')}</ul></section>
        <section class="card"><div class="card-head"><h2>پرونده‌های میز خدمت</h2><a class="link" href="#/desk">میز خدمت${icon('chevLeft')}</a></div>
          <div class="prof-status">${STATUSES.map(s => `<button class="ps ${toneCls(s.tone)}" data-action="desk-filter" data-val="${s.key}"><b>${fa(caseCount(cases, s.key))}</b><span>${s.label}</span></button>`).join('')}</div></section>
      </div>`;
  }
};

ACTIONS['my-needs'] = () => { Object.assign(ui.needs, { q: '', cat: 'all', kind: 'all', mine: true }); go('needs'); };
ACTIONS['desk-filter'] = el => { Object.assign(ui.desk, { q: '', cat: 'all', status: el.dataset.val }); go('desk'); };
