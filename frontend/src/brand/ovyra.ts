export type ArchiveFigure = {
  id: number;
  code: string;
  name: string;
  nameFa: string;
  tagline: string;
  accent: string;
};

export const BRAND = {
  name: 'OVYRA',
  series: 'THE LOST ARCHIVE',
  archive: 'ARCHIVE 01',
  tagline: 'COLLECT. CONNECT. COMPLETE.',
  closing: 'YOU ARE THE TENTH.',
  eyeLine: 'WHEN THE TEN ARE TOGETHER, THE EYE REMEMBERS.',
  age: '15+',
} as const;

export const COPY = {
  hero: {
    line1: 'ده موجود.',
    line2: 'یک چشم.',
    line3: 'تو دهمی.',
    lead: 'آرشیوی که سال‌ها گم بود، دوباره پیدا شد.',
    sub: 'ده فیگور با داستان‌های جدا. یک چشم بنفش که فقط وقتی کامل شود، راز را به یاد می‌آورد.',
    ctaPrimary: 'ورود به آرشیو ۰۱',
    ctaSecondary: 'چطور کار می‌کند؟',
    statFigures: 'موجود',
    statEye: 'چشم',
    statAge: 'کلکسیونر',
  },
  system: {
    eyebrow: 'SYSTEM',
    lead: 'سه حرکت ساده. یک آرشیو کامل.',
    steps: [
      {
        step: '01',
        title: 'COLLECT',
        fa: 'جمع کن',
        body: 'هر جعبه شامل فیگور، Lore Card، Puzzle Piece و Archive Plate است.',
      },
      {
        step: '02',
        title: 'CONNECT',
        fa: 'وصل کن',
        body: 'نمادهای جعبه کنار هم قرار می‌گیرند و چشم بنفش آرشیو شکل می‌گیرد.',
      },
      {
        step: '03',
        title: 'COMPLETE',
        fa: 'کامل کن',
        body: 'با ده جعبه، چشم کامل می‌شود و آرشیو بیدار می‌شود.',
      },
    ],
  },
  archive: {
    eyebrow: 'ARCHIVE 01',
    title: 'ده موجود منتظرند',
    lead: 'هر کدام داستان خودش را دارد. یکی را انتخاب کن و اولین قطعه چشم را بردار.',
    shopCta: 'ورود به آرشیو ۰۱',
    featuredCta: 'مشاهده در فروشگاه',
  },
  why: {
    eyebrow: 'WHY OVYRA',
    title1: 'کلکسیونی که',
    title2: 'داستان دارد.',
    lead: 'OVYRA فقط فیگور نیست. یک سیستم lore است که با هر جعبه عمیق‌تر می‌شود.',
  },
  cta: {
    title1: 'یک قطعه بردار.',
    title2: 'آرشیو را بیدار کن.',
    sub: 'شخصیت را انتخاب کن. جعبه را باز کن. به سمت چشم کامل حرکت کن.',
    primary: 'ورود به آرشیو ۰۱',
    secondary: 'داستان برند',
  },
  sticky: 'ورود به آرشیو ۰۱',
  shop: {
    title: 'فروشگاه آرشیو',
    titleEn: 'Archive Shop',
    lead: 'هر جعبه: فیگور، lore، قطعه چشم و پلاک. پرینت سه‌بعدی OVYRA.',
    searchPlaceholder: 'نام شخصیت را جستجو کن',
    emptySearch: 'چیزی با این نام پیدا نشد.',
    fallbackLead: 'فعلاً محصولات API در دسترس نیست. این‌ها شخصیت‌های رسمی Archive 01 هستند.',
  },
  about: {
    lead: 'OVYRA برند فیگور و lore است. هر موجود یک داستان دارد و بخشی از چشم بنفش آرشیو.',
    body: 'Archive 01 ده شخصیت دارد. وقتی هر ده جعبه کنار هم باشند، چشم کامل می‌شود.',
  },
  footer: {
    tagline: 'فیگور lore محور با پرینت سه‌بعدی. جمع کن، وصل کن، کامل کن.',
  },
} as const;

export const ARCHIVE_01: ArchiveFigure[] = [
  { id: 1, code: '01', name: 'Memory Parasite', nameFa: 'انگل حافظه', tagline: 'خاطراتی که مال تو نبودند.', accent: '#9b5de5' },
  { id: 2, code: '02', name: 'Mood Totem', nameFa: 'توتم حال', tagline: 'حس بدون حافظه، هرج‌ومرج می‌آورد.', accent: '#c9a227' },
  { id: 3, code: '03', name: 'Void Creature', nameFa: 'موجود خلأ', tagline: 'آسمان داخل قفسه سینه.', accent: '#3b82f6' },
  { id: 4, code: '04', name: 'Urban Fossil', nameFa: 'فسیل شهری', tagline: 'بتن و چرخ‌دنده با یک چشم.', accent: '#94a3b8' },
  { id: 5, code: '05', name: 'Living Planter', nameFa: 'گلدان زنده', tagline: 'زندگی از ترک‌ها بیرون می‌زند.', accent: '#84cc16' },
  { id: 6, code: '06', name: 'Gravity Breaker', nameFa: 'شکننده گرانش', tagline: 'وقتی زمین دیگر قانون نیست.', accent: '#e2e8f0' },
  { id: 7, code: '07', name: 'Echo Heads', nameFa: 'سرهای پژواک', tagline: 'ماسک‌هایی که صدا را نگه می‌دارند.', accent: '#38bdf8' },
  { id: 8, code: '08', name: 'Persian Neo Myth', nameFa: 'نئواسطوره پارسی', tagline: 'طلا روی بال اسطوره.', accent: '#d4af37' },
  { id: 9, code: '09', name: 'Broken Dimension', nameFa: 'بعد شکسته', tagline: 'نیمه تن، نیمه بلور.', accent: '#c026d3' },
  { id: 10, code: '10', name: 'Shadow Companion', nameFa: 'همراه سایه', tagline: 'چهره‌ای از نور در تاریکی.', accent: '#f59e0b' },
];

export const BOX_CONTENTS = [
  { title: 'FIGURE', titleFa: 'فیگور', desc: 'شخصیت پرینت‌شده با جزئیات بالا.' },
  { title: 'LORE CARD', titleFa: 'کارت lore', desc: 'داستان و نقل‌قول شخصیت.' },
  { title: 'PUZZLE', titleFa: 'قطعه چشم', desc: 'یک تکه از پازل. با نُه قطعه دیگر کامل می‌شود.' },
  { title: 'PLATE', titleFa: 'پلاک آرشیو', desc: 'پلاک شماره‌دار مخصوص این سیزن.' },
] as const;

export const TRUST_SIGNALS = [
  'پرینت سه‌بعدی اختصاصی',
  'Limited Archive 01',
  'Lore + Puzzle + Plate',
  'جعبه Premium',
  '۱۵+',
] as const;

export const COMPETITOR_EDGE = [
  'lore یکپارچه برای هر ده شخصیت',
  'مکانیک چشم بنفش: Collect · Connect · Complete',
  'هر جعبه: فیگور + lore + پازل + پلاک',
  'تولید مستقیم از طراحی تا پرینت',
] as const;

export const SEASON_02 = {
  label: 'SEASON 02',
  title: 'آرشیو بعدی به‌زودی',
  body: 'بعد از تکمیل Archive 01 درگاه سیزن بعدی باز می‌شود.',
  cta: 'خبرم کن',
} as const;

export type NavPillItem = {
  id: string;
  label: string;
  to?: string;
  comingSoon?: boolean;
  accent: string;
  glow: string;
};

export const NAV_PILLS: NavPillItem[] = [
  {
    id: 'characters',
    label: 'شخصیت‌ها',
    to: '/products',
    accent: '#9d4edd',
    glow: 'rgba(157,78,221,0.45)',
  },
  {
    id: 'story',
    label: 'داستان',
    to: '/about',
    accent: '#c9a227',
    glow: 'rgba(201,162,39,0.4)',
  },
  {
    id: 'ai',
    label: 'هوش مصنوعی',
    comingSoon: true,
    accent: '#c026d3',
    glow: 'rgba(192,38,211,0.5)',
  },
];

export const NAV_HOME = {
  id: 'home',
  label: 'آرشیو',
  to: '/',
} as const;

export const NAV_AUTH = {
  login: {
    id: 'login',
    label: 'ورود',
    accent: '#c9a227',
    glow: 'rgba(201,162,39,0.45)',
  },
  logout: {
    id: 'logout',
    label: 'خروج',
    accent: '#94a3b8',
    glow: 'rgba(148,163,184,0.35)',
  },
} as const;

export const NAV_UTIL = [
  { id: 'cart', to: '/cart', label: 'سبد' },
  { id: 'orders', to: '/orders', label: 'سفارش‌ها' },
] as const;

export function matchArchiveFigure(productName?: string): ArchiveFigure | undefined {
  if (!productName) return undefined;
  const n = productName.toLowerCase();
  return ARCHIVE_01.find(
    (f) =>
      n.includes(f.name.toLowerCase()) ||
      n.includes(f.nameFa) ||
      n.includes(`archive ${f.code}`) ||
      n.includes(f.code.padStart(2, '0'))
  );
}
