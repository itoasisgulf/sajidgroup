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

  const f = document.getElementById('quote');
  if (f) f.addEventListener('click', e => {
    const btn = e.target.closest('button[data-via]'); if (!btn) return;
    e.preventDefault();
    const d = Object.fromEntries(new FormData(f)), err = f.querySelector('.err');
    if (!d.name.trim() || !d.phone.trim()) { err.hidden = false; return; }
    err.hidden = true;
    const ar = document.documentElement.lang === 'ar';
    const text = ar ? `مرحباً مجموعة ساجد،\nالاسم: ${d.name}\nالهاتف: ${d.phone}\nالخدمة: ${d.service}\n${d.msg}` : `Hello Sajid Group,\nName: ${d.name}\nPhone: ${d.phone}\nService: ${d.service}\n${d.msg}`;
    const url = btn.dataset.via === 'wa'
      ? 'https://wa.me/971528264786?text=' + encodeURIComponent(text)
      : 'mailto:sajiid.group@gmail.com?subject=' + encodeURIComponent((ar ? 'طلب عرض سعر: ' : 'Quote request: ') + d.service) + '&body=' + encodeURIComponent(text);
    window.open(url, btn.dataset.via === 'wa' ? '_blank' : '_self');
  });
})();
