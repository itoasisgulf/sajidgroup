// Builds the static site (English at /, Arabic at /ar/) from the content below. Run: node build.js
const fs = require('fs');
const path = require('path');
const OUT = __dirname;
const SITE = 'https://sajidgroup.com';

const C = {
  phones: ['+971 52 826 4786', '+971 52 734 1966'],
  email: 'sajiid.group@gmail.com',
  instagram: 'https://www.instagram.com/sajiid.group/',
  // Head office (Google Maps listing "Sajid Group", plus code 7842+F9 Dubai)
  office: {
    building: { en: 'Al Abbas Building', ar: 'مبنى العباس' },
    street: { en: 'Khalid Bin Al Waleed Road', ar: 'شارع خالد بن الوليد' },
    area: { en: 'Bur Dubai', ar: 'بر دبي' },
    city: { en: 'Dubai, United Arab Emirates', ar: 'دبي، الإمارات العربية المتحدة' },
  },
  addr: { en: 'Al Abbas Building, Khalid Bin Al Waleed Road, Bur Dubai, Dubai, UAE', ar: 'مبنى العباس، شارع خالد بن الوليد، بر دبي، دبي، الإمارات العربية المتحدة' },
  geo: { lat: 25.2561971, lng: 55.3009133 },
  mapLink: 'https://maps.app.goo.gl/b6v5jRmP1Gyvd9VG6',
  map: 'https://www.google.com/maps?q=25.2561971,55.3009133&z=17&hl=en&output=embed',
  hours: { en: ['Monday to Saturday', '9:00 AM to 8:00 PM', 'Sunday', 'Closed'], ar: ['من الاثنين إلى السبت', '9:00 صباحاً إلى 8:00 مساءً', 'الأحد', 'مغلق'] },
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
  ig: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  up: '<path d="M12 19V5M5 12l7-7 7 7"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
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

// English SEO for each company page: title (under 60 chars), meta description (under 160), schema.org type and FAQs.
const QUOTE_A = `Call or WhatsApp ${C.phones[0]} with your requirements, or visit our office in Al Abbas Building, Khalid Bin Al Waleed Road, Bur Dubai. Quotes are free.`;
const SEO = {
  'interior-technical': { type: 'HomeAndConstructionBusiness',
    title: 'Interior Fit-Out & Technical Services in Dubai | Sajid Group',
    desc: 'Interior fit-out, renovation, AC, electrical, MEP, CCTV and fire safety works in Dubai, with authority approvals handled. Free quote: +971 52 826 4786.',
    faq: [['Do you handle authority approvals for fit-out work in Dubai?', 'Yes. Authority approvals and utility connections are part of our service, so one team takes your project from design to handover.'],
      ['What kind of properties do you work on?', 'Homes, offices, shops and restaurants across Dubai, from complete interior fit-outs and renovations to day-to-day technical maintenance.'],
      ['Do you offer AC, electrical and MEP maintenance?', 'Yes. We carry out AC maintenance, electrical works, MEP services, CCTV, fire and safety systems, gas lines, kitchen equipment maintenance and general maintenance.'],
      ['How do I get a quote?', QUOTE_A]] },
  'real-estate': { type: 'RealEstateAgent',
    title: 'Real Estate Sales, Leasing & Management Dubai | Sajid Group',
    desc: 'Al Sajid Real Estate helps you buy, sell, rent and manage property in Dubai, with valuation and investment advice. Call or WhatsApp +971 52 826 4786.',
    faq: [['Can you help me buy, sell or rent a property in Dubai?', 'Yes. Al Sajid Real Estate handles property sales, purchases and leasing, including viewings and paperwork.'],
      ['Do you offer property management for landlords?', 'Yes. We manage tenants, viewings and day-to-day paperwork so your property keeps working for you.'],
      ['Do you provide property valuations and investment advice?', 'Yes. We offer valuation services and real estate investment consultancy.'],
      ['How do I get started?', QUOTE_A]] },
  'pest-control': { type: 'LocalBusiness',
    title: 'Pest Control Dubai | Rooh Al Karama Pest Control Services',
    desc: 'Cockroach, bed bug, termite, rodent and mosquito control in Dubai with Dubai Municipality approved chemicals, for homes and businesses. Call +971 52 826 4786.',
    faq: [['Are your pest control chemicals approved?', 'Yes. We use Dubai Municipality approved chemicals, applied by trained technicians.'],
      ['Which pests do you treat?', 'Cockroaches, rodents, termites, bed bugs, mosquitoes and ants, plus general pest control, disinfection and sanitization.'],
      ['Do you offer contracts for restaurants and buildings?', 'Yes. We offer commercial and residential pest control contracts, and kitchen hood cleaning to keep commercial kitchens clean and compliant.'],
      ['How do I book a pest control visit?', QUOTE_A]] },
  advertising: { type: 'ProfessionalService',
    title: 'Signage & Vehicle Branding in Dubai | RJ Advertising',
    desc: 'RJ Advertising in Dubai: shop signboards, LED and 3D signs, digital printing, vehicle and uniform branding, graphic design and social media marketing.',
    faq: [['Do you make LED and 3D sign boards?', 'Yes. We design and produce shop signage boards, including LED and 3D sign boards.'],
      ['Can you brand our vehicles and uniforms?', 'Yes. We handle vehicle branding, uniform branding and promotional materials.'],
      ['Do you also offer design and digital marketing?', 'Yes. Our services include graphic design, digital printing, social media marketing, and web design and development.'],
      ['How do I get a quote?', QUOTE_A]] },
  'corporate-services': { type: 'ProfessionalService',
    title: 'Business Setup & PRO Services in Dubai | Al Sajid Corporate',
    desc: 'Company formation, trade licences, visas, PRO, labour and immigration, VAT and FTA services in Dubai from Al Sajid Corporate Service, Bur Dubai.',
    faq: [['Can you set up my company and trade licence in Dubai?', 'Yes. We handle company formation and business setup, trade licence services and the related government applications.'],
      ['Do you process visas and labour documents?', 'Yes. We provide visa services, labour and immigration processing, and document clearing.'],
      ['Can you help with VAT and the FTA?', 'Yes. We provide accounts, VAT and FTA services for UAE businesses.'],
      ['How do I get started?', QUOTE_A]] },
  'it-solutions': { type: 'ProfessionalService',
    title: 'IT Solutions, POS & Cybersecurity in Dubai | IT Oasis UAE',
    desc: 'IT Oasis UAE, the IT company of Sajid Group: POS and ERP systems, networks, CCTV, Microsoft 365, cybersecurity and AI automation for UAE businesses.',
    faq: [['Do you supply POS systems for restaurants and shops?', 'Yes. IT Oasis UAE supplies and supports POS systems and software, with opening-day packages for cafes, restaurants and retail.'],
      ['Do you provide managed IT support and cybersecurity?', 'Yes. Services include managed IT support, Microsoft 365 setup, network configuration and cybersecurity.'],
      ['Where can I see all IT Oasis services?', 'Visit itoasisgulf.com for the full list of IT Oasis UAE products and services.'],
      ['How do I get a quote?', QUOTE_A]] },
};
const HOME_FAQ = [
  ['What services does Sajid Group of Companies offer?', 'Six specialist companies under one group: interior fit-out and technical services, real estate, pest control, signage and advertising, business setup and PRO services, and IT solutions.'],
  ['Where is the Sajid Group office?', `Our head office is in Al Abbas Building, Khalid Bin Al Waleed Road, Bur Dubai, Dubai, UAE.`],
  ['What are your office hours?', 'Monday to Saturday, 9:00 AM to 8:00 PM. We are closed on Sunday.'],
  ['How can I contact Sajid Group?', `Call or WhatsApp ${C.phones[0]} or ${C.phones[1]}, or email ${C.email}.`],
];

// Content Security Policy (meta tag, since GitHub Pages cannot send headers): only our own files, plus the Google Maps embed.
const CSP = "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; frame-src https://www.google.com; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests";

// schema.org building blocks
const ORG_ID = SITE + '/#organization';
const ADDRESS_LD = { '@type': 'PostalAddress', streetAddress: 'Al Abbas Building, Khalid Bin Al Waleed Road, Bur Dubai', addressLocality: 'Dubai', addressRegion: 'Dubai', addressCountry: 'AE' };
const HOURS_LD = [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:00', closes: '20:00' }];
const LOCAL_LD = {
  address: ADDRESS_LD, geo: { '@type': 'GeoCoordinates', latitude: C.geo.lat, longitude: C.geo.lng }, hasMap: C.mapLink,
  openingHoursSpecification: HOURS_LD, telephone: C.phones[0].replace(/\s/g, ''), email: C.email,
  areaServed: [{ '@type': 'City', name: 'Dubai' }, { '@type': 'Country', name: 'United Arab Emirates' }],
};
const faqLd = (qa, pageUrl) => ({ '@type': 'FAQPage', '@id': pageUrl + '#faq', mainEntity: qa.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
const crumbLd = (items) => ({ '@type': 'BreadcrumbList', itemListElement: items.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })) });

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
  nav: [['index.html', 'Home', 'الرئيسية'], ['about.html', 'About', 'من نحن'], ['companies.html', 'Our Companies', 'شركاتنا'], ['services.html', 'Services', 'الخدمات'], ['contact.html', 'Contact', 'اتصل بنا']],
  other: ['العربية', 'English'], skip: ['Skip to content', 'تخطي إلى المحتوى'], menu: ['Menu', 'القائمة'], whatsapp: ['WhatsApp', 'واتساب'],
  tagline: ['People | Solutions | Sustainability', 'الناس | الحلول | الاستدامة'],
  partner: ['Your trusted business partner in Dubai, UAE', 'شريكك الموثوق للأعمال في دبي، الإمارات'],
  ourCos: ['Our companies', 'شركاتنا'], contact: ['Contact', 'تواصل معنا'], rights: ['All rights reserved.', 'جميع الحقوق محفوظة.'], itPartner: ['IT partner: IT Oasis UAE', 'الشريك التقني: آي تي أويسس الإمارات'],
  waMsg: ['Hello Sajid Group, I would like to know more about your services.', 'مرحباً مجموعة ساجد، أود معرفة المزيد عن خدماتكم.'],
  view: ['View services', 'عرض الخدمات'], visitIt: ['Visit IT Oasis', 'زيارة آي تي أويسس'], visitItSite: ['Visit IT Oasis website', 'زيارة موقع آي تي أويسس'],
  ctaH: ['Ready to work with us?', 'هل أنت مستعد للعمل معنا؟'], ctaP: ['Tell us what you need and the right company in our group will get back to you quickly.', 'أخبرنا بما تحتاجه وستتواصل معك الشركة المناسبة في مجموعتنا بسرعة.'],
  book: ['Book a visit', 'احجز زيارة'], waUs: ['WhatsApp us', 'راسلنا على واتساب'], call: ['Call', 'اتصل'],
};
const AREAS = [['Bur Dubai', 'بر دبي'], ['Deira', 'ديرة'], ['Karama', 'الكرامة'], ['Downtown Dubai', 'وسط مدينة دبي'], ['Business Bay', 'الخليج التجاري'], ['Dubai Marina and JLT', 'مرسى دبي وأبراج بحيرات جميرا'], ['Jumeirah and Al Satwa', 'جميرا والساتوا'], ['Al Quoz and Al Barsha', 'القوز والبرشاء'], ['Jumeirah Village Circle', 'قرية جميرا الدائرية'], ['Dubai Silicon Oasis and Al Warqa', 'واحة دبي للسيليكون والورقاء'], ['Sharjah and Ajman', 'الشارقة وعجمان'], ['Other area in the UAE', 'منطقة أخرى في الإمارات']];
const SLOTS = [['9:00 AM to 12:00 PM', '9:00 صباحاً إلى 12:00 ظهراً'], ['12:00 PM to 3:00 PM', '12:00 ظهراً إلى 3:00 عصراً'], ['3:00 PM to 6:00 PM', '3:00 عصراً إلى 6:00 مساءً'], ['6:00 PM to 8:00 PM', '6:00 مساءً إلى 8:00 مساءً']];
const NOT_FOUND = { en: ['Page not found', 'The page you are looking for has moved or does not exist.', 'Back to home'], ar: ['الصفحة غير موجودة', 'الصفحة التي تبحث عنها نُقلت أو غير موجودة.', 'العودة إلى الرئيسية'] };

function build(L) {
  const ar = L === 'ar', x = v => (Array.isArray(v) ? v[ar ? 1 : 0] : v[L]);
  const base = ar ? '../' : '', img = base + 'assets/img/';
  const O = C.office, addrLines = sep => [O.building, O.street, O.area, O.city].map(x).join(sep);
  const W = m => wa(C.phones[0], m || x(S.waMsg));
  const url = f => `${SITE}/${ar ? 'ar/' : ''}${f === 'index.html' ? '' : f}`;
  const urlOther = f => `${SITE}/${ar ? '' : 'ar/'}${f === 'index.html' ? '' : f}`;

  function page({ file, title, desc, body, active, ld = [], noindex, preload = '' }) {
    const nav = S.nav.map(([h, en, a]) => `<a href="${h}"${h === active ? ' aria-current="page"' : ''}>${ar ? a : en}</a>`).join('');
    const brand = alt => `<a class="brand" href="index.html"${alt ? '' : ` aria-label="${x(S.full)}"`}><img src="${img}sg-logo.png" alt="${alt || ''}" width="56" height="56"${alt ? ' loading="lazy"' : ''}><span>${x(S.group)}<small>${x(S.ofCos)}</small></span></a>`;
    // JSON-LD: escape "<" so text can never close the script element
    const ldTag = ld.length ? `<script type="application/ld+json">${JSON.stringify(ld.length === 1 ? { '@context': 'https://schema.org', ...ld[0] } : { '@context': 'https://schema.org', '@graph': ld }).replace(/</g, '\\u003c')}</script>` : '';
    const fonts = ar ? '' : `<link rel="preload" href="${base}assets/fonts/Inter-400-latin.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="${base}assets/fonts/CormorantGaramond-600-latin.woff2" as="font" type="font/woff2" crossorigin>`;
    return `<!doctype html>
<html lang="${L}" dir="${ar ? 'rtl' : 'ltr'}">
<head>
<meta charset="utf-8">
${noindex && !ar ? '<base href="/">\n' : ''}<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="${CSP}">
<meta name="referrer" content="strict-origin-when-cross-origin">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1'}">
${noindex ? '' : `<link rel="canonical" href="${url(file)}">
<link rel="alternate" hreflang="en" href="${ar ? urlOther(file) : url(file)}"><link rel="alternate" hreflang="ar" href="${ar ? url(file) : urlOther(file)}"><link rel="alternate" hreflang="x-default" href="${ar ? urlOther(file) : url(file)}">`}
<meta property="og:type" content="website"><meta property="og:site_name" content="${x(S.full)}"><meta property="og:title" content="${title}"><meta property="og:description" content="${desc}">
<meta property="og:image" content="${SITE}/assets/img/sg-logo-og.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="1200"><meta property="og:image:alt" content="${x(S.full)} logo"><meta property="og:url" content="${url(file)}"><meta property="og:locale" content="${ar ? 'ar_AE' : 'en_AE'}"><meta property="og:locale:alternate" content="${ar ? 'en_AE' : 'ar_AE'}">
<meta name="twitter:card" content="summary"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${desc}"><meta name="twitter:image" content="${SITE}/assets/img/sg-logo-og.jpg">
<meta name="geo.region" content="AE-DU"><meta name="geo.placename" content="Bur Dubai, Dubai"><meta name="geo.position" content="${C.geo.lat};${C.geo.lng}"><meta name="ICBM" content="${C.geo.lat}, ${C.geo.lng}">
<meta name="theme-color" content="#faf7f0"><meta name="color-scheme" content="light dark">
<script src="${base}assets/theme.js"></script>
<link rel="icon" type="image/png" sizes="32x32" href="${img}favicon-32.png"><link rel="icon" type="image/png" sizes="192x192" href="${img}favicon.png"><link rel="apple-touch-icon" href="${img}apple-touch-icon.png">
${fonts}${preload}
<link rel="stylesheet" href="${base}assets/fonts-${ar ? 'ar' : 'en'}.css">
<link rel="stylesheet" href="${base}styles.css">
${ldTag}
</head>
<body>
<a class="skip" href="#main">${x(S.skip)}</a>
<div class="progress" aria-hidden="true"></div>
<div class="topbar"><div class="wrap topbar-in">
  <span class="open-badge" data-open hidden></span>
  <a class="tb-link" href="${tel(C.phones[0])}">${ic('phone', 'ic xs')}${num(C.phones[0])}</a>
  <a class="tb-link hide-sm" href="mailto:${C.email}">${ic('mail', 'ic xs')}${C.email}</a>
  <a class="tb-link hide-sm" href="${C.mapLink}" target="_blank" rel="noopener">${ic('pin', 'ic xs')}${x(O.area)}, ${x(O.city)}</a>
  <a class="lang tb-lang" href="${ar ? '../' : 'ar/'}${file}" hreflang="${ar ? 'en' : 'ar'}" lang="${ar ? 'en' : 'ar'}">${ic('globe', 'ic xs')}${x(S.other)}</a>
</div></div>
<header class="hdr">
  <div class="wrap hdr-in">
    ${brand()}
    <nav id="nav" class="nav">${nav}<a class="lang nav-lang" href="${ar ? '../' : 'ar/'}${file}" hreflang="${ar ? 'en' : 'ar'}" lang="${ar ? 'en' : 'ar'}">${ic('globe', 'ic xs')}${x(S.other)}</a></nav>
    <div class="hdr-tools">
      <a class="btn btn-line sm hdr-quote" href="contact.html#quote">${ic('doc')}${ar ? 'عرض سعر' : 'Get a quote'}</a>
      <a class="btn btn-gold sm hdr-book" href="booking.html">${ic('cal')}${x(S.book)}</a>
      <button class="theme-t" type="button" aria-label="${ar ? 'تبديل الوضع الفاتح والداكن' : 'Switch light or dark mode'}" aria-pressed="false">${ic('moon', 'ic i-moon')}${ic('sun', 'ic i-sun')}</button>
      <button class="burger" aria-label="${x(S.menu)}" aria-expanded="false" aria-controls="nav"><span></span><span></span><span></span></button>
    </div>
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
      <li>${ic('ig')}<a href="${C.instagram}" target="_blank" rel="noopener">@sajiid.group</a></li>
      <li>${ic('pin')}<a href="${C.mapLink}" target="_blank" rel="noopener">${addrLines(', ')}</a></li>
      <li>${ic('cal')}<a href="booking.html">${x(S.book)}</a></li>
      <li>${ic('clock')}<span>${x(C.hours)[0]}: ${x(C.hours)[1]}<br>${x(C.hours)[2]}: ${x(C.hours)[3]}<br><span class="open-badge" data-open hidden></span></span></li></ul></div>
  </div>
  <div class="wrap ftr-bot"><span>&copy; <span id="yr">2026</span> ${x(S.full)}. ${x(S.rights)}</span><a href="${C.itoasis}" target="_blank" rel="noopener">${x(S.itPartner)} ${ic('ext', 'ic xs')}</a></div>
</footer>
<nav class="dock" aria-label="${ar ? 'إجراءات سريعة' : 'Quick actions'}">
  <a href="${tel(C.phones[0])}">${ic('phone')}<span>${x(S.call)}</span></a>
  <a href="${W()}" target="_blank" rel="noopener">${ic('wa')}<span>${x(S.whatsapp)}</span></a>
  <a href="contact.html#quote">${ic('doc')}<span>${ar ? 'عرض سعر' : 'Quote'}</span></a>
  <a class="dock-main" href="booking.html">${ic('cal')}<span>${ar ? 'احجز' : 'Book'}</span></a>
</nav>
<a class="wa-float" href="${W()}" target="_blank" rel="noopener" aria-label="${x(S.whatsapp)}">${ic('wa')}</a>
<button class="to-top" type="button" aria-label="${ar ? 'العودة إلى الأعلى' : 'Back to top'}">${ic('up')}</button>
<script src="${base}app.js" defer></script>
</body>
</html>
`;
  }

  const itLogo = cls => `<div class="co-logo${cls || ''}"><img src="${img}itoasis.png" alt="${ar ? 'شعار آي تي أويسس' : 'IT Oasis UAE logo'}" loading="lazy" width="260" height="142"></div>`;
  const quoteMsg = d => W(T(`Hello Sajid Group, I would like a quote from ${d.name.en}.`, `مرحباً مجموعة ساجد، أود الحصول على عرض سعر من ${d.name.ar}.`));
  const media = (d, cls = '') => d.logo ? itLogo(cls) : `<img src="${img}${d.img}" alt="${T(`${d.tag.en} in Dubai by ${d.name.en}`, x(d.name))}" loading="lazy" width="1200" height="750">`;
  const card = (d, i = 0) => `<article class="co reveal${i === 0 ? ' co-wide' : ''}">
  <a class="co-media" href="${d.slug}.html" tabindex="-1" aria-hidden="true">${media(d)}<span class="co-num">0${D.indexOf(d) + 1}</span></a>
  <div class="co-body"><p class="eyebrow">${ic(d.icon, 'ic xs')}${x(d.short)}</p><h3><a href="${d.slug}.html">${x(d.name)}</a></h3><p>${x(d.tag)}.</p>
  <ul class="co-tags">${d.services.slice(0, 3).map(sv => `<li>${x(sv)}</li>`).join('')}</ul>
  <div class="co-actions"><a class="btn btn-gold sm" href="${quoteMsg(d)}" target="_blank" rel="noopener">${ic('wa')}${T('Quote', 'عرض سعر')}</a><a class="btn btn-line sm" href="booking.html?s=${d.slug}.0">${ic('cal')}${T('Book', 'احجز')}</a><a class="link" href="${d.slug}.html">${x(S.view)} ${ic('arrow', 'ic xs')}</a></div>
  ${d.ext ? `<a class="co-ext" href="${d.ext}" target="_blank" rel="noopener">${x(S.visitItSite)} ${ic('ext', 'ic xs')}</a>` : ''}</div>
</article>`;
  const cta = () => `<section class="cta"><div class="wrap cta-in reveal"><div><h2>${x(S.ctaH)}</h2><p>${x(S.ctaP)}</p></div><div class="btns"><a class="btn btn-gold" href="${W()}" target="_blank" rel="noopener">${ic('wa')}${x(S.waUs)}</a><a class="btn btn-line" href="booking.html">${ic('cal')}${x(S.book)}</a><a class="btn btn-line" href="${tel(C.phones[0])}">${ic('phone')}${x(S.call)} ${num(C.phones[0])}</a></div></div></section>`;
  const head = (eyebrow, h1, p, nav = '') => `<section class="phead"><div class="wrap">${nav}<p class="eyebrow">${eyebrow}</p><h1>${h1}</h1>${p ? `<p class="lead">${p}</p>` : ''}</div></section>`;
  const why = () => `<div class="grid4">${WHY.map(([i, h, p]) => `<div class="why reveal">${ic(i, 'ic lg')}<h3>${x(h)}</h3><p>${x(p)}</p></div>`).join('')}</div>`;
  const T = (en, a) => (ar ? a : en);
  const pages = [];
  // FAQ block and breadcrumbs (English SEO; the Arabic pages keep their current layout)
  const faqSection = qa => ar ? '' : `<section class="sec"><div class="wrap narrow"><div class="sec-head reveal"><p class="eyebrow">FAQ</p><h2>Frequently asked questions</h2></div>
<div class="faq">${qa.map(([q, a]) => `<details class="reveal"><summary>${q}</summary><p>${a}</p></details>`).join('')}</div></div></section>`;
  const crumbs = items => ar ? '' : `<nav class="crumbs" aria-label="Breadcrumb"><ol>${items.map(([n, h], i) => i === items.length - 1 ? `<li><span aria-current="page">${n}</span></li>` : `<li><a href="${h}">${n}</a></li>`).join('')}</ol></nav>`;
  const crumbUrls = items => crumbLd(items.map(([n, h]) => [n, url(h)]));
  const orgLd = () => ({ '@type': 'LocalBusiness', '@id': ORG_ID, name: S.full[0], alternateName: 'Sajid Group', url: SITE + '/', logo: SITE + '/assets/img/sg-logo-og.jpg', image: SITE + '/assets/img/sg-logo-og.jpg',
    description: 'Sajid Group of Companies is a diversified Dubai group offering interior fit-out and technical services, real estate, pest control, advertising, corporate PRO services and IT solutions.',
    slogan: S.tagline[0], founder: { '@type': 'Person', name: 'Muhammad Sajid', jobTitle: 'Founder and CEO' }, ...LOCAL_LD,
    contactPoint: C.phones.map(p => ({ '@type': 'ContactPoint', telephone: p.replace(/\s/g, ''), contactType: 'customer service', areaServed: 'AE', availableLanguage: ['English', 'Arabic'] })),
    subOrganization: D.map(d => ({ '@id': `${SITE}/${d.slug}.html#business` })),
    sameAs: [C.mapLink, C.instagram] });
  const siteLd = () => ({ '@type': 'WebSite', '@id': SITE + '/#website', url: SITE + '/', name: S.full[0], publisher: { '@id': ORG_ID }, inLanguage: ['en', 'ar'] });

  pages.push({ file: 'index.html', active: 'index.html',
    ld: ar ? [] : [orgLd(), siteLd(), faqLd(HOME_FAQ, url('index.html'))],
    preload: `<link rel="preload" href="${img}hero-skyline.webp" as="image" type="image/webp" fetchpriority="high">${ar ? '' : `<link rel="preload" href="assets/fonts/GreatVibes-400-latin.woff2" as="font" type="font/woff2" crossorigin>`}`,
    title: T('Sajid Group of Companies | Business Services in Dubai, UAE', 'مجموعة ساجد للشركات | شريكك الموثوق للأعمال في دبي'),
    desc: T('Sajid Group, Bur Dubai: interior fit-out, technical maintenance, real estate, pest control, signage, business setup, PRO and IT services in one group.','مجموعة ساجد للشركات في دبي: الديكور والخدمات الفنية، العقارات، مكافحة الحشرات، الإعلان، خدمات الشركات والمندوب، وحلول تقنية المعلومات تحت مجموعة واحدة موثوقة.'),
    body: `<section class="hero hero2">
  <div class="hero-bg" aria-hidden="true"><img class="hero-sky" src="${img}hero-skyline.webp" alt="" width="1058" height="508" fetchpriority="high"></div>
  <div class="wrap hero-grid hero-center">
    <div class="hero-copy hx">
      <p class="hx-chip reveal"><span class="hx-dot"></span>${T('Six companies · One number · Dubai', 'ست شركات · رقم واحد · دبي')}</p>
      <h1 class="hx-name reveal"><span class="hx-big">${T('Sajid Group', 'مجموعة ساجد')}</span><span class="hx-of">${T('of Companies', 'للشركات')}</span></h1>
      <p class="hx-line reveal">${T('Everything your home and business needs, <span>in one group.</span>', 'كل ما يحتاجه منزلك وعملك، <span>في مجموعة واحدة.</span>')}</p>
      <p class="hx-lead reveal">${T('Interiors, real estate, pest control, advertising, corporate services and IT across Dubai. Six licensed companies, one number to call.', 'الديكور والعقارات ومكافحة الحشرات والإعلان وخدمات الشركات وتقنية المعلومات في دبي. ست شركات مرخصة ورقم واحد للتواصل.')}</p>
      <ul class="hx-trust reveal"><li><b>6</b>${T('licensed companies', 'شركات مرخصة')}</li><li><b dir="ltr">60+</b>${T('services', 'خدمة')}</li><li><b>${ic('check', 'ic xs')}</b>${T('Authority approved', 'معتمدون حكومياً')}</li></ul>
    </div>
    <form class="qcard qbar reveal" id="qcard" action="booking.html" method="get">
      <p class="qcard-k">${T('Quick request', 'طلب سريع')}</p>
      <h2 class="qcard-h">${T('What do you need today?', 'ما الذي تحتاجه اليوم؟')}</h2>
      <div class="qpick" role="radiogroup" aria-label="${T('Choose a company', 'اختر الشركة')}">${D.map((d, i) => `<label class="qopt"><input type="radio" name="s" value="${d.slug}.0" data-wa="${quoteMsg(d)}"${i === 0 ? ' checked' : ''}><span>${ic(d.icon)}${x(d.short)}</span></label>`).join('')}</div>
      <div class="qcard-btns"><a class="btn btn-gold" id="q-quote" href="${quoteMsg(D[0])}" target="_blank" rel="noopener">${ic('wa')}${T('Get a free quote', 'احصل على عرض سعر مجاني')}</a><button class="btn btn-line" type="submit">${ic('cal')}${x(S.book)}</button></div>
      <a class="qcard-call" href="${tel(C.phones[0])}">${ic('phone', 'ic xs')}${T('Or call', 'أو اتصل')} ${num(C.phones[0])}</a>
    </form>
  </div>
</section>
<section class="sec deck-sec"><div class="wrap deck-grid">
  <div class="deck-copy reveal"><p class="eyebrow">${x(S.ourCos)}</p><h2>${T('Meet the companies behind the group', 'تعرّف على شركات المجموعة')}</h2><p class="muted">${T('Six specialist companies, each with its own licence and team. Tap a card to bring it forward, then get a quote or book a visit.', 'ست شركات متخصصة، لكل منها رخصتها وفريقها. اضغط على بطاقة لإظهارها، ثم اطلب عرض سعر أو احجز زيارة.')}</p>
  <a class="link" href="companies.html">${T('See all companies', 'عرض جميع الشركات')} ${ic('arrow', 'ic xs')}</a></div>
  <div class="deck reveal" data-deck aria-roledescription="carousel" aria-label="${x(S.ourCos)}">
      ${D.map((d, i) => `<article class="dcard" data-i="${i}" aria-label="${x(d.name)}">
        <div class="dc-media">${d.logo ? `<div class="dc-logo"><img src="${img}itoasis.png" alt="" loading="lazy" width="260" height="142"></div>` : `<img src="${img}${d.img}" alt="" loading="${i < 3 ? 'eager' : 'lazy'}" width="1200" height="750">`}</div>
        <div class="dc-body"><p class="dc-k">${x(d.short)}</p><h3><a href="${d.slug}.html">${x(d.name)}</a></h3>
        <div class="dc-btns"><a class="dc-q" href="${quoteMsg(d)}" target="_blank" rel="noopener">${T('Quote', 'عرض سعر')}</a><a class="dc-b" href="booking.html?s=${d.slug}.0">${T('Book', 'احجز')}</a></div></div>
      </article>`).join('')}
      <div class="deck-dots" role="tablist" aria-label="${x(S.ourCos)}">${D.map((d, i) => `<button type="button" role="tab" aria-label="${x(d.short)}" data-go="${i}"${i === 0 ? ' aria-selected="true"' : ''}></button>`).join('')}</div>
    </div>
</div></section>
${(() => { const items = D.flatMap(d => d.services.slice(0, 3)).map(([e, a2]) => `<span>${ar ? a2 : e}</span>`).join(''); return `<div class="ticker" role="region" aria-label="${T('Our services', 'خدماتنا')}"><div class="ticker-track"><div class="ticker-set">${items}</div><div class="ticker-set" aria-hidden="true">${items}</div></div></div>`; })()}
<section class="sec show" id="companies"><div class="wrap">
  <div class="sec-head reveal"><p class="eyebrow">${x(S.ourCos)}</p><h2>${T('Six companies. One trusted group.', 'ست شركات. مجموعة واحدة موثوقة.')}</h2><p class="muted">${T('Pick a company to see what it does, then get a quote or book a visit in one tap.', 'اختر شركة لترى ما تقدمه، ثم اطلب عرض سعر أو احجز زيارة بنقرة واحدة.')}</p></div>
  <div class="show-in reveal">
    <div class="show-tabs" role="tablist" aria-label="${x(S.ourCos)}">${D.map((d, i) => `<button class="show-tab" role="tab" id="st-${d.slug}" aria-controls="sp-${d.slug}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><span class="st-ic">${ic(d.icon)}</span><span class="st-txt"><b>${x(d.short)}</b><small>${x(d.tag)}</small></span><i class="st-bar"></i></button>`).join('')}</div>
    <div class="show-panels">${D.map((d, i) => `<article class="show-panel" role="tabpanel" id="sp-${d.slug}" aria-labelledby="st-${d.slug}"${i ? ' hidden' : ''}>
      <div class="sp-media">${media(d, ' big')}</div>
      <div class="sp-body"><p class="eyebrow">0${i + 1} / 0${D.length}</p><h3>${x(d.name)}</h3><p class="muted">${x(d.intro)}</p>
      <ul class="sp-svc">${d.services.slice(0, 6).map((sv, j) => `<li><a href="booking.html?s=${d.slug}.${j}">${ic('check', 'ic xs')}${x(sv)}</a></li>`).join('')}</ul>
      <div class="btns"><a class="btn btn-gold" href="${quoteMsg(d)}" target="_blank" rel="noopener">${ic('wa')}${T('Get a quote', 'اطلب عرض سعر')}</a><a class="btn btn-line" href="booking.html?s=${d.slug}.0">${ic('cal')}${x(S.book)}</a><a class="link" href="${d.slug}.html">${T('Explore company', 'تعرّف على الشركة')} ${ic('arrow', 'ic xs')}</a></div>
      ${d.ext ? `<a class="co-ext" href="${d.ext}" target="_blank" rel="noopener">${x(S.visitItSite)} ${ic('ext', 'ic xs')}</a>` : ''}</div>
    </article>`).join('')}</div>
  </div>
</div></section>
<section class="sec alt steps-sec"><div class="wrap">
  <div class="sec-head reveal"><p class="eyebrow">${T('How it works', 'كيف نعمل')}</p><h2>${T('From request to done in three steps', 'من الطلب إلى الإنجاز في ثلاث خطوات')}</h2></div>
  <ol class="steps">
    <li class="reveal"><span class="step-n">1</span>${ic('wa', 'ic lg')}<h3>${T('Tell us what you need', 'أخبرنا بما تحتاجه')}</h3><p>${T('Call, WhatsApp or use the quick request. One number for every company.', 'اتصل أو راسلنا على واتساب أو استخدم الطلب السريع. رقم واحد لجميع الشركات.')}</p></li>
    <li class="reveal"><span class="step-n">2</span>${ic('cal', 'ic lg')}<h3>${T('We book a visit', 'نحجز لك زيارة')}</h3><p>${T('The right specialist team visits at a time that suits you, anywhere in Dubai.', 'يزورك الفريق المتخصص المناسب في الوقت الذي يناسبك في أي مكان في دبي.')}</p></li>
    <li class="reveal"><span class="step-n">3</span>${ic('check', 'ic lg')}<h3>${T('Clear quote, quality work', 'عرض واضح وعمل متقن')}</h3><p>${T('You get a clear quote, then the work is done on time and to standard.', 'تحصل على عرض سعر واضح، ثم يُنجز العمل في موعده وبالجودة المطلوبة.')}</p></li>
  </ol>
  <div class="steps-cta reveal"><a class="btn btn-gold" href="booking.html">${ic('cal')}${x(S.book)}</a><a class="btn btn-line" href="contact.html#quote">${ic('doc')}${T('Get a quote', 'اطلب عرض سعر')}</a></div>
</div></section>
<section class="sec"><div class="wrap split">
  <div class="reveal"><p class="eyebrow">${T('About the group', 'عن المجموعة')}</p><h2>${T('A diversified group serving Dubai and the UAE', 'مجموعة متنوعة تخدم دبي والإمارات')}</h2>
  <p>${T('Sajid Group of Companies serves residential, commercial and corporate clients across Dubai and the UAE. Each company in the group holds its own trade licence and name. Our mission is simple: deliver dependable services that help clients improve properties, grow businesses and maintain safe, comfortable spaces.', 'تخدم مجموعة ساجد للشركات العملاء من الأفراد والشركات والمؤسسات في دبي وجميع أنحاء الإمارات. ولكل شركة في المجموعة رخصتها التجارية واسمها الخاص. مهمتنا بسيطة: تقديم خدمات موثوقة تساعد عملاءنا على تحسين عقاراتهم وتنمية أعمالهم والحفاظ على أماكن آمنة ومريحة.')}</p>
  <a class="link" href="about.html">${T('More about us', 'المزيد عنا')} ${ic('arrow', 'ic xs')}</a></div>
  <div class="stats reveal"><div><b>6</b><span>${T('Specialist companies', 'شركات متخصصة')}</span></div><div><b>60+</b><span>${T('Services under one roof', 'خدمة تحت سقف واحد')}</span></div><div><b>6</b><span>${T('Authority approvals', 'موافقات حكومية')}</span></div><div><b>1</b><span>${T('Point of contact', 'جهة تواصل واحدة')}</span></div></div>
</div></section>
<section class="sec itband"><div class="wrap itband-in reveal">
  <img src="${img}itoasis.png" alt="${ar ? 'شعار آي تي أويسس' : 'IT Oasis UAE logo'}" width="260" height="142" loading="lazy">
  <div><p class="eyebrow">${T('Technology partner of the group', 'الشريك التقني للمجموعة')}</p><h2>${T('IT Oasis UAE, our IT company', 'آي تي أويسس الإمارات، شركتنا للتقنية')}</h2><p>${T('POS and ERP systems, networks, CCTV, Microsoft 365, cybersecurity and AI for UAE businesses. The same team supports every company in Sajid Group.', 'أنظمة نقاط البيع وتخطيط الموارد، والشبكات، وكاميرات المراقبة، ومايكروسوفت 365، والأمن السيبراني والذكاء الاصطناعي للشركات في الإمارات. والفريق نفسه يدعم جميع شركات مجموعة ساجد.')}</p></div>
  <a class="btn btn-gold" href="${C.itoasis}" target="_blank" rel="noopener">${x(S.visitItSite)} ${ic('ext', 'ic xs')}</a>
</div></section>
<section class="sec"><div class="wrap"><div class="sec-head reveal"><p class="eyebrow">${T('Why choose us', 'لماذا تختارنا')}</p><h2>${T('Built on people, solutions and sustainability', 'قائمة على الناس والحلول والاستدامة')}</h2></div>${why()}
<ul class="approvals reveal">${APPROVALS.map(a => `<li>${ic('check')}${x(a)}</li>`).join('')}</ul></div></section>
${faqSection(HOME_FAQ)}${cta()}` });

  const coCrumbs = [['Home', 'index.html'], ['Our Companies', 'companies.html']];
  pages.push({ file: 'companies.html', active: 'companies.html', title: T('Our Companies in Dubai | Sajid Group of Companies', 'شركاتنا | مجموعة ساجد للشركات'),
    ld: ar ? [] : [crumbUrls(coCrumbs), { '@type': 'ItemList', name: 'Companies of Sajid Group', itemListElement: D.map((d, i) => ({ '@type': 'ListItem', position: i + 1, name: d.name.en, url: url(d.slug + '.html') })) }],
    desc: T('The six companies of Sajid Group in Dubai: fit-out and technical services, real estate, pest control, advertising, business setup and PRO, and IT.','تعرّف على شركات مجموعة ساجد الست: الديكور والخدمات الفنية، العقارات، مكافحة الحشرات، الإعلان، خدمات الشركات وآي تي أويسس الإمارات.'),
    body: head(x(S.ourCos), T('Specialist services. One trusted group.', 'خدمات متخصصة. مجموعة واحدة موثوقة.'), T('Each company is separately licensed and trades under its own name, run by its own specialist team, with Sajid Group as one point of contact for you.', 'كل شركة مرخصة بشكل مستقل وتعمل باسمها الخاص ويديرها فريق متخصص، مع مجموعة ساجد كجهة تواصل واحدة لك.'), crumbs(coCrumbs)) +
      `<section class="sec"><div class="wrap"><div class="cogrid">${D.map((d, i) => card(d, i)).join('')}</div></div></section>${cta()}` });

  for (const d of D) {
    const others = D.filter(o => o !== d).map(o => `<li><a href="${o.slug}.html">${ic(o.icon)}${x(o.short)}</a></li>`).join('');
    const seo = SEO[d.slug], pageUrl = url(`${d.slug}.html`), cr = [...coCrumbs, [d.name.en, `${d.slug}.html`]];
    const bizLd = { '@type': seo.type, '@id': `${SITE}/${d.slug}.html#business`, name: d.name.en, ...(d.alt ? { alternateName: 'RAK Pest Control' } : {}),
      description: d.intro.en, url: d.ext || pageUrl, image: SITE + '/assets/img/' + (d.img || 'itoasis.png'), parentOrganization: { '@id': ORG_ID }, ...LOCAL_LD,
      hasOfferCatalog: { '@type': 'OfferCatalog', name: `${d.name.en} services`, itemListElement: d.services.map(s => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s[0], areaServed: 'Dubai' } })) } };
    pages.push({ file: `${d.slug}.html`, active: 'companies.html', title: T(seo.title, `${d.name.ar} | مجموعة ساجد دبي`),
      ld: ar ? [] : [bizLd, crumbUrls(cr), faqLd(seo.faq, pageUrl)],
      desc: T(seo.desc, `${d.name.ar}، إحدى شركات مجموعة ساجد في دبي: ${d.tag.ar}. اتصل أو راسلنا على واتساب ${C.phones[0]}.`),
      body: `<section class="cohero${d.logo ? ' cohero-logo' : ''}">${d.logo ? '' : `<img class="cohero-bg" src="${img}${d.img}" alt="" width="1200" height="750">`}<div class="wrap cohero-in">${crumbs(cr)}
  <div class="cohero-copy"><p class="eyebrow">${ic(d.icon, 'ic xs')}${x(d.short)}</p><h1>${x(d.name)}</h1><p class="lead">${x(d.intro)}</p>
  <div class="btns"><a class="btn btn-gold" href="${quoteMsg(d)}" target="_blank" rel="noopener">${ic('wa')}${T('Get a free quote', 'احصل على عرض سعر مجاني')}</a><a class="btn btn-line" href="booking.html?s=${d.slug}.0">${ic('cal')}${x(S.book)}</a><a class="btn btn-line" href="${tel(C.phones[0])}">${ic('phone')}${num(C.phones[0])}</a></div></div>
  ${d.logo ? `<div class="cohero-mark">${itLogo(' big')}</div>` : ''}</div></section>` + `<section class="sec"><div class="wrap split top">
  <div><h2 class="h3">${T('Our services', 'خدماتنا')}</h2><ul class="svc svc2">${d.services.map((sv, j) => `<li class="reveal">${ic('check')}<span>${x(sv)}</span><a class="svc-book" href="booking.html?s=${d.slug}.${j}">${T('Book', 'احجز')} ${ic('arrow', 'ic xs')}</a></li>`).join('')}</ul>
  ${d.alt ? `<p class="muted note">${x(d.alt)}</p>` : ''}</div>
  <aside class="side reveal">${d.logo ? itLogo(' big') : `<img class="side-img" src="${img}${d.img}" alt="${T(`${d.tag.en} in Dubai by ${d.name.en}`, x(d.name))}" width="1200" height="750">`}
    <h3>${T('Get a free quote', 'احصل على عرض سعر مجاني')}</h3><p>${T('Message us with what you need and we will reply quickly.', 'راسلنا بما تحتاجه وسنرد عليك بسرعة.')}</p>
    <a class="btn btn-gold full" href="${W(T(`Hello Sajid Group, I would like a quote from ${d.name.en}.`, `مرحباً مجموعة ساجد، أود الحصول على عرض سعر من ${d.name.ar}.`))}" target="_blank" rel="noopener">${ic('wa')}${x(S.whatsapp)} ${x(d.short)}</a>
    <a class="btn btn-line full" href="${tel(C.phones[0])}">${ic('phone')}${num(C.phones[0])}</a>
    ${d.ext ? `<a class="btn btn-gold full" href="${d.ext}" target="_blank" rel="noopener">${x(S.visitItSite)} ${ic('ext', 'ic xs')}</a>` : ''}
  </aside></div></section>
${faqSection(seo.faq)}<section class="sec alt"><div class="wrap"><h2 class="h3">${T('Other companies in the group', 'شركات أخرى في المجموعة')}</h2><ul class="pills dark">${others}</ul></div></section>${cta()}` });
  }

  const abCrumbs = [['Home', 'index.html'], ['About Us', 'about.html']];
  pages.push({ file: 'about.html', active: 'about.html', title: T('About Sajid Group of Companies | Diversified Group in Dubai', 'من نحن | مجموعة ساجد للشركات'),
    ld: ar ? [] : [crumbUrls(abCrumbs), { '@type': 'AboutPage', url: url('about.html'), name: 'About Sajid Group of Companies', about: { '@id': ORG_ID } }],
    desc: T('About Sajid Group of Companies, Bur Dubai: founded by Muhammad Sajid, six specialist companies serving homes and businesses across the UAE.','عن مجموعة ساجد للشركات: مجموعة متنوعة في دبي تخدم العملاء من الأفراد والشركات والمؤسسات في جميع أنحاء الإمارات.'),
    body: head(T('About us', 'من نحن'), T('People. Solutions. Sustainability.', 'الناس. الحلول. الاستدامة.'), T('A diversified group serving residential, commercial and corporate clients across Dubai and the UAE.', 'مجموعة متنوعة تخدم العملاء من الأفراد والشركات والمؤسسات في دبي وجميع أنحاء الإمارات.'), crumbs(abCrumbs)) +
      `<section class="sec"><div class="wrap split">
  <div class="reveal"><h2>${T('Our mission', 'مهمتنا')}</h2><p>${T('Deliver dependable services that help clients improve properties, grow businesses and maintain safe, comfortable spaces.', 'تقديم خدمات موثوقة تساعد عملاءنا على تحسين عقاراتهم وتنمية أعمالهم والحفاظ على أماكن آمنة ومريحة.')}</p>
  <h2>${T('Our promise', 'وعدنا')}</h2><p>${T('One trusted group for the services a home or business needs in Dubai, with specialist teams, clear communication and quality you can rely on. Building a better tomorrow, one project at a time.', 'مجموعة واحدة موثوقة لكل ما يحتاجه المنزل أو النشاط التجاري في دبي، بفرق متخصصة وتواصل واضح وجودة يمكنك الاعتماد عليها. نبني غداً أفضل، مشروعاً بعد مشروع.')}</p></div>
  <div class="ceo reveal"><img class="ceo-photo" src="${img}ceo-sajid-ali.jpg" alt="${T('Muhammad Sajid, Founder and CEO of Sajid Group', 'محمد ساجد، المؤسس والرئيس التنفيذي لمجموعة ساجد')}" width="435" height="560" loading="lazy"><h3>${T('Muhammad Sajid', 'محمد ساجد')}</h3><p class="eyebrow">${T('Founder &amp; CEO', 'المؤسس والرئيس التنفيذي')}</p><p>${T('"Our strength is our people. Every company in the group is built to give clients practical, honest solutions."', '«قوتنا في فريقنا. كل شركة في المجموعة قائمة على تقديم حلول عملية وصادقة لعملائنا.»')}</p></div>
</div></section>
<section class="sec alt"><div class="wrap">${why()}</div></section>${cta()}` });

  const ctCrumbs = [['Home', 'index.html'], ['Contact', 'contact.html']];
  pages.push({ file: 'contact.html', active: 'contact.html', title: T('Contact Sajid Group | Al Abbas Building, Bur Dubai', 'اتصل بنا | مجموعة ساجد للشركات، بر دبي'),
    ld: ar ? [] : [crumbUrls(ctCrumbs), { '@type': 'ContactPage', url: url('contact.html'), name: 'Contact Sajid Group of Companies', about: { '@id': ORG_ID } }],
    desc: T(`Visit Sajid Group at Al Abbas Building, Khalid Bin Al Waleed Road, Bur Dubai. Open Mon to Sat, 9 AM to 8 PM. Call or WhatsApp ${C.phones[0]}.`, `تواصل مع مجموعة ساجد للشركات: ${C.phones.join('، ')}، ${C.email}. مبنى العباس، شارع خالد بن الوليد، بر دبي.`),
    body: head(x(S.contact), T("Let's work together", 'لنعمل معاً'), T('Call, WhatsApp or visit our head office in Al Abbas Building, Bur Dubai.', 'اتصل بنا أو راسلنا على واتساب أو زر مكتبنا الرئيسي في مبنى العباس، بر دبي.'), crumbs(ctCrumbs)) + `<section class="sec"><div class="wrap split top">
  <div class="reveal"><ul class="cards">
    ${C.phones.map(p => `<li>${ic('phone', 'ic lg')}<div><b>${T('Call or WhatsApp', 'اتصال أو واتساب')}</b><a href="${tel(p)}">${num(p)}</a> &middot; <a href="${wa(p, x(S.waMsg))}" target="_blank" rel="noopener">${x(S.whatsapp)}</a></div></li>`).join('')}
    <li>${ic('mail', 'ic lg')}<div><b>${T('Email', 'البريد الإلكتروني')}</b><a href="mailto:${C.email}">${C.email}</a></div></li>
    <li>${ic('ig', 'ic lg')}<div><b>${T('Instagram', 'إنستغرام')}</b><a href="${C.instagram}" target="_blank" rel="noopener">@sajiid.group</a></div></li>
    <li>${ic('pin', 'ic lg')}<div><b>${T('Head office', 'المكتب الرئيسي')}</b><address>${x(S.full)}<br>${addrLines('<br>')}</address><a class="link" href="${C.mapLink}" target="_blank" rel="noopener">${T('Get directions on Google Maps', 'الاتجاهات على خرائط جوجل')} ${ic('ext', 'ic xs')}</a></div></li>
    <li>${ic('clock', 'ic lg')}<div><b>${T('Office hours', 'ساعات العمل')}</b><span>${x(C.hours)[0]}: ${x(C.hours)[1]}<br>${x(C.hours)[2]}: ${x(C.hours)[3]}</span><span class="open-badge" data-open hidden></span></div></li>
  </ul>
  <iframe class="map" title="${T('Map of the Sajid Group office, Al Abbas Building, Bur Dubai', 'خريطة مكتب مجموعة ساجد، مبنى العباس، بر دبي')}" src="${C.map}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe></div>
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

  // Services catalogue: every service of every company, with search and company filter
  const ALL = D.flatMap(d => d.services.map((sv, i) => ({ d, i, sv })));
  const svCrumbs = [['Home', 'index.html'], ['Services', 'services.html']];
  pages.push({ file: 'services.html', active: 'services.html', title: T('Services in Dubai | Sajid Group of Companies', 'الخدمات | مجموعة ساجد للشركات'),
    ld: ar ? [] : [crumbUrls(svCrumbs), { '@type': 'ItemList', name: 'Services of Sajid Group', itemListElement: ALL.map((a, n) => ({ '@type': 'ListItem', position: n + 1, name: a.sv[0], url: url(a.d.slug + '.html') })) }],
    desc: T(`Browse every service of Sajid Group in Dubai: fit-out, maintenance, real estate, pest control, signage, PRO and IT. Request a quote or book a visit. ${C.phones[0]}.`, 'تصفح جميع خدمات مجموعة ساجد في دبي: التشطيبات والصيانة والعقارات ومكافحة الحشرات واللوحات والمندوب وتقنية المعلومات. اطلب عرض سعر أو احجز زيارة.'),
    body: head(T('Services', 'الخدمات'), T('Every service, one trusted group', 'كل الخدمات، مجموعة واحدة موثوقة'), T('Search the full list, pick the service you need and request a quote or book a visit in a minute.', 'ابحث في القائمة الكاملة واختر الخدمة التي تحتاجها واطلب عرض سعر أو احجز زيارة خلال دقيقة.'), crumbs(svCrumbs)) + `<section class="sec"><div class="wrap">
  <div class="svc-tools reveal"><label class="search">${ic('search')}<input type="search" id="svc-q" placeholder="${T('Search services', 'ابحث في الخدمات')}" aria-label="${T('Search services', 'ابحث في الخدمات')}"></label>
  <div class="chips" role="group" aria-label="${T('Filter by company', 'تصفية حسب الشركة')}"><button type="button" class="chip on" data-f="all">${T('All', 'الكل')}</button>${D.map(d => `<button type="button" class="chip" data-f="${d.slug}">${x(d.short)}</button>`).join('')}</div></div>
  <p class="muted" id="svc-none" hidden>${T('No service matches your search. Call or WhatsApp us and we will help.', 'لا توجد خدمة مطابقة. اتصل بنا أو راسلنا على واتساب وسنساعدك.')}</p>
  ${D.map(d => `<div class="svc-group" data-g="${d.slug}"><h2 class="h3">${ic(d.icon)} <a href="${d.slug}.html">${x(d.name)}</a></h2><ul class="svc-cards">${d.services.map((sv, i) => `<li data-t="${x(sv).toLowerCase()}"><span>${x(sv)}</span><a class="link" href="booking.html?s=${d.slug}.${i}">${T('Book', 'احجز')} ${ic('arrow', 'ic xs')}</a></li>`).join('')}</ul></div>`).join('')}
</div></section>
<section class="sec alt"><div class="wrap"><div class="sec-head reveal"><p class="eyebrow">${T('Areas we serve', 'مناطق الخدمة')}</p><h2>${T('Across Dubai and the UAE', 'في أنحاء دبي والإمارات')}</h2></div>
<ul class="approvals reveal">${AREAS.map(a => `<li>${ic('pin')}${x(a)}</li>`).join('')}</ul></div></section>${cta()}` });

  // Booking: choose service, area, date and time, then send to WhatsApp or email
  const bkCrumbs = [['Home', 'index.html'], ['Book a visit', 'booking.html']];
  pages.push({ file: 'booking.html', active: 'booking.html', title: T('Book a Visit | Sajid Group of Companies, Dubai', 'احجز زيارة | مجموعة ساجد للشركات، دبي'),
    ld: ar ? [] : [crumbUrls(bkCrumbs)],
    desc: T(`Book a site visit or consultation with Sajid Group in Dubai. Pick the service, area, date and time, then confirm on WhatsApp. ${C.phones[0]}.`, 'احجز زيارة موقع أو استشارة مع مجموعة ساجد في دبي. اختر الخدمة والمنطقة والتاريخ والوقت ثم أكد عبر واتساب.'),
    body: head(T('Book a visit', 'احجز زيارة'), T('Book a site visit or consultation', 'احجز زيارة موقع أو استشارة'), T('Choose the service, area, date and time. We confirm by WhatsApp or phone.', 'اختر الخدمة والمنطقة والتاريخ والوقت. نؤكد الموعد عبر واتساب أو الهاتف.'), crumbs(bkCrumbs)) + `<section class="sec"><div class="wrap split top">
  <form class="form reveal" id="book" novalidate>
    <h2 class="h3">${T('Your booking', 'بيانات الحجز')}</h2>
    <label>${T('Your name', 'الاسم')}<input name="name" required autocomplete="name"></label>
    <label>${T('Phone', 'رقم الهاتف')}<input name="phone" type="tel" dir="ltr" required autocomplete="tel"></label>
    <label>${T('Service', 'الخدمة')}<select name="service">${D.map(d => `<optgroup label="${x(d.short)}">${d.services.map((sv, i) => `<option value="${d.slug}.${i}">${x(sv)}</option>`).join('')}</optgroup>`).join('')}</select></label>
    <label>${T('Area', 'المنطقة')}<select name="area">${AREAS.map(a => `<option>${x(a)}</option>`).join('')}</select></label>
    <label>${T('Preferred date', 'التاريخ المفضل')}<input name="date" type="date" dir="ltr"></label>
    <label>${T('Preferred time', 'الوقت المفضل')}<select name="time">${SLOTS.map(a => `<option>${x(a)}</option>`).join('')}</select></label>
    <label>${T('Details (optional)', 'تفاصيل (اختياري)')}<textarea name="msg" rows="3"></textarea></label>
    <p class="err" role="alert" hidden>${T('Please enter your name and phone number.', 'يرجى إدخال الاسم ورقم الهاتف.')}</p>
    <div class="btns"><button class="btn btn-gold" data-via="wa">${ic('wa')}${T('Confirm on WhatsApp', 'تأكيد عبر واتساب')}</button><button class="btn btn-line" data-via="mail">${ic('mail')}${T('Send by email', 'إرسال بالبريد')}</button></div>
  </form>
  <div class="reveal"><ul class="cards">
    <li>${ic('phone', 'ic lg')}<div><b>${T('Prefer to talk?', 'تفضل الاتصال؟')}</b><a href="${tel(C.phones[0])}">${num(C.phones[0])}</a> &middot; <a href="${W()}" target="_blank" rel="noopener">${x(S.whatsapp)}</a></div></li>
    <li>${ic('clock', 'ic lg')}<div><b>${T('Office hours', 'ساعات العمل')}</b><span>${x(C.hours)[0]}: ${x(C.hours)[1]}<br>${x(C.hours)[2]}: ${x(C.hours)[3]}</span><span class="open-badge" data-open hidden></span></div></li>
    <li>${ic('pin', 'ic lg')}<div><b>${T('Head office', 'المكتب الرئيسي')}</b><address>${addrLines('<br>')}</address></div></li>
  </ul></div>
</div></section>` });

  const nf = NOT_FOUND[L];
  pages.push({ file: '404.html', title: `${nf[0]} | ${x(S.full)}`, desc: nf[0], noindex: true,
    body: head('404', nf[0], nf[1]) + `<section class="sec"><div class="wrap"><a class="btn btn-gold" href="${ar ? '' : ''}index.html">${nf[2]}</a></div></section>` });

  const dir = ar ? path.join(OUT, 'ar') : OUT;
  fs.mkdirSync(dir, { recursive: true });
  for (const p of pages) fs.writeFileSync(path.join(dir, p.file), page(p).replace(/href="(\.\.\/|ar\/)?index\.html"/g, (m, pre) => `href="${pre || './'}"`));
  return pages.filter(p => p.file !== '404.html').map(p => url(p.file));
}

const urls = [...build('en'), ...build('ar')];
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(u => `<url><loc>${u}</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>`).join('')}</urlset>\n`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
console.log('Built', urls.length + 2, 'pages (en + ar)');
