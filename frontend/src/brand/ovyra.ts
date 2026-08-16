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

/** Figures that need a slightly larger render in grid + spotlight. */
export const ARCHIVE_FIGURE_LARGE = new Set(['01', '02', '04', '06', '09']);

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
    eyebrow: 'THE LOST ARCHIVE',
    tagline: 'فیگور lore محور با پرینت سه‌بعدی. جمع کن، وصل کن، کامل کن.',
    taglineEn: 'Lore-driven figures. Collect. Connect. Complete.',
    archiveHeading: 'ARCHIVE',
    legalHeading: 'LEGAL',
    socialHeading: 'CONNECT',
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
      'اولین بار داخل جعبه‌ای پیدا شد که برچسب نداشت. چند چشم دارد و هر کدام چیز دیگری را به یاد می‌آورد. نه خاطره خودش. خاطره کس دیگر. روی Lore Card نوشته: بعضی خاطره‌ها مثل مه هستند. وقتی نگهشان می‌داری، مال تو می‌شوند.',
    loreEn:
      'First found in a box with no label. It has several eyes, and each one remembers something different. Not its own memory. Someone else\'s. The Lore Card reads: some memories are like fog. Hold them long enough, and they become yours.',
    accent: '#9b5de5',
    image: '/brand/Copilot_20260815_161213.png',
  },
  {
    id: 2,
    code: '02',
    name: 'Mood Totem',
    nameFa: 'توتم حال',
    tagline: 'حس بدون حافظه، هرج‌ومرج می‌آورد.',
    taglineEn: 'Feeling without memory brings chaos.',
    loreFa:
      'روی بدنش خط و خش زیاد است. انگار بارها افتاده و بلند شده. توتم حال احساس را نگه می‌دارد، نه دلیلش را. وقتی نزدیکش می‌شوی، حالت عجیبی می‌گیری. نه خوش، نه بد. فقط آشنا.',
    loreEn:
      'Its body is full of scratches, as if it has been dropped and picked up many times. The Mood Totem holds the feeling, not the reason. Stand close and your mood shifts. Not happy, not bad. Just familiar.',
    accent: '#c9a227',
    image: '/brand/Copilot_20260815_160150.png',
  },
  {
    id: 3,
    code: '03',
    name: 'Void Creature',
    nameFa: 'موجود خلأ',
    tagline: 'آسمان داخل قفسه سینه.',
    taglineEn: 'A sky inside the ribcage.',
    loreFa:
      'داخل سینه‌اش تاریک است، ولی نقطه‌های کوچک نور مثل ستاره می‌درخشند. کسی نمی‌داند آن طرف چیست. فقط می‌دانیم قطعه پازل این موجود با آسمان بنفش آرشیو جور درمی‌آید.',
    loreEn:
      'Its chest is dark, but small points of light shine like stars. No one knows what is on the other side. We only know its puzzle piece fits the Archive\'s purple sky.',
    accent: '#3b82f6',
    image: '/brand/Copilot_20260815_160924.png',
  },
  {
    id: 4,
    code: '04',
    name: 'Urban Fossil',
    nameFa: 'فسیل شهری',
    tagline: 'بتن و چرخ‌دنده با یک چشم.',
    taglineEn: 'Concrete, gears, and a single eye.',
    loreFa:
      'از بتن، پیچ و چرخ‌دنده ساخته شده. یک چشم دارد و کافی است. در پرونده آرشیو نوشته شده که اولین بار کنار یک کارخانه متروکه پیدا شده. هنوز گاهی صدای قدم روی سنگفرش را نگه می‌دارد.',
    loreEn:
      'Made of concrete, bolts, and gears. It has one eye, and that is enough. Archive records say it was first found near an abandoned factory. It still sometimes holds the sound of footsteps on pavement.',
    accent: '#94a3b8',
    image: '/brand/Copilot_20260815_162459.png',
  },
  {
    id: 5,
    code: '05',
    name: 'Living Planter',
    nameFa: 'گلدان زنده',
    tagline: 'زندگی از ترک‌ها بیرون می‌زند.',
    taglineEn: 'Life pushes through the cracks.',
    loreFa:
      'برگ‌ها از سرش بیرون زده‌اند و ریشه‌ها از پاهای مکانیکی. گلدان زنده اولین موجودی بود که داخل آرشیو رشد کرد، نه اینکه آورده شود. روی Lore Card یک جمله هست: زندگی منتظر اجازه نمی‌ماند.',
    loreEn:
      'Leaves grow from its head, roots from its mechanical feet. The Living Planter was the first being that grew inside the Archive instead of being brought in. Its Lore Card has one line: life does not wait for permission.',
    accent: '#84cc16',
    image: '/brand/Copilot_20260815_161511.png',
  },
  {
    id: 6,
    code: '06',
    name: 'Gravity Breaker',
    nameFa: 'شکننده گرانش',
    tagline: 'وقتی زمین دیگر قانون نیست.',
    taglineEn: 'When the ground is no longer law.',
    loreFa:
      'کلاهش پف کرده و پاهایش همیشه کمی از زمین فاصله دارند. شکننده گرانش مثل کسی است که هنوز یاد گرفته پایین نیفتد. هر بار که می‌پرد، یک خط تازه به پرونده‌اش اضافه می‌شود.',
    loreEn:
      'Its beanie is puffy and its feet never quite touch the ground. The Gravity Breaker moves like someone who has not learned to fall yet. Every jump adds a new line to its file.',
    accent: '#e2e8f0',
    image: '/brand/Copilot_20260815_161735.png',
  },
  {
    id: 7,
    code: '07',
    name: 'Echo Heads',
    nameFa: 'سرهای پژواک',
    tagline: 'ماسک‌هایی که صدا را نگه می‌دارند.',
    taglineEn: 'Masks that hold the sound.',
    loreFa:
      'چند سر، یک بدن. هر ماسک صدای متفاوتی نگه می‌دارد. بعضی کلکسیونرها می‌گویند اگر گوش بدهی، جمله ناتمام خودت را می‌شنوی. Lore Card این موجود کوتاه است: سکوت هم یک پژواک است.',
    loreEn:
      'Many heads, one body. Each mask keeps a different sound. Some collectors say if you listen long enough, you hear your own unfinished sentence. Its Lore Card is short: silence is an echo too.',
    accent: '#38bdf8',
    image: '/brand/Copilot_20260815_163130.png',
  },
  {
    id: 8,
    code: '08',
    name: 'Persian Neo Myth',
    nameFa: 'نئواسطوره پارسی',
    tagline: 'طلا روی بال اسطوره.',
    taglineEn: 'Gold laid over mythic wings.',
    loreFa:
      'بال‌های طلایی و بدن سنگی. نئواسطوره پارسی از داستان‌های کهن ساخته شده، ولی برای آرشیوی که هنوز کامل نشده. روی پلاکش نوشته: گذشته را جمع کن. آینده را وصل کن.',
    loreEn:
      'Golden wings, a body of stone. The Persian Neo Myth comes from old stories, rebuilt for an Archive that is not complete yet. Its plate reads: collect the past. connect the future.',
    accent: '#d4af37',
    image: '/brand/Copilot_20260815_162850.png',
  },
  {
    id: 9,
    code: '09',
    name: 'Broken Dimension',
    nameFa: 'بعد شکسته',
    tagline: 'نیمه تن، نیمه بلور.',
    taglineEn: 'Half flesh, half crystal.',
    loreFa:
      'نیمه بدنش سیاه است و نیمه دیگر بلور بنفش. از جایی آمده که خط مرز بین چیزها پاک شده. هر تکه بلور که می‌افتد، جای خالی پازل چشم را کمی پرتر می‌کند.',
    loreEn:
      'Half its body is black, the other half purple crystal. It came from a place where the line between things disappeared. Every shard that falls fills a little more of the eye puzzle\'s empty space.',
    accent: '#c026d3',
    image: '/brand/Copilot_20260815_164503.png',
  },
  {
    id: 10,
    code: '10',
    name: 'Shadow Companion',
    nameFa: 'همراه سایه',
    tagline: 'چهره‌ای از نور در تاریکی.',
    taglineEn: 'A face made of light in the dark.',
    loreFa:
      'صورت ندارد. فقط نور. همراه سایه آخرین موجود آرشیو ۰۱ است، ولی پرونده‌اش اول باز شده. Lore Card می‌گوید: تو دهمی. وقتی نُه تا کنار هم باشند، این یکی راه را نشان می‌دهد.',
    loreEn:
      'No face. Only light. The Shadow Companion is the last being in Archive 01, but its file was opened first. The Lore Card says: you are the tenth. When the other nine stand together, this one shows the way.',
    accent: '#f59e0b',
    image: '/brand/Copilot_20260815_164149.png',
  },
];

export const BOX_CONTENTS = [
  {
    title: 'FIGURE',
    titleFa: 'فیگور',
    desc: 'شخصیت پرینت‌شده با جزئیات بالا.',
    icon: '/brand/system/figure-totem.png',
  },
  {
    title: 'LORE CARD',
    titleFa: 'کارت lore',
    desc: 'داستان و نقل‌قول شخصیت.',
    icon: '/brand/system/lore-card.png',
  },
  {
    title: 'PUZZLE',
    titleFa: 'قطعه چشم',
    desc: 'یک تکه از پازل. با نُه قطعه دیگر کامل می‌شود.',
    icon: '/brand/system/puzzle-piece.png',
  },
  {
    title: 'PLATE',
    titleFa: 'پلاک آرشیو',
    desc: 'پلاک شماره‌دار مخصوص این سیزن.',
    icon: '/brand/system/chain-link.png',
  },
] as const;

export const QUEST_BOX_WORLD = {
  eyebrow: 'INSIDE THE BOX',
  title: 'هر جعبه، یک دنیا',
} as const;

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

export const OVYRA_QUEST = {
  eyebrow: 'OVYRA KIDS',
  title: 'OVYRA QUEST',
  tagline: 'ماجراجویی تعاملی برای کودکان دنیای OVYRA',
  paragraphs: [
    'اینجا جاییه که هر بچه می‌تونه وارد دنیایی بشه که هیچ‌کس هنوز کشفش نکرده.',
    'معماها رو حل کن، موجودات عجیب OVYRA رو پیدا کن و رازهایی رو کشف کن که بزرگ‌ترها ازشون خبر ندارن.',
    'هر انتخاب تو، بخشی از داستان رو تغییر می‌ده…',
  ],
  closing: 'آماده‌ای اولین مأموریتت رو شروع کنی؟',
  pillars: [
    { en: 'SOLVE', fa: 'معماها', hint: 'هر پازل، یک قدم به سمت حقیقت' },
    { en: 'DISCOVER', fa: 'موجودات', hint: 'موجودات عجیب منتظر کشف‌اند' },
    { en: 'UNCOVER', fa: 'رازها', hint: 'رازهایی که بزرگ‌ترها نمی‌دانند' },
  ],
  ctaLabel: 'شروع اولین مأموریت',
  ctaSoon: 'SOON',
  ctaToast: 'OVYRA QUEST به زودی باز می‌شود — اولین مأموریت در راه است!',
} as const;

export const SEASON_02 = {
  eyebrow: 'ARCHIVE 02',
  label: 'COMING SOON',
  titleEn: 'THE NEXT CHAPTER',
  subtitleEn: 'WHEN THE PORTAL OPENS, THE COLLECTOR RETURNS.',
  leadEn: 'ARCHIVE 02 STANDS SEALED. THOSE WHO COMPLETED THE EYE ALREADY FEEL IT CALL.',
  titleFa: 'فصل بعد',
  subtitleFa: 'وقتی در باز شود، کلکسیونر برمی‌گردد',
  leadFa:
    'آرشیو ۰۲ در سکوت مانده. هر کلکسیونری که چشم را یک بار کامل دیده می‌داند: درِ بعدی خودش را نشان می‌دهد.',
  bodyFa:
    'پشت این در، جهان تازه‌ای منتظر است. موجودات جدید، داستان‌های تازه، و تکه‌ای از چشم که هنوز نامش را نگفته‌اند.',
  bodyFa2:
    'هر جعبه جدید یک موجود تازه. هر موجود یک تکه از پازل. هر تکه، یک قدم نزدیک‌تر به چشم.',
  statsEn: 'THE ARCHIVE STIRS AGAIN.',
  statsFa: 'آرشیو دوباره به جان می‌افتد',
  hintEn: 'NEW BEINGS WAIT BEHIND THE STONE. NEW LORE WAITS IN THE DARK.',
  pulseEn: 'FIGURE. LORE. PUZZLE. ONE TRUTH.',
  pulseFa: 'فیگور. کارت. پازل. یک حقیقت.',
  manifestoEn: 'COLLECT. CONNECT. THE EYE BEGINS AGAIN.',
  verseEn: 'THE STONE REMEMBERS WHO STOOD BEFORE THE DOOR.',
  preClosingEn: 'WHEN THE TEN ARE WHOLE, THE NEXT TEN BEGIN.',
  whisperEn: 'BEYOND THE PORTAL, A NEW TRUTH WAITS.',
  whisperFa: 'پشت پرتال، حقیقتی تازه منتظر است',
  verseFa: 'سکوت تمام نمی‌شود. فقط عمیق‌تر می‌شود.',
  manifestoFa: 'هر فصل، یک آرشیو. هر آرشیو، یک راز.',
  closingFa: 'چشم، آنچه در راه است را به یاد می‌آورد.',
  signals: [
    { en: 'NEW BEINGS', fa: 'موجود تازه' },
    { en: 'NEW LORE', fa: 'راز تازه' },
    { en: 'ONE EYE', fa: 'یک چشم' },
  ],
  seal: 'SEALED',
  image: '/brand/comingsoon4.png',
  imageWidth: 1920,
  imageHeight: 819,
  imageAlt: 'OVYRA Archive 02 portal to the next chapter',
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
    to: '/#ovyra-quest',
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
