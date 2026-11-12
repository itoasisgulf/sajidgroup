// Builds the static site (English at /, Arabic at /ar/) from the content below. Run: node build.js
const fs = require('fs');
const path = require('path');
const OUT = __dirname;
const SITE = 'https://sajidgroup.pages.dev';

const C = {
  phones: ['+971 52 826 4786', '+971 52 734 1966'],
  email: 'sajiid.group@gmail.com',
  addr: { en: 'Office 505, Habib Bank Building, Bank Street, Al Mankhool, Bur Dubai, Dubai, UAE', ar: 'مكتب 505، مبنى حبيب بنك، شارع البنك، المنخول، بر دبي، دبي، الإمارات العربية المتحدة' },
  map: 'https://www.google.com/maps?q=Habib+Bank+Building+Al+Mankhool+Bur+Dubai&output=embed',
  itoasis: 'https://itoasisgulf.com',
};
const tel = p => 'tel:' + p.replace(/\s/g, '');
const num = p => `<span dir="ltr">${p}</span>`;
const wa = (p, msg) => 'https://wa.me/' + p.replace(/\D/g, '') + '?text=' + encodeURIComponent(msg);

// Simple line icons (24px, stroke = currentColor)
const I = {
  home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  tower: '<path d="M4 21V8l6-3v16M10 21V3l10 4v14M2 21h20M14 9h2M14 13h2M14 17h2M6 11h2M6 15h2"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  mega: '<path d="M3 10v4h4l6 4V6L7 10zM16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/>',
  doc: '<path d="M6 2h9l5 5v15H6zM14 2v6h6M9 13h8M9 17h8M9 9h3"/>',
  chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4M10 10h4v4h-4z"/>',
  team: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15 14.5c3 0 6 2 6 5.5"/>',
  check: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
  leaf: '<path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15M5 19l7-7"/>',
  phone: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18"/>',
  wa: '<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2z"/>',
};
const ic = (n, cls = 'ic') => `<svg class="${cls}${n === 'arrow' ? ' flip' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;

// Each text field is {en, ar}; services are [en, ar] pairs.
const D = [
  { slug: 'interior-technical', icon: 'tower', img: 'interior.jpg',
    name: { en: 'Sajid Interior & Technical Services', ar: 'ساجد للديكور والخدمات الفنية' },
    short: { en: 'Interior & Technical', ar: 'الديكور والخدمات الفنية' },
    tag: { en: 'Interior fit-out, renovation and maintenance', ar: 'التشطيبات الداخلية والتجديد والصيانة' },
    intro: { en: 'From full interior fit-outs to day-to-day technical maintenance, our team designs, builds and looks after homes, offices, shops and restaurants across Dubai, including the authority approvals and utility connections.',
      ar: 'من التشطيبات الداخلية الكاملة إلى الصيانة الفنية اليومية، يصمم فريقنا وينفذ ويعتني بالمنازل والمكاتب والمحلات والمطاعم في جميع أنحاء دبي، بما في ذلك الموافقات الحكومية وتوصيلات الخدمات.' },
    services: [['Interior fit-out works', 'أعمال التشطيبات الداخلية'], ['3D design and renovations', 'التصميم ثلاثي الأبعاد والتجديدات'], ['AC maintenance', 'صيانة المكيفات'], ['Electrical works', 'الأعمال الكهربائية'], ['MEP services', 'خدمات الكهروميكانيك والسباكة'], ['CCTV installation and maintenance', 'تركيب وصيانة كاميرات المراقبة'], ['Fire and safety systems', 'أنظمة الحريق والسلامة'], ['Kitchen equipment maintenance and hood cleaning', 'صيانة معدات المطابخ وتنظيف الشفاطات'], ['Gas line installation and fixing', 'تركيب وإصلاح خطوط الغاز'], ['Aluminium and glass works', 'أعمال الألمنيوم والزجاج'], ['Authority approvals and utilities', 'الموافقات الحكومية وتوصيل الخدمات'], ['General maintenance', 'الصيانة العامة']] },
  { slug: 'real-estate', icon: 'home', img: 'realestate.jpg',
    name: { en: 'Al Sajid Real Estate', ar: 'الساجد للعقارات' },
    short: { en: 'Real Estate', ar: 'العقارات' },
    tag: { en: 'Property sales, leasing and management', ar: 'بيع العقارات وتأجيرها وإدارتها' },
    intro: { en: 'Whether you are buying, selling, renting or investing, Al Sajid Real Estate gives honest advice and handles the paperwork, viewings and tenants so your property works for you.',
      ar: 'سواء كنت تشتري أو تبيع أو تستأجر أو تستثمر، تقدم لك الساجد للعقارات مشورة صادقة وتتولى المعاملات والمعاينات والمستأجرين ليعمل عقارك لصالحك.' },
    services: [['Property sales and purchase', 'بيع وشراء العقارات'], ['Property leasing', 'تأجير العقارات'], ['Property management', 'إدارة العقارات'], ['Real estate investments', 'الاستثمار العقاري'], ['Valuation services', 'خدمات التقييم'], ['Real estate consultancy', 'الاستشارات العقارية']] },
  { slug: 'pest-control', icon: 'shield', img: 'pest.jpg',
    name: { en: 'Rooh Al Karama Pest Control Services', ar: 'روح الكرامة لخدمات مكافحة الحشرات' },
    alt: { en: 'Also known as RAK Pest Control.', ar: 'وتُعرف أيضاً باسم راك لمكافحة الحشرات.' },
    short: { en: 'Pest Control', ar: 'مكافحة الحشرات' },
    tag: { en: 'Pest treatment, hygiene and sanitation', ar: 'مكافحة الحشرات والنظافة والتعقيم' },
    intro: { en: 'Safe, effective and reliable pest control for homes and businesses, using Dubai Municipality approved chemicals and trained technicians. We also keep commercial kitchens clean and compliant.',
      ar: 'مكافحة حشرات آمنة وفعالة وموثوقة للمنازل والشركات، باستخدام مواد معتمدة من بلدية دبي وفنيين مدربين. كما نحافظ على نظافة المطابخ التجارية ومطابقتها للمعايير.' },
    services: [['General pest control', 'مكافحة الحشرات العامة'], ['Cockroach control', 'مكافحة الصراصير'], ['Rodent control', 'مكافحة القوارض'], ['Termite control', 'مكافحة النمل الأبيض'], ['Bed bug control', 'مكافحة بق الفراش'], ['Mosquito and ant treatment', 'مكافحة البعوض والنمل'], ['Disinfection and sanitization', 'التطهير والتعقيم'], ['Kitchen hood cleaning', 'تنظيف شفاطات المطابخ'], ['Commercial and residential contracts', 'عقود تجارية وسكنية']] },
  { slug: 'advertising', icon: 'mega', img: 'advertising.jpg',
    name: { en: 'RJ Advertising', ar: 'آر جي للإعلان' },
    short: { en: 'Advertising', ar: 'الإعلان' },
    tag: { en: 'Signage, printing and branding', ar: 'اللوحات والطباعة والهوية التجارية' },
    intro: { en: 'RJ Advertising makes your business easy to see and remember, from shop signs and vehicle branding to print, uniforms and social media.',
      ar: 'تجعل آر جي للإعلان نشاطك التجاري واضحاً وسهل التذكر، من لوحات المحلات وتغليف المركبات إلى الطباعة والزي الموحد ووسائل التواصل الاجتماعي.' },
    services: [['Signage boards', 'اللوحات الإعلانية'], ['LED and 3D sign boards', 'لوحات LED وثلاثية الأبعاد'], ['Digital printing', 'الطباعة الرقمية'], ['Graphic design', 'التصميم الجرافيكي'], ['Uniform branding', 'طباعة شعارات الزي الموحد'], ['Vehicle branding', 'تغليف وإعلانات المركبات'], ['Promotional materials', 'المواد الترويجية'], ['Social media marketing', 'التسويق عبر وسائل التواصل الاجتماعي'], ['Web design and development', 'تصميم وتطوير المواقع']] },
  { slug: 'corporate-services', icon: 'doc', img: 'corporate.jpg',
    name: { en: 'Al Sajid Corporate Service', ar: 'الساجد للخدمات المؤسسية' },
    short: { en: 'Corporate Services', ar: 'خدمات الشركات' },
    tag: { en: 'Business setup, visas and PRO services', ar: 'تأسيس الشركات والتأشيرات وخدمات المندوب' },
    intro: { en: 'We take care of the government side of running a business in the UAE, from company formation and trade licences to visas, labour and VAT, so you can focus on your customers.',
      ar: 'نتولى الجانب الحكومي لإدارة أعمالك في الإمارات، من تأسيس الشركات والرخص التجارية إلى التأشيرات والعمالة وضريبة القيمة المضافة، لتتفرغ لعملائك.' },
    services: [['Company formation and business setup', 'تأسيس الشركات وبدء الأعمال'], ['PRO services and government applications', 'خدمات المندوب والمعاملات الحكومية'], ['Trade licence services', 'خدمات الرخص التجارية'], ['Visa services', 'خدمات التأشيرات'], ['Labour and immigration', 'العمل والإقامة'], ['Document clearing', 'تخليص المستندات'], ['HR and recruitment services', 'الموارد البشرية والتوظيف'], ['Accounts, VAT and FTA services', 'المحاسبة وضريبة القيمة المضافة وخدمات الهيئة الاتحادية للضرائب'], ['Legal consulting services', 'الاستشارات القانونية'], ['Banking services', 'الخدمات المصرفية']] },
  { slug: 'it-solutions', icon: 'chip', logo: 'itoasis.png', ext: C.itoasis,
    name: { en: 'IT Oasis UAE', ar: 'آي تي أويسس الإمارات' },
    short: { en: 'IT Solutions', ar: 'حلول تقنية المعلومات' },
    tag: { en: 'IT products, software and support', ar: 'منتجات وبرمجيات ودعم تقنية المعلومات' },
    intro: { en: 'IT Oasis UAE supplies, installs and supports the technology UAE businesses run on: POS and ERP systems, networks, CCTV, Microsoft 365, cybersecurity and AI, with opening-day packages for cafes, restaurants and retail.',
      ar: 'توفر آي تي أويسس الإمارات وتركّب وتدعم التقنيات التي تعتمد عليها الشركات في الإمارات: أنظمة نقاط البيع وتخطيط الموارد، والشبكات، وكاميرات المراقبة، ومايكروسوفت 365، والأمن السيبراني والذكاء الاصطناعي، مع باقات جاهزة للافتتاح للمقاهي والمطاعم ومحلات التجزئة.' },
    services: [['POS systems and software', 'أنظمة وبرامج نقاط البيع'], ['ERP platforms', 'أنظمة تخطيط موارد المؤسسات'], ['CRM systems', 'أنظمة إدارة علاقات العملاء'], ['Managed IT support', 'الدعم الفني المُدار'], ['Microsoft 365 setup', 'إعداد مايكروسوفت 365'], ['Cybersecurity', 'الأمن السيبراني'], ['Network configuration', 'إعداد الشبكات'], ['CCTV and installation', 'كاميرات المراقبة وتركيبها'], ['Telephone systems and cabling', 'أنظمة الهاتف والتمديدات'], ['Custom software', 'برمجيات مخصصة'], ['AI solutions and automation workflows', 'حلول الذكاء الاصطناعي وأتمتة سير العمل'], ['Dashboards, reporting and UAE e-invoicing readiness', 'لوحات المعلومات والتقارير والجاهزية للفوترة الإلكترونية']] },
];

const APPROVALS = [['Dubai Municipality', 'بلدية دبي'], ['Dubai Civil Defense', 'الدفاع المدني دبي'], ['RTA', 'هيئة الطرق والمواصلات'], ['DEWA', 'هيئة كهرباء ومياه دبي'], ['Dubai Economy and Tourism', 'دائرة الاقتصاد والسياحة بدبي'], ['Ministry of Human Resources & Emiratisation', 'وزارة الموارد البشرية والتوطين']];
const WHY = [
  ['team', ['Professional teams', 'فرق محترفة'], ['Experienced specialists in every company of the group.', 'متخصصون ذوو خبرة في كل شركة من شركات المجموعة.']],
  ['check', ['Reliable delivery', 'تنفيذ موثوق'], ['Clear quotes, on-time work and quality you can count on.', 'عروض أسعار واضحة وعمل في الوقت المحدد وجودة يمكنك الاعتماد عليها.']],
  ['gear', ['Tailored solutions', 'حلول مصممة لك'], ['Practical answers that fit your property, business and budget.', 'حلول عملية تناسب عقارك ونشاطك وميزانيتك.']],
  ['leaf', ['Sustainable practices', 'ممارسات مستدامة'], ['Safe, compliant and eco friendly methods wherever we work.', 'أساليب آمنة ومتوافقة مع المعايير وصديقة للبيئة أينما عملنا.']],
];

// UI strings
const S = {
  group: ['Sajid Group', 'مجموعة ساجد'], ofCos: ['of Companies', 'للشركات'], full: ['Sajid Group of Companies', 'مجموعة ساجد للشركات'],
  nav: [['index.html', 'Home', 'الرئيسية'], ['about.html', 'About', 'من نحن'], ['companies.html', 'Our Companies', 'شركاتنا'], ['contact.html', 'Contact', 'اتصل بنا']],
  other: ['العربية', 'English'], skip: ['Skip to content', 'تخطي إلى المحتوى'], menu: ['Menu', 'القائمة'], whatsapp: ['WhatsApp', 'واتساب'],
  tagline: ['People | Solutions | Sustainability', 'الناس | الحلول | الاستدامة'],
  partner: ['Your trusted business partner in Dubai, UAE', 'شريكك الموثوق للأعمال في دبي، الإمارات'],
  ourCos: ['Our companies', 'شركاتنا'], contact: ['Contact', 'تواصل معنا'], rights: ['All rights reserved.', 'جميع الحقوق محفوظة.'], itPartner: ['IT partner: IT Oasis UAE', 'الشريك التقني: آي تي أويسس الإمارات'],
  waMsg: ['Hello Sajid Group, I would like to know more about your services.', 'مرحباً مجموعة ساجد، أود معرفة المزيد عن خدماتكم.'],
  view: ['View services', 'عرض الخدمات'], visitIt: ['Visit IT Oasis', 'زيارة آي تي أويسس'], visitItSite: ['Visit IT Oasis website', 'زيارة موقع آي تي أويسس'],
  ctaH: ['Ready to work with us?', 'هل أنت مستعد للعمل معنا؟'], ctaP: ['Tell us what you need and the right company in our group will get back to you quickly.', 'أخبرنا بما تحتاجه وستتواصل معك الشركة المناسبة في مجموعتنا بسرعة.'],
  waUs: ['WhatsApp us', 'راسلنا على واتساب'], call: ['Call', 'اتصل'],
};
const NOT_FOUND = { en: ['Page not found', 'The page you are looking for has moved or does not exist.', 'Back to home'], ar: ['الصفحة غير موجودة', 'الصفحة التي تبحث عنها نُقلت أو غير موجودة.', 'العودة إلى الرئيسية'] };

function build(L) {
  const ar = L === 'ar', x = v => (Array.isArray(v) ? v[ar ? 1 : 0] : v[L]);
  const base = ar ? '../' : '', img = base + 'assets/img/';
  const W = m => wa(C.phones[0], m || x(S.waMsg));
  const url = f => `${SITE}/${ar ? 'ar/' : ''}${f === 'index.html' ? '' : f}`;
  const urlOther = f => `${SITE}/${ar ? '' : 'ar/'}${f === 'index.html' ? '' : f}`;

  function page({ file, title, desc, body, active }) {
    const nav = S.nav.map(([h, en, a]) => `<a href="${h}"${h === active ? ' aria-current="page"' : ''}>${ar ? a : en}</a>`).join('');
    const brand = alt => `<a class="brand" href="index.html"${alt ? '' : ` aria-label="${x(S.full)}"`}><img src="${img}sg-logo.png" alt="${alt || ''}" width="56" height="56"${alt ? ' loading="lazy"' : ''}><span>${x(S.group)}<small>${x(S.ofCos)}</small></span></a>`;
    const ld = file === 'index.html' ? `<script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Organization', name: x(S.full), url: url('index.html'), logo: SITE + '/assets/img/sg-logo-og.jpg',
      email: C.email, telephone: C.phones[0].replace(/\s/g, ''),
      address: { '@type': 'PostalAddress', streetAddress: 'Office 505, Habib Bank Building, Bank Street, Al Mankhool', addressLocality: 'Bur Dubai, Dubai', addressCountry: 'AE' },
      subOrganization: D.map(d => ({ '@type': 'Organization', name: x(d.name), url: d.ext || url(d.slug + '.html') })),
    })}</script>` : '';
    return `<!doctype html>
<html lang="${L}" dir="${ar ? 'rtl' : 'ltr'}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${url(file)}">
<link rel="alternate" hreflang="en" href="${ar ? urlOther(file) : url(file)}"><link rel="alternate" hreflang="ar" href="${ar ? url(file) : urlOther(file)}"><link rel="alternate" hreflang="x-default" href="${ar ? urlOther(file) : url(file)}">
<meta property="og:type" content="website"><meta property="og:title" content="${title}"><meta property="og:description" content="${desc}">
<meta property="og:image" content="${SITE}/assets/img/sg-logo-og.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="1200"><meta property="og:url" content="${url(file)}"><meta property="og:locale" content="${ar ? 'ar_AE' : 'en_AE'}">
<meta name="theme-color" content="#0b0b0c">
<link rel="icon" type="image/png" href="${img}favicon.png"><link rel="apple-touch-icon" href="${img}favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=${ar ? 'Tajawal:wght@400;500;700&family=Amiri:wght@700' : 'Cormorant+Garamond:wght@500;600;700&family=Great+Vibes&family=Inter:wght@400;500;600;700'}&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${base}styles.css">
${ld}
</head>
<body>
<a class="skip" href="#main">${x(S.skip)}</a>
<header class="hdr">
  <div class="wrap hdr-in">
    ${brand()}
    <button class="burger" aria-label="${x(S.menu)}" aria-expanded="false" aria-controls="nav"><span></span><span></span><span></span></button>
    <nav id="nav" class="nav">${nav}<a class="lang" href="${ar ? '../' : 'ar/'}${file}" hreflang="${ar ? 'en' : 'ar'}" lang="${ar ? 'en' : 'ar'}">${ic('globe', 'ic xs')}${x(S.other)}</a><a class="btn btn-gold sm" href="${W()}" target="_blank" rel="noopener">${ic('wa')}${x(S.whatsapp)}</a></nav>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="ftr">
  <div class="wrap ftr-grid">
    <div>${brand(x(S.full))}<p class="muted">${x(S.tagline)}. ${x(S.partner)}.</p></div>
    <div><h3>${x(S.ourCos)}</h3><ul class="links">${D.map(d => `<li><a href="${d.slug}.html">${x(d.name)}</a></li>`).join('')}</ul></div>
    <div><h3>${x(S.contact)}</h3><ul class="links contact-list">
      ${C.phones.map(p => `<li>${ic('phone')}<a href="${tel(p)}">${num(p)}</a></li>`).join('')}
      <li>${ic('mail')}<a href="mailto:${C.email}">${C.email}</a></li>
      <li>${ic('pin')}<span>${x(C.addr)}</span></li></ul></div>
  </div>
  <div class="wrap ftr-bot"><span>&copy; <span id="yr">2026</span> ${x(S.full)}. ${x(S.rights)}</span><a href="${C.itoasis}" target="_blank" rel="noopener">${x(S.itPartner)} ${ic('ext', 'ic xs')}</a></div>
</footer>
<a class="wa-float" href="${W()}" target="_blank" rel="noopener" aria-label="${x(S.whatsapp)}">${ic('wa')}</a>
<script src="${base}app.js" defer></script>
</body>
</html>
`;
  }

  const itLogo = cls => `<div class="co-logo${cls || ''}"><img src="${img}itoasis.png" alt="${ar ? 'شعار آي تي أويسس' : 'IT Oasis UAE logo'}" loading="lazy" width="260" height="142"></div>`;
  const card = d => `<article class="co reveal">
  <div class="co-media">${d.logo ? itLogo() : `<img src="${img}${d.img}" alt="${x(d.name)}" loading="lazy" width="198" height="148">`}<span class="co-ic">${ic(d.icon)}</span></div>
  <div class="co-body"><p class="eyebrow">${x(d.short)}</p><h3>${x(d.name)}</h3><p>${x(d.tag)}.</p>
  <div class="co-actions"><a class="link" href="${d.slug}.html">${x(S.view)} ${ic('arrow', 'ic xs')}</a>${d.ext ? `<a class="btn btn-gold sm" href="${d.ext}" target="_blank" rel="noopener">${x(S.visitIt)} ${ic('ext', 'ic xs')}</a>` : ''}</div></div>
</article>`;
  const cta = () => `<section class="cta"><div class="wrap cta-in reveal"><div><h2>${x(S.ctaH)}</h2><p>${x(S.ctaP)}</p></div><div class="btns"><a class="btn btn-gold" href="${W()}" target="_blank" rel="noopener">${ic('wa')}${x(S.waUs)}</a><a class="btn btn-line" href="${tel(C.phones[0])}">${ic('phone')}${x(S.call)} ${num(C.phones[0])}</a></div></div></section>`;
  const head = (eyebrow, h1, p) => `<section class="phead"><div class="wrap"><p class="eyebrow">${eyebrow}</p><h1>${h1}</h1>${p ? `<p class="lead">${p}</p>` : ''}</div></section>`;
  const why = () => `<div class="grid4">${WHY.map(([i, h, p]) => `<div class="why reveal">${ic(i, 'ic lg')}<h3>${x(h)}</h3><p>${x(p)}</p></div>`).join('')}</div>`;
  const T = (en, a) => (ar ? a : en);
  const pages = [];

  pages.push({ file: 'index.html', active: 'index.html',
    title: T('Sajid Group of Companies | Your Trusted Business Partner in Dubai, UAE', 'مجموعة ساجد للشركات | شريكك الموثوق للأعمال في دبي'),
    desc: T('Sajid Group of Companies in Dubai: interior and technical services, real estate, pest control, advertising, corporate PRO services and IT solutions under one trusted group.', 'مجموعة ساجد للشركات في دبي: الديكور والخدمات الفنية، العقارات، مكافحة الحشرات، الإعلان، خدمات الشركات والمندوب، وحلول تقنية المعلومات تحت مجموعة واحدة موثوقة.'),
    body: `<section class="hero">
  <div class="hero-bg" aria-hidden="true"><img class="hero-sky" src="${img}hero-skyline.webp" alt="" width="1058" height="508" fetchpriority="high"></div>
  <div class="wrap hero-in">
    <h1 class="brand-title reveal"><span class="script">${T('Sajid Group', 'مجموعة ساجد')}</span><span class="caps">${T('of Companies', 'للشركات')}</span></h1>
    <p class="tagline reveal">${x(S.tagline).replace(/ \| /g, '<i></i>')}</p>
    <p class="lead reveal">${T('Your trusted business partner in Dubai, UAE. Six specialist companies, one trusted group: interiors, real estate, pest control, advertising, corporate services and IT.', 'شريكك الموثوق للأعمال في دبي، الإمارات. ست شركات متخصصة ومجموعة واحدة موثوقة: الديكور والعقارات ومكافحة الحشرات والإعلان وخدمات الشركات وتقنية المعلومات.')}</p>
    <div class="btns reveal"><a class="btn btn-gold" href="companies.html">${T('Explore our companies', 'تعرّف على شركاتنا')} ${ic('arrow', 'ic xs')}</a><a class="btn btn-line" href="${W()}" target="_blank" rel="noopener">${ic('wa')}${T('Get a free quote', 'احصل على عرض سعر مجاني')}</a></div>
    <ul class="rings reveal">${D.map(d => `<li><a href="${d.slug}.html"><span class="ring">${ic(d.icon)}</span><span class="rl">${x(d.short)}</span></a></li>`).join('')}</ul>
  </div>
</section>
<section class="sec"><div class="wrap split">
  <div class="reveal"><p class="eyebrow">${T('About the group', 'عن المجموعة')}</p><h2>${T('A diversified group serving Dubai and the UAE', 'مجموعة متنوعة تخدم دبي والإمارات')}</h2>
  <p>${T('Sajid Group of Companies serves residential, commercial and corporate clients across Dubai and the UAE. Each company in the group holds its own trade licence and name. Our mission is simple: deliver dependable services that help clients improve properties, grow businesses and maintain safe, comfortable spaces.', 'تخدم مجموعة ساجد للشركات العملاء من الأفراد والشركات والمؤسسات في دبي وجميع أنحاء الإمارات. ولكل شركة في المجموعة رخصتها التجارية واسمها الخاص. مهمتنا بسيطة: تقديم خدمات موثوقة تساعد عملاءنا على تحسين عقاراتهم وتنمية أعمالهم والحفاظ على أماكن آمنة ومريحة.')}</p>
  <a class="link" href="about.html">${T('More about us', 'المزيد عنا')} ${ic('arrow', 'ic xs')}</a></div>
  <div class="stats reveal"><div><b>6</b><span>${T('Specialist companies', 'شركات متخصصة')}</span></div><div><b>60+</b><span>${T('Services under one roof', 'خدمة تحت سقف واحد')}</span></div><div><b>6</b><span>${T('Authority approvals', 'موافقات حكومية')}</span></div><div><b>1</b><span>${T('Point of contact', 'جهة تواصل واحدة')}</span></div></div>
</div></section>
<section class="sec alt" id="companies"><div class="wrap"><div class="sec-head reveal"><p class="eyebrow">${x(S.ourCos)}</p><h2>${T('Specialist services. One trusted group.', 'خدمات متخصصة. مجموعة واحدة موثوقة.')}</h2></div>
<div class="grid3">${D.map(card).join('')}</div></div></section>
<section class="sec itband"><div class="wrap itband-in reveal">
  <img src="${img}itoasis.png" alt="${ar ? 'شعار آي تي أويسس' : 'IT Oasis UAE logo'}" width="260" height="142" loading="lazy">
  <div><p class="eyebrow">${T('Technology partner of the group', 'الشريك التقني للمجموعة')}</p><h2>${T('IT Oasis UAE, our IT company', 'آي تي أويسس الإمارات، شركتنا للتقنية')}</h2><p>${T('POS and ERP systems, networks, CCTV, Microsoft 365, cybersecurity and AI for UAE businesses. The same team supports every company in Sajid Group.', 'أنظمة نقاط البيع وتخطيط الموارد، والشبكات، وكاميرات المراقبة، ومايكروسوفت 365، والأمن السيبراني والذكاء الاصطناعي للشركات في الإمارات. والفريق نفسه يدعم جميع شركات مجموعة ساجد.')}</p></div>
  <a class="btn btn-gold" href="${C.itoasis}" target="_blank" rel="noopener">${x(S.visitItSite)} ${ic('ext', 'ic xs')}</a>
</div></section>
<section class="sec"><div class="wrap"><div class="sec-head reveal"><p class="eyebrow">${T('Why choose us', 'لماذا تختارنا')}</p><h2>${T('Built on people, solutions and sustainability', 'قائمة على الناس والحلول والاستدامة')}</h2></div>${why()}</div></section>
<section class="sec alt"><div class="wrap"><div class="sec-head reveal"><p class="eyebrow">${T('Authority approvals', 'الموافقات الحكومية')}</p><h2>${T('Approved and compliant', 'معتمدون وملتزمون بالمعايير')}</h2></div>
<ul class="approvals reveal">${APPROVALS.map(a => `<li>${ic('check')}${x(a)}</li>`).join('')}</ul></div></section>
${cta()}` });

  pages.push({ file: 'companies.html', active: 'companies.html', title: T('Our Companies | Sajid Group of Companies', 'شركاتنا | مجموعة ساجد للشركات'),
    desc: T('Meet the six companies of Sajid Group: interior and technical, real estate, pest control, advertising, corporate services and IT Oasis UAE.', 'تعرّف على شركات مجموعة ساجد الست: الديكور والخدمات الفنية، العقارات، مكافحة الحشرات، الإعلان، خدمات الشركات وآي تي أويسس الإمارات.'),
    body: head(x(S.ourCos), T('Specialist services. One trusted group.', 'خدمات متخصصة. مجموعة واحدة موثوقة.'), T('Each company is separately licensed and trades under its own name, run by its own specialist team, with Sajid Group as one point of contact for you.', 'كل شركة مرخصة بشكل مستقل وتعمل باسمها الخاص ويديرها فريق متخصص، مع مجموعة ساجد كجهة تواصل واحدة لك.')) +
      `<section class="sec"><div class="wrap"><div class="grid3">${D.map(card).join('')}</div></div></section>${cta()}` });

  for (const d of D) {
    const others = D.filter(o => o !== d).map(o => `<li><a href="${o.slug}.html">${ic(o.icon)}${x(o.short)}</a></li>`).join('');
    pages.push({ file: `${d.slug}.html`, active: 'companies.html', title: `${x(d.name)} | ${T('Sajid Group Dubai', 'مجموعة ساجد دبي')}`,
      desc: T(`${d.name.en}, part of Sajid Group of Companies in Dubai: ${d.tag.en.toLowerCase()}. Call or WhatsApp ${C.phones[0]}.`, `${d.name.ar}، إحدى شركات مجموعة ساجد في دبي: ${d.tag.ar}. اتصل أو راسلنا على واتساب ${C.phones[0]}.`),
      body: head(x(d.short), x(d.name), x(d.intro)) + `<section class="sec"><div class="wrap split top">
  <div><h2 class="h3">${T('Our services', 'خدماتنا')}</h2><ul class="svc">${d.services.map(s => `<li class="reveal">${ic('check')}${x(s)}</li>`).join('')}</ul>
  ${d.alt ? `<p class="muted note">${x(d.alt)}</p>` : ''}</div>
  <aside class="side reveal">${d.logo ? itLogo(' big') : `<img class="side-img" src="${img}${d.img}" alt="${x(d.name)}" width="198" height="148">`}
    <h3>${T('Get a free quote', 'احصل على عرض سعر مجاني')}</h3><p>${T('Message us with what you need and we will reply quickly.', 'راسلنا بما تحتاجه وسنرد عليك بسرعة.')}</p>
    <a class="btn btn-gold full" href="${W(T(`Hello Sajid Group, I would like a quote from ${d.name.en}.`, `مرحباً مجموعة ساجد، أود الحصول على عرض سعر من ${d.name.ar}.`))}" target="_blank" rel="noopener">${ic('wa')}${x(S.whatsapp)} ${x(d.short)}</a>
    <a class="btn btn-line full" href="${tel(C.phones[0])}">${ic('phone')}${num(C.phones[0])}</a>
    ${d.ext ? `<a class="btn btn-gold full" href="${d.ext}" target="_blank" rel="noopener">${x(S.visitItSite)} ${ic('ext', 'ic xs')}</a>` : ''}
  </aside></div></section>
<section class="sec alt"><div class="wrap"><h2 class="h3">${T('Other companies in the group', 'شركات أخرى في المجموعة')}</h2><ul class="pills dark">${others}</ul></div></section>${cta()}` });
  }

  pages.push({ file: 'about.html', active: 'about.html', title: T('About Us | Sajid Group of Companies', 'من نحن | مجموعة ساجد للشركات'),
    desc: T('About Sajid Group of Companies: a diversified Dubai group serving residential, commercial and corporate clients across the UAE.', 'عن مجموعة ساجد للشركات: مجموعة متنوعة في دبي تخدم العملاء من الأفراد والشركات والمؤسسات في جميع أنحاء الإمارات.'),
    body: head(T('About us', 'من نحن'), T('People. Solutions. Sustainability.', 'الناس. الحلول. الاستدامة.'), T('A diversified group serving residential, commercial and corporate clients across Dubai and the UAE.', 'مجموعة متنوعة تخدم العملاء من الأفراد والشركات والمؤسسات في دبي وجميع أنحاء الإمارات.')) +
      `<section class="sec"><div class="wrap split">
  <div class="reveal"><h2>${T('Our mission', 'مهمتنا')}</h2><p>${T('Deliver dependable services that help clients improve properties, grow businesses and maintain safe, comfortable spaces.', 'تقديم خدمات موثوقة تساعد عملاءنا على تحسين عقاراتهم وتنمية أعمالهم والحفاظ على أماكن آمنة ومريحة.')}</p>
  <h2>${T('Our promise', 'وعدنا')}</h2><p>${T('One trusted group for the services a home or business needs in Dubai, with specialist teams, clear communication and quality you can rely on. Building a better tomorrow, one project at a time.', 'مجموعة واحدة موثوقة لكل ما يحتاجه المنزل أو النشاط التجاري في دبي، بفرق متخصصة وتواصل واضح وجودة يمكنك الاعتماد عليها. نبني غداً أفضل، مشروعاً بعد مشروع.')}</p></div>
  <div class="ceo reveal"><img class="ceo-photo" src="${img}ceo-sajid-ali.jpg" alt="${T('Muhammad Sajid, Founder and CEO of Sajid Group', 'محمد ساجد، المؤسس والرئيس التنفيذي لمجموعة ساجد')}" width="435" height="560" loading="lazy"><h3>${T('Muhammad Sajid', 'محمد ساجد')}</h3><p class="eyebrow">${T('Founder &amp; CEO', 'المؤسس والرئيس التنفيذي')}</p><p>${T('"Our strength is our people. Every company in the group is built to give clients practical, honest solutions."', '«قوتنا في فريقنا. كل شركة في المجموعة قائمة على تقديم حلول عملية وصادقة لعملائنا.»')}</p></div>
</div></section>
<section class="sec alt"><div class="wrap">${why()}</div></section>${cta()}` });

  pages.push({ file: 'contact.html', active: 'contact.html', title: T('Contact Us | Sajid Group of Companies, Bur Dubai', 'اتصل بنا | مجموعة ساجد للشركات، بر دبي'),
    desc: T(`Contact Sajid Group of Companies: ${C.phones.join(', ')}, ${C.email}. Office 505, Habib Bank Building, Al Mankhool, Bur Dubai.`, `تواصل مع مجموعة ساجد للشركات: ${C.phones.join('، ')}، ${C.email}. مكتب 505، مبنى حبيب بنك، المنخول، بر دبي.`),
    body: head(x(S.contact), T("Let's work together", 'لنعمل معاً'), T('Call, WhatsApp or visit our office in Bur Dubai.', 'اتصل بنا أو راسلنا على واتساب أو زر مكتبنا في بر دبي.')) + `<section class="sec"><div class="wrap split top">
  <div class="reveal"><ul class="cards">
    ${C.phones.map(p => `<li>${ic('phone', 'ic lg')}<div><b>${T('Call or WhatsApp', 'اتصال أو واتساب')}</b><a href="${tel(p)}">${num(p)}</a> &middot; <a href="${wa(p, x(S.waMsg))}" target="_blank" rel="noopener">${x(S.whatsapp)}</a></div></li>`).join('')}
    <li>${ic('mail', 'ic lg')}<div><b>${T('Email', 'البريد الإلكتروني')}</b><a href="mailto:${C.email}">${C.email}</a></div></li>
    <li>${ic('pin', 'ic lg')}<div><b>${T('Office', 'المكتب')}</b><span>${x(C.addr)}</span></div></li>
  </ul>
  <iframe class="map" title="${T('Map of our Bur Dubai office', 'خريطة مكتبنا في بر دبي')}" src="${C.map}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
  <form class="form reveal" id="quote" novalidate>
    <h2 class="h3">${T('Request a quote', 'اطلب عرض سعر')}</h2>
    <label>${T('Your name', 'الاسم')}<input name="name" required autocomplete="name"></label>
    <label>${T('Phone', 'رقم الهاتف')}<input name="phone" type="tel" dir="ltr" required autocomplete="tel"></label>
    <label>${T('Service', 'الخدمة')}<select name="service">${D.map(d => `<option>${x(d.name)}</option>`).join('')}<option>${T('Other', 'أخرى')}</option></select></label>
    <label>${T('Message', 'الرسالة')}<textarea name="msg" rows="4"></textarea></label>
    <p class="err" role="alert" hidden>${T('Please enter your name and phone number.', 'يرجى إدخال الاسم ورقم الهاتف.')}</p>
    <div class="btns"><button class="btn btn-gold" data-via="wa">${ic('wa')}${T('Send on WhatsApp', 'إرسال عبر واتساب')}</button><button class="btn btn-line" data-via="mail">${ic('mail')}${T('Send by email', 'إرسال بالبريد')}</button></div>
  </form>
</div></section>` });

  const nf = NOT_FOUND[L];
  pages.push({ file: '404.html', title: `${nf[0]} | ${x(S.full)}`, desc: nf[0],
    body: head('404', nf[0], nf[1]) + `<section class="sec"><div class="wrap"><a class="btn btn-gold" href="${ar ? '' : ''}index.html">${nf[2]}</a></div></section>` });

  const dir = ar ? path.join(OUT, 'ar') : OUT;
  fs.mkdirSync(dir, { recursive: true });
  for (const p of pages) fs.writeFileSync(path.join(dir, p.file), page(p));
  return pages.filter(p => p.file !== '404.html').map(p => url(p.file));
}

const urls = [...build('en'), ...build('ar')];
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(u => `<url><loc>${u}</loc></url>`).join('')}</urlset>\n`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
console.log('Built', urls.length + 2, 'pages (en + ar)');
