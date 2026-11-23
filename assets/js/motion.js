/* Sajid Group motion layer. Progressive enhancement: theme.js adds html.js-motion (unless reduced motion);
   this file adds html.motion-ready, then drives reveals, split headings, counters, pointer effects and parallax.
   Hooks are documented in docs/redesign-spec.md section 4.3. No dependencies, no inline code. */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('motion-ready');
  if (!root.classList.contains('js-motion')) return;

  var rmq = matchMedia('(prefers-reduced-motion: reduce)');
  var soft = rmq.matches;        // reduced motion: reveals, counters and hovers still run; pointer and parallax effects stay off
  root.classList.toggle('motion-soft', soft);
  var fine = matchMedia('(hover: hover) and (pointer: fine)');
  var SEL = '[data-reveal],[data-split],[data-count],[data-stagger]';
  var DESC = '[data-reveal],[data-split],[data-count],[data-stagger]';
  var alive = true;
  var counters = new Map();      // element -> { raf, orig }
  var counted = new WeakSet();

  function all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ---------- split words (text preserved exactly) ---------- */
  function splitEl(el) {
    var before = el.textContent, saved = el.innerHTML, idx = 0;
    function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          if (!/\S/.test(n.nodeValue)) return;
          var frag = document.createDocumentFragment();
          n.nodeValue.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var w = document.createElement('span'), i = document.createElement('span');
            w.className = 'sg-w'; i.className = 'sg-wi';
            i.style.setProperty('--sg-wi', Math.min(idx++, 14));
            i.textContent = part; w.appendChild(i); frag.appendChild(w);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.nodeName !== 'BR' && !n.classList.contains('sg-w')) walk(n);
      });
    }
    walk(el);
    if (el.textContent !== before) { el.innerHTML = saved; return; }
    el.classList.add('is-split');
  }

  /* ---------- counters ---------- */
  function finishCount(el) {
    var c = counters.get(el); if (!c) return;
    cancelAnimationFrame(c.raf); el.textContent = c.orig; counters.delete(el);
  }
  function startCount(el) {
    if (counted.has(el)) return; counted.add(el);
    var end = parseInt(el.getAttribute('data-count'), 10); if (isNaN(end)) return;
    var suf = el.getAttribute('data-count-suffix') || '', orig = el.textContent, t0 = performance.now(), dur = 1400, c = { orig: orig, raf: 0 };
    counters.set(el, c);
    (function step(t) {
      var p = Math.min(1, (t - t0) / dur), e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      if (p < 1) { el.textContent = Math.round(end * e) + suf; c.raf = requestAnimationFrame(step); }
      else finishCount(el);
    })(t0);
  }

  /* ---------- reveals ----------
     Every target is revealed only by its OWN geometry (never through a parent). IntersectionObserver (observing the element,
     or its parent box for clip-path wipe targets, which report no intersection while fully clipped) and scroll/resize/load
     only trigger scan(); scan() decides per element from getBoundingClientRect. Elements revealed in the same scan (or within
     100ms) are staggered in DOM order; nested reveals wait for, then chain after, their own container. */
  var io = null, waiting = [], info = new WeakMap(), batchT = 0, batchN = 0, scanRaf = 0, tmr = 0;
  var STEP = 90, CAP = 6, CHAIN = 150;

  function judge(b, vh, atEnd) {      // 'past' (scrolled above the viewport), 'in' (visible enough), or null (still below / barely visible)
    if (b.bottom <= 0) return 'past';
    var lim = atEnd ? vh : vh * 0.88;
    if (b.top >= lim) return null;
    var seen = Math.min(b.bottom, lim) - Math.max(b.top, 0);
    return seen >= Math.min(b.height * 0.15, lim * 0.12) ? 'in' : null;
  }
  function hostOf(el) { return el.getAttribute('data-reveal') === 'img' && el.parentElement && el.parentElement !== document.body ? el.parentElement : el; }
  function unlock(el) { requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.remove('sg-now'); }); }); }
  function show(el, delay, instant, now) {
    if (instant) { el.classList.add('sg-now'); counted.add(el); unlock(el); }
    if (delay > 0) el.style.setProperty('--sg-bd', Math.round(delay) + 'ms'); else el.style.removeProperty('--sg-bd');
    el.classList.add('is-in');
    if (io && hostOf(el) === el) io.unobserve(el);
    info.set(el, { t: now, d: instant ? 0 : Math.max(0, delay) });
    if (!instant && el.hasAttribute('data-count')) startCount(el);
  }
  function scan() {
    scanRaf = 0;
    if (!alive || !waiting.length) return;
    var vh = innerHeight, now = performance.now(), de = document.documentElement;
    var atEnd = scrollY + vh >= Math.max(de.scrollHeight, document.body.scrollHeight) - 2;
    if (now - batchT > 100) { batchN = 0; }
    var started = false, rest = [];
    for (var i = 0; i < waiting.length; i++) {                // waiting is in DOM order, so a container is always judged before its descendants
      var el = waiting[i], b = el.getBoundingClientRect(), j = judge(b, vh, atEnd);
      if (!j) { rest.push(el); continue; }
      var anc = el.parentElement ? el.parentElement.closest('[data-reveal]') : null;
      if (anc && !anc.classList.contains('is-in')) { if (j === 'past') { show(el, 0, true, now); } else rest.push(el); continue; }
      if (j === 'past') { show(el, 0, true, now); continue; }
      var delay = 0, ai = anc && info.get(anc);
      if (ai && now - ai.t < 600) delay = Math.max(0, ai.t + ai.d + CHAIN - now);      // chained right after its own container
      else if (el.hasAttribute('data-reveal')) {
        var host = el.closest('[data-stagger]'), step = (host && parseInt(host.getAttribute('data-stagger'), 10)) || STEP;
        delay = Math.min(batchN, CAP) * step; batchN++; started = true;
      }
      show(el, delay, false, now);
    }
    if (started) batchT = now;
    var n = waiting.length; waiting = rest; if (rest.length && rest.length < n) scan();   // a revealed container may release deferred children
    if (!waiting.length && io) io.disconnect();
  }
  function queue() { if (!scanRaf && alive) scanRaf = requestAnimationFrame(scan); }
  function later() { clearTimeout(tmr); tmr = setTimeout(scan, 140); }

  function init() {
    all('[data-split]').forEach(splitEl);
    all('[data-reveal-delay]').forEach(function (el) {
      var d = parseInt(el.getAttribute('data-reveal-delay'), 10);
      if (d > 0) el.style.setProperty('--sg-delay', d + 'ms');
    });
    waiting = all(SEL);
    if (!('IntersectionObserver' in window)) { waiting.forEach(function (el) { show(el, 0, true, 0); }); waiting = []; return; }
    var th = [0, .05, .1, .15, .25, .5, 1];
    io = new IntersectionObserver(function () { scan(); }, { threshold: th, rootMargin: '0px 0px -12% 0px' });
    waiting.forEach(function (el) {
      io.observe(hostOf(el));                                     // wipe targets are clipped away, so their (unclipped) parent box is the proxy
    });
    scan();
    addEventListener('load', function () { setTimeout(scan, 600); setTimeout(scan, 1500); });
    addEventListener('pageshow', queue);
  }

  /* ---------- pointer effects (delegated, rAF batched, eased toward target) ---------- */
  var HOSTS = [
    ['spot', '[data-spotlight]'], ['glow', '[data-glow]']
  ];
  var rects = new Map(), active = new Map(), pend = null, pf = 0;
  var eased = new Map(), lf = 0, lt = 0;     // element -> { rx, ry, mx, my, trx, try_, tmx, tmy }

  function rectOf(el) {
    var r = rects.get(el);
    if (!r) {
      var b = el.getBoundingClientRect(), o = el._sgOff || [0, 0];
      r = { l: b.left - o[0], t: b.top - o[1], w: b.width, h: b.height }; rects.set(el, r);
    }
    return r;
  }
  function st(el) {
    var s = eased.get(el);
    if (!s) { eased.set(el, s = { rx: 0, ry: 0, mx: 0, my: 0, trx: 0, try_: 0, tmx: 0, tmy: 0 }); }
    return s;
  }
  // smooth follow: every frame move a time-based fraction of the remaining distance (frame-rate independent)
  function ease(t) {
    var dt = Math.min(64, t - (lt || t)); lt = t; lf = 0;
    var k = 1 - Math.exp(-dt / 110), busy = false;
    eased.forEach(function (s, el) {
      s.rx += (s.trx - s.rx) * k; s.ry += (s.try_ - s.ry) * k; s.mx += (s.tmx - s.mx) * k; s.my += (s.tmy - s.my) * k;
      var done = Math.abs(s.trx - s.rx) + Math.abs(s.try_ - s.ry) + Math.abs(s.tmx - s.mx) + Math.abs(s.tmy - s.my) < 0.02;
      if (done) { s.rx = s.trx; s.ry = s.try_; s.mx = s.tmx; s.my = s.tmy; }
      el.style.setProperty('--sg-rx', s.rx.toFixed(2) + 'deg'); el.style.setProperty('--sg-ry', s.ry.toFixed(2) + 'deg');
      if (el.hasAttribute('data-magnetic')) { el.style.setProperty('--sg-mx', s.mx.toFixed(2) + 'px'); el.style.setProperty('--sg-my', s.my.toFixed(2) + 'px'); }
      if (done && !s.trx && !s.try_ && !s.tmx && !s.tmy && !active.has(el)) { eased.delete(el); el._sgOff = [0, 0]; rects.delete(el); }
      else if (!done) busy = true;
    });
    if (busy) lf = requestAnimationFrame(ease); else lt = 0;
  }
  function kick() { if (!lf) lf = requestAnimationFrame(ease); }

  function leave(el, kinds) {
    if (kinds.tilt || kinds.mag) { var s = st(el); s.trx = s.try_ = s.tmx = s.tmy = 0; kick(); }
    if (kinds.spot) el.classList.remove('is-spot');
    if (kinds.glow) el.classList.remove('is-glow');
  }
  function leaveAll() { active.forEach(function (k, el) { leave(el, k); }); active.clear(); }

  function frame() {
    pf = 0;
    if (!alive || soft || !pend || !fine.matches) { leaveAll(); return; }
    var x = pend.x, y = pend.y, next = new Map();
    var list = [];
    if (pend.t && pend.t.closest) {
      HOSTS.forEach(function (h) {
        var el = pend.t.closest(h[1]);
        if (el) { var k = next.get(el); if (!k) next.set(el, k = {}); k[h[0]] = true; }
      });
    }
    active.forEach(function (k, el) { if (!next.has(el)) leave(el, k); });
    next.forEach(function (k, el) { list.push([el, k, rectOf(el)]); });          // reads first
    list.forEach(function (it) {                                                  // then writes
      var el = it[0], k = it[1], r = it[2], px = x - r.l, py = y - r.t, nx = px / r.w, ny = py / r.h;
      if (k.tilt) {
        var m = parseFloat(el.getAttribute('data-tilt')) || 5, s = st(el);
        s.trx = (0.5 - ny) * 2 * m; s.try_ = (nx - 0.5) * 2 * m; kick();
      }
      if (k.spot) { el.style.setProperty('--mx', px.toFixed(1) + 'px'); el.style.setProperty('--my', py.toFixed(1) + 'px'); el.classList.add('is-spot'); }
      if (false && k.mag && !el.matches('.sm,.chip,.svc-book,.hdr-quote,.hdr-book,.dock a,.to-top,.wa-float')) {
        var s2 = st(el);
        s2.tmx = Math.max(-2, Math.min(2, (px - r.w / 2) * 0.08)); s2.tmy = Math.max(-2, Math.min(2, (py - r.h / 2) * 0.08));
        el._sgOff = [s2.tmx, s2.tmy]; kick();
      }
      if (k.glow) {
        if (!el.querySelector(':scope > .sg-glow')) {
          var g = document.createElement('span'); g.className = 'sg-glow'; g.setAttribute('aria-hidden', 'true'); el.insertBefore(g, el.firstChild);
        }
        el.style.setProperty('--sg-gx', px.toFixed(1) + 'px'); el.style.setProperty('--sg-gy', py.toFixed(1) + 'px'); el.classList.add('is-glow');
      }
    });
    active = next;
  }
  function onMove(e) {
    if (!alive || soft || e.pointerType === 'touch' || !fine.matches) return;
    pend = { x: e.clientX, y: e.clientY, t: e.target };
    if (!pf) pf = requestAnimationFrame(frame);
  }

  /* ---------- parallax ---------- */
  var par = new Map(), parActive = new Set(), sf = 0, pio = null;
  function measure(el, it) {
    var b = el.getBoundingClientRect(), top = b.top + scrollY - (it.py || 0);
    it.ref = top < innerHeight ? 0 : top - innerHeight / 2;
  }
  function parFrame() {
    sf = 0;
    if (!alive || soft) return;
    var y = scrollY;
    parActive.forEach(function (el) {
      var it = par.get(el), v = Math.max(-120, Math.min(120, (y - it.ref) * it.speed)).toFixed(1);
      if (v !== it.py_s) { it.py_s = v; it.py = +v; el.style.setProperty('--sg-py', v + 'px'); }
    });
  }
  function onScroll() {
    if (waiting.length) { queue(); later(); }
    if (rects.size) rects.clear();
    if (parActive.size && !sf) sf = requestAnimationFrame(parFrame);
  }
  function initParallax() {
    var els = all('[data-parallax]');
    if (!els.length || !('IntersectionObserver' in window)) return;
    els.forEach(function (el) { par.set(el, { speed: parseFloat(el.getAttribute('data-parallax')) || 0.1, py: 0, ref: 0 }); });
    pio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { measure(e.target, par.get(e.target)); parActive.add(e.target); } else parActive.delete(e.target);
      });
      if (parActive.size && !sf) sf = requestAnimationFrame(parFrame);
    }, { rootMargin: '20% 0px' });
    els.forEach(function (el) { pio.observe(el); });
  }
  var rsz = 0;
  function onResize() {
    rects.clear(); if (waiting.length) { queue(); later(); }
    if (rsz) return;
    rsz = requestAnimationFrame(function () { rsz = 0; parActive.forEach(function (el) { measure(el, par.get(el)); }); parFrame(); });
  }

  /* ---------- reduced motion switched on live ---------- */
  function stop() {
    alive = false;
    if (io) io.disconnect();
    waiting = [];
    if (pio) pio.disconnect();
    parActive.clear();
    leaveAll();
    Array.from(counters.keys()).forEach(finishCount);
    par.forEach(function (it, el) { el.style.removeProperty('--sg-py'); });
    all(SEL).forEach(function (el) { el.classList.add('is-in'); });
    all('.sg-glow').forEach(function (g) { g.remove(); });
    root.classList.remove('js-motion');
  }
  function onRM() {
    soft = rmq.matches; root.classList.toggle('motion-soft', soft);
    if (soft) {
      leaveAll();
      par.forEach(function (it, el) { el.style.removeProperty('--sg-py'); it.py = 0; it.py_s = null; });
      all('.sg-glow').forEach(function (g) { g.remove(); });
    } else { parActive.forEach(function (el) { measure(el, par.get(el)); }); parFrame(); }
  }
  if (rmq.addEventListener) rmq.addEventListener('change', onRM); else if (rmq.addListener) rmq.addListener(onRM);

  /* ---------- go ---------- */
  try { init(); initParallax(); } catch (err) { console.error(err); stop(); return; }
  document.addEventListener('pointermove', onMove, { passive: true });
  document.documentElement.addEventListener('mouseleave', leaveAll, { passive: true });
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onResize, { passive: true });
  addEventListener('pagehide', leaveAll);
})();
