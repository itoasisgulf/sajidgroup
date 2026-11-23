document.documentElement.classList.add('js');
(() => {
  const b = document.querySelector('.burger'), n = document.getElementById('nav');
  if (b) b.addEventListener('click', () => { const o = n.classList.toggle('open'); b.setAttribute('aria-expanded', o); });
  const y = document.getElementById('yr'); if (y) y.textContent = new Date().getFullYear();

  const root = document.documentElement, ar0 = root.lang === 'ar';
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Light / dark switch (dark is the default; the choice is remembered on this device)
  const tt = document.querySelector('.theme-t');
  const meta = document.querySelector('meta[name="theme-color"]');
  const setTheme = t => {
    root.setAttribute('data-theme', t);
    if (tt) tt.setAttribute('aria-pressed', t === 'light');
    if (meta) meta.content = t === 'light' ? '#faf7f0' : '#0b0b0c';
  };
  setTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  if (tt) tt.addEventListener('click', () => {
    const t = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    setTheme(t); try { localStorage.setItem('sg-theme', t); } catch (e) {}
  });

  // Header shrink, reading progress, back to top, hero skyline drift
  const hdr = document.querySelector('.hdr'), bar = document.querySelector('.progress');
  const top = document.querySelector('.to-top'), sky = document.querySelector('.hero-sky');
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
    if (hdr) hdr.classList.toggle('scrolled', y > 20);
    if (bar) bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, y / h) : 0) + ')';
    if (top) top.classList.toggle('show', y > 600);
    if (sky && !still && y < 900) sky.style.transform = 'translateY(' + (y * 0.12).toFixed(1) + 'px)' + (ar0 ? ' scaleX(-1)' : '');
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  if (top) top.addEventListener('click', () => scrollTo({ top: 0, behavior: still ? 'auto' : 'smooth' }));

  // Cursor spotlight on cards
  document.addEventListener('pointermove', e => {
    const c = e.target.closest && e.target.closest('.co,.why,.stats div,.svc-cards li,.cards li'); if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });

  // Count-up for the numbers on the home page
  const countUp = el => {
    if (el.dataset.counted) return; el.dataset.counted = 1;
    const m = el.textContent.trim().match(/^(\d+)(.*)$/); if (!m || still) return;
    const end = +m[1], suf = m[2], t0 = performance.now(), dur = 1200;
    const step = t => { const p = Math.min(1, (t - t0) / dur); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(step); };
    el.textContent = '0' + suf; requestAnimationFrame(step);
  };

  // Open now / closed badge (Dubai time, Monday to Saturday 9 AM to 8 PM)
  const badges = document.querySelectorAll('[data-open]');
  if (badges.length) {
    const upd = () => {
      let d, h;
      try {
        const p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Dubai', weekday: 'short', hour: 'numeric', hour12: false }).formatToParts(new Date());
        d = p.find(x => x.type === 'weekday').value; h = +p.find(x => x.type === 'hour').value % 24;
      } catch (e) { return; }
      const open = d !== 'Sun' && h >= 9 && h < 20;
      const txt = open ? (ar0 ? 'مفتوح الآن · يغلق 8:00 مساءً' : 'Open now · closes 8:00 PM')
        : (ar0 ? 'مغلق الآن · ' + (d === 'Sat' && h >= 20 ? 'يفتح الاثنين 9:00 صباحاً' : (d === 'Sun' ? 'يفتح غداً 9:00 صباحاً' : (h < 9 ? 'يفتح 9:00 صباحاً' : 'يفتح غداً 9:00 صباحاً')))
               : 'Closed now · opens ' + (d === 'Sat' && h >= 20 ? 'Monday 9:00 AM' : (d === 'Sun' ? 'tomorrow 9:00 AM' : (h < 9 ? 'today 9:00 AM' : 'tomorrow 9:00 AM'))));
      badges.forEach(b => { b.textContent = txt; b.classList.toggle('is-open', open); b.classList.toggle('is-closed', !open); b.hidden = false; });
    };
    upd(); setInterval(upd, 60000);
  }

  // Stagger: items revealed together come in one after another
  document.querySelectorAll('.grid3,.grid4,.stats,.svc-cards,.faq,.cards').forEach(g => {
    [...g.children].forEach((c, i) => { if (c.classList.contains('reveal')) c.style.transitionDelay = Math.min(i, 8) * 70 + 'ms'; });
  });

  // Company showcase: tabs that switch automatically until the visitor picks one
  const tabs = [...document.querySelectorAll('.show-tab')];
  if (tabs.length) {
    let cur = 0, timer = null;
    const show = (i, focus) => {
      cur = (i + tabs.length) % tabs.length;
      tabs.forEach((t, j) => {
        const on = j === cur; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; t.classList.remove('playing');
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tabs[cur].focus();
      if (timer) { void tabs[cur].offsetWidth; tabs[cur].classList.add('playing'); }
      const box = tabs[cur].parentElement; if (box.scrollWidth > box.clientWidth) box.scrollTo({ left: tabs[cur].offsetLeft - 16, behavior: still ? 'auto' : 'smooth' });
    };
    const stop = () => { clearInterval(timer); timer = null; tabs.forEach(t => t.classList.remove('playing')); };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => { stop(); show(i); });
      t.addEventListener('keydown', e => {
        const k = e.key, rtl = ar0; let d = 0;
        if (k === 'ArrowDown' || k === (rtl ? 'ArrowLeft' : 'ArrowRight')) d = 1;
        if (k === 'ArrowUp' || k === (rtl ? 'ArrowRight' : 'ArrowLeft')) d = -1;
        if (d) { e.preventDefault(); stop(); show(cur + d, true); }
      });
    });
    const wrap = document.querySelector('.show-in');
    if (!still && 'IntersectionObserver' in window) {
      new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting && timer === null && !wrap.dataset.touched) { timer = setInterval(() => show(cur + 1), 7000); show(cur); }
        else if (!e.isIntersecting && timer) stop();
      }), { threshold: .4 }).observe(wrap);
      wrap.addEventListener('pointerdown', () => { wrap.dataset.touched = 1; stop(); });
    }
  }

  // Hero quick request: the chosen company sets the WhatsApp quote link; Book goes to the booking form
  const qc = document.getElementById('qcard');
  if (qc) qc.addEventListener('change', e => { const r = e.target; if (r.name === 's' && r.dataset.wa) document.getElementById('q-quote').href = r.dataset.wa; });

  // Hero company deck: front card plus two behind; shuffles until the visitor interacts
  const deck = document.querySelector('[data-deck]');
  if (deck) {
    const cards = [...deck.querySelectorAll('.dcard')], dots = [...deck.querySelectorAll('[data-go]')];
    let front = 0, auto = null;
    const lay = () => {
      cards.forEach((c, i) => {
        const k = (i - front + cards.length) % cards.length;
        c.classList.remove('p0', 'p1', 'p2');
        if (k < 3) c.classList.add('p' + k);
        c.setAttribute('aria-hidden', k === 0 ? 'false' : 'true');
        c.querySelectorAll('a').forEach(a => { a.tabIndex = k === 0 ? 0 : -1; });
      });
      dots.forEach((d, i) => d.setAttribute('aria-selected', i === front));
    };
    const go = i => { front = (i + cards.length) % cards.length; lay(); };
    const halt = () => { clearInterval(auto); auto = null; };
    cards.forEach((c, i) => c.addEventListener('click', e => { if (!c.classList.contains('p0')) { e.preventDefault(); halt(); go(i); } }));
    dots.forEach(d => d.addEventListener('click', () => { halt(); go(+d.dataset.go); }));
    lay();
    if (!still) { auto = setInterval(() => go(front + 1), 4200); deck.addEventListener('pointerenter', halt, { once: true }); }
  }

  // Home screen shortcut. Android: the phone's own one-tap "Add" pop-up when the browser offers it.
  // iPhone (Apple allows no automatic adding) and any browser without the pop-up: a short step-by-step guide.
  const inst = [...document.querySelectorAll('[data-install]')], tip = document.getElementById('ios-tip');
  const ua = navigator.userAgent, ios = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1), android = /android/i.test(ua);
  const added = matchMedia('(display-mode: minimal-ui)').matches || matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  let deferred = null;
  const openTip = () => { if (!tip) return; tip.hidden = false; tip.querySelector('.ios-x').focus(); };
  if ((ios || android) && tip && !added) {
    inst.forEach(b => { b.hidden = false; });
    tip.querySelector('[data-os="ios"]').hidden = !ios; tip.querySelector('[data-os="android"]').hidden = !android;
    const addBtn = tip.querySelector('.tip-add'), andSteps = tip.querySelector('[data-os="android"]');
    addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; if (addBtn) addBtn.hidden = false; if (andSteps) andSteps.hidden = true; });
    if (addBtn) addBtn.addEventListener('click', async () => { if (!deferred) return; const d = deferred; deferred = null; tip.hidden = true; d.prompt(); try { await d.userChoice; } catch (e) {} });
    addEventListener('appinstalled', () => { deferred = null; inst.forEach(b => { b.hidden = true; }); });
    inst.forEach(b => b.addEventListener('click', async () => {
      if (deferred) { const d = deferred; deferred = null; d.prompt(); try { await d.userChoice; } catch (e) {} }
      else openTip();
    }));
    tip.addEventListener('click', e => { if (e.target === tip || e.target.closest('.ios-x')) tip.hidden = true; });
    addEventListener('keydown', e => { if (e.key === 'Escape') tip.hidden = true; });
    if (location.hash === '#add-to-home') openTip();
  }

  const els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { const t = e.target; t.classList.add('in'); setTimeout(() => { t.style.transitionDelay = ''; }, 1100); if (t.matches('.stats')) t.querySelectorAll('b').forEach(countUp); io.unobserve(e.target); } }), { threshold: .12 });
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
