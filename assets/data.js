/* Demo data. Every company, person, number and status here is FICTIONAL
   and exists only to show the flows of the prototype. */

const NEED_CATS = {
  material: { label: 'مواد اولیه', icon: 'box', tone: 'orange' },
  workforce: { label: 'نیروی انسانی', icon: 'users', tone: 'blue' },
  investment: { label: 'سرمایه‌گذاری', icon: 'coins', tone: 'green' },
  service: { label: 'خدمات تخصصی', icon: 'briefcase', tone: 'purple' }
};

const CASE_CATS = {
  water: { label: 'آب', icon: 'droplet', tone: 'sky' },
  power: { label: 'برق', icon: 'zap', tone: 'amber' },
  permit: { label: 'مجوزها', icon: 'fileCheck', tone: 'indigo' },
  infra: { label: 'زیرساخت', icon: 'road', tone: 'slate' },
  env: { label: 'محیط‌زیست', icon: 'leaf', tone: 'green' },
  other: { label: 'سایر موانع تولید', icon: 'more', tone: 'gray' },
  export: { label: 'ارزیابی صادرات', icon: 'globe', tone: 'blue' }
};
const PROBLEM_CATS = ['water', 'power', 'permit', 'infra', 'env', 'other'];

const STATUSES = [
  { key: 'new', label: 'ثبت‌شده', tone: 'gray' },
  { key: 'review', label: 'در حال بررسی', tone: 'amber' },
  { key: 'referred', label: 'ارجاع‌شده', tone: 'purple' },
  { key: 'answered', label: 'پاسخ داده‌شده', tone: 'blue' },
  { key: 'closed', label: 'بسته‌شده', tone: 'green' }
];
const STATUS = Object.fromEntries(STATUSES.map((s, i) => [s.key, { ...s, step: i }]));

const PRIORITIES = {
  low: { label: 'کم', tone: 'gray', sla: 14 },
  medium: { label: 'متوسط', tone: 'amber', sla: 7 },
  high: { label: 'زیاد', tone: 'orange', sla: 3 },
  urgent: { label: 'فوری', tone: 'red', sla: 1 }
};

const UNITS = ['میز خدمت شهرک', 'واحد آب و فاضلاب شهرک', 'واحد برق و انرژی', 'امور مجوزها', 'واحد عمران و زیرساخت', 'کارشناس محیط‌زیست', 'کارشناس توسعه صادرات'];
const UNIT_FOR = { water: UNITS[1], power: UNITS[2], permit: UNITS[3], infra: UNITS[4], env: UNITS[5], other: UNITS[0], export: UNITS[6] };

const DEMO_MARKETS = {
  iq: { name: 'عراق', route: 'زمینی و دریایی', demand: 'مصالح ساختمانی، مواد غذایی، قطعات و لوازم صنعتی', stars: 4, note: 'نزدیکی جغرافیایی و مرز زمینی مشترک با استان' },
  om: { name: 'عمان', route: 'دریایی', demand: 'مواد غذایی، محصولات پلیمری و فلزی', stars: 3, note: 'دسترسی دریایی از بنادر جنوبی کشور' },
  ae: { name: 'امارات', route: 'دریایی', demand: 'مواد غذایی، فولادی و پلیمری', stars: 4, note: 'نقش توزیع مجدد کالا به بازارهای دیگر منطقه' },
  qa: { name: 'قطر', route: 'دریایی', demand: 'مواد غذایی و مصالح', stars: 3, note: 'بازار کوچک‌تر با حساسیت بالا به کیفیت و بسته‌بندی' }
};

const PRODUCT_CATS = {
  food: { label: 'مواد غذایی', icon: 'apple', tone: 'orange' },
  steel: { label: 'فولادی و فلزی', icon: 'pipe', tone: 'slate' },
  chemical: { label: 'شیمیایی و شوینده', icon: 'flask', tone: 'sky' },
  polymer: { label: 'پلیمری', icon: 'layers', tone: 'purple' },
  parts: { label: 'قطعات صنعتی', icon: 'cog', tone: 'blue' }
};

const EVENT_TYPES = {
  expo: { label: 'نمایشگاه و رویداد', icon: 'flag', tone: 'blue' },
  meeting: { label: 'نشست تخصصی', icon: 'users', tone: 'green' },
  training: { label: 'آموزش', icon: 'cap', tone: 'purple' },
  notice: { label: 'اطلاعیه', icon: 'info', tone: 'orange' }
};

const COMPANIES = {
  c1: { name: 'صنایع قطعه‌سازی نیک‌فن', field: 'تولید شیرآلات و قطعات ماشین‌کاری‌شده', city: 'اهواز', park: 'شهرک صنعتی شماره ۲ اهواز', plot: 'قطعه ۱۴', founded: 1388, staff: 64, certs: ['ISO 9001', 'استاندارد ملی ایران'], complete: true },
  c2: { name: 'پلیمر سپید کارون', field: 'تأمین گرانول و مواد اولیه پلیمری', city: 'اهواز', park: 'شهرک صنعتی شماره ۴ اهواز', complete: true },
  c3: { name: 'فناوران تجهیز اروند', field: 'ساخت تابلو برق و تجهیزات کنترلی', city: 'آبادان', park: 'شهرک صنعتی آبادان', complete: false },
  c4: { name: 'صنایع غذایی دشت‌آذر', field: 'کنسرو و فرآورده‌های غذایی', city: 'دزفول', park: 'شهرک صنعتی دزفول', complete: true },
  c5: { name: 'خرمای طلایی جنوب', field: 'فرآوری و بسته‌بندی خرما', city: 'شادگان', park: 'شهرک صنعتی شادگان', complete: true },
  c6: { name: 'لوله و پروفیل فولادین کارون', field: 'تولید لوله و پروفیل فولادی', city: 'اهواز', park: 'شهرک صنعتی شماره ۱ اهواز', complete: true },
  c7: { name: 'آزمایشگاه همکار کیفیت‌آزما', field: 'آزمون، بازرسی و کالیبراسیون', city: 'اهواز', park: 'شهرک صنعتی شماره ۲ اهواز', complete: true },
  c8: { name: 'بسته‌بندی موج‌نو خوزستان', field: 'کارتن، لفاف و بسته‌بندی', city: 'شوشتر', park: 'شهرک صنعتی شوشتر', complete: false },
  c9: { name: 'مرکز مهارت‌آموزی صنعتگران', field: 'آموزش فنی و معرفی نیرو', city: 'اهواز', park: 'اهواز', complete: true },
  c10: { name: 'صندوق سرمایه‌گذاری نمونه جنوب', field: 'تأمین مالی و مشارکت در طرح‌ها', city: 'اهواز', park: 'اهواز', complete: true },
  c11: { name: 'شوینده‌سازان پاک‌تاب', field: 'مواد شوینده و بهداشتی', city: 'بهبهان', park: 'شهرک صنعتی بهبهان', complete: false }
};

const USERS = {
  company: { name: 'علی محمدی', title: 'مدیر بازرگانی', companyId: 'c1', initials: 'ع‌م' },
  expert: { name: 'مریم رضایی', title: 'کارشناس میز خدمت', unit: 'میز خدمت شهرک‌ها', initials: 'م‌ر' }
};
const ME = 'c1';

/* Words the rule-based matcher looks for in titles and descriptions. */
const KEYWORDS = ['فولاد', 'ورق', 'پروفیل', 'لوله', 'پلیمر', 'پلی‌اتیلن', 'گرانول', 'کارتن', 'قوطی', 'بسته‌بندی', 'چاپ', 'برق', 'PLC', 'CNC', 'جوشکاری', 'ماشین‌کاری', 'تراش', 'کالیبراسیون', 'آزمایشگاه', 'کیفیت', 'غذایی', 'کنسرو', 'خرما', 'خط تولید', 'مشارکت', 'سرمایه در گردش', 'شوینده', 'صادرات', 'حمل', 'انبار'];

const SERVICES = [
  { cat: 'permit', title: 'تمدید پروانه بهره‌برداری', desc: 'ثبت درخواست تمدید و دریافت فهرست مدارک لازم.', eta: 7 },
  { cat: 'permit', title: 'مجوز ساخت یا توسعه', desc: 'ساخت سوله، توسعه سالن تولید یا تغییر کاربری قطعه.', eta: 10 },
  { cat: 'water', title: 'انشعاب یا افزایش ظرفیت آب', desc: 'درخواست انشعاب جدید آب صنعتی یا افزایش ظرفیت فعلی.', eta: 14 },
  { cat: 'power', title: 'افزایش دیماند برق', desc: 'درخواست افزایش قدرت قراردادی برق واحد تولیدی.', eta: 14 },
  { cat: 'env', title: 'استعلام و مجوز زیست‌محیطی', desc: 'استعلام الزامات محیط‌زیستی برای توسعه یا تغییر فرایند.', eta: 10 },
  { cat: 'infra', title: 'خدمات زیرساخت و نگهداری', desc: 'معابر، روشنایی، فاضلاب و سایر خدمات عمومی شهرک.', eta: 5 }
];

function seedState() {
  const H = 36e5, D = 24 * H, now = Date.now();
  const ago = (d, h = 0) => now - d * D - h * H;
  const ahead = (d, h = 0) => now + d * D + h * H;
  const contact = slug => ({ unit: 'واحد بازرگانی خارجی', phone: '۰۶۱-۰۰۰۰-۰۰۰۰', email: `${slug}@example.com` });
  const hist = (at, status, role, by, text) => ({ at, kind: 'status', status, role, by, text });
  const EXP = 'مریم رضایی — میز خدمت';

  return {
    version: 1,
    seq: { need: 1049, offer: 2032, case: 113, notif: 20 },
    needs: [
      { id: 'N-1048', kind: 'need', cat: 'material', company: 'c1', title: 'ورق فولادی St37 ضخامت ۵ میلی‌متر', amount: 120, unit: 'تن در ماه', desc: 'برای تولید بدنه شیرآلات صنعتی. تحویل در محل کارخانه و ترجیحاً قرارداد سه‌ماهه با امکان تمدید.', tags: ['فولاد', 'ورق'], created: ago(0, 20), deadline: ahead(20) },
      { id: 'N-1047', kind: 'need', cat: 'workforce', company: 'c3', title: '۳ تکنسین برق صنعتی آشنا به PLC', amount: 3, unit: 'نفر', desc: 'برای مونتاژ و تست تابلوهای کنترل؛ آشنا به نقشه‌خوانی و برنامه‌نویسی PLC، قرارداد تمام‌وقت.', tags: ['برق', 'PLC'], created: ago(0, 5), deadline: ahead(14) },
      { id: 'O-2031', kind: 'offer', cat: 'material', company: 'c6', title: 'عرضه ورق و پروفیل فولادی St37 و St52', amount: 300, unit: 'تن در ماه', desc: 'موجودی دائمی ورق در ضخامت‌های ۲ تا ۱۲ میلی‌متر؛ امکان برش طبق سفارش و حمل درون‌استانی.', tags: ['فولاد', 'ورق', 'پروفیل', 'حمل'], created: ago(1, 8) },
      { id: 'N-1046', kind: 'need', cat: 'investment', company: 'c4', title: 'سرمایه‌گذار برای توسعه خط تولید کنسرو', amount: 45, unit: 'میلیارد تومان', desc: 'افزایش حدود ۴۰ درصدی ظرفیت با خرید دستگاه پرکن و دربند خودکار؛ امکان مشارکت مدنی یا سرمایه‌گذاری مستقیم.', tags: ['غذایی', 'کنسرو', 'خط تولید', 'مشارکت'], created: ago(1, 3), deadline: ahead(45) },
      { id: 'O-2030', kind: 'offer', cat: 'material', company: 'c2', title: 'عرضه گرانول پلی‌اتیلن HDPE و LDPE', amount: 60, unit: 'تن در ماه', desc: 'گرید فیلم و تزریق؛ همراه با برگه آنالیز برای هر محموله.', tags: ['پلیمر', 'پلی‌اتیلن', 'گرانول'], created: ago(2) },
      { id: 'N-1045', kind: 'need', cat: 'material', company: 'c8', title: 'گرانول پلی‌اتیلن سنگین (HDPE) گرید فیلم', amount: 40, unit: 'تن در ماه', desc: 'برای تولید لفاف و بسته‌بندی صنعتی؛ تحویل ماهانه در شوشتر.', tags: ['پلیمر', 'پلی‌اتیلن', 'گرانول', 'بسته‌بندی'], created: ago(2, 6), deadline: ahead(30) },
      { id: 'N-1044', kind: 'need', cat: 'service', company: 'c6', title: 'کالیبراسیون تجهیزات اندازه‌گیری خط لوله', desc: 'کالیبراسیون دوره‌ای ضخامت‌سنج‌ها و فشارسنج‌های خط تولید، همراه با گواهی کالیبراسیون.', tags: ['کالیبراسیون', 'آزمایشگاه'], created: ago(3), deadline: ahead(10) },
      { id: 'O-2029', kind: 'offer', cat: 'service', company: 'c7', title: 'خدمات آزمون، بازرسی و کالیبراسیون', desc: 'کالیبراسیون ابزار دقیق، آزمون‌های مکانیکی و بازرسی جوش با صدور گواهی.', tags: ['کالیبراسیون', 'آزمایشگاه', 'کیفیت', 'جوشکاری'], created: ago(3, 4) },
      { id: 'N-1043', kind: 'need', cat: 'service', company: 'c5', title: 'طراحی بسته‌بندی صادراتی خرما', desc: 'طراحی جعبه و کارتن صادراتی با برچسب دوزبانه عربی و انگلیسی برای بازارهای منطقه.', tags: ['بسته‌بندی', 'صادرات', 'خرما', 'کارتن'], created: ago(4), deadline: ahead(25) },
      { id: 'O-2028', kind: 'offer', cat: 'workforce', company: 'c9', title: 'معرفی نیروی دوره‌دیده برق صنعتی، CNC و جوشکاری', amount: 25, unit: 'نفر', desc: 'فارغ‌التحصیلان دوره‌های مهارتی با سابقه کارورزی در واحدهای تولیدی؛ امکان مصاحبه در محل.', tags: ['برق', 'PLC', 'CNC', 'جوشکاری', 'تراش'], created: ago(4) },
      { id: 'N-1042', kind: 'need', cat: 'workforce', company: 'c1', title: '۲ اپراتور ماشین CNC با سابقه', amount: 2, unit: 'نفر', desc: 'حداقل دو سال سابقه کار با تراش و فرز CNC؛ شیفت صبح.', tags: ['CNC', 'تراش', 'ماشین‌کاری'], created: ago(5), deadline: ahead(15) },
      { id: 'O-2027', kind: 'offer', cat: 'investment', company: 'c10', title: 'مشارکت در طرح‌های توسعه صنایع غذایی و بسته‌بندی', amount: 60, unit: 'میلیارد تومان', desc: 'سرمایه‌گذاری در طرح‌های دارای بازار مشخص؛ بررسی اولیه طرح حدود دو هفته.', tags: ['غذایی', 'بسته‌بندی', 'خط تولید', 'مشارکت'], created: ago(5) },
      { id: 'N-1041', kind: 'need', cat: 'investment', company: 'c11', title: 'تأمین سرمایه در گردش برای خرید مواد اولیه', amount: 18, unit: 'میلیارد تومان', desc: 'برای خرید مواد اولیه فصل پرتقاضا؛ بازپرداخت شش‌ماهه از محل فروش.', tags: ['سرمایه در گردش', 'شوینده'], created: ago(6), deadline: ahead(30) },
      { id: 'O-2026', kind: 'offer', cat: 'service', company: 'c8', title: 'طراحی و چاپ بسته‌بندی صادراتی', desc: 'طراحی ساختار و گرافیک، چاپ روی کارتن و جعبه با برچسب چندزبانه.', tags: ['بسته‌بندی', 'چاپ', 'صادرات', 'کارتن'], created: ago(6) },
      { id: 'N-1040', kind: 'need', cat: 'material', company: 'c4', title: 'قوطی فلزی کنسرو ۴۰۰ گرمی', amount: 500, unit: 'هزار عدد در ماه', desc: 'قوطی با لاک داخلی مناسب مواد غذایی؛ تحویل در دزفول.', tags: ['قوطی', 'بسته‌بندی', 'غذایی'], created: ago(8), deadline: ahead(20) },
      { id: 'O-2025', kind: 'offer', cat: 'material', company: 'c8', title: 'عرضه کارتن سه‌لایه و پنج‌لایه', amount: 80, unit: 'هزار عدد در ماه', desc: 'کارتن چاپ‌دار و ساده در ابعاد سفارشی.', tags: ['کارتن', 'بسته‌بندی', 'چاپ'], created: ago(9) },
      { id: 'O-2024', kind: 'offer', cat: 'investment', company: 'c10', title: 'تأمین سرمایه در گردش واحدهای تولیدی', amount: 20, unit: 'میلیارد تومان', desc: 'تأمین مالی کوتاه‌مدت با ضمانت قرارداد فروش.', tags: ['سرمایه در گردش'], created: ago(10) }
    ],

    products: [
      { id: 'P-301', company: 'c5', name: 'خرمای مضافتی و فرآورده‌های خرما', cat: 'food', hs: '0804.10', capacity: 'حدود ۱۵۰ تن در ماه', moq: 'یک کانتینر ۲۰ فوت', standards: ['استاندارد ملی ایران', 'HACCP', 'گواهی حلال'], markets: ['iq', 'qa', 'om', 'ae'], desc: 'خرمای سورت‌شده درجه یک با بسته‌بندی‌های متنوع برای بازارهای منطقه.', specs: [['بسته‌بندی', 'کارتن ۵ و ۱۰ کیلویی، جعبه ۵۰۰ گرمی'], ['ماندگاری', '۱۲ ماه در دمای ۰ تا ۵ درجه'], ['محصولات جانبی', 'شیره و خمیر خرما']], contact: contact('dates-p301'), created: ago(1) },
      { id: 'P-302', company: 'c6', name: 'لوله فولادی درزدار و پروفیل ساختمانی', cat: 'steel', hs: '7306.30', capacity: 'حدود ۸۰۰ تن در ماه', moq: '۲۰ تن', standards: ['ISO 9001', 'استاندارد ملی ایران'], markets: ['iq', 'om'], desc: 'لوله و پروفیل برای مصارف ساختمانی و تأسیساتی.', specs: [['قطر', '½ تا ۸ اینچ'], ['ضخامت', '۲ تا ۶ میلی‌متر'], ['پوشش', 'سیاه، گالوانیزه یا رنگ صنعتی']], contact: contact('pipe-p302'), created: ago(3) },
      { id: 'P-303', company: 'c4', name: 'کنسرو حبوبات و خوراک آماده', cat: 'food', hs: '2005.51', capacity: 'حدود ۲ میلیون قوطی در ماه', moq: 'یک کانتینر ۲۰ فوت', standards: ['HACCP', 'گواهی حلال', 'استاندارد ملی ایران'], markets: ['iq', 'ae', 'qa'], desc: 'کنسرو حبوبات و خوراک‌های آماده با ماندگاری بالا.', specs: [['اندازه قوطی', '۳۵۰ و ۴۰۰ گرمی'], ['ماندگاری', '۲۴ ماه'], ['برچسب', 'فارسی و عربی، قابل سفارشی‌سازی']], contact: contact('food-p303'), created: ago(5) },
      { id: 'P-304', company: 'c11', name: 'مایع ظرفشویی و شوینده‌های صنعتی', cat: 'chemical', hs: '3402.20', capacity: 'حدود ۴۰۰ هزار لیتر در ماه', moq: '۵ هزار لیتر', standards: ['ISO 9001'], markets: ['iq', 'om'], desc: 'شوینده‌های خانگی و صنعتی با امکان تولید سفارشی.', specs: [['بسته‌بندی', 'بطری ۱ و ۴ لیتری، گالن ۲۰ لیتری'], ['فرمولاسیون', 'قابل تنظیم برای سفارش اختصاصی']], contact: contact('clean-p304'), created: ago(7) },
      { id: 'P-305', company: 'c2', name: 'گرانول پلی‌اتیلن بازیافتی درجه یک', cat: 'polymer', hs: '3901.20', capacity: 'حدود ۲۰۰ تن در ماه', moq: '۱۰ تن', standards: ['ISO 9001'], markets: ['ae', 'om'], desc: 'گرانول بازیافتی یکنواخت برای فیلم و تزریق.', specs: [['گرید', 'فیلم و تزریق'], ['رنگ', 'طبیعی و مشکی'], ['بسته‌بندی', 'کیسه ۲۵ کیلویی و جامبوبگ']], contact: contact('poly-p305'), created: ago(9) },
      { id: 'P-306', company: 'c1', name: 'شیرآلات صنعتی و قطعات ماشین‌کاری‌شده', cat: 'parts', hs: '8481.80', capacity: 'حدود ۵ هزار قطعه در ماه', moq: '۲۰۰ قطعه', standards: ['ISO 9001', 'استاندارد ملی ایران'], markets: ['iq', 'qa'], desc: 'شیرهای کشویی و توپی و قطعات سفارشی ماشین‌کاری.', specs: [['جنس', 'فولاد کربنی و چدن داکتیل'], ['سایز', '½ تا ۶ اینچ'], ['فشار کاری', 'تا ۲۵ بار']], contact: contact('valve-p306'), created: ago(12) }
    ],

    cases: [
      { id: 'HS-1405-0112', company: 'c5', cat: 'water', title: 'تأخیر در نصب انشعاب آب صنعتی', desc: 'درخواست انشعاب دو ماه پیش ثبت شده ولی هنوز نصب نشده و راه‌اندازی خط جدید متوقف مانده است.', note: '', priority: 'urgent', status: 'new', assignee: UNITS[0], location: 'شهرک صنعتی شادگان — قطعه ۷', created: ago(1, 2), updated: ago(1, 2),
        history: [hist(ago(1, 2), 'new', 'company', 'نماینده خرمای طلایی جنوب', 'پرونده ثبت شد.')], notes: [] },
      { id: 'HS-1405-0110', company: 'c4', cat: 'infra', title: 'خرابی آسفالت معبر اصلی ورودی', desc: 'چاله‌های عمیق در معبر ورودی باعث آسیب به بار و تأخیر در تردد کامیون‌ها شده است.', note: '', priority: 'medium', status: 'new', assignee: UNITS[0], location: 'شهرک صنعتی دزفول — خیابان اصلی', created: ago(2, 5), updated: ago(2, 5),
        history: [hist(ago(2, 5), 'new', 'company', 'نماینده صنایع غذایی دشت‌آذر', 'پرونده ثبت شد.')], notes: [] },
      { id: 'HS-1405-0107', company: 'c2', cat: 'permit', title: 'تأخیر در صدور مجوز ساخت سوله دوم', desc: 'مدارک کامل ارسال شده اما پاسخی درباره مجوز ساخت دریافت نکرده‌ایم.', note: '', priority: 'high', status: 'review', assignee: UNITS[3], location: 'شهرک صنعتی شماره ۴ اهواز', created: ago(6), updated: ago(5),
        history: [hist(ago(6), 'new', 'company', 'نماینده پلیمر سپید کارون', 'پرونده ثبت شد.'), hist(ago(5), 'review', 'expert', EXP, 'مدارک دریافت شد و در حال بررسی است.')], notes: [] },
      { id: 'HS-1405-0104', company: 'c1', cat: 'power', title: 'قطعی‌های مکرر برق در ساعات اوج مصرف', desc: 'در هفته گذشته چهار قطعی بیش از ۳۰ دقیقه داشته‌ایم؛ دستگاه‌های CNC در میانه کار متوقف می‌شوند و قطعه‌ها ضایعات می‌شوند.', note: '', priority: 'high', status: 'referred', assignee: UNITS[2], location: 'شهرک صنعتی شماره ۲ اهواز — قطعه ۱۴', created: ago(4), updated: ago(0, 2),
        history: [hist(ago(4), 'new', 'company', 'علی محمدی', 'پرونده ثبت شد.'), hist(ago(3), 'review', 'expert', EXP, 'بررسی اولیه انجام شد؛ گزارش قطعی‌ها از پست برق شهرک درخواست شد.'), hist(ago(0, 2), 'referred', 'expert', EXP, 'برای بررسی فنی به واحد برق و انرژی شهرک ارجاع شد.')],
        notes: [{ at: ago(3), by: 'مریم رضایی', text: 'احتمالاً مشکل از فیدر شمالی است؛ با واحد برق هماهنگ شود.' }] },
      { id: 'HS-1405-0101', company: 'c3', cat: 'other', title: 'نبود سرویس رفت‌وآمد برای کارکنان شیفت شب', desc: 'کارکنان شیفت شب برای رسیدن به شهرک وسیله عمومی ندارند و غیبت‌ها زیاد شده است.', note: '', priority: 'low', status: 'referred', assignee: UNITS[0], location: 'شهرک صنعتی آبادان', created: ago(9), updated: ago(6),
        history: [hist(ago(9), 'new', 'company', 'نماینده فناوران تجهیز اروند', 'پرونده ثبت شد.'), hist(ago(8), 'review', 'expert', EXP, 'در حال بررسی.'), hist(ago(6), 'referred', 'expert', EXP, 'برای هماهنگی با شهرداری منطقه ارجاع شد (نمایشی).')], notes: [] },
      { id: 'HS-1405-0098', company: 'c1', cat: 'water', title: 'افت فشار آب شبکه در ساعات اوج', desc: 'از ساعت ۱۰ تا ۱۴ فشار آب برای سیستم خنک‌کاری دستگاه‌ها کافی نیست.', note: '', priority: 'medium', status: 'review', assignee: UNITS[1], location: 'شهرک صنعتی شماره ۲ اهواز — قطعه ۱۴', created: ago(9), updated: ago(8),
        history: [hist(ago(9), 'new', 'company', 'علی محمدی', 'پرونده ثبت شد.'), hist(ago(8), 'review', 'expert', EXP, 'به واحد آب و فاضلاب شهرک اطلاع داده شد.')], notes: [] },
      { id: 'HS-1405-0095', company: 'c6', cat: 'power', title: 'درخواست افزایش دیماند برق کارخانه', desc: 'با نصب خط جدید، قدرت قراردادی فعلی کافی نیست.', note: '', priority: 'medium', status: 'review', assignee: UNITS[2], location: 'شهرک صنعتی شماره ۱ اهواز', created: ago(12), updated: ago(10),
        history: [hist(ago(12), 'new', 'company', 'نماینده لوله و پروفیل فولادین کارون', 'پرونده ثبت شد.'), hist(ago(10), 'review', 'expert', EXP, 'در انتظار بررسی ظرفیت پست.')], notes: [] },
      { id: 'HS-1405-0087', company: 'c1', cat: 'permit', title: 'تمدید پروانه بهره‌برداری', desc: 'پروانه بهره‌برداری تا دو ماه دیگر منقضی می‌شود؛ فهرست مدارک لازم برای تمدید را می‌خواهیم.', note: '', priority: 'medium', status: 'answered', assignee: UNITS[3], location: 'شهرک صنعتی شماره ۲ اهواز — قطعه ۱۴', created: ago(10), updated: ago(2),
        history: [hist(ago(10), 'new', 'company', 'علی محمدی', 'پرونده ثبت شد.'), hist(ago(9), 'review', 'expert', EXP, 'در حال بررسی سوابق پروانه.'), hist(ago(2), 'answered', 'expert', EXP, 'فهرست مدارک تمدید ارسال شد: گواهی ایمنی، آخرین قبض‌ها و تصویر پروانه فعلی (نمایشی). پس از بارگذاری مدارک، تمدید بررسی می‌شود.')], notes: [] },
      { id: 'HS-1405-0061', company: 'c1', cat: 'env', title: 'استعلام محیط‌زیستی برای توسعه سوله', desc: 'برای توسعه سالن رنگ‌کاری، الزامات محیط‌زیستی را می‌خواهیم بدانیم.', note: '', priority: 'low', status: 'closed', assignee: UNITS[5], location: 'شهرک صنعتی شماره ۲ اهواز — قطعه ۱۴', created: ago(40), updated: ago(25),
        history: [hist(ago(40), 'new', 'company', 'علی محمدی', 'پرونده ثبت شد.'), hist(ago(38), 'review', 'expert', EXP, 'در حال بررسی.'), hist(ago(36), 'referred', 'expert', EXP, 'به کارشناس محیط‌زیست ارجاع شد.'), hist(ago(28), 'answered', 'expert', 'کارشناس محیط‌زیست', 'الزامات تهویه و تصفیه هوا اعلام شد (نمایشی).'), hist(ago(25), 'closed', 'company', 'علی محمدی', 'پاسخ دریافت شد؛ پرونده بسته شد.')], notes: [] }
    ],

    events: [
      { id: 'E-1', type: 'notice', title: 'تمدید مهلت ثبت درخواست مجوزهای زیست‌محیطی', date: ahead(3), place: 'اطلاعیه برخط', mode: 'اطلاعیه', desc: 'مهلت ثبت درخواست برای واحدهایی که در حال توسعه هستند تمدید شد. جزئیات و مدارک لازم در این اطلاعیه نمونه آمده است.' },
      { id: 'E-2', type: 'training', title: 'کارگاه الزامات صادرات به عراق و عمان', date: ahead(5, 6), place: 'برخط', mode: 'آنلاین', seats: 80, taken: 52, desc: 'آشنایی با مراحل ارزیابی آمادگی، مدارک رایج صادرات و تجربه‌های عملی واحدهای استان.' },
      { id: 'E-3', type: 'meeting', title: 'نشست B2B تأمین مواد اولیه پلیمری', date: ahead(9, 4), place: 'سالن همایش شهرک صنعتی شماره ۴ اهواز', mode: 'حضوری', seats: 40, taken: 29, desc: 'دیدار مستقیم تولیدکنندگان و تأمین‌کنندگان مواد اولیه پلیمری برای قراردادهای میان‌مدت.' },
      { id: 'E-4', type: 'expo', title: 'نمایشگاه توانمندی‌های صنعتی خوزستان', date: ahead(12), place: 'اهواز', mode: 'حضوری', seats: 120, taken: 87, desc: 'معرفی محصولات و توانمندی‌های واحدهای صنعتی استان به خریداران داخلی و هیئت‌های تجاری (رویداد نمونه).' },
      { id: 'E-5', type: 'training', title: 'دوره بهره‌وری انرژی در واحدهای تولیدی', date: ahead(19), place: 'برخط', mode: 'آنلاین', seats: 100, taken: 34, desc: 'روش‌های کاهش مصرف برق و آب در خطوط تولید و مدیریت بار در ساعات اوج.' },
      { id: 'E-6', type: 'expo', title: 'رویداد معرفی فرصت‌های سرمایه‌گذاری شهرک‌ها', date: ahead(26), place: 'اهواز', mode: 'حضوری', seats: 60, taken: 21, desc: 'ارائه طرح‌های آماده سرمایه‌گذاری واحدهای صنعتی به سرمایه‌گذاران و صندوق‌ها (رویداد نمونه).' }
    ],

    notifications: [
      { id: 'nt1', role: 'company', icon: 'zap', tone: 'purple', text: 'پرونده HS-1405-0104 به «ارجاع‌شده» تغییر کرد.', at: ago(0, 2), read: false, link: { page: 'desk', open: 'HS-1405-0104' } },
      { id: 'nt2', role: 'company', icon: 'sparkles', tone: 'green', text: 'برای نیاز «ورق فولادی St37» پیشنهاد مرتبط پیدا شد.', at: ago(0, 6), read: false, link: { page: 'needs', open: 'N-1048' } },
      { id: 'nt3', role: 'company', icon: 'message', tone: 'blue', text: 'کارشناس به پرونده HS-1405-0087 پاسخ داد.', at: ago(2), read: true, link: { page: 'desk', open: 'HS-1405-0087' } },
      { id: 'nt4', role: 'company', icon: 'calendar', tone: 'orange', text: 'یادآوری: کارگاه الزامات صادرات، ۵ روز دیگر.', at: ago(2, 4), read: true, link: { page: 'events', open: 'E-2' } },
      { id: 'nx1', role: 'expert', icon: 'inbox', tone: 'red', text: 'پرونده فوری HS-1405-0112 از «خرمای طلایی جنوب» ثبت شد.', at: ago(1, 2), read: false, link: { page: 'expert', open: 'HS-1405-0112' } },
      { id: 'nx2', role: 'expert', icon: 'alert', tone: 'orange', text: 'چند پرونده از سررسید پاسخ گذشته‌اند.', at: ago(0, 8), read: false, link: { page: 'expert' } }
    ],

    contacts: {},
    registrations: {},
    assessments: []
  };
}
