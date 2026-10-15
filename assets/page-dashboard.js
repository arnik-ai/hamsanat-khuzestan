/* Page 1 — dashboard of the signed-in industrial company. */

const SLIDES = [
  { art: 'refinery', eyebrow: 'شرکت شهرک‌های صنعتی خوزستان · نمونه اولیه', title: 'همراه صنعتگران،<br>برای فردایی بهتر', text: 'پلتفرم یکپارچه نیازها، فرصت‌ها و خدمات شرکت‌های صنعتی در شهرک‌های صنعتی خوزستان', cta: 'شروع کنید', page: 'needs' },
  { art: 'port', eyebrow: 'توسعه بازار و صادرات', title: 'بازارهای همسایه،<br>یک قدم نزدیک‌تر', text: 'آمادگی صادرات محصول خود به عراق، عمان، امارات و قطر را در چند دقیقه ارزیابی کنید.', cta: 'ارزیابی آمادگی صادرات', page: 'export', open: 'assess' },
  { art: 'park', eyebrow: 'میز خدمت', title: 'مشکل تولید را ثبت کنید،<br>مسیرش را ببینید', text: 'آب، برق، مجوز یا زیرساخت؛ پرونده شما تا پاسخ نهایی مرحله‌به‌مرحله قابل پیگیری است.', cta: 'ثبت مشکل', page: 'desk', open: 'new-case' }
];

const QUICK = [
  { label: 'ثبت فرصت همکاری', icon: 'handshake', tone: 'green', open: 'new-offer' },
  { label: 'ثبت نیاز جدید', icon: 'plusCircle', tone: 'blue', open: 'new-need' },
  { label: 'گزارش مشکل', icon: 'wrench', tone: 'purple', open: 'new-case' },
  { label: 'درخواست مجوز', icon: 'fileCheck', tone: 'green', open: 'new-permit' },
  { label: 'ارزیابی صادرات', icon: 'globe', tone: 'sky', open: 'assess' },
  { label: 'مشاهده رویدادها', icon: 'calendar', tone: 'orange', page: 'events' }
];

function statItems() {
  const n = state.needs;
  return [
    { label: 'نیاز نیروی انسانی', icon: 'users', tone: 'blue', list: n.filter(x => x.kind === 'need' && x.cat === 'workforce'), filter: { cat: 'workforce', kind: 'need' } },
    { label: 'نیاز مواد اولیه', icon: 'box', tone: 'orange', list: n.filter(x => x.kind === 'need' && x.cat === 'material'), filter: { cat: 'material', kind: 'need' } },
    { label: 'فرصت سرمایه‌گذاری', icon: 'coins', tone: 'green', list: n.filter(x => x.cat === 'investment'), filter: { cat: 'investment', kind: 'all' } },
    { label: 'فرصت صادراتی', icon: 'globe', tone: 'sky', list: state.products, page: 'export' }
  ];
}

function heroHTML() {
  return `<section class="hero" aria-roledescription="carousel" aria-label="معرفی هم‌صنعت">
    ${SLIDES.map((s, i) => `<div class="slide ${i === ui.slide ? 'on' : ''}" aria-hidden="${i !== ui.slide}">
      ${heroArt(s.art)}
      <div class="hero-copy">
        <span class="eyebrow">${s.eyebrow}</span>
        <h2>${s.title}</h2>
        <p>${s.text}</p>
        <button class="btn btn-primary btn-hero" data-action="go" data-page="${s.page}" ${s.open ? `data-open="${s.open}"` : ''} ${i === ui.slide ? '' : 'tabindex="-1"'}>${s.cta}${icon('arrowLeft')}</button>
      </div>
    </div>`).join('')}
    <div class="dots">${SLIDES.map((s, i) => `<button class="dot ${i === ui.slide ? 'on' : ''}" data-action="slide" data-i="${i}" aria-label="اسلاید ${fa(i + 1)} از ${fa(SLIDES.length)}" aria-pressed="${i === ui.slide}"></button>`).join('')}</div>
  </section>`;
}

function statsHTML() {
  return `<div class="stats">${statItems().map((s, i) => {
    const fresh = s.list.filter(x => Date.now() - x.created < 7 * DAY).length;
    return `<button class="stat card" data-action="stat" data-i="${i}" aria-label="${s.label}: ${fa(s.list.length)} مورد">
      <span class="stat-top"><strong>${fa(s.list.length)}</strong>${iconTile(s.icon, s.tone)}</span>
      <span class="stat-label">${s.label}</span>
      ${fresh ? `<span class="badge-new">${fa(fresh)} مورد جدید این هفته</span>` : '<span class="stat-none">بدون مورد جدید این هفته</span>'}
    </button>`;
  }).join('')}</div>`;
}

const listCard = (title, href, rows) => `<section class="card list-card">
  <div class="card-head"><h2>${title}</h2><a class="link" href="${href}" aria-label="مشاهده همه: ${title}">همه${icon('chevLeft')}</a></div>
  <ul class="rows">${rows}</ul></section>`;

function dashEventsHTML() {
  const list = state.events.slice().sort((a, b) => a.date - b.date).slice(0, 3);
  return listCard('اخبار و رویدادها', '#/events', list.map(e => `<li><button class="row-btn" data-action="open" data-id="${e.id}">
    <span class="thumb ${toneCls(EVENT_TYPES[e.type].tone)}"><b>${fmtDay.format(new Date(e.date))}</b><small>${fmtMonth.format(new Date(e.date))}</small></span>
    <span class="row-main"><strong>${esc(e.title)}</strong><small>${EVENT_TYPES[e.type].label} · ${until(e.date)}</small></span>
  </button></li>`).join(''));
}

function dashNeedsHTML() {
  const list = state.needs.slice().sort((a, b) => b.created - a.created).slice(0, 3);
  return listCard('نیازهای جدید شرکت‌ها', '#/needs', list.map(x => `<li><button class="row-btn" data-action="open" data-id="${x.id}">
    ${iconTile(NEED_CATS[x.cat].icon, NEED_CATS[x.cat].tone, 'sm')}
    <span class="row-main"><strong>${esc(x.title)}</strong><small>${esc(companyOf(x).name)}${x.company === ME ? ' · ثبت شما' : ''}</small>
      <span class="row-tags"><span class="chip-cat sm ${toneCls(NEED_CATS[x.cat].tone)}">${x.kind === 'need' ? 'نیاز' : 'عرضه'}: ${NEED_CATS[x.cat].label}</span><small>${timeAgo(x.created)}</small></span></span>
  </button></li>`).join(''));
}

function dashExportHTML() {
  const list = state.products.slice().sort((a, b) => b.created - a.created).slice(0, 3);
  return listCard('آخرین فرصت‌های صادراتی', '#/export', list.map(p => `<li><button class="row-btn" data-action="open" data-id="${p.id}">
    ${flag(p.markets[0], 'lg')}
    <span class="row-main"><strong>${esc(p.name)}</strong><small>بازار هدف: ${p.markets.map(m => DEMO_MARKETS[m].name).join('، ')}</small>
      <span class="row-tags"><small>${jDate(p.created)}</small></span></span>
  </button></li>`).join(''));
}

function quickHTML() {
  return `<section class="card quick">
    <div class="card-head"><h2>دسترسی سریع</h2></div>
    <div class="quick-grid">${QUICK.map((q, i) => `<button class="qtile ${toneCls(q.tone)}" data-action="quick" data-i="${i}">${iconTile(q.icon, q.tone)}<span>${q.label}</span></button>`).join('')}</div>
  </section>`;
}

function myRequestsHTML() {
  const list = myCases().slice().sort((a, b) => b.updated - a.updated);
  const open = list.filter(c => c.status !== 'closed').length, answered = list.filter(c => c.status === 'answered').length;
  return `<section class="card myreq">
    <div class="card-head"><h2>وضعیت درخواست‌های من</h2><a class="link" href="#/desk">همه${icon('chevLeft')}</a></div>
    <p class="myreq-sum">${fa(open)} پرونده باز${answered ? ` · <b>${fa(answered)} پاسخ تازه</b>` : ''}</p>
    <ul class="req-list">${list.slice(0, 4).map(c => `<li><button class="req" data-action="open" data-id="${c.id}">
      ${iconTile(CASE_CATS[c.cat].icon, CASE_CATS[c.cat].tone, 'sm')}
      <span class="req-main"><strong>${esc(c.title)}</strong>
        <span class="req-meta">${statusPill(c.status)}<small>${timeAgo(c.updated)}</small></span>
        ${miniSteps(c.status)}</span>
    </button></li>`).join('') || '<li class="muted">هنوز درخواستی ثبت نکرده‌اید.</li>'}</ul>
    <button class="btn btn-soft btn-block" data-action="quick" data-i="2">${icon('plus')}ثبت درخواست تازه</button>
  </section>`;
}

PAGES.dashboard = {
  title: 'داشبورد',
  render: () => `<div class="dash">
      <div class="dash-main">${heroHTML()}${statsHTML()}<div class="dash-lists">${dashEventsHTML()}${dashNeedsHTML()}${dashExportHTML()}</div></div>
      <aside class="dash-side">${quickHTML()}${myRequestsHTML()}</aside>
    </div>`,
  after: startSlides
};

let slideTimer = null;
function setSlide(i) {
  ui.slide = (i + SLIDES.length) % SLIDES.length;
  $$('.hero .slide').forEach((el, k) => {
    const on = k === ui.slide;
    el.classList.toggle('on', on);
    el.setAttribute('aria-hidden', String(!on));
    const b = $('.btn-hero', el);
    if (b) b.tabIndex = on ? 0 : -1;
  });
  $$('.hero .dot').forEach((el, k) => { el.classList.toggle('on', k === ui.slide); el.setAttribute('aria-pressed', String(k === ui.slide)); });
}
function startSlides() {
  clearInterval(slideTimer);
  slideTimer = setInterval(() => {
    const hero = $('.hero');
    if (!hero) return clearInterval(slideTimer);
    if (!hero.matches(':hover') && !hero.contains(document.activeElement) && !document.hidden) setSlide(ui.slide + 1);
  }, 6500);
}

ACTIONS.slide = el => { setSlide(+el.dataset.i); startSlides(); };
ACTIONS.stat = el => {
  const s = statItems()[+el.dataset.i];
  if (s.page) return go(s.page);
  Object.assign(ui.needs, { q: '', mine: false }, s.filter);
  go('needs');
};
ACTIONS.quick = el => {
  const q = QUICK[+el.dataset.i];
  return q.open ? openItem(q.open) : go(q.page);
};
