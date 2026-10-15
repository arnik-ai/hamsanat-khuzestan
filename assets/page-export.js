/* Page 3 — market development and export. Market notes, scores and checklists are hypothetical. */

const CERTS = [['iso', 'ISO 9001'], ['inso', 'استاندارد ملی ایران'], ['haccp', 'HACCP / ایمنی غذا'], ['halal', 'گواهی حلال'], ['ce', 'CE']];

function filteredProducts() {
  const f = ui.export, q = norm(f.q);
  return state.products
    .filter(p => (f.market === 'all' || p.markets.includes(f.market)) && (f.cat === 'all' || p.cat === f.cat) && (!q || norm(p.name + companyOf(p).name + p.desc).includes(q)))
    .sort((a, b) => b.created - a.created);
}

function ring(score, size = '') {
  const r = 26, c = 2 * Math.PI * r, tone = score >= 75 ? 'green' : score >= 50 ? 'amber' : 'red';
  return `<span class="ring ${size} ${toneCls(tone)}" role="img" aria-label="امتیاز ${fa(score)} از ۱۰۰"><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="${r}" class="ring-bg"/><circle cx="32" cy="32" r="${r}" class="ring-fg" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c * (1 - score / 100)).toFixed(1)}"/></svg><b>${fa(score)}</b></span>`;
}
const stars = n => `<span class="stars" aria-label="${fa(n)} از ۵">${[1, 2, 3, 4, 5].map(i => `<i class="${i <= n ? 'on' : ''}">${icon('star')}</i>`).join('')}</span>`;

function productCard(p) {
  const cat = PRODUCT_CATS[p.cat];
  return `<article class="pcard card" data-action="open" data-id="${p.id}" tabindex="0" role="button" aria-label="${esc(p.name)}">
    <div class="pcard-img ${toneCls(cat.tone)}">${icon(cat.icon)}<span class="flags">${p.markets.map(m => flag(m, 'sm')).join('')}</span>${newBadge(p.created)}</div>
    <div class="pcard-body">
      <span class="pcard-cat">${cat.label}${p.company === ME ? ' · <b>محصول شما</b>' : ''}</span>
      <h3>${esc(p.name)}</h3>
      <div class="meta"><span>${icon('building')}${esc(companyOf(p).name)}</span></div>
      <div class="meta"><span>${icon('factory')}ظرفیت: ${esc(p.capacity)}</span></div>
      <div class="std">${p.standards.slice(0, 2).map(s => `<span class="tag">${esc(s)}</span>`).join('')}${p.standards.length > 2 ? `<span class="tag">+${fa(p.standards.length - 2)}</span>` : ''}</div>
    </div>
  </article>`;
}

function marketsHTML() {
  const f = ui.export;
  const all = `<button class="mcard ${f.market === 'all' ? 'on' : ''}" data-action="xf" data-key="market" data-val="all" aria-pressed="${f.market === 'all'}"><span class="mcard-ico">${icon('globe')}</span><strong>همه بازارها</strong><small>${fa(state.products.length)} محصول</small></button>`;
  return `<div class="markets">${all}${Object.entries(DEMO_MARKETS).map(([k, m]) => `<button class="mcard ${f.market === k ? 'on' : ''}" data-action="xf" data-key="market" data-val="${k}" aria-pressed="${f.market === k}">${flag(k, 'lg')}<strong>${m.name}</strong><small>${fa(state.products.filter(p => p.markets.includes(k)).length)} محصول · ${m.route}</small></button>`).join('')}</div>`;
}

function marketBrief(k) {
  const m = DEMO_MARKETS[k];
  return `<section class="card brief">
    <div class="brief-head">${flag(k, 'lg')}<div class="brief-title"><h2>بازار ${m.name}</h2>${demoTag('برداشت نمونه؛ نیازمند اعتبارسنجی کارشناسی')}</div>
      <button class="btn btn-primary btn-sm" data-action="assess" data-market="${k}">${icon('gauge')}ارزیابی آمادگی برای ${m.name}</button></div>
    <div class="kv kv-3">
      <div><div class="k">مسیر حمل پیشنهادی</div><div class="v">${m.route}</div></div>
      <div><div class="k">زمینه‌های پرتقاضا (نمونه)</div><div class="v">${m.demand}</div></div>
      <div><div class="k">جذابیت اولیه (نمایشی)</div><div class="v">${stars(m.stars)}</div></div>
    </div>
    <p class="brief-note">${icon('info')}<span>${m.note}.</span></p>
  </section>`;
}

function assessCardHTML() {
  const a = state.assessments[0];
  return `<section class="card assess-card">
    <span class="assess-ill">${icon('gauge')}</span>
    <h2>ارزیابی اولیه آمادگی صادرات</h2>
    <p>با پاسخ به چند پرسش کوتاه، تصویری اولیه از آمادگی محصول برای بازار هدف و فهرست اقدامات پیشنهادی بگیرید.</p>
    <button class="btn btn-primary btn-block" data-action="assess">${icon('clipboard')}${a ? 'ارزیابی تازه' : 'شروع ارزیابی'}</button>
    ${a ? `<div class="last-assess"><div class="la-head"><span>آخرین ارزیابی</span><span class="muted">${timeAgo(a.at)}</span></div>
      <button class="la-body" data-action="open" data-id="assessment">${ring(a.score, 'sm')}<span><strong>${esc(a.productName)} ← ${DEMO_MARKETS[a.market].name}</strong><small>${a.level} · ${fa(a.done.filter(Boolean).length)} از ${fa(a.items.length)} اقدام انجام شده</small></span>${icon('chevLeft')}</button>
      ${a.caseId ? `<p class="la-sent">${icon('send')}ارسال‌شده برای کارشناس: ${code(a.caseId)}</p>` : ''}</div>` : ''}
    <p class="label-warn">${icon('alert')}ارزیابی اولیه؛ نیازمند تأیید کارشناسی</p>
  </section>`;
}

PAGES.export = {
  title: 'صادرات و بازارهای بین‌المللی',
  results() {
    const list = filteredProducts(), m = ui.export.market;
    return `<p class="result-count">${fa(list.length)} محصول${m !== 'all' ? ` با بازار هدف ${DEMO_MARKETS[m].name}` : ''}</p>` + (list.length
      ? `<div class="pgrid">${list.map(productCard).join('')}</div>`
      : `<div class="card">${emptyState('محصولی با این فیلترها پیدا نشد.', '<button class="btn btn-ghost btn-sm" data-action="xf-clear">پاک کردن فیلترها</button>')}</div>`);
  },
  render() {
    const f = ui.export;
    return pageHead('توسعه بازار و صادرات', 'محصولات آماده صادرات شرکت‌ها را ببینید، بازار هدف را انتخاب کنید و آمادگی صادراتی محصول خود را به‌صورت اولیه بسنجید.',
      `<button class="btn btn-primary" data-action="assess">${icon('gauge')}ارزیابی آمادگی صادرات</button>`) +
      `<div class="sec-label"><span>انتخاب بازار هدف</span>${demoTag('اطلاعات بازارها نمونه است')}</div>
      ${marketsHTML()}
      ${f.market !== 'all' ? marketBrief(f.market) : ''}
      <div class="export-grid">
        <div class="export-main">
          <div class="toolbar">
            <label class="tsearch">${icon('search')}<input id="export-q" type="search" placeholder="جست‌وجوی محصول یا شرکت…" value="${esc(f.q)}" data-filter="export.q" aria-label="جست‌وجوی محصول"></label>
            <select id="export-cat" class="tselect" data-filter="export.cat" aria-label="دسته محصول">${[['all', 'همه دسته‌ها'], ...Object.entries(PRODUCT_CATS).map(([k, v]) => [k, v.label])].map(([k, l]) => `<option value="${k}" ${f.cat === k ? 'selected' : ''}>${l}</option>`).join('')}</select>
          </div>
          <div id="results">${this.results()}</div>
        </div>
        <aside class="export-side">${assessCardHTML()}</aside>
      </div>`;
  }
};

ACTIONS.xf = el => { ui.export[el.dataset.key] = el.dataset.val; rerender(); };
ACTIONS['xf-clear'] = () => { Object.assign(ui.export, { q: '', market: 'all', cat: 'all' }); rerender(); };
ACTIONS.assess = el => openAssessmentForm({ market: el.dataset.market, product: el.dataset.product });

function openProduct(id) {
  const p = findProduct(id);
  if (!p) return toast('این محصول پیدا نشد.', 'warn');
  const c = companyOf(p), mine = p.company === ME, cat = PRODUCT_CATS[p.cat], sent = state.contacts[p.id];
  const specs = [['کد تعرفه (نمونه)', `<bdi dir="ltr">${p.hs}</bdi>`], ['ظرفیت عرضه', esc(p.capacity)], ['حداقل سفارش', esc(p.moq)], ...p.specs.map(([k, v]) => [esc(k), esc(v)])];
  const contact = mine || sent
    ? `<div class="kv"><div><div class="k">واحد</div><div class="v">${p.contact.unit}</div></div><div><div class="k">تلفن (نمونه)</div><div class="v"><bdi dir="ltr">${p.contact.phone}</bdi></div></div><div><div class="k">ایمیل (نمونه)</div><div class="v"><bdi dir="ltr">${p.contact.email}</bdi></div></div></div>`
    : `<div class="notice tone-gray">${icon('lock')}<span>اطلاعات تماس با اجازه شرکت و پس از ثبت «درخواست ارتباط» نمایش داده می‌شود (نمایشی).</span></div>`;
  openPanel({
    size: 'lg', key: 'product:' + id, reopen: () => openProduct(id), title: p.name,
    sub: `${catChip(PRODUCT_CATS, p.cat)}${mine ? '<span class="badge-mine">محصول شما</span>' : ''}<span>${esc(c.name)} · ${esc(c.city)}</span>`,
    body: `<div class="prod-hero ${toneCls(cat.tone)}">${iconTile(cat.icon, cat.tone, 'lg')}<div><p class="prose">${esc(p.desc)}</p>
        <div class="mk-row">${p.markets.map(m => `<span class="mk">${flag(m, 'sm')}${DEMO_MARKETS[m].name}</span>`).join('')}</div></div></div>
      <div class="sec"><div class="sec-title">${icon('listCheck')}مشخصات و ظرفیت عرضه</div>
        <table class="spec"><tbody>${specs.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}</tbody></table></div>
      <div class="sec"><div class="sec-title">${icon('award')}استانداردهای ثبت‌شده</div>
        <div class="std">${p.standards.map(s => `<span class="tag hit">${icon('shield')}${esc(s)}</span>`).join('')}</div>
        <p class="small-note">اعلام‌شده توسط شرکت؛ اصالت گواهی‌ها در نسخه عملیاتی بررسی می‌شود.</p></div>
      <div class="sec"><div class="sec-title">${icon('phone')}اطلاعات تماس مجاز</div>${contact}</div>`,
    footer: (mine
      ? `<button class="btn btn-primary" data-action="assess" data-product="${p.id}">${icon('gauge')}ارزیابی آمادگی صادرات این محصول</button>`
      : sent ? `<button class="btn btn-done" disabled>${icon('check')}درخواست ارتباط ثبت شد</button>`
        : `<button class="btn btn-primary" data-action="connect" data-id="${p.id}">${icon('send')}درخواست ارتباط با تأمین‌کننده</button>`) +
      '<button class="btn btn-ghost" data-action="close">بستن</button>'
  });
}

function openAssessmentForm(preset = {}) {
  const mine = state.products.filter(p => p.company === ME);
  const market = preset.market || (ui.export.market !== 'all' ? ui.export.market : '');
  openPanel({
    size: 'md', key: 'assess-form', title: 'ارزیابی اولیه آمادگی صادرات',
    sub: `<span class="label-warn sm">${icon('alert')}ارزیابی اولیه؛ نیازمند تأیید کارشناسی</span>`,
    body: `<form id="assessForm" class="form-grid" data-form="assess" novalidate>
      ${field('product', 'محصول', selectBox('product', [['', 'انتخاب کنید…'], ...mine.map(p => [p.id, p.name]), ['other', 'محصول دیگر (عمومی)']], preset.product || (mine[0] ? mine[0].id : '')), { cls: 'full' })}
      ${field('market', 'بازار هدف', `<div class="market-pick" role="radiogroup" aria-labelledby="l-market">${Object.entries(DEMO_MARKETS).map(([k, m]) => `<label class="mp-opt"><input type="radio" name="market" value="${k}" ${k === market ? 'checked' : ''}><span>${flag(k, 'md')}${m.name}</span></label>`).join('')}</div>`, { group: true, cls: 'full' })}
      ${field('share', 'سهم ظرفیت قابل اختصاص به صادرات', segmented('share', [['low', 'کمتر از ۱۰٪'], ['mid', '۱۰ تا ۳۰٪'], ['high', 'بیش از ۳۰٪']], ''), { group: true, cls: 'full' })}
      ${field('exp', 'سابقه صادرات', segmented('exp', [['none', 'ندارد'], ['some', 'کمتر از ۲ سال'], ['long', 'بیش از ۲ سال']], ''), { group: true, cls: 'full' })}
      ${field('certs', 'گواهی‌ها و استانداردهای فعلی', `<div class="checks">${CERTS.map(([k, l]) => `<label class="check"><input type="checkbox" name="certs" value="${k}">${l}</label>`).join('')}</div>`, { group: true, cls: 'full', hint: 'اگر هیچ‌کدام را ندارید، خالی بگذارید.' })}
      ${field('pack', 'بسته‌بندی صادراتی', segmented('pack', [['yes', 'آماده است'], ['wip', 'در حال آماده‌سازی'], ['no', 'ندارد']], ''), { group: true, cls: 'full' })}
      ${field('label', 'برچسب عربی یا انگلیسی', segmented('label', [['yes', 'دارد'], ['no', 'ندارد']], ''), { group: true })}
      ${field('price', 'قیمت صادراتی (FOB/CIF)', segmented('price', [['yes', 'آماده است'], ['no', 'هنوز نه']], ''), { group: true })}
      ${field('card', 'کارت بازرگانی', segmented('card', [['yes', 'دارد'], ['partner', 'از طریق شریک'], ['no', 'ندارد']], ''), { group: true, cls: 'full' })}
    </form>`,
    footer: `<button class="btn btn-primary" type="submit" form="assessForm">${icon('gauge')}محاسبه نتیجه</button><button class="btn btn-ghost" data-action="close">انصراف</button>`
  });
}

FORMS.assess = form => {
  const pick = required('یکی از گزینه‌ها را انتخاب کنید.');
  const ok = validate(form, { product: required('محصول را انتخاب کنید.'), market: required('بازار هدف را انتخاب کنید.'), share: pick, exp: pick, pack: pick, label: pick, price: pick, card: pick });
  if (!ok) return;
  const d = Object.fromEntries(new FormData(form)), certs = new FormData(form).getAll('certs');
  const product = findProduct(d.product), food = product && product.cat === 'food', mk = DEMO_MARKETS[d.market].name;
  const pts = { share: { low: 4, mid: 9, high: 12 }, exp: { none: 0, some: 9, long: 16 }, pack: { yes: 14, wip: 7, no: 0 }, label: { yes: 10, no: 0 }, card: { yes: 10, partner: 6, no: 0 }, price: { yes: 10, no: 0 } };
  const score = Math.min(100, Object.keys(pts).reduce((t, k) => t + pts[k][d[k]], 0) + Math.min(28, certs.length * 7));

  const strengths = [];
  if (d.pack === 'yes') strengths.push('بسته‌بندی صادراتی آماده است');
  if (d.label === 'yes') strengths.push('برچسب عربی یا انگلیسی دارد');
  if (d.price === 'yes') strengths.push('قیمت صادراتی آماده است');
  if (d.card !== 'no') strengths.push(d.card === 'yes' ? 'کارت بازرگانی دارد' : 'از طریق شریک تجاری امکان صادرات دارد');
  if (d.exp !== 'none') strengths.push('سابقه صادرات دارد');
  if (certs.length) strengths.push(`گواهی‌ها: ${CERTS.filter(([k]) => certs.includes(k)).map(([, l]) => l).join('، ')}`);

  const items = [];
  if (d.pack !== 'yes') items.push('آماده‌سازی بسته‌بندی مقاوم برای حمل طولانی و دمای بالای منطقه');
  if (d.label !== 'yes') items.push(`طراحی برچسب دوزبانه عربی/انگلیسی؛ الزامات دقیق بازار ${mk} بررسی شود`);
  if (d.card === 'no') items.push('دریافت کارت بازرگانی یا همکاری با یک شرکت بازرگانی دارای کارت');
  if (!certs.includes('iso')) items.push('استقرار سیستم مدیریت کیفیت (مانند ISO 9001)');
  if (food && !certs.includes('halal')) items.push('اخذ گواهی حلال و گواهی‌های بهداشتی مورد نیاز مقصد');
  if (food && !certs.includes('haccp')) items.push('استقرار HACCP یا سیستم ایمنی مواد غذایی');
  if (d.price !== 'yes') items.push('تهیه فهرست قیمت صادراتی بر پایه FOB یا CIF');
  if (d.exp === 'none') items.push('شرکت در «کارگاه الزامات صادرات» در بخش آموزش و رویدادها');
  items.push(d.market === 'iq' ? 'بررسی مدارک گواهی مبدأ و الزامات بازرسی کالا برای بازار عراق' : `بررسی الزامات ثبت محصول و برچسب‌گذاری در ${mk}`);
  items.push('یافتن خریدار یا نماینده آزمایشی و ارسال نمونه محصول');
  items.push('هماهنگی با کارشناس توسعه صادرات برای تأیید نتیجه');

  const now = Date.now();
  state.assessments.unshift({
    id: 'A-' + now, at: now, product: d.product, productName: product ? product.name : 'محصول عمومی', market: d.market, score,
    level: score >= 75 ? 'آمادگی خوب' : score >= 50 ? 'آمادگی متوسط' : 'نیازمند آماده‌سازی', strengths, items, done: items.map(() => false), caseId: null
  });
  state.assessments.length = Math.min(state.assessments.length, 5);
  save();
  rerender();
  openAssessmentResult();
};

function openAssessmentResult() {
  const a = state.assessments[0];
  if (!a) return openAssessmentForm();
  const done = a.done.filter(Boolean).length;
  openPanel({
    size: 'md', key: 'assess-result:' + a.id, reopen: openAssessmentResult, title: 'نتیجه ارزیابی اولیه',
    sub: `<span>${esc(a.productName)}</span><span class="mk">${flag(a.market, 'sm')}${DEMO_MARKETS[a.market].name}</span>`,
    body: `<p class="label-warn big">${icon('alert')}ارزیابی اولیه؛ نیازمند تأیید کارشناسی</p>
      <div class="result-top">${ring(a.score, 'lg')}<div><h3>${a.level}</h3><p class="muted">امتیاز ${fa(a.score)} از ۱۰۰، محاسبه‌شده از پاسخ‌های شما با قواعد ساده نمایشی؛ این عدد نظر رسمی یا تأییدشده نیست.</p></div></div>
      ${a.strengths.length ? `<div class="sec"><div class="sec-title">${icon('checkCircle')}نقاط قوت</div><ul class="bullets">${a.strengths.map(s => `<li>${icon('check')}<span>${esc(s)}</span></li>`).join('')}</ul></div>` : ''}
      <div class="sec"><div class="sec-title">${icon('listCheck')}چک‌لیست پیشنهادی اقدامات<span class="sec-count">${fa(done)} از ${fa(a.items.length)}</span></div>
        <div class="progress"><i style="width:${Math.round(done / a.items.length * 100)}%"></i></div>
        <ul class="checklist">${a.items.map((t, i) => `<li><label class="cl-item ${a.done[i] ? 'done' : ''}"><input type="checkbox" data-change="tick" data-i="${i}" ${a.done[i] ? 'checked' : ''}><span>${esc(t)}</span></label></li>`).join('')}</ul></div>`,
    footer: (a.caseId
      ? `<button class="btn btn-done" disabled>${icon('check')}ارسال شد: ${code(a.caseId)}</button>`
      : `<button class="btn btn-primary" data-action="assess-send">${icon('send')}ارسال برای بررسی کارشناس</button>`) +
      `<button class="btn btn-ghost" data-action="assess" data-product="${a.product === 'other' ? '' : a.product}" data-market="${a.market}">ارزیابی دوباره</button>`
  });
}

ACTIONS.tick = el => {
  const a = state.assessments[0];
  if (!a) return;
  a.done[+el.dataset.i] = el.checked;
  save();
  rerender();
};
ACTIONS['assess-send'] = () => {
  const a = state.assessments[0];
  if (!a || a.caseId) return;
  const c = createCase({ cat: 'export', priority: 'medium', title: `بررسی ارزیابی صادرات «${a.productName}» به ${DEMO_MARKETS[a.market].name}`, desc: `امتیاز اولیه ${fa(a.score)} از ۱۰۰ (${a.level}) با ${fa(a.items.length)} اقدام پیشنهادی. لطفاً نتیجه بررسی و تأیید شود.` });
  c.assignee = UNIT_FOR.export;
  a.caseId = c.id;
  save();
  rerender();
  toast(`برای کارشناس ارسال شد؛ کد پیگیری ${c.id}`);
};
