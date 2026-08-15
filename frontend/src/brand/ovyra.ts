export type ArchiveFigure = {
  id: number;
  code: string;
  name: string;
  nameFa: string;
  tagline: string;
  taglineEn: string;
  loreFa: string;
  loreEn: string;
  accent: string;
  image: string;
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
  heroRealm: {
    welcome: 'WELCOME TO',
    title: 'OVYRA',
    subtitle: 'OVYRA — WHERE IMAGINATION TAKES FORM.',
    bodyFa: 'اویرا؛ جایی که تخیل شکل می‌گیرد',
    statsEn: '10 BEINGS. 10 STORIES. 1 SECRET.',
    statsFa: '۱۰ موجود. ۱۰ داستان. ۱ راز',
    cta: 'EXPLORE THE WORLD',
    scroll: 'SCROLL TO DISCOVER',
    closingLine1: 'ARE YOU READY',
    closingLine2: 'TO UNCOVER THE TRUTH?',
    social: [
      { label: 'INSTAGRAM', href: 'https://instagram.com' },
      { label: 'YOUTUBE', href: 'https://youtube.com' },
      { label: 'DISCORD', href: 'https://discord.com' },
    ],
  },
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
    eyebrow: 'THE OVYRA SYSTEM',
    title: 'COLLECT. CONNECT. COMPLETE.',
    subtitle: 'OVYRA — MORE THAN COLLECTIBLES. A LIVING ARCHIVE.',
    manifestoFa: 'هر جعبه، یک موجود. هر موجود، یک راز. هر راز، یک تکه از چشم.',
    statsEn: 'FIGURE. LORE. PUZZLE. ONE TRUTH.',
    statsFa: 'فیگور. کارت. پازل. یک حقیقت.',
    lead: 'با هر خرید، شخصیت، کارت lore و قطعه پازل را دریافت می‌کنی و هر کدام تو را به حقیقت پنهان نزدیک‌تر می‌کند.',
    imageAlt: 'Inside the OVYRA Archive 01 box — figure, lore card, and puzzle piece',
    callouts: {
      lore: {
        tag: 'LORE CARD',
        titleFa: 'کارت راز',
        body: 'داستان عمیق هر موجود — سرنخ‌هایی که فقط داخل کارت نهفته‌اند و به تکمیل پازل کمک می‌کنند.',
      },
      puzzle: {
        tag: 'PUZZLE PIECE',
        titleFa: 'قطعه چشم',
        body: 'یک تکه از پازل بنفش آرشیو. ده قطعه کنار هم — چشم کامل می‌شود.',
      },
    },
    steps: [
      {
        step: '01',
        title: 'COLLECT',
        fa: 'جمع کن',
        body: 'هر جعبه یک موجود داستانی را باز می‌کند: فیگور پرینت‌شده، Lore Card، قطعه پازل و پلاک Archive.',
        hint: 'A piece of the truth — in every box.',
      },
      {
        step: '02',
        title: 'CONNECT',
        fa: 'وصل کن',
        body: 'کارت‌ها را بخوان. قطعات را کنار هم بگذار. نمادها روی جعبه‌ها چشم بنفش آرشیو را شکل می‌دهند.',
        hint: 'The eye begins to form.',
      },
      {
        step: '03',
        title: 'COMPLETE',
        fa: 'کامل کن',
        body: 'ده موجود. ده داستان. یک راز. وقتی آرشیو کامل شود، چشم بیدار می‌شود — و حقیقت آشکار.',
        hint: 'You are the tenth.',
      },
    ],
    closing: 'WHEN THE TEN ARE TOGETHER, THE EYE REMEMBERS.',
    closingFa: 'وقتی ده‌تایی کنار هم باشند، چشم به یاد می‌آورد.',
  },
  archive: {
    eyebrow: 'ARCHIVE 01',
    titleEn: 'TEN BEINGS AWAIT',
    title: 'ده موجود منتظرند',
    lead: 'هر کدام داستان خودش را دارد. یکی را انتخاب کن و اولین قطعه چشم را بردار.',
    statsEn: '10 BEINGS. 10 STORIES. 1 SECRET.',
    statsFa: '۱۰ موجود. ۱۰ داستان. ۱ راز',
    storyCta: 'ورود به داستان',
    storyCtaEn: 'ENTER THE STORY',
    storyChip: 'منشأ · زندگی · راز',
    hoverHint: 'HOVER TO INSPECT',
    dossierLabel: 'ARCHIVE DOSSIER',
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
  {
    id: 1,
    code: '01',
    name: 'Memory Parasite',
    nameFa: 'انگل حافظه',
    tagline: 'خاطراتی که مال تو نبودند.',
    taglineEn: 'Memories that were never yours.',
    loreFa:
      'در اعماق آرشیو گم‌شده، موجوداتی زندگی می‌کنند که خاطره نمی‌سازند — قرض می‌گیرند. انگل حافظه از لایه‌های فراموش‌شده ذهن تغذیه می‌کند و هر بار که نگاهش می‌افتد، تصویری را برمی‌گرداند که شاید هرگز مال تو نبوده. بعضی می‌گویند اولین بار در یک جعبه Archive 01 پیدا شد — بدون برچسب، بدون نام.',
    loreEn:
      'In the depths of the Lost Archive, beings live that do not create memories — they borrow them. The Memory Parasite feeds on forgotten layers of the mind, returning images that were never yours. Some say it was first found inside an unmarked Archive 01 box — no label, no name, only eyes that remembered someone else.',
    accent: '#9b5de5',
    image: '/brand/archive/figure-01.png',
  },
  {
    id: 2,
    code: '02',
    name: 'Mood Totem',
    nameFa: 'توتم حال',
    tagline: 'حس بدون حافظه، هرج‌ومرج می‌آورد.',
    taglineEn: 'Feeling without memory brings chaos.',
    loreFa:
      'توتم حال بدون نام است. احساسی که نمی‌دانی از کجا آمده، اما تمام بدنت را می‌لرزاند. مهندسان آرشیو می‌گویند این موجود حامل «حالت‌های گم‌شده» است — پیش از آنکه تبدیل به خاطره شوند. هر خط روی بدنش مثل ردی از طوفانی است که هنوز تمام نشده.',
    loreEn:
      'The Mood Totem has no name of its own. It carries feelings you cannot place — yet they shake your whole body. Archive engineers call it a vessel for lost moods, emotions that arrive before memory can claim them. Every scratch on its surface reads like a storm that never finished passing.',
    accent: '#c9a227',
    image: '/brand/archive/figure-02.png',
  },
  {
    id: 3,
    code: '03',
    name: 'Void Creature',
    nameFa: 'موجود خلأ',
    tagline: 'آسمان داخل قفسه سینه.',
    taglineEn: 'A sky inside the ribcage.',
    loreFa:
      'سینه‌اش پنجره‌ای به جایی دیگر است. ستاره‌ها درونش می‌چرخند، اما هیچ‌کس نمی‌داند آن سمت چه چیزی نگاه می‌کند. هر قطعه پازل این موجود، بخشی از آسمان بنفش آرشیو را روشن می‌کند. داستانش با سکوت شروع شد — و هنوز هم بیشترش نگفته شده.',
    loreEn:
      'Its chest is a window to somewhere else. Stars spin inside, but no one knows what stares back. Each puzzle piece tied to this being lights another fragment of the Archive\'s purple sky. Its story began in silence — and most of it remains unspoken.',
    accent: '#3b82f6',
    image: '/brand/archive/figure-03.png',
  },
  {
    id: 4,
    code: '04',
    name: 'Urban Fossil',
    nameFa: 'فسیل شهری',
    tagline: 'بتن و چرخ‌دنده با یک چشم.',
    taglineEn: 'Concrete, gears, and a single eye.',
    loreFa:
      'وقتی شهرها پیر می‌شوند، چیزی زیر بتن زنده می‌ماند. فسیل شهری از لایه‌های ساختمان، خیابان و ماشین ساخته شده — با یک چشم مکانیکی که هنوز می‌بیند و هنوز چیزی را به یاد می‌آورد. منشأش در ویرانه‌هایی است که دیگر روی نقشه‌ها نیست.',
    loreEn:
      'When cities grow old, something keeps breathing beneath the concrete. The Urban Fossil is built from layers of buildings, streets, and machines — one mechanical eye still watching, still remembering. Its origin lies in ruins that no longer appear on any map.',
    accent: '#94a3b8',
    image: '/brand/archive/figure-04.png',
  },
  {
    id: 5,
    code: '05',
    name: 'Living Planter',
    nameFa: 'گلدان زنده',
    tagline: 'زندگی از ترک‌ها بیرون می‌زند.',
    taglineEn: 'Life pushes through the cracks.',
    loreFa:
      'از ترک‌های فلز و خاک، زندگی بیرون می‌زند. گلدان زنده نماد امید آرشیو است: حتی در تاریک‌ترین جعبه‌ها، چیزی رشد می‌کند — اگر به آن فضا بدهی. برگ‌هایش سرنخ‌هایی پنهان درباره چشم بنفش دارند. زندگی این موجود با اولین قطره نور داخل آرشیو شروع شد.',
    loreEn:
      'From cracks in metal and soil, life breaks through. The Living Planter is the Archive\'s quiet hope: even in the darkest boxes, something grows — if you give it room. Its leaves hide clues about the purple eye. This being\'s life began with the first drop of light inside the Archive.',
    accent: '#84cc16',
    image: '/brand/archive/figure-05.png',
  },
  {
    id: 6,
    code: '06',
    name: 'Gravity Breaker',
    nameFa: 'شکننده گرانش',
    tagline: 'وقتی زمین دیگر قانون نیست.',
    taglineEn: 'When the ground is no longer law.',
    loreFa:
      'وقتی قوانین فیزیک دیگر پاسخ نمی‌دهند، این موجود بیدار می‌شود. شکننده گرانش در مرز زمین و آسمان زندگی می‌کند — جایی که سقوط معنا ندارد و هر پرش، داستانی تازه باز می‌کند. منشأش در لحظه‌ای است که یک پازل آرشیو از جای خود کمی بلند شد.',
    loreEn:
      'When the laws of physics stop answering, this being wakes. The Gravity Breaker lives on the border between earth and sky — where falling means nothing and every leap opens a new story. Its origin is the moment an Archive puzzle piece lifted slightly off the ground.',
    accent: '#e2e8f0',
    image: '/brand/archive/figure-06.png',
  },
  {
    id: 7,
    code: '07',
    name: 'Echo Heads',
    nameFa: 'سرهای پژواک',
    tagline: 'ماسک‌هایی که صدا را نگه می‌دارند.',
    taglineEn: 'Masks that hold the sound.',
    loreFa:
      'صداها در این ماسک‌ها گیر می‌کنند. سرهای پژواک هر کلمه‌ای را که گفته شده نگه می‌دارند — حتی آن‌هایی که نباید شنیده می‌شدند. پرونده این موجود پر از پژواک‌های ناتمام و رازهایی است که هنوز تمام نشده. زندگی‌اش با اولین جمله‌ای آغاز شد که کسی جرأت تکرارش را نداشت.',
    loreEn:
      'Sounds get trapped inside these masks. The Echo Heads keep every word ever spoken — even those that should never have been heard. Their dossier is full of unfinished echoes and secrets still mid-sentence. Their life began with the first phrase no one dared repeat.',
    accent: '#38bdf8',
    image: '/brand/archive/figure-07.png',
  },
  {
    id: 8,
    code: '08',
    name: 'Persian Neo Myth',
    nameFa: 'نئواسطوره پارسی',
    tagline: 'طلا روی بال اسطوره.',
    taglineEn: 'Gold laid over mythic wings.',
    loreFa:
      'اسطوره‌های کهن با طلا و سنگ بازآفرینی شده‌اند. نئواسطوره پارسی پل بین گذشته و آینده آرشیو است — بال‌هایی که همزمان به تاریخ و فردا اشاره می‌کنند. در هر پر، تکه‌ای از حقیقت پنهان جا داده شده. منشأش در داستان‌هایی است که مادربزرگ‌ها در تاریکی تعریف می‌کردند.',
    loreEn:
      'Ancient myths reforged in gold and stone. The Persian Neo Myth bridges the Archive\'s past and future — wings pointing at history and tomorrow at once. Each feather hides a piece of the hidden truth. Its origin lies in stories grandmothers used to tell in the dark.',
    accent: '#d4af37',
    image: '/brand/archive/figure-08.png',
  },
  {
    id: 9,
    code: '09',
    name: 'Broken Dimension',
    nameFa: 'بعد شکسته',
    tagline: 'نیمه تن، نیمه بلور.',
    taglineEn: 'Half flesh, half crystal.',
    loreFa:
      'نیمه‌اش جسم، نیمه‌اش بلور. بعد شکسته در نقطه‌ای ایستاده که واقعیت ترک خورده — و از آن ترک‌ها، نور بنفش بیرون می‌زند. هر بلوری که از بدنش جدا می‌شود، یک تکه از پازل چشم است. زندگی‌اش جایی شروع شد که یک بعد، دیگر نمی‌توانست به بعد دیگر وصل شود.',
    loreEn:
      'Half body, half crystal. The Broken Dimension stands where reality split — purple light leaking through the fracture. Every shard that breaks away becomes part of the eye puzzle. Its life began where one dimension could no longer connect to the next.',
    accent: '#c026d3',
    image: '/brand/archive/figure-09.png',
  },
  {
    id: 10,
    code: '10',
    name: 'Shadow Companion',
    nameFa: 'همراه سایه',
    tagline: 'چهره‌ای از نور در تاریکی.',
    taglineEn: 'A face made of light in the dark.',
    loreFa:
      'در تاریک‌ترین گوشه آرشیو، همراهی زندگی می‌کند که چهره ندارد — فقط نور. سایه‌ات نیست؛ راهنمایی است که منتظر مانده تا تو، موجود دهم، جای خود را پیدا کنی. وقتی ده موجود کنار هم باشند، چشم آرشیو کامل می‌شود — و این همراه، اولین نفری است که آن را می‌بیند.',
    loreEn:
      'In the Archive\'s darkest corner lives a companion with no face — only light. Not your shadow, but a guide waiting for you, the tenth being, to take your place. When all ten stand together, the eye completes — and this companion is the first to witness it.',
    accent: '#f59e0b',
    image: '/brand/archive/figure-10.png',
  },
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
  variant?: 'kids';
};

export const NAV_PILLS: NavPillItem[] = [
  {
    id: 'characters',
    label: 'خزانه OVYRA',
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
    id: 'kids',
    label: 'KIDS',
    comingSoon: true,
    accent: '#ff2fd6',
    glow: 'rgba(255,47,214,0.7)',
    variant: 'kids',
  },
];

export const NAV_HOME = {
  id: 'home',
  label: 'آرشیو شخصیت‌ها',
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
