document.documentElement.classList.add('js');
(() => {
  const b = document.querySelector('.burger'), n = document.getElementById('nav');
  if (b) b.addEventListener('click', () => { const o = n.classList.toggle('open'); b.setAttribute('aria-expanded', o); });
  const y = document.getElementById('yr'); if (y) y.textContent = new Date().getFullYear();

  const els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
    els.forEach(el => io.observe(el));
  } else els.forEach(el => el.classList.add('in'));

  // Quote and booking forms: send the details to WhatsApp or email (no server needed)
  const PH = '971528264786', MAIL = 'sajiid.group@gmail.com';
  const ar = document.documentElement.lang === 'ar';
  const sel = (f, n) => { const e = f.elements[n]; return e && e.selectedOptions ? e.selectedOptions[0].text : (e ? e.value : ''); };
  const wire = (f, isBook) => {
    f.addEventListener('click', e => {
      const btn = e.target.closest('button[data-via]'); if (!btn) return;
      e.preventDefault();
      const d = Object.fromEntries(new FormData(f)), err = f.querySelector('.err');
      if (!d.name.trim() || !d.phone.trim()) { err.hidden = false; return; }
      err.hidden = true;
      const service = sel(f, 'service');
      const lines = ar ? ['مرحباً مجموعة ساجد،', isBook ? 'أود حجز زيارة.' : '', `الاسم: ${d.name}`, `الهاتف: ${d.phone}`, `الخدمة: ${service}`] : ['Hello Sajid Group,', isBook ? 'I would like to book a visit.' : '', `Name: ${d.name}`, `Phone: ${d.phone}`, `Service: ${service}`];
      if (isBook) lines.push((ar ? 'المنطقة: ' : 'Area: ') + sel(f, 'area'), (ar ? 'التاريخ: ' : 'Date: ') + (d.date || '-'), (ar ? 'الوقت: ' : 'Time: ') + sel(f, 'time'));
      lines.push(d.msg || '');
      const text = lines.filter(Boolean).join('\n');
      if (btn.dataset.via === 'wa') window.open('https://wa.me/' + PH + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
      else location.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent((isBook ? (ar ? 'حجز زيارة: ' : 'Visit booking: ') : (ar ? 'طلب عرض سعر: ' : 'Quote request: ')) + service) + '&body=' + encodeURIComponent(text);
    });
  };
  const q = document.getElementById('quote'); if (q) wire(q, false);
  const bk = document.getElementById('book');
  if (bk) {
    wire(bk, true);
    const dt = bk.elements.date; if (dt) { const t = new Date(); dt.min = new Date(t - t.getTimezoneOffset() * 60000).toISOString().slice(0, 10); }
    const pre = new URLSearchParams(location.search).get('s'); if (pre && bk.elements.service) bk.elements.service.value = pre;
  }

  // Services page: search and filter by company
  const sq = document.getElementById('svc-q');
  if (sq) {
    let flt = 'all';
    const run = () => {
      const t = sq.value.trim().toLowerCase(); let any = false;
      document.querySelectorAll('.svc-group').forEach(g => {
        let n = 0;
        g.querySelectorAll('li').forEach(li => { const ok = (flt === 'all' || g.dataset.g === flt) && li.dataset.t.includes(t); li.hidden = !ok; if (ok) n++; });
        g.hidden = !n; if (n) any = true;
      });
      document.getElementById('svc-none').hidden = any;
    };
    sq.addEventListener('input', run);
    document.querySelector('.chips').addEventListener('click', e => {
      const c = e.target.closest('.chip'); if (!c) return;
      document.querySelectorAll('.chip').forEach(x => x.classList.toggle('on', x === c)); flt = c.dataset.f; run();
    });
  }
})();
