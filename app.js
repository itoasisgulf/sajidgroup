document.documentElement.classList.add('js');
(() => {
  const b = document.querySelector('.burger'), n = document.getElementById('nav');
  if (b) b.addEventListener('click', () => { const o = n.classList.toggle('open'); b.setAttribute('aria-expanded', o); });
  const y = document.getElementById('yr'); if (y) y.textContent = new Date().getFullYear();

  const root = document.documentElement, ar0 = root.lang === 'ar';
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Light / dark switch (light is the default; the choice is remembered on this device)
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

  // Header shrink, reading progress, back to top.
  // Layout is measured only on resize / body size change / load (never in the scroll path); writes happen only when a value changes.
  const hdr = document.querySelector('.hdr'), bar = document.querySelector('.progress');
  const top = document.querySelector('.to-top');
  let ticking = false, maxY = 0, hs = false, ts = false, lastP = -1, lastB = -1;
  const paint = () => {
    ticking = false;
    const y = window.scrollY, f = maxY > 0 ? Math.min(1, Math.max(0, y / maxY)) : 0;
    const s = y > 20; if (hdr && s !== hs) { hs = s; hdr.classList.toggle('scrolled', s); }
    const t = y > 600; if (top && t !== ts) { ts = t; top.classList.toggle('show', t); }
    const pb = Math.round(f * 1000) / 1000; if (bar && pb !== lastB) { lastB = pb; bar.style.transform = 'scaleX(' + pb + ')'; }
    const pp = Math.round(f * 200) / 200; if (top && ts && pp !== lastP) { lastP = pp; top.style.setProperty('--p', pp); }
  };
  const queue = () => { if (!ticking) { ticking = true; requestAnimationFrame(paint); } };
  const measure = () => { maxY = Math.max(0, root.scrollHeight - innerHeight); lastP = -1; queue(); };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', measure, { passive: true });
  addEventListener('load', measure);
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(document.body); else measure();
  queue();
  if (top) top.addEventListener('click', () => scrollTo({ top: 0, behavior: still ? 'auto' : 'smooth' }));

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
    let lock = 0, arr = null;
    const go = i => {
      const n = (i + cards.length) % cards.length, moved = n !== front;
      front = n; lay();
      if (moved) {                                   // the arriving card lifts in an arc while it slides over the old front card
        lock = Date.now() + 1100; clearTimeout(arr);
        cards.forEach(c => c.classList.remove('arrive'));
        void cards[n].offsetWidth; cards[n].classList.add('arrive');
        arr = setTimeout(() => cards[n].classList.remove('arrive'), 1200);
      }
    };
    let dead = false, vis = true;
    const pause = () => { clearInterval(auto); auto = null; };
    const halt = () => { dead = true; pause(); };
    const run = () => { if (!auto && !dead && vis && !document.hidden) auto = setInterval(() => go(front + 1), 4200); };
    cards.forEach((c, i) => c.addEventListener('click', e => { if (!c.classList.contains('p0')) { e.preventDefault(); halt(); go(i); } }));
    dots.forEach(d => d.addEventListener('click', () => { halt(); go(+d.dataset.go); }));
    // Hover intent (mouse only): a card behind comes forward slowly if the pointer rests on it
    const finePtr = matchMedia('(hover: hover) and (pointer: fine)');
    cards.forEach((c, i) => {
      let t = null;
      const cancel = () => { clearTimeout(t); t = null; };
      const arm = e => {
        if (t || e.pointerType === 'touch' || !finePtr.matches || c.classList.contains('p0') || !(c.classList.contains('p1') || c.classList.contains('p2'))) return;
        if (!e.movementX && !e.movementY) return;                       // only real pointer movement counts (cards sliding under a still mouse do not)
        if (Date.now() < lock) return;
        t = setTimeout(() => {
          t = null;
          if (c.matches(':hover') && !c.classList.contains('p0')) { halt(); go(i); }
        }, 220);
      };
      c.addEventListener('pointermove', arm);
      c.addEventListener('pointerleave', cancel);
    });
    lay();
    if (!still) {
      run(); deck.addEventListener('pointerenter', halt, { once: true });
      // the shuffle only ticks while the deck is on screen and the tab is visible
      if ('IntersectionObserver' in window) new IntersectionObserver(es => { vis = es[es.length - 1].isIntersecting; vis ? run() : pause(); }).observe(deck);
      document.addEventListener('visibilitychange', () => document.hidden ? pause() : run());
    }
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
    addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; if (addBtn) addBtn.hidden = false; if (andSteps) andSteps.hidden = true; const c = tip.querySelector('.tip-chrome'), o = tip.querySelector('.tip-or'); if (c) c.hidden = true; if (o) o.hidden = true; });
    if (addBtn) addBtn.addEventListener('click', async () => { if (!deferred) return; const d = deferred; deferred = null; tip.hidden = true; d.prompt(); try { await d.userChoice; } catch (e) {} });
    addEventListener('appinstalled', () => { deferred = null; inst.forEach(b => { b.hidden = true; }); });
    inst.forEach(b => b.addEventListener('click', async () => {
      if (deferred) { const d = deferred; deferred = null; d.prompt(); try { await d.userChoice; } catch (e) {} }
      else openTip();
    }));
    tip.addEventListener('click', e => { if (e.target === tip || e.target.closest('.ios-x')) tip.hidden = true; });
    addEventListener('keydown', e => { if (e.key === 'Escape') tip.hidden = true; });
    // Android without the pop-up (for example inside WhatsApp or Instagram): offer to reopen the page in Chrome, where it works
    const chrome = tip.querySelector('.tip-chrome'), orTxt = tip.querySelector('.tip-or');
    if (android && chrome) {
      chrome.href = 'intent://' + location.host + location.pathname + '?add=1#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=' + encodeURIComponent(location.origin + location.pathname + '?add=1') + ';end';
      const syncChrome = () => { const need = !deferred; chrome.hidden = !need; if (orTxt) orTxt.hidden = !need; };
      syncChrome(); addEventListener('beforeinstallprompt', syncChrome);
    }
    if (location.hash === '#add-to-home' || new URLSearchParams(location.search).get('add') === '1') openTip();
  }

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
      document.querySelectorAll('.svc-cards').forEach(u => u.classList.add('svc-f'));
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

// Instant page-to-page navigation: prefetch a same-site page when the pointer rests on its link (or on press, touch, focus),
// so the click lands on an already fetched document. Nothing is fetched for external links, downloads or slow connections.
(() => {
  const l = document.createElement('link');
  if (!l.relList || !l.relList.supports || !l.relList.supports('prefetch')) return;
  const cn = navigator.connection; if (cn && (cn.saveData || /(^|-)2g$/.test(cn.effectiveType || ''))) return;
  const seen = new Set([location.pathname + location.search]); let timer = 0;
  const go = e => {
    const a = e.target && e.target.closest && e.target.closest('a[href]');
    if (!a || a.target || a.hasAttribute('download') || !/^https?:$/.test(a.protocol) || a.origin !== location.origin) return;
    if (/\.(pdf|zip|png|jpe?g|webp|svg|ico|webmanifest|xml|txt)$/i.test(a.pathname)) return;
    const k = a.pathname + a.search; if (seen.has(k)) return; seen.add(k);
    const p = document.createElement('link'); p.rel = 'prefetch'; p.as = 'document'; p.href = a.origin + k; document.head.appendChild(p);
  };
  document.addEventListener('pointerover', e => { if (e.pointerType === 'touch') return; clearTimeout(timer); timer = setTimeout(() => go(e), 60); }, { passive: true });
  document.addEventListener('pointerout', () => clearTimeout(timer), { passive: true });
  document.addEventListener('pointerdown', go, { passive: true });
  document.addEventListener('touchstart', go, { passive: true });
  document.addEventListener('focusin', go);
})();
