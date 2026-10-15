/* Page 2 — needs and opportunities, with simple rule-based matching. */

const toLatin = s => String(s ?? '').replace(/[۰-۹]/g, d => FA_DIGITS.indexOf(d)).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[,٬\s]/g, '');
const UNIT_OPTIONS = ['تن در ماه', 'هزار عدد در ماه', 'نفر', 'میلیارد تومان'];
const UNIT_BY_CAT = { material: 'تن در ماه', workforce: 'نفر', investment: 'میلیارد تومان', service: 'تن در ماه' };

function filteredNeeds() {
  const f = ui.needs, q = norm(f.q);
  return state.needs
    .filter(x => (f.cat === 'all' || x.cat === f.cat) && (f.kind === 'all' || x.kind === f.kind) && (!f.mine || x.company === ME) &&
      (!q || norm(x.title + companyOf(x).name + x.desc + x.tags.join('')).includes(q)))
    .sort((a, b) => b.created - a.created);
}

function needCard(x) {
  const c = companyOf(x), m = matchesFor(x).length;
  return `<article class="ncard card" data-action="open" data-id="${x.id}" tabindex="0" role="button" aria-label="${esc(x.title)}">
    <div class="ncard-top">${catChip(NEED_CATS, x.cat)}${kindBadge(x.kind)}${x.company === ME ? '<span class="badge-mine">ثبت شما</span>' : ''}${newBadge(x.created)}</div>
    <h3>${esc(x.title)}</h3>
    <div class="meta"><span>${icon('building')}${esc(c.name)}</span><span>${icon('pin')}${esc(c.city)}</span></div>
    ${x.amount ? `<div class="ncard-amount">${x.kind === 'need' ? 'مقدار نیاز' : 'ظرفیت'}: <b>${faNum(x.amount)} ${x.unit}</b></div>` : ''}
    <div class="ncard-foot"><span class="muted">${timeAgo(x.created)}</span>${m ? `<span class="match-hint">${icon('sparkles')}${fa(m)} پیشنهاد مرتبط</span>` : ''}</div>
  </article>`;
}

PAGES.needs = {
  title: 'نیازمندی‌ها و فرصت‌ها',
  results() {
    const list = filteredNeeds();
    return `<p class="result-count">${fa(list.length)} مورد</p>` + (list.length
      ? `<div class="ngrid">${list.map(needCard).join('')}</div>`
      : `<div class="card">${emptyState('موردی با این فیلترها پیدا نشد.', '<button class="btn btn-ghost btn-sm" data-action="nf-clear">پاک کردن فیلترها</button>')}</div>`);
  },
  render() {
    const f = ui.needs, base = state.needs.filter(x => (f.kind === 'all' || x.kind === f.kind) && (!f.mine || x.company === ME));
    const cats = [['all', 'همه دسته‌ها', base.length], ...Object.entries(NEED_CATS).map(([k, v]) => [k, v.label, base.filter(x => x.cat === k).length])];
    return pageHead('نیازمندی‌ها و فرصت‌های صنعتی', 'نیازهای ثبت‌شده شرکت‌ها و فرصت‌های همکاری را ببینید، نیاز خود را ثبت کنید و پیشنهادهای مرتبط را همراه با دلیل تطبیق بگیرید.',
      `<button class="btn btn-ghost" data-action="new-need" data-kind="offer">${icon('handshake')}ثبت فرصت همکاری</button><button class="btn btn-primary" data-action="new-need" data-kind="need">${icon('plus')}ثبت نیاز جدید</button>`) +
      `<div class="toolbar">
        <label class="tsearch">${icon('search')}<input id="needs-q" type="search" placeholder="جست‌وجو در عنوان، شرکت یا توضیح…" value="${esc(f.q)}" data-filter="needs.q" aria-label="جست‌وجو در نیازها"></label>
        <div class="segbar" role="group" aria-label="نوع">${[['all', 'همه'], ['need', 'نیازها'], ['offer', 'عرضه و فرصت‌ها']].map(([k, l]) => `<button class="${f.kind === k ? 'on' : ''}" data-action="nf" data-key="kind" data-val="${k}" aria-pressed="${f.kind === k}">${l}</button>`).join('')}</div>
        ${chip(`${icon('user')}ثبت‌شده‌های من`, f.mine, 'nf', `data-key="mine" data-val="${!f.mine}"`)}
      </div>
      <div class="fchips cat-chips">${cats.map(([k, l, n]) => chip(l, f.cat === k, 'nf', `data-key="cat" data-val="${k}"`, n)).join('')}</div>
      <div id="results">${this.results()}</div>`;
  },
  after() {
    if (!ui.flash) return;
    const el = $(`.ncard[data-id="${ui.flash}"]`);
    ui.flash = null;
    if (el) { el.classList.add('flash'); el.scrollIntoView({ block: 'center' }); }
  }
};

ACTIONS.nf = el => {
  const k = el.dataset.key;
  ui.needs[k] = k === 'mine' ? el.dataset.val === 'true' : el.dataset.val;
  rerender();
};
ACTIONS['nf-clear'] = () => { Object.assign(ui.needs, { q: '', cat: 'all', kind: 'all', mine: false }); rerender(); };
ACTIONS['new-need'] = el => openNeedForm(el.dataset.kind);
ACTIONS['see-need'] = el => {
  Object.assign(ui.needs, { q: '', cat: 'all', kind: 'all', mine: false });
  ui.flash = el.dataset.id;
  if (ui.page === 'needs') { closeOverlay(); rerender(); PAGES.needs.after(); } else go('needs');
};
ACTIONS.connect = el => {
  state.contacts[el.dataset.id] = Date.now();
  save();
  toast('درخواست ارتباط ثبت شد؛ پس از تأیید طرف مقابل، اطلاعات تماس نمایش داده می‌شود (نمایشی).');
  refreshOverlay();
};

function matchesHTML(x, ms) {
  const head = `<div class="sec-title">${icon('sparkles')}پیشنهادهای مرتبط ${demoTag('تطبیق با قواعد ساده')}</div>`;
  if (!ms.length) return head + '<p class="muted">فعلاً مورد هم‌خوانی پیدا نشد؛ با ثبت موارد تازه، پیشنهادها به‌روز می‌شوند.</p>';
  return head + `<div class="matches">${ms.map(m => {
    const [lvl, t] = matchLevel(m.score), o = companyOf(m.item);
    return `<div class="match">
      <div class="match-score ${toneCls(t)}" style="--p:${m.score}"><b>${fa(m.score)}٪</b><small>${lvl}</small></div>
      <div class="match-main">
        <div class="match-title"><strong>${esc(m.item.title)}</strong>${kindBadge(m.item.kind)}</div>
        <div class="meta"><span>${icon('building')}${esc(o.name)}</span><span>${icon('pin')}${esc(o.city)}</span></div>
        <ul class="reasons">${m.reasons.map(r => `<li>${icon('check')}<span>${esc(r)}</span></li>`).join('')}</ul>
      </div>
      <button class="btn btn-ghost btn-sm" data-action="open" data-id="${m.item.id}">مشاهده</button>
    </div>`;
  }).join('')}</div>`;
}

function openNeed(id) {
  const x = findNeed(id);
  if (!x) return toast('این مورد پیدا نشد.', 'warn');
  const c = companyOf(x), mine = x.company === ME, sent = state.contacts[x.id];
  const contactBtn = sent
    ? `<button class="btn btn-done" disabled>${icon('check')}درخواست ارتباط ارسال شد</button>`
    : `<button class="btn btn-primary" data-action="connect" data-id="${x.id}">${icon('send')}درخواست ارتباط با ${x.kind === 'need' ? 'متقاضی' : 'عرضه‌کننده'}</button>`;
  openPanel({
    size: 'lg', key: 'need:' + id, reopen: () => openNeed(id), title: x.title,
    sub: `${catChip(NEED_CATS, x.cat)}${kindBadge(x.kind)}${mine ? '<span class="badge-mine">ثبت شما</span>' : ''}${code(x.id)}`,
    body: `<div class="kv">
        <div><div class="k">شرکت</div><div class="v">${esc(c.name)}</div></div>
        <div><div class="k">محل</div><div class="v">${esc(c.park || c.city)}</div></div>
        ${x.amount ? `<div><div class="k">${x.kind === 'need' ? 'مقدار نیاز' : 'ظرفیت اعلام‌شده'}</div><div class="v">${faNum(x.amount)} ${x.unit}</div></div>` : ''}
        <div><div class="k">${x.deadline ? 'مهلت پاسخ' : 'تاریخ ثبت'}</div><div class="v">${x.deadline ? `<bdi>${jDate(x.deadline)}</bdi> · <bdi>${until(x.deadline)}</bdi>` : jDate(x.created)}</div></div>
      </div>
      <div class="sec"><div class="sec-title">${icon('note')}توضیحات</div><p class="prose">${esc(x.desc)}</p>
        ${x.tags.length ? `<div class="tags-live">${x.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>` : ''}</div>
      <div class="sec">${matchesHTML(x, matchesFor(x))}</div>
      ${mine ? '' : `<div class="notice tone-gray sec">${icon('lock')}<span>اطلاعات تماس پس از تأیید طرف مقابل نمایش داده می‌شود. در این دمو، درخواست ارتباط فقط به‌صورت نمایشی ثبت می‌شود.</span></div>`}`,
    footer: (mine ? '' : contactBtn) + '<button class="btn btn-ghost" data-action="close">بستن</button>'
  });
}

function openNeedForm(kind = 'need') {
  const cat = ui.needs.cat !== 'all' ? ui.needs.cat : '';
  openPanel({
    size: 'md', key: 'need-form',
    title: kind === 'need' ? 'ثبت نیاز جدید' : 'ثبت فرصت همکاری',
    sub: `<span>ثبت به نام ${esc(COMPANIES[ME].name)} · ${esc(COMPANIES[ME].city)}</span>`,
    body: `<form id="needForm" class="form-grid" data-form="need" novalidate>
      ${field('kind', 'نوع ثبت', segmented('kind', [['need', 'به این نیاز دارم', 'search'], ['offer', 'این را عرضه می‌کنم', 'handshake']], kind), { group: true, cls: 'full' })}
      ${field('cat', 'دسته', tilePicker('cat', Object.entries(NEED_CATS).map(([k, v]) => [k, v.label, v.icon, v.tone]), cat), { group: true, cls: 'full' })}
      ${field('title', 'عنوان', textInput('title', 'maxlength="80" placeholder="مثلاً: ورق فولادی St37 ضخامت ۵ میلی‌متر" autocomplete="off"'), { cls: 'full' })}
      ${field('amount', 'مقدار یا ظرفیت (اختیاری)', `<div class="inline-row">${textInput('amount', 'inputmode="decimal" placeholder="مثلاً ۴۰" autocomplete="off"')}${selectBox('unit', UNIT_OPTIONS.map(u => [u, u]), UNIT_BY_CAT[cat] || UNIT_OPTIONS[0])}</div>`)}
      ${field('deadline', 'مهلت پاسخ', selectBox('deadline', [['7', 'یک هفته'], ['14', 'دو هفته'], ['30', 'یک ماه'], ['90', 'سه ماه']], '30'))}
      ${field('desc', 'توضیحات', textArea('desc', 'rows="3" maxlength="400" placeholder="مشخصات، شرایط تحویل یا همکاری، و هر نکته‌ای که به تطبیق دقیق‌تر کمک می‌کند."'), { cls: 'full' })}
      <div class="full"><div class="tags-live" id="needTags"><span>کلیدواژه‌های شناسایی‌شده برای تطبیق، اینجا نمایش داده می‌شوند.</span></div></div>
    </form>`,
    footer: `<button class="btn btn-primary" type="submit" form="needForm">${icon('check')}ثبت و دیدن پیشنهادها</button><button class="btn btn-ghost" data-action="close">انصراف</button>`
  });
}

FORMS.needInput = (form, el) => {
  if (el.name === 'cat') form.elements.unit.value = UNIT_BY_CAT[el.value];
  if (el.name === 'title' || el.name === 'desc') {
    const tags = extractTags(`${form.elements.title.value} ${form.elements.desc.value}`);
    $('#needTags').innerHTML = tags.length
      ? `<span>کلیدواژه‌ها:</span>${tags.map(t => `<span class="tag hit">${esc(t)}</span>`).join('')}`
      : '<span>کلیدواژه‌های شناسایی‌شده برای تطبیق، اینجا نمایش داده می‌شوند.</span>';
  }
};

FORMS.need = form => {
  const ok = validate(form, {
    cat: required('دسته را انتخاب کنید.'),
    title: v => (!v ? 'عنوان را بنویسید.' : v.length < 5 ? 'عنوان کوتاه است؛ دست‌کم ۵ حرف بنویسید.' : ''),
    amount: v => (v && !(+toLatin(v) > 0) ? 'مقدار را فقط به عدد بنویسید؛ مثلاً ۴۰.' : ''),
    desc: v => (!v ? 'یک توضیح کوتاه بنویسید تا تطبیق دقیق‌تر شود.' : v.length < 15 ? 'توضیح را کمی کامل‌تر بنویسید (دست‌کم ۱۵ حرف).' : '')
  });
  if (!ok) return;
  const d = Object.fromEntries(new FormData(form)), now = Date.now(), amount = d.amount ? +toLatin(d.amount) : undefined;
  const item = {
    id: d.kind === 'need' ? `N-${++state.seq.need}` : `O-${++state.seq.offer}`, kind: d.kind, cat: d.cat, company: ME,
    title: d.title.trim(), desc: d.desc.trim(), amount, unit: amount ? d.unit : undefined,
    tags: extractTags(`${d.title} ${d.desc}`), created: now, deadline: now + (+d.deadline) * DAY
  };
  state.needs.unshift(item);
  const ms = matchesFor(item);
  if (ms.length) notify('company', { icon: 'sparkles', tone: 'green', text: `برای «${item.title}» ${fa(ms.length)} پیشنهاد مرتبط پیدا شد.`, link: { page: 'needs', open: item.id } });
  save();
  rerender();
  openPanel({
    size: 'lg', key: 'need-ok:' + item.id, title: item.kind === 'need' ? 'نیاز شما ثبت شد' : 'فرصت همکاری ثبت شد',
    body: `<div class="success-hero"><span class="ok">${icon('check')}</span><h3>«${esc(item.title)}» منتشر شد</h3>
        <p>کد پیگیری ${code(item.id)} · در فهرست نیازها و داشبورد نمایش داده می‌شود.</p></div>
      <div class="sec">${matchesHTML(item, ms)}</div>`,
    footer: `<button class="btn btn-primary" data-action="see-need" data-id="${item.id}">مشاهده در فهرست</button><button class="btn btn-ghost" data-action="close">بستن</button>`
  });
  toast('ثبت شد و در فهرست قرار گرفت.');
};
