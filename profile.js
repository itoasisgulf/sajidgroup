// Builds a single self-contained HTML company profile (images embedded) for sharing.
// Usage: node profile.js  ->  outputs/sajid_group_profile.html
const fs = require('fs');
const path = require('path');
const src = fs.readFileSync(path.join(__dirname, 'build.js'), 'utf8');
const data = src.slice(0, src.indexOf('function build('));
const { C, D, APPROVALS, WHY, ic } = new Function('require', '__dirname', data + 'return { C, D, APPROVALS, WHY, ic };')(require, __dirname);

const img = f => {
  const p = path.join(__dirname, 'assets/img', f);
  const ext = path.extname(f).slice(1).replace('jpg', 'jpeg');
  return `data:image/${ext};base64,${fs.readFileSync(p).toString('base64')}`;
};
const x = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const cos = D.map((d, i) => `
<article class="co">
  <div class="co-media">${d.img ? `<img src="${img(d.img)}" alt="${x(d.name.en)}">` : `<div class="co-logo"><img src="${img(d.logo || 'itoasis.png')}" alt="${x(d.name.en)}"></div>`}</div>
  <div class="co-body">
    <p class="co-n">${String(i + 1).padStart(2, '0')}</p>
    <h3>${x(d.name.en)}</h3>
    <p class="co-ar" dir="rtl" lang="ar">${x(d.name.ar)}</p>
    <p class="co-tag">${x(d.tag.en)}</p>
    <p>${x(d.intro.en)}</p>
    <ul>${d.services.map(s => `<li>${x(s[0])}</li>`).join('')}</ul>
    ${d.ext ? `<p class="co-link">${x(d.ext.replace(/^https?:\/\//, ''))}</p>` : ''}
  </div>
</article>`).join('');

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Sajid Group of Companies | Company Profile</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:wght@600;700&family=Inter:wght@400;500;600;700&family=Tajawal:wght@500&display=swap" rel="stylesheet">
<style>
:root{--bg:#0b0b0c;--card:#141416;--gold:#d4af37;--gold2:#f3d77a;--gold3:#a8842a;--txt:#e9e4da;--mut:#a39d92;--grad:linear-gradient(135deg,#f6e27a,#d4af37 45%,#a8842a)}
*{box-sizing:border-box;margin:0;padding:0}
body{background:#050505;color:var(--txt);font:400 15px/1.65 Inter,system-ui,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{max-width:1000px;margin:0 auto 28px;background:var(--bg);border:1px solid rgba(212,175,55,.35);border-radius:14px;padding:56px 60px;position:relative;overflow:hidden}
h2{font:700 2.2rem/1.15 "Cormorant Garamond",serif;color:#fff;margin-bottom:1rem}
h3{font:700 1.45rem/1.2 "Cormorant Garamond",serif;color:#fff}
.eyebrow{font:600 .72rem/1.4 Inter;letter-spacing:.24em;text-transform:uppercase;color:var(--gold);margin-bottom:.7rem}
.gold{background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent}
.ic{width:22px;height:22px}
/* cover */
.cover{min-height:640px;background:radial-gradient(ellipse at 80% 10%,rgba(212,175,55,.16),transparent 55%),#050505;display:flex;flex-direction:column;justify-content:center}
.cover .sky{position:absolute;right:0;bottom:0;width:78%;mix-blend-mode:screen}
.cover-in{position:relative}
.cover .logo{width:120px;height:120px;margin-bottom:28px}
.script{display:block;font:400 5.6rem/1 "Great Vibes",cursive;word-spacing:.12em;padding:.08em .1em 0 0}
.caps{display:block;font:500 1.35rem/1.2 Inter;letter-spacing:.42em;text-transform:uppercase;color:var(--gold2);margin:.4rem 0 1rem .2em}
.tagline{display:inline-block;border-top:1px solid rgba(212,175,55,.5);padding-top:.8rem;font:500 .8rem Inter;letter-spacing:.28em;color:var(--gold)}
.cover .meta{margin-top:2.2rem;color:var(--mut);font-size:.9rem;max-width:420px}
/* about */
.split{display:grid;grid-template-columns:1.25fr 1fr;gap:44px;align-items:start}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:1.6rem}
.stats div{border:1px solid rgba(212,175,55,.3);border-radius:12px;padding:16px;background:var(--card)}
.stats b{display:block;font:700 2rem/1 "Cormorant Garamond",serif;color:var(--gold2)}
.stats span{font-size:.82rem;color:var(--mut)}
.ceo{text-align:center;background:var(--card);border:1px solid rgba(212,175,55,.3);border-radius:14px;padding:26px}
.ceo img{width:190px;aspect-ratio:435/560;object-fit:cover;border-radius:12px;border:2px solid var(--gold3)}
.ceo h3{margin-top:14px}.ceo .eyebrow{margin:.3rem 0 .8rem}.ceo q{color:#cfc9bf;font-style:italic;font-size:.92rem}
p+p{margin-top:.8rem}
/* companies */
.co{display:grid;grid-template-columns:260px 1fr;gap:28px;padding:26px 0;border-top:1px solid rgba(212,175,55,.2);break-inside:avoid}
.co:first-of-type{border-top:0}
.co-media img{width:100%;height:220px;object-fit:cover;border-radius:12px;border:1px solid rgba(212,175,55,.3)}
.co-logo{height:220px;border-radius:12px;background:#fff;display:grid;place-items:center;padding:24px}
.co-logo img{width:100%;height:auto;border:0;object-fit:contain}
.co-n{font:700 .8rem Inter;color:var(--gold);letter-spacing:.2em}
.co-ar{font:500 1rem Tajawal,sans-serif;color:var(--mut);margin:.1rem 0 .3rem;text-align:left}
.co-tag{color:var(--gold2);font-weight:600;font-size:.9rem;margin-bottom:.5rem}
.co ul{display:flex;flex-wrap:wrap;gap:6px;list-style:none;margin-top:.8rem}
.co li{font-size:.76rem;border:1px solid rgba(212,175,55,.3);border-radius:999px;padding:3px 10px;color:#d6d0c6}
.co-link{margin-top:.8rem;color:var(--gold2);font-weight:600}
/* why */
.why{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin:1.2rem 0 2.4rem}
.why div{background:var(--card);border:1px solid rgba(212,175,55,.25);border-radius:12px;padding:18px}
.why .ic{color:var(--gold2);margin-bottom:8px}.why b{display:block;color:#fff;margin-bottom:4px}.why span{font-size:.84rem;color:var(--mut)}
.appr{display:flex;flex-wrap:wrap;gap:8px;margin-top:.8rem}
.appr li{list-style:none;border:1px solid rgba(212,175,55,.35);border-radius:8px;padding:8px 14px;font-size:.86rem;background:var(--card)}
/* contact */
.contact{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:1.2rem}
.contact div{display:flex;gap:14px;align-items:center;background:var(--card);border:1px solid rgba(212,175,55,.25);border-radius:12px;padding:16px}
.contact .ring{flex:none;display:grid;place-items:center;width:46px;height:46px;border-radius:50%;border:2px solid var(--gold);color:var(--gold2)}
.contact a{color:var(--txt);text-decoration:none}
.foot{margin-top:2.2rem;padding-top:1rem;border-top:1px solid rgba(212,175,55,.2);font-size:.8rem;color:var(--mut);display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}
@media (max-width:760px){.page{padding:34px 22px;border-radius:0;margin-bottom:14px}.script{font-size:3.6rem}.caps{font-size:1rem}.cover .sky{width:120%}.split,.co,.contact{grid-template-columns:1fr}.why,.stats{grid-template-columns:1fr 1fr}.cover{min-height:560px}}
@page{size:A4;margin:0}
@media print{body{background:var(--bg)}.page{max-width:none;border:0;border-radius:0;margin:0;min-height:100vh;break-after:page}}
</style></head><body>

<section class="page cover">
  <img class="sky" src="${img('hero-skyline.webp')}" alt="">
  <div class="cover-in">
    <img class="logo" src="${img('sg-logo.png')}" alt="Sajid Group logo">
    <h1><span class="script gold">Sajid Group</span><span class="caps">of Companies</span></h1>
    <p class="tagline">PEOPLE &nbsp;|&nbsp; SOLUTIONS &nbsp;|&nbsp; SUSTAINABILITY</p>
    <p class="meta">Company Profile<br>Dubai, United Arab Emirates</p>
  </div>
</section>

<section class="page">
  <div>
    <div>
      <p class="eyebrow">About the group</p>
      <h2>A diversified group serving <span class="gold">Dubai and the UAE</span></h2>
      <p>Sajid Group of Companies serves residential, commercial and corporate clients across Dubai and the UAE. Each company in the group holds its own trade licence and name, backed by one trusted management team.</p>
      <p>Our mission is simple: deliver dependable services that help clients improve properties, grow businesses and maintain safe, comfortable spaces.</p>
      <div class="stats"><div><b>6</b><span>Specialist companies</span></div><div><b>60+</b><span>Services under one roof</span></div><div><b>6</b><span>Authority approvals</span></div><div><b>1</b><span>Point of contact</span></div></div>
    </div>
  </div>
</section>

<section class="page">
  <p class="eyebrow">Our companies</p>
  <h2>Specialist services. <span class="gold">One trusted group.</span></h2>
  ${cos}
</section>

<section class="page">
  <p class="eyebrow">Why choose us</p>
  <h2>Built on <span class="gold">people, solutions and sustainability</span></h2>
  <div class="why">${WHY.map(w => `<div>${ic(w[0])}<b>${x(w[1][0])}</b><span>${x(w[2][0])}</span></div>`).join('')}</div>
  <p class="eyebrow">Approvals and authorities we work with</p>
  <ul class="appr">${APPROVALS.map(a => `<li>${x(a[0])}</li>`).join('')}</ul>

  <p class="eyebrow" style="margin-top:2.6rem">Contact us</p>
  <h2>Let's work <span class="gold">together</span></h2>
  <div class="contact">
    ${C.phones.map(p => `<div><span class="ring">${ic('wa')}</span><a href="https://wa.me/${p.replace(/\D/g, '')}">${p}</a></div>`).join('')}
    <div><span class="ring">${ic('mail')}</span><a href="mailto:${C.email}">${C.email}</a></div>
    <div><span class="ring">${ic('pin')}</span><span>${x(C.addr.en)}</span></div>
  </div>
  <div class="foot"><span>Sajid Group of Companies, Dubai, UAE &nbsp;|&nbsp; sajidgroup.com</span><span>IT partner: itoasisgulf.com</span></div>
</section>
</body></html>`;

fs.mkdirSync(path.join(__dirname, 'outputs'), { recursive: true });
const out = path.join(__dirname, 'outputs', 'sajid_group_profile.html');
fs.writeFileSync(out, html);
console.log('Wrote', out, Math.round(html.length / 1024) + ' KB');
