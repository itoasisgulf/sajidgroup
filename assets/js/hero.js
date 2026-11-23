/* Home hero: letter split, gold dust canvas, pointer + scroll parallax. No dependencies. */
(function () {
  'use strict';
  var hero = document.querySelector('[data-hx]');
  if (!hero) return;
  var mqR = matchMedia('(prefers-reduced-motion: reduce)'), mqF = matchMedia('(hover: hover) and (pointer: fine)');
  var R = mqR.matches;
  var q = function (s) { return hero.querySelector(s); };
  var big = q('.hx-big'), sky = q('.hero-sky'), cv = q('.hx-dust'), beams = q('.hx-beams'), spot = q('.hx-spot'), grid = q('.hero-grid'), copy = q('.hero-copy');
  var hw = 1, hh = 1, top0 = 0, left0 = 0;

  /* 1. title: split into letters (Arabic: whole words, to keep joining). textContent stays identical. */
  function split() {
    if (!big || big.classList.contains('hx-split')) return;
    var txt = big.textContent, ar = /[؀-ۿ]/.test(txt), i = 0;
    big.textContent = '';
    txt.split(/(\s+)/).forEach(function (p) {
      if (!p) return;
      if (/^\s+$/.test(p)) { big.appendChild(document.createTextNode(p)); return; }
      var w = document.createElement('span');
      w.className = 'hx-w';
      (ar ? [p] : Array.from(p)).forEach(function (c) {
        var l = document.createElement('span');
        l.className = 'hx-l';
        l.textContent = c;
        l.style.setProperty('--hx-i', i++);
        w.appendChild(l);
      });
      big.appendChild(w);
    });
    big.classList.add('hx-split');
  }
  /* each letter paints its slice of one shared gradient, so the shimmer sweeps across the whole word */
  function measure() {
    if (!big) return;
    var ls = big.querySelectorAll('.hx-l'), xs = [], k;
    var w = big.offsetWidth;
    for (k = 0; k < ls.length; k++) xs.push(ls[k].offsetLeft);
    big.style.setProperty('--hx-w', w + 'px');
    for (k = 0; k < ls.length; k++) ls[k].style.setProperty('--hx-x', xs[k] + 'px');
  }
  split();
  measure();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);

  /* 2. gold dust */
  var ctx = cv && cv.getContext && cv.getContext('2d'), P = [], W = 1, H = 1, dpr = 1, spr = null;
  function sprite() {
    var s = document.createElement('canvas'), c, g;
    s.width = s.height = 64;
    c = s.getContext('2d');
    g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,244,200,1)');
    g.addColorStop(.22, 'rgba(243,205,107,.6)');
    g.addColorStop(1, 'rgba(243,205,107,0)');
    c.fillStyle = g;
    c.fillRect(0, 0, 64, 64);
    return s;
  }
  function want() { return R ? 15 : (innerWidth < 700 ? 25 : 60); }
  function fill() {
    var n = want(), r = Math.random;
    while (P.length > n) P.pop();
    while (P.length < n) P.push({ x: r() * W, y: r() * H, s: 2 + r() * 5, v: .008 + r() * .016, am: 6 + r() * 14, sf: .0003 + r() * .0007, tw: .0012 + r() * .002, ph: r() * 6.28, a: .35 + r() * .6 });
  }
  function drawFinal() {
    if (!ctx) return;
    if (!spr) spr = sprite();
    cal = 0;
    draw(tv, 0);
  }
  function size() {
    var rc = hero.getBoundingClientRect();
    hw = rc.width; hh = rc.height; top0 = rc.top + scrollY; left0 = rc.left;
    if (!ctx) return;
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = hw + 48; H = hh + 48;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    fill();
    if (settled) drawFinal();
  }
  /* settle: full motion for 20s, then ease down over 4s to a few faint still sparkles, then the loop stops */
  var SETTLE_AT = 20000, SETTLE_FOR = 4000, FEW = 6, t0 = 0, tv = 0, settled = false, cal = 1;
  function calm(ts) {
    var u = (ts - t0 - SETTLE_AT) / SETTLE_FOR;
    if (u <= 0) return 1;
    if (u >= 1) return 0;
    return 1 - u * u * (3 - 2 * u);
  }
  function draw(t, dt) {
    var k = (R ? .12 : 1) * cal, i, p, x, a, s, fa;
    tv += dt * cal;
    t = tv;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    for (i = 0; i < P.length; i++) {
      p = P[i];
      p.y -= p.v * dt * k;
      if (p.y < -20) { p.y = H + 20; p.x = Math.random() * W; }
      if (cal < 1 && i >= FEW && cal === 0) continue;
      fa = i < FEW ? .35 + .65 * cal : cal;
      x = p.x + Math.sin(t * p.sf * (R ? .3 : 1) + p.ph) * p.am;
      a = p.a * (.5 + .5 * Math.sin(t * p.tw + p.ph * 2));
      s = p.s * 3.2;
      ctx.globalAlpha = a * fa * Math.min(1, (H - p.y) / 80, (p.y + 20) / 60 + .2);
      ctx.drawImage(spr, x - s / 2, p.y - s / 2, s, s);
    }
    ctx.globalAlpha = 1;
  }

  /* 3. pointer + scroll state, one rAF loop that only runs while the hero is on screen */
  var tx = 0, ty = 0, cx = 0, cy = 0, mx = 0, my = 0, tmx = 0, tmy = 0, ys = scrollY, sc = scrollY, vis = true, run = false, last = 0, sdirty = true;
  var set = function (el, a, b, ux, uy) { if (el) { el.style.setProperty(a, ux); el.style.setProperty(b, uy); } };
  function apply() {
    var p = Math.min(1, Math.max(0, sc / (hh * .75))), px = function (v) { return v.toFixed(2) + 'px'; };
    hero.style.setProperty('--hx-p', p.toFixed(3));
    if (copy) copy.style.setProperty('--hx-co', (1 - .7 * p).toFixed(3));
    if (R) return;
    set(sky, '--hx-sx', '--hx-sy', px(-cx * 7), px(-cy * 5 + sc * .14));
    set(cv, '--hx-dx', '--hx-dy', px(-cx * 14), px(-cy * 10));
    set(beams, '--hx-bx', '--hx-by', px(-cx * 22), px(-cy * 14));
    if (grid) grid.style.setProperty('--hx-cy', px(-40 * p));
    set(spot, '--hx-mx', '--hx-my', px(mx), px(my));
  }
  function tick(ts) {
    var dt = Math.min(50, ts - (last || ts)), t, k;
    last = ts;
    if (!vis || document.hidden) { run = false; return; }
    if (!t0) t0 = ts;
    var animating = !!(cv && ctx) && !settled;
    if (animating) {
      if (!spr) spr = sprite();
      cal = calm(ts);
      if (cal === 0) { settled = true; animating = false; drawFinal(); }
      else draw(ts, dt);
    }
    k = 1 - Math.exp(-dt / 240);
    cx += (tx - cx) * k; cy += (ty - cy) * k;
    mx += (tmx - mx) * (1 - Math.exp(-dt / 140)); my += (tmy - my) * (1 - Math.exp(-dt / 140));
    sc += (ys - sc) * (1 - Math.exp(-dt / 120));
    if (Math.abs(ys - sc) < .1) sc = ys;
    t = Math.abs(tx - cx) + Math.abs(ty - cy) + Math.abs(tmx - mx) + Math.abs(tmy - my) + Math.abs(ys - sc);
    if (t > .002 || sdirty) { apply(); sdirty = t > .002; }
    if (!animating && t <= .002 && !sdirty) { run = false; return; }
    requestAnimationFrame(tick);
  }
  function kick() { if (!run && vis && !document.hidden) { run = true; last = 0; requestAnimationFrame(tick); } }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      vis = e[0].isIntersecting;
      hero.classList.toggle('hx-off', !vis);
      if (vis) { ys = scrollY; sdirty = true; kick(); }
    }, { threshold: 0 }).observe(hero);
  }
  document.addEventListener('visibilitychange', kick);
  addEventListener('scroll', function () { ys = scrollY; sdirty = true; kick(); }, { passive: true });

  hero.addEventListener('pointermove', function (e) {
    if (R || !mqF.matches || e.pointerType !== 'mouse') return;
    var x = e.clientX - left0, y = e.pageY - top0;
    tx = x / hw * 2 - 1; ty = y / hh * 2 - 1; tmx = x; tmy = y;
    if (spot && !spot.classList.contains('is-on')) { mx = x; my = y; spot.classList.add('is-on'); }
    kick();
  }, { passive: true });
  hero.addEventListener('pointerleave', function () { tx = ty = 0; if (spot) spot.classList.remove('is-on'); kick(); });

  var rt;
  addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { size(); measure(); sdirty = true; kick(); }, 150); });
  var onR = function () {
    R = mqR.matches;
    if (R) { tx = ty = cx = cy = 0; [sky, cv, beams, grid].forEach(function (el) { if (el) ['--hx-sx', '--hx-sy', '--hx-dx', '--hx-dy', '--hx-bx', '--hx-by', '--hx-cy'].forEach(function (v) { el.style.removeProperty(v); }); }); }
    fill(); sdirty = true; kick();
  };
  if (mqR.addEventListener) mqR.addEventListener('change', onR);

  size();
  kick();
})();
