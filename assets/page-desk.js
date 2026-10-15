/* Page 4 — service desk (company view) and Page 5 — expert panel (expert view).
   Both work on the same state.cases, so a change on one side shows up on the other. */

const caseCount = (list, s) => list.filter(c => c.status === s).length;

function caseRow(c, expert) {
  const cat = CASE_CATS[c.cat];
  return `<tr class="row" data-action="open" data-id="${c.id}" tabindex="0">
    <td><div class="t-title">${iconTile(cat.icon, cat.tone, 'sm')}<div><strong>${esc(c.title)}</strong><small>${code(c.id)} · ${expert ? esc(companyOf(c).name) : cat.label}</small></div></div></td>
    ${expert ? `<td data-label="نوع">${catChip(CASE_CATS, c.cat)}</td>` : ''}
    <td data-label="تاریخ ثبت">${jDate(c.created)}</td>
    <td data-label="مسئول">${esc(c.assignee)}</td>
    <td data-label="اولویت">${prioPill(c.priority)}</td>
    <td data-label="وضعیت">${statusPill(c.status)}</td>
    <td class="t-go">${icon('chevLeft')}</td>
  </tr>`;
}
function caseTable(list, expert) {
  return `<div class="card table-card"><div class="table-wrap"><table class="tbl stack">
    <thead><tr><th>عنوان پرونده</th>${expert ? '<th>نوع درخواست</th>' : ''}<th>تاریخ ثبت</th><th>مسئول</th><th>اولویت</th><th>وضعیت</th><th></th></tr></thead>
    <tbody>${list.map(c => caseRow(c, expert)).join('')}</tbody></table></div></div>`;
}

function historyHTML(c, withNotes) {
  const items = c.history.map(h => ({ ...h, type: 'h' }));
  if (withNotes) items.push(...c.notes.map(n => ({ ...n, type: 'n' })));
  items.sort((a, b) => a.at - b.at);
  return `<ol class="timeline">${items.map(h => h.type === 'n'
    ? `<li class="tl-note"><span class="tl-dot">${icon('lock')}</span><div><div class="tl-head"><strong>یادداشت داخلی</strong><span>${esc(h.by)} · ${jDate(h.at)} ${jTime(h.at)}</span></div><p>${esc(h.text)}</p></div></li>`
    : `<li class="${h.kind === 'message' ? 'tl-msg' : ''}"><span class="tl-dot ${h.kind === 'status' ? toneCls(STATUS[h.status].tone) : 'tone-gray'}">${icon(h.kind === 'message' ? 'message' : h.kind === 'assign' ? 'user' : 'check')}</span>
        <div><div class="tl-head"><strong>${h.kind === 'status' ? STATUS[h.status].label : h.kind === 'assign' ? 'تغییر مسئول' : 'پیام'}</strong><span>${esc(h.by)} · ${jDate(h.at)} ${jTime(h.at)}</span></div>${h.text ? `<p>${esc(h.text)}</p>` : ''}</div></li>`).join('')}</ol>`;
}

function caseInfo(c) {
  return `<div class="sec">${stepper(c.status)}</div>
    <div class="kv sec">
      <div><div class="k">نوع درخواست</div><div class="v">${CASE_CATS[c.cat].label}</div></div>
      <div><div class="k">اولویت</div><div class="v">${prioPill(c.priority)}</div></div>
      <div><div class="k">تاریخ ثبت</div><div class="v"><bdi>${jDate(c.created)}</bdi> · <bdi>${timeAgo(c.created)}</bdi></div></div>
      <div><div class="k">مسئول پیگیری</div><div class="v">${esc(c.assignee)}</div></div>
      <div><div class="k">شرکت</div><div class="v">${esc(companyOf(c).name)}</div></div>
      <div><div class="k">محل</div><div class="v">${esc(c.location)}</div></div>
    </div>
    <div class="sec"><div class="sec-title">${icon('note')}شرح مشکل</div><p class="prose">${esc(c.desc)}</p>${c.note ? `<p class="prose muted">توضیحات تکمیلی: ${esc(c.note)}</p>` : ''}</div>`;
}

/* ---------- Page 4: company service desk ---------- */
PAGES.desk = {
  title: 'میز خدمت و پیگیری مشکلات',
  results() {
    const f = ui.desk, q = norm(f.q);
    const list = myCases().filter(c => (f.status === 'all' || c.status === f.status) && (f.cat === 'all' || c.cat === f.cat) && (!q || norm(c.id + c.title + c.desc).includes(q)))
      .sort((a, b) => b.updated - a.updated);
    return list.length ? caseTable(list, false) : `<div class="card">${emptyState('پرونده‌ای با این فیلترها پیدا نشد.', '<button class="btn btn-ghost btn-sm" data-action="df-clear">پاک کردن فیلترها</button>')}</div>`;
  },
  render() {
    const f = ui.desk, mine = myCases();
    return pageHead('میز خدمت و پیگیری مشکلات', 'مشکلات آب، برق، مجوزها، زیرساخت، محیط‌زیست و سایر موانع تولید را ثبت کنید و مسیر رسیدگی را مرحله‌به‌مرحله ببینید.',
      `<button class="btn btn-primary" data-action="new-case">${icon('plus')}ثبت مشکل جدید</button>`) +
      `<div class="flow card">
        <button class="flow-step ${f.status === 'all' ? 'on' : ''}" data-action="df" data-key="status" data-val="all"><b>${fa(mine.length)}</b><span>همه پرونده‌ها</span></button>
        ${STATUSES.map(s => `<button class="flow-step ${toneCls(s.tone)} ${f.status === s.key ? 'on' : ''}" data-action="df" data-key="status" data-val="${s.key}" aria-pressed="${f.status === s.key}"><b>${fa(caseCount(mine, s.key))}</b><span>${s.label}</span></button>`).join(`<span class="flow-arrow">${icon('chevLeft')}</span>`)}
      </div>
      <div class="toolbar">
        <label class="tsearch">${icon('search')}<input id="desk-q" type="search" placeholder="جست‌وجو با عنوان یا شناسه پرونده…" value="${esc(f.q)}" data-filter="desk.q" aria-label="جست‌وجوی پرونده"></label>
        <select id="desk-cat" class="tselect" data-filter="desk.cat" aria-label="دسته">${[['all', 'همه دسته‌ها'], ...PROBLEM_CATS.concat('export').map(k => [k, CASE_CATS[k].label])].map(([k, l]) => `<option value="${k}" ${f.cat === k ? 'selected' : ''}>${l}</option>`).join('')}</select>
      </div>
      <div id="results">${this.results()}</div>`;
  }
};

ACTIONS.df = el => { ui.desk[el.dataset.key] = el.dataset.val; rerender(); };
ACTIONS['df-clear'] = () => { Object.assign(ui.desk, { q: '', status: 'all', cat: 'all' }); rerender(); };
ACTIONS['new-case'] = el => openCaseForm({ cat: el.dataset.cat, title: el.dataset.title });

function openCaseForm(preset = {}) {
  const cats = PROBLEM_CATS.map(k => [k, CASE_CATS[k].label, CASE_CATS[k].icon, CASE_CATS[k].tone]);
  openPanel({
    size: 'md', key: 'case-form', title: preset.cat === 'permit' ? 'درخواست مجوز یا پیگیری مجوز' : 'ثبت مشکل جدید',
    sub: `<span>ثبت به نام ${esc(COMPANIES[ME].name)} · ${esc(COMPANIES[ME].park)}</span>`,
    body: `<form id="caseForm" class="form-grid" data-form="case" novalidate>
      ${field('cat', 'موضوع', tilePicker('cat', cats, preset.cat || ''), { group: true, cls: 'full' })}
      ${field('title', 'عنوان کوتاه', textInput('title', `maxlength="80" autocomplete="off" placeholder="مثلاً: قطعی مکرر برق در ساعات اوج" value="${esc(preset.title || '')}"`), { cls: 'full' })}
      ${field('desc', 'شرح مشکل', textArea('desc', 'rows="3" maxlength="500" placeholder="چه اتفاقی افتاده، از کی، و چه اثری بر تولید داشته است؟"'), { cls: 'full' })}
      ${field('priority', 'اولویت', segmented('priority', Object.entries(PRIORITIES).map(([k, p]) => [k, p.label]), 'medium'), { group: true, cls: 'full', hint: 'فوری: تولید متوقف شده است. زیاد: تولید مختل شده است.' })}
      ${field('note', 'توضیحات تکمیلی (اختیاری)', textArea('note', 'rows="2" maxlength="300" placeholder="شماره قطعه، ساعت تماس مناسب یا هر نکته دیگر"'), { cls: 'full' })}
    </form>`,
    footer: `<button class="btn btn-primary" type="submit" form="caseForm">${icon('send')}ثبت پرونده</button><button class="btn btn-ghost" data-action="close">انصراف</button>`
  });
}

FORMS.case = form => {
  const ok = validate(form, {
    cat: required('موضوع را انتخاب کنید.'),
    title: v => (!v ? 'یک عنوان کوتاه بنویسید.' : v.length < 5 ? 'عنوان کوتاه است؛ دست‌کم ۵ حرف بنویسید.' : ''),
    desc: v => (!v ? 'شرح مشکل را بنویسید.' : v.length < 15 ? 'کمی بیشتر توضیح دهید (دست‌کم ۱۵ حرف) تا کارشناس سریع‌تر اقدام کند.' : ''),
    priority: required('اولویت را انتخاب کنید.')
  });
  if (!ok) return;
  const d = Object.fromEntries(new FormData(form));
  const c = createCase({ cat: d.cat, title: d.title.trim(), desc: d.desc.trim(), priority: d.priority, note: (d.note || '').trim() });
  rerender();
  openPanel({
    size: 'sm', key: 'case-ok:' + c.id, title: 'پرونده ثبت شد',
    body: `<div class="success-hero"><span class="ok">${icon('check')}</span><h3>کد پیگیری: ${code(c.id)}</h3>
        <p>وضعیت فعلی «ثبت‌شده» است و به میز خدمت شهرک اطلاع داده شد. هر تغییر وضعیت را در اعلان‌ها و همین بخش می‌بینید.</p></div>
      <div class="sec">${stepper('new')}</div>`,
    footer: `<button class="btn btn-primary" data-action="go" data-page="desk" data-open="${c.id}">مشاهده پرونده</button><button class="btn btn-ghost" data-action="close">بستن</button>`
  });
};

function openCase(id) {
  const c = findCase(id);
  if (!c) return toast('این پرونده پیدا نشد.', 'warn');
  const mine = c.company === ME;
  const answered = c.status === 'answered' && mine;
  openPanel({
    kind: 'drawer', key: 'case:' + id, reopen: () => openCase(id), title: c.title,
    sub: `${code(c.id)}${statusPill(c.status)}${prioPill(c.priority)}`,
    body: `${answered ? `<div class="notice tone-blue">${icon('message')}<span>کارشناس پاسخ داده است. اگر مشکل برطرف شده، پرونده را ببندید؛ در غیر این صورت «هنوز حل نشده» را بزنید تا دوباره بررسی شود.</span></div>` : ''}
      ${caseInfo(c)}
      <div class="sec"><div class="sec-title">${icon('history')}تاریخچه مراحل</div>${historyHTML(c, false)}</div>
      ${mine && c.status !== 'closed' ? `<form class="sec reply" data-form="message" data-id="${c.id}" novalidate>
        ${field('msg', 'ارسال توضیح تکمیلی برای کارشناس', textArea('msg', 'rows="2" maxlength="300" placeholder="مثلاً: امروز صبح هم قطعی داشتیم."'))}
        <button class="btn btn-soft btn-sm" type="submit">${icon('send')}ارسال</button></form>` : ''}
      <div class="notice tone-gray sec">${icon('info')}<span>وضعیت پرونده را کارشناس شهرک تغییر می‌دهد. برای نشان دادن آن، دکمه «${ROLE_LABEL.expert}» را در بالای صفحه بزنید.</span></div>`,
    footer: (answered
      ? `<button class="btn btn-green" data-action="close-case" data-id="${c.id}">${icon('checkCircle')}رفع شد؛ بستن پرونده</button><button class="btn btn-ghost" data-action="reopen-case" data-id="${c.id}">هنوز حل نشده</button>`
      : '') + `<button class="btn btn-ghost" data-action="as-expert" data-id="${c.id}">${icon('userCheck')}مشاهده به‌عنوان کارشناس شهرک</button>`
  });
}

FORMS.message = form => {
  if (!validate(form, { msg: v => (!v ? 'متن پیام را بنویسید.' : '') })) return;
  const c = findCase(form.dataset.id), text = form.elements.msg.value.trim();
  c.history.push({ at: Date.now(), kind: 'message', role: 'company', by: USERS.company.name, text });
  c.updated = Date.now();
  notify('expert', { icon: 'message', tone: 'blue', text: `پیام تازه شرکت در پرونده ${c.id}.`, link: { page: 'expert', open: c.id } });
  save();
  rerender();
  toast('پیام برای کارشناس ارسال شد.');
};
ACTIONS['close-case'] = el => { changeStatus(findCase(el.dataset.id), 'closed', 'مشکل برطرف شد؛ پرونده توسط شرکت بسته شد.', 'company'); rerender(); toast('پرونده بسته شد. از بازخورد شما متشکریم.'); };
ACTIONS['reopen-case'] = el => { changeStatus(findCase(el.dataset.id), 'review', 'شرکت اعلام کرد مشکل هنوز حل نشده است؛ پرونده دوباره در حال بررسی است.', 'company'); rerender(); toast('پرونده دوباره به «در حال بررسی» برگشت.', 'info'); };
ACTIONS['as-expert'] = el => go('expert', el.dataset.id);

/* ---------- Page 5: expert panel ---------- */
PAGES.expert = {
  title: 'پنل کارشناس',
  results() {
    const f = ui.expert, q = norm(f.q);
    const list = state.cases.filter(c =>
      (f.status === 'all' || (f.status === 'open' ? c.status !== 'closed' : c.status === f.status)) &&
      (f.cat === 'all' || c.cat === f.cat) && (f.priority === 'all' || c.priority === f.priority) &&
      (!q || norm(c.id + c.title + companyOf(c).name).includes(q)))
      .sort((a, b) => b.updated - a.updated);
    return `<p class="result-count">${fa(list.length)} درخواست</p>` + (list.length ? caseTable(list, true)
      : `<div class="card">${emptyState('درخواستی با این فیلترها پیدا نشد.', '<button class="btn btn-ghost btn-sm" data-action="ef-clear">پاک کردن فیلترها</button>')}</div>`);
  },
  render() {
    const f = ui.expert, all = state.cases, fu = followUps();
    const open = all.filter(c => c.status !== 'closed').length;
    const weekAnswered = all.filter(c => c.history.some(h => h.status === 'answered' && Date.now() - h.at < 7 * DAY)).length;
    const opt = (list, val) => list.map(([k, l]) => `<option value="${k}" ${val === k ? 'selected' : ''}>${l}</option>`).join('');
    return `<section class="role-banner">
        <span class="avatar lg expert">${USERS.expert.initials}</span>
        <div><h1>پنل کارشناس · ${USERS.expert.name}</h1><p>${USERS.expert.title} · ${USERS.expert.unit}. شما به‌عنوان کارشناس شهرک وارد شده‌اید: درخواست‌های همه شرکت‌ها را می‌بینید، وضعیت را تغییر می‌دهید و یادداشت داخلی ثبت می‌کنید.</p></div>
        <button class="btn btn-ghost btn-sm" data-action="role" data-role="company">${icon('factory')}${ROLE_LABEL.company}</button>
      </section>
      <div class="kpis">
        <div class="kpi card">${iconTile('inbox', 'blue')}<div><b>${fa(open)}</b><span>درخواست باز</span></div></div>
        <div class="kpi card">${iconTile('plusCircle', 'gray')}<div><b>${fa(caseCount(all, 'new'))}</b><span>جدید، بدون اقدام</span></div></div>
        <div class="kpi card">${iconTile('alert', 'red')}<div><b>${fa(fu.length)}</b><span>نیازمند پیگیری</span></div></div>
        <div class="kpi card">${iconTile('message', 'green')}<div><b>${fa(weekAnswered)}</b><span>پاسخ‌داده‌شده در ۷ روز</span></div></div>
      </div>
      <div class="expert-grid">
        <div class="expert-main">
          <div class="toolbar">
            <label class="tsearch">${icon('search')}<input id="expert-q" type="search" placeholder="شرکت، عنوان یا شناسه…" value="${esc(f.q)}" data-filter="expert.q" aria-label="جست‌وجوی درخواست"></label>
            <select id="expert-cat" class="tselect" data-filter="expert.cat" aria-label="نوع درخواست">${opt([['all', 'همه انواع'], ...Object.entries(CASE_CATS).map(([k, v]) => [k, v.label])], f.cat)}</select>
            <select id="expert-priority" class="tselect" data-filter="expert.priority" aria-label="اولویت">${opt([['all', 'همه اولویت‌ها'], ...Object.entries(PRIORITIES).map(([k, v]) => [k, 'اولویت ' + v.label])], f.priority)}</select>
            <select id="expert-status" class="tselect" data-filter="expert.status" aria-label="وضعیت">${opt([['open', 'همه باز'], ['all', 'همه وضعیت‌ها'], ...STATUSES.map(s => [s.key, s.label])], f.status)}</select>
          </div>
          <div id="results">${this.results()}</div>
        </div>
        <aside class="card followups">
          <div class="card-head"><h2>${icon('alert')}نیازمند پیگیری</h2><span class="sub">${fa(fu.length)} پرونده</span></div>
          <ul>${fu.length ? fu.map(({ c, reasons }) => `<li><button class="fu" data-action="open" data-id="${c.id}">
            <span class="fu-top">${code(c.id)}${prioPill(c.priority)}</span>
            <strong>${esc(c.title)}</strong><small>${esc(companyOf(c).name)}</small>
            <span class="fu-reasons">${reasons.map(r => `<span>${icon('clock')}${r}</span>`).join('')}</span></button></li>`).join('')
            : `<li class="muted fu-empty">${icon('checkCircle')}همه پرونده‌ها در زمان مقرر پیگیری شده‌اند.</li>`}</ul>
          <p class="fu-rule">قاعده نمایشی: اولویت فوری، بیش از یک روز بدون اقدام، یا گذشتن از سررسید پاسخ بر اساس اولویت.</p>
        </aside>
      </div>`;
  }
};

ACTIONS['ef-clear'] = () => { Object.assign(ui.expert, { q: '', status: 'open', cat: 'all', priority: 'all' }); rerender(); };

function openExpertCase(id) {
  const c = findCase(id);
  if (!c) return toast('این پرونده پیدا نشد.', 'warn');
  const cur = STATUS[c.status].step, next = cur < 4 ? cur + 1 : -1;
  openPanel({
    kind: 'drawer', key: 'xcase:' + id, reopen: () => openExpertCase(id), title: c.title,
    sub: `${code(c.id)}${statusPill(c.status)}${prioPill(c.priority)}<span>${esc(companyOf(c).name)}</span>`,
    body: `${caseInfo(c)}
      <form class="sec act-box" data-form="status" data-id="${c.id}" novalidate>
        <div class="sec-title">${icon('reset')}تغییر وضعیت</div>
        <div class="status-pick" role="radiogroup" aria-label="وضعیت جدید">${STATUSES.map((s, i) => `<label class="sp-opt ${toneCls(s.tone)}"><input type="radio" name="status" value="${s.key}" ${i === next ? 'checked' : ''} ${s.key === c.status ? 'disabled' : ''}><span>${s.label}${s.key === c.status ? ' (فعلی)' : ''}</span></label>`).join('')}</div>
        ${field('text', 'پیام برای شرکت (اختیاری)', textArea('text', 'rows="2" maxlength="300" placeholder="مثلاً: موضوع به واحد برق ارجاع شد؛ نتیجه تا پایان هفته اعلام می‌شود."'))}
        <button class="btn btn-primary btn-sm" type="submit">${icon('check')}ثبت وضعیت و اطلاع به شرکت</button>
      </form>
      <div class="sec act-row">
        ${field('assignee', 'مسئول پیگیری', selectBox('assignee', UNITS.map(u => [u, u]), c.assignee))}
      </div>
      <form class="sec act-box note-box" data-form="note" data-id="${c.id}" novalidate>
        <div class="sec-title">${icon('lock')}یادداشت داخلی <span class="sec-count">فقط کارشناسان می‌بینند</span></div>
        ${field('note', 'متن یادداشت', textArea('note', 'rows="2" maxlength="300" placeholder="مثلاً: با مسئول پست برق تماس گرفته شد."'))}
        <button class="btn btn-soft btn-sm" type="submit">${icon('note')}ثبت یادداشت</button>
      </form>
      <div class="sec"><div class="sec-title">${icon('history')}تاریخچه و یادداشت‌ها</div>${historyHTML(c, true)}</div>`,
    footer: `<button class="btn btn-ghost" data-action="close">بستن</button>`
  });
}

FORMS.status = form => {
  if (!validate(form, { status: required('وضعیت جدید را انتخاب کنید.') })) return;
  const c = findCase(form.dataset.id), status = form.elements.status.value;
  changeStatus(c, status, form.elements.text.value.trim(), 'expert');
  rerender();
  toast(`وضعیت به «${STATUS[status].label}» تغییر کرد و به شرکت اطلاع داده شد.`);
};
FORMS.note = form => {
  if (!validate(form, { note: v => (!v ? 'متن یادداشت را بنویسید.' : '') })) return;
  const c = findCase(form.dataset.id);
  c.notes.push({ at: Date.now(), by: USERS.expert.name, text: form.elements.note.value.trim() });
  save();
  rerender();
  toast('یادداشت داخلی ثبت شد؛ برای شرکت نمایش داده نمی‌شود.', 'info');
};
/* assignee <select> inside the expert drawer */
FORMS.assigneeChange = el => {
  const c = findCase(overlay.key.split(':')[1]);
  if (!c || c.assignee === el.value) return;
  c.assignee = el.value; c.updated = Date.now();
  c.history.push({ at: c.updated, kind: 'assign', role: 'expert', by: `${USERS.expert.name} — میز خدمت`, text: `مسئول پیگیری: ${el.value}` });
  save();
  rerender();
  toast(`مسئول پیگیری به «${el.value}» تغییر کرد.`, 'info');
};
