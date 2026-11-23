# Sajid Group website: redesign spec "Gilded Night"

Version 1.0, 2026-11-23. Branch `redesign`. Do not push, do not commit.

---

## 0. HARD RULE (owner): no content changes

**DO NOT change any content and DO NOT add any content.**

- All text (EN and AR), the informational content of every section, links, numbers, FAQs, services, contact details, alt texts, titles, meta descriptions, schema and hreflang stay exactly as they are today.
- The redesign is purely visual and motion: layout, styling, typography, decoration, animation, interaction.
- Allowed in markup: wrapper elements, classes, data attributes, `aria-hidden="true"` decorative empty elements, and re-ordering of existing elements. Wrapping an existing phrase in `<span class="gold">` is allowed (no text changes).
- NOT allowed: new copy, new eyebrow labels, new taglines, new CTA text, new stats, new sections with text, text preloaders, tooltips with text, new `aria-label` strings (reuse existing strings only).
- Decorative non-text elements (gradients, shapes, already-present icons, dividers, glows, the existing images) are fine.
- No em dashes anywhere (content or generated strings).
- Owner-approved change already applied in build.js before this redesign: the IT company is "IT Oasis Gulf" (AR: آي تي أويسس الخليج). Logo files: `assets/img/itoasis-gulf-light.webp` (light text, transparent, 1600x873, for DARK backgrounds) and `assets/img/itoasis-gulf-dark.webp` (dark text, for LIGHT backgrounds). `itoasis.png` is no longer used. Every IT logo spot in this spec (`.co-logo`, `.dc-logo`, `.itband img`, `.cohero-mark`, `.side` on the IT page, showcase `.sp-media`) stays on a dark plate in BOTH themes, so the light-text file remains correct everywhere; B must keep those plates dark in light mode (`.co-logo`, `.dc-logo` background `radial-gradient(circle at 50% 40%, #1f1d1a, #0d0d0e)`). Never stretch the logo: `width:auto; height:auto; max-height` only, `object-fit: contain`.
- Owner: "We want design to be perfect and fully animated." Go rich on motion, tastefully, within section 2.

If an implementer believes a text change is needed, stop and report it instead.

---

## 1. Design direction

### 1.1 Concept: "Gilded Night"
Dubai after dark seen from a private lounge: near-black glass surfaces, warm gold light that moves slowly, crisp modern type, generous space. Light mode is "Gilded Day": warm cream paper, white porcelain cards, the same gold, with the dark brand bands (hero, page heads, IT band, CTA, footer) acting as night windows between cream sections.

Mood words: confident, calm, expensive, precise. Motion is slow-in, fast-settle (expo-out), never bouncy except tiny press feedback.

Principles:
1. One type family per language for everything structural (Inter EN, Tajawal AR). Serif only as a brand accent.
2. Every section enters with motion, but content is never hidden without JS, and hero text is never delayed.
3. "Book a visit" and "Get a quote" are always the brightest objects on screen (gold gradient, shine, magnetic on desktop; dock on phones).
4. Dark bands and cream sections alternate to create rhythm.

### 1.2 Typography

| Role | EN | AR | Size | Line-height | Tracking | Weight |
|---|---|---|---|---|---|---|
| Display (home `.hx-big`) | Inter | Tajawal | keep current clamp values | keep | keep | 700 |
| H1 (`.phead h1`, `.cohero h1`) | Inter | Tajawal | `clamp(2.4rem, 5.2vw, 4.25rem)` | 1.04 (AR 1.3) | -0.035em (AR 0) | 700 |
| H2 | Inter | Tajawal | `clamp(1.9rem, 3.6vw, 3rem)` | 1.08 (AR 1.35) | -0.03em (AR 0) | 700 |
| H3 / `.h3` | Inter | Tajawal | `clamp(1.12rem, 1.6vw, 1.3rem)` | 1.3 (AR 1.5) | -0.015em (AR 0) | 600 (AR 700) |
| Section `.h3` used as section title (`h2.h3`) | Inter | Tajawal | `clamp(1.5rem, 2.4vw, 1.9rem)` | 1.15 | -0.025em | 700 |
| Lead | Inter | Tajawal | `clamp(1.05rem, 1.6vw, 1.2rem)` | 1.6 (AR 1.85) | 0 | 400 |
| Body | Inter | Tajawal | 16px | 1.65 (AR 1.85) | 0 | 400 |
| Eyebrow | Inter | Tajawal | .75rem (AR .9rem) | 1.4 | .2em uppercase (AR 0, no uppercase) | 600 |
| Small / meta | Inter | Tajawal | .85rem | 1.5 | 0 | 500 |
| Numerals (`.stats b`, `.step-n`, `.co-num`, `.hx-trust b`) | Inter | Inter | per component | 1 | -0.04em | 700, `font-variant-numeric: tabular-nums` |

Serif accent (Cormorant Garamond EN / Amiri AR) is used ONLY for:
- `.brand` wordmark text in header and footer (unchanged).
- The CEO quote on About (`.ceo p:last-child`): Cormorant Garamond 600, 1.4rem, line-height 1.45, not italic (no italic file). AR: Amiri 700 1.25rem.

Everything else that is serif today (all h1/h2/h3, `.stats b`, `.step-n`, `.co-num`, `.ftr h3`, `[dir=rtl]` Amiri headings) becomes Inter / Tajawal.

Heading extras: `text-wrap: balance` on h1, h2; `text-wrap: pretty` on `.lead`, p.

### 1.3 Spacing, radii, layout
- Container: keep `.wrap` = `min(1180px, 100% - 32px)` (16px gutter at 390px). Add `--sg-wrap-wide: 1280px` for hero only.
- Spacing scale (rem): `--sg-s1 .25, s2 .5, s3 .75, s4 1, s5 1.5, s6 2, s7 3, s8 4, s9 6`.
- Section padding: `--sg-sec-y: clamp(72px, 10vw, 128px)`. `.sec` uses it top and bottom.
- `.sec-head` margin-bottom `clamp(2.2rem, 4vw, 3.4rem)`.
- Radii: `--sg-r-xs 8px, --sg-r-sm 12px, --sg-r-md 16px, --sg-r-lg 22px, --sg-r-xl 28px, --sg-r-pill 999px`. Cards = md, feature panels/forms/CTA = lg or xl, buttons/chips = pill. Keep `--r` (14px) untouched for legacy rules.

### 1.4 Design tokens (put on `:root` in `assets/css/ui.css`)
Existing tokens in styles.css are kept as is and remain the source of truth (`--bg --bg2 --card --line --txt --txt2 --mut --gold --gold2 --gold3 --grad --hdr --input --ftr --glass --band --cta --fade --errc --sh --r`). New tokens are additive and derived only from those hexes.

Dark (default values on `:root`, also applied under `[data-theme=dark]`):
```
--sg-font: Inter, system-ui, sans-serif;
--sg-font-head: Inter, system-ui, sans-serif;
--sg-font-accent: "Cormorant Garamond", Georgia, serif;
--sg-night: #0b0b0c;          /* = existing dark --bg */
--sg-night-2: #131315;        /* = existing dark --bg2 */
--sg-night-3: #18181b;        /* = existing dark --card */
--sg-ink: #050505;            /* existing cohero bg */
--sg-gold-50: #fff6d8; --sg-gold-100: #f6dc84; --sg-gold-200: #f3d77a; --sg-gold-300: #e3b549;
--sg-gold-400: #d4af37; --sg-gold-500: #c9952c; --sg-gold-600: #a87f1f; --sg-gold-700: #94700f; --sg-gold-800: #6f520a;
--sg-gold-a06: rgba(212,175,55,.06); --sg-gold-a10: rgba(212,175,55,.10); --sg-gold-a16: rgba(212,175,55,.16);
--sg-gold-a24: rgba(212,175,55,.24); --sg-gold-a40: rgba(212,175,55,.40);
--sg-grad: var(--grad);
--sg-grad-shine: linear-gradient(110deg,#fff6d8 0%,#f2cd6b 28%,#d4a23a 55%,#f6dc84 78%,#a8781c 100%);
--sg-grad-text: var(--sg-grad-shine);
--sg-grad-border: conic-gradient(from var(--sg-angle), rgba(246,220,132,.95), rgba(168,127,31,.15) 25%, rgba(212,175,55,.85) 50%, rgba(168,127,31,.15) 75%, rgba(246,220,132,.95));
--sg-hairline: linear-gradient(90deg, transparent, rgba(212,175,55,.55), transparent);
--sg-surface: var(--card);
--sg-surface-2: #1d1d21;      /* card hover, derived from #18181b +3% */
--sg-glass-bg: rgba(24,24,27,.62);
--sg-glass-bd: rgba(243,215,122,.14);
--sg-glass-blur: 16px;
--sg-sh-1: 0 1px 2px rgba(0,0,0,.25), 0 4px 12px rgba(0,0,0,.2);
--sg-sh-2: 0 16px 40px -12px rgba(0,0,0,.6);
--sg-sh-3: 0 40px 80px -24px rgba(0,0,0,.7);
--sg-sh-gold: 0 12px 32px -8px rgba(212,175,55,.45);
--sg-ring: 0 0 0 3px rgba(243,215,122,.35);
--sg-grain: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E");
--sg-dir: 1;
```
Light (`[data-theme=light]`):
```
--sg-surface: #fff; --sg-surface-2: #fffdf8;
--sg-grad-text: linear-gradient(135deg,#c79b2c 0%,#9a7414 55%,#6f520a 100%);
--sg-glass-bg: rgba(255,255,255,.72); --sg-glass-bd: rgba(201,164,60,.28);
--sg-sh-1: 0 1px 2px rgba(90,65,15,.08), 0 4px 14px rgba(90,65,15,.08);
--sg-sh-2: 0 18px 40px -14px rgba(90,65,15,.22);
--sg-sh-3: 0 40px 80px -28px rgba(90,65,15,.32);
--sg-sh-gold: 0 12px 30px -8px rgba(148,112,15,.38);
--sg-ring: 0 0 0 3px rgba(148,112,15,.28);
```
RTL: `[dir=rtl]{ --sg-dir: -1; --sg-font: Tajawal, "Segoe UI", Tahoma, sans-serif; --sg-font-head: Tajawal, "Segoe UI", sans-serif; --sg-font-accent: Amiri, Tajawal, serif; }`

Dark tone scope: any element with `data-tone="dark"` gets the full dark token set in light mode, exactly the values styles.css already uses in `[data-theme=light] .hero, .itband, .ftr` (`--bg:#0b0b0c; --bg2:#131315; --card:#18181b; --line:#2a2724; --txt:#ece8e1; --txt2:#cfc9bf; --mut:#a9a39a; --gold:#d4af37; --gold2:#f3d77a; --gold3:#a87f1f; --glass:rgba(24,24,27,.7); --hdr:rgba(11,11,12,.82); --input:#0f0f11; --fade:rgba(11,11,12,.85)` plus the dark `--sg-*` values and `color: var(--txt)`). Selector: `[data-theme=light] [data-tone=dark]`.

Registered properties (top of ui.css; needed so custom props animate):
```
@property --sg-angle { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
@property --sg-lift  { syntax: '<length>'; inherits: false; initial-value: 0px; }
@property --sg-rx    { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
@property --sg-ry    { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
```

### 1.5 Recipes
- **Glass**: `background: var(--sg-glass-bg); border: 1px solid var(--sg-glass-bd); backdrop-filter: blur(var(--sg-glass-blur)) saturate(1.2); box-shadow: var(--sg-sh-2), inset 0 1px 0 rgba(255,255,255,.06);` (light inset uses rgba(255,255,255,.8)). Max 6 blurred surfaces per viewport (header, dock, qbar, dcards, form).
- **Gold text** `.gold` (existing class, re-skinned): `background: var(--sg-grad-text); background-size: 220% 100%; -webkit-background-clip: text; background-clip: text; color: transparent; padding-bottom: .08em;` On h1/h2 add `animation: sg-shine 9s var(--sg-ease-inout) infinite` (moves background-position 0% to 100% and back). Gold text only at >= 24px in light mode (AA large).
- **Hairline divider**: `height:1px; background: var(--sg-hairline)`.
- **Card**: `background: var(--sg-surface); border: 1px solid var(--line); border-radius: var(--sg-r-md); box-shadow: var(--sg-sh-1); transition: transform var(--sg-d-sm) var(--sg-ease-out), box-shadow var(--sg-d-md) var(--sg-ease-out), border-color var(--sg-d-sm);` hover: `--sg-lift:-6px; box-shadow: var(--sg-sh-2); border-color: var(--gold3)`.
- **Card transform composition** (used by every card that can lift or tilt): `transform: perspective(1000px) translateY(var(--sg-lift)) rotateX(var(--sg-rx)) rotateY(var(--sg-ry));`
- **Animated gradient border** `[data-border=spin]`: a `::before` with `inset:-1px; border-radius:inherit; padding:1px; background: var(--sg-grad-border); mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);` (plus `-webkit-mask` + `-webkit-mask-composite: xor`), `animation: sg-spin 8s linear infinite` on `--sg-angle` 0deg to 360deg. If the element already uses `::before` (`.qcard`), override that same `::before`.
- **Aurora** `.sg-aurora` (decorative div): `position:absolute; inset:0; overflow:hidden; pointer-events:none; z-index:0`. `::before` = 60vmax circle `radial-gradient(circle, rgba(212,175,55,.20), transparent 60%)` at inline-end top; `::after` = 50vmax circle `radial-gradient(circle, rgba(168,127,31,.16), transparent 62%)` at inline-start bottom. Both drift with `sg-drift` (translate3d +/- 6%, 26s and 34s, alternate, ease-in-out). No `filter: blur` (soft edges come from the gradients). Plus a grain layer: `background-image: var(--sg-grain); opacity:.05; mix-blend-mode: overlay` on the `.sg-aurora` itself.
- **Dot grid**: reuse the existing hero dot pattern (`radial-gradient(rgba(243,215,122,.55) 1px, transparent 1.5px) 0 0/46px 46px`) masked by a diagonal gradient, opacity .18, for `.phead::before`.

---

## 2. Motion system

### 2.1 Tokens
```
--sg-ease-out:   cubic-bezier(.16,1,.3,1);     /* expo-out: all entrances */
--sg-ease-inout: cubic-bezier(.65,0,.35,1);    /* loops, shine, drift */
--sg-ease-std:   cubic-bezier(.2,.7,.2,1);     /* hovers */
--sg-ease-back:  cubic-bezier(.34,1.56,.64,1); /* tiny press/pop only */
--sg-d-xs: 150ms; --sg-d-sm: 240ms; --sg-d-md: 420ms; --sg-d-lg: 760ms; --sg-d-xl: 1100ms;
--sg-stagger: 70ms;        /* per child; JS caps index at 8 */
--sg-reveal-y: 28px; --sg-reveal-x: 36px;
```

### 2.2 Progressive enhancement contract
- `assets/theme.js` (runs in head, before paint) adds `js-motion` to `<html>` only when `prefers-reduced-motion` is not `reduce`. It also sets a 3000ms failsafe: if `<html>` does not have `motion-ready` by then, it removes `js-motion` (so content becomes visible if motion.js fails).
- `assets/js/motion.js` adds `motion-ready` to `<html>` as its first action. If `js-motion` is absent when motion.js runs (reduced motion, or failsafe fired), motion.js runs NO hide/reveal/split/parallax/tilt/magnetic/glow code; it only leaves content as is (counters show final values, which is the markup text).
- All hidden initial states in CSS are written as `html.js-motion [data-reveal]:not(.is-in) {...}`, inside `@media (prefers-reduced-motion: no-preference)`.
- `@media print` and `@media (prefers-reduced-motion: reduce)`: force `opacity:1; translate:none; scale:none; filter:none; clip-path:none` on all `[data-reveal]`, `[data-intro]`, `.sg-wi`, and `animation:none` on all `sg-*` keyframes, `.sg-aurora`, `[data-border=spin]::before`, `.gold`.
- Hero and page heads use `data-intro` (CSS only, starts at first paint, no JS wait).

### 2.3 Property ownership (prevents transform conflicts)
| Mechanism | CSS property it may use |
|---|---|
| Reveal (`data-reveal`, `data-intro`) | `opacity`, `translate`, `scale`, `filter`, `clip-path` (individual transform properties, never `transform`) |
| Hover lift + tilt (cards) | `transform` via `--sg-lift`, `--sg-rx`, `--sg-ry` |
| Magnetic (buttons) | `transform` via `--sg-mx`, `--sg-my` (px, set by JS) |
| Parallax (`data-parallax`) | `translate` via `--sg-py` (set by JS); such elements are never reveal targets |
| Existing keyframes (Ken Burns `kb`, `pin`, deck `.p0/.p1/.p2`) | `transform` (unchanged) |

Buttons: `.btn { transform: translate3d(var(--sg-mx,0px), calc(var(--sg-my,0px) + var(--sg-lift)), 0); }` and `.btn:hover { --sg-lift: -2px }` (replaces the old `translateY(-2px)`).

### 2.4 Effect catalogue

| Name | Trigger | Exact behaviour |
|---|---|---|
| `reveal-up` (`data-reveal="up"`, default) | IO, threshold .15, rootMargin `0px 0px -8% 0px`, once | from `opacity:0; translate:0 var(--sg-reveal-y)` to `1; none`, `--sg-d-lg` `--sg-ease-out` |
| `reveal-fade` (`fade`) | same | opacity only, `--sg-d-lg` |
| `reveal-start` (`start`) | same | from `translate: calc(var(--sg-dir) * -1 * var(--sg-reveal-x)) 0` (comes from inline-start; mirrors in RTL) |
| `reveal-end` (`end`) | same | from `translate: calc(var(--sg-dir) * var(--sg-reveal-x)) 0` |
| `reveal-scale` (`scale`) | same | from `opacity:0; scale:.94; filter: blur(6px)` to normal, `--sg-d-xl` |
| `reveal-blur` (`blur`) | same | from `opacity:0; filter: blur(12px); translate:0 12px` |
| `reveal-img` (`img`) | same | wipe: `clip-path: inset(0 0 0 100%)` (LTR) / `inset(0 100% 0 0)` (RTL) to `inset(0 0 0 0)`, `--sg-d-xl` `--sg-ease-inout`; any direct `img` child also goes `scale:1.12` to `1` over 1400ms |
| `stagger` (`data-stagger` on parent) | IO on the parent | JS sets `--sg-i` (0..8) on each direct element child; parent and every descendant `[data-reveal]` get `.is-in` together; CSS `transition-delay: calc(var(--sg-i, 0) * var(--sg-stagger) + var(--sg-delay, 0ms))`. Optional `data-stagger="90"` sets `--sg-stagger: 90ms` on the parent |
| `delay` (`data-reveal-delay="200"`) | n/a | JS sets `--sg-delay: 200ms` on the element |
| `split-words` (`data-split`) | IO, once | JS wraps every word of every text node (keeping inner elements like `.gold`, `<span>`, `<a>`) in `<span class="sg-w"><span class="sg-wi">word</span></span>` with whitespace text nodes kept between; sets `--sg-wi` index on each `.sg-wi`; adds `.is-split`. CSS: `.sg-w{display:inline-block; overflow:clip; overflow-clip-margin: .12em; padding-bottom:.08em; vertical-align:top}` `.sg-wi{display:inline-block; translate:0 110%; transition: translate 900ms var(--sg-ease-out) calc(var(--sg-wi)*45ms)}` and `.is-in .sg-wi{translate:none}`. Words only, never characters (Arabic joining). Never on elements whose own text uses background-clip (`.hx-big`); for `.gold` children, the `.gold` span keeps its gradient by applying `background-clip:text` on each `.sg-wi` inside `.gold` (B: `.gold .sg-wi{background:inherit; -webkit-background-clip:text; background-clip:text; color:transparent}` and set `.gold:has(.sg-w){background:none}` with the gradient moved to `.gold .sg-wi`) |
| `intro` (`data-intro="1".."7"`) | page load, CSS only | keyframes `sg-intro` from `opacity:0; translate:0 22px; filter:blur(6px)` to normal, 900ms `--sg-ease-out`, `animation-fill-mode: both`, delay `(n-1) * 80ms`. Variant `data-intro-keep` (used on h1 and `.hx-name`): keyframes `sg-intro-keep` with NO opacity change (`translate:0 .3em; filter: blur(8px)` to none) so LCP is not delayed. Max delay 480ms |
| `count` (`data-count="60"`, optional `data-count-suffix="+"`) | IO once | counts 0 to N over 1400ms easeOutExpo with `requestAnimationFrame`; writes `N_partial + suffix`; last frame restores the element's ORIGINAL textContent exactly. `font-variant-numeric: tabular-nums` and a `min-width` in `ch` set by B to avoid jitter |
| `tilt` (`data-tilt`, optional value = max deg, default 5) | pointer fine + hover only | on `pointerenter` cache rect; on `pointermove` (rAF throttled) set `--sg-rx = (0.5 - y) * 2 * max deg`, `--sg-ry = (x - 0.5) * 2 * max deg`; on `pointerleave` set both to 0deg (transition 600ms `--sg-ease-out` via registered props) |
| `spotlight` (`data-spotlight`) | pointer fine | sets `--mx`, `--my` (px) on the element; B draws `::after` `radial-gradient(360px circle at var(--mx) var(--my), rgba(243,215,122,.14), transparent 60%)` (light: rgba(201,164,60,.16)), opacity 0 to 1 on hover. Replaces the old app.js spotlight |
| `magnetic` (`data-magnetic`) | pointer fine | within the element rect, set `--sg-mx/--sg-my` = offset from centre * .25, clamped to +/-8px; reset to 0 on leave (transition 500ms `--sg-ease-out`) |
| `shine` (`data-shine`) | CSS | `::after` diagonal highlight band (`linear-gradient(105deg, transparent 35%, rgba(255,255,255,.55) 50%, transparent 65%)`) translated from inline-start -120% to +120% on hover (700ms); plus idle loop `sg-shine-idle` every 6s (sweep takes 900ms, rest idle) only on elements with `data-shine="idle"`. RTL: sweep direction mirrors using `--sg-dir` |
| `parallax` (`data-parallax="0.12"`) | IO activates; single passive scroll listener with rAF, only runs while >= 1 parallax element is intersecting | `--sg-py = (rectTopAtStart - currentScroll) * speed` clamped to +/-120px; CSS `translate: 0 var(--sg-py, 0px)`. Desktop and mobile; skipped for reduced motion |
| `glow` (`data-glow`) | pointer fine | JS injects `<span class="sg-glow" aria-hidden="true"></span>` as first child; on pointermove sets `--sg-gx/--sg-gy` on the host; host gets `.is-glow` while hovered. B: `.sg-glow{position:absolute; inset:0; z-index:0; pointer-events:none; opacity:0; transition:opacity 600ms; background: radial-gradient(520px circle at var(--sg-gx,50%) var(--sg-gy,50%), rgba(243,215,122,.12), transparent 60%)}` `.is-glow > .sg-glow{opacity:1}` |
| `border-spin` (`data-border="spin"`) | CSS | animated conic border, 8s linear infinite (see recipe). Paused when not hovered on `.side` and `.form`? No: always on, it is cheap (only `--sg-angle`) |
| `aurora` (`.sg-aurora`) | CSS | slow drifting gold light (see recipe) |
| `marquee` (existing `.ticker`) | CSS | keep existing keyframes and RTL; add gold diamond separators (`span::after{content:""; width:5px; height:5px; rotate:45deg; background: var(--gold)}`), stronger edge fade (12%), pause on hover and on `:focus-within`, speed 60s |
| `header` (existing `.hdr.scrolled`, app.js) | app.js | B: on `.scrolled` header gets glass with blur 18px, bottom border becomes `--sg-hairline`, shadow `--sg-sh-2`; height 72px to 62px (existing). Header never hides (CTAs must stay visible) |
| `progress bar` (existing `.progress`) | app.js | B: 2px, `--sg-grad`, plus `box-shadow: 0 0 12px rgba(243,215,122,.6)` |
| `to-top ring` | app.js sets `--p` (0..1) on `.to-top` | B: conic ring `conic-gradient(var(--gold) calc(var(--p,0)*360deg), transparent 0)` masked to a 2px ring around the button |
| `nav underline` | CSS | `.nav a:not(.btn)::after` always present, `scale: 0 1` to `1 1` on hover/current, `transform-origin` inline-start (RTL: right) 300ms |
| `section divider` | CSS on `.sec-head.is-in::after` | 64px x 2px gold gradient bar under the heading, centered, draws `scale:0 1` to `1 1` 900ms with 300ms delay |
| `steps line` | CSS on `.steps.is-in::before` | existing dashed connector draws `scale:0 1` to `1 1` 1200ms from inline-start |
| `panel swap` (showcase) | CSS | when a `.show-panel` loses `hidden`, `.sp-body > *` play `sg-intro` with `nth-child` delays 0/60/120/180/240/300ms; `.sp-media` plays `reveal-img` style keyframe `sg-wipe` 900ms |
| `press` | CSS | `.btn:active, .chip:active, .dock a:active, .qopt:active span { scale: .97 }` 150ms `--sg-ease-back` |
| `scroll cue` (`.sg-scrollcue`) | CSS | 1px x 44px line at hero bottom centre, a 12px gold dot travels down it, 2.4s loop; hidden at <= 860px and for reduced motion |
| `faq open` | CSS | `:root{interpolate-size: allow-keywords}`; `.faq details::details-content{block-size:0; overflow:clip; transition: block-size 420ms var(--sg-ease-out), content-visibility 420ms allow-discrete}` `details[open]::details-content{block-size:auto}`; plus icon rotates 45deg (replace content swap with a rotated "+" drawn from two pseudo bars). Browsers without support: instant open (fine) |
| `filter results` (services) | CSS | `.svc-cards li{transition: opacity 300ms, translate 300ms}` with `@starting-style { opacity:0; translate:0 8px }` so items re-entering after filter fade in |

Not used (deliberately): page-wide cursor followers, text-scramble, character splitting, scroll hijacking, preloaders, autoplay video, hiding header on scroll.

### 2.5 Reduced motion
`prefers-reduced-motion: reduce`: no `js-motion` class (so nothing is hidden), all `sg-*` animations off, aurora static, ticker wraps (existing rule), deck autoplay already off (app.js), showcase autoplay already off, counters show final text, no tilt/magnetic/parallax/glow. Hover color/border changes remain.

---

## 3. Page by page

General markup rules for Implementer A (build.js):
- Remove the `reveal` class everywhere (it is replaced by `data-reveal`). Do NOT leave both.
- Add `data-tone="dark"` to: `.topbar`, `.hero`, `.phead`, `.cohero`, `.itband`, `.cta-in`, `.ftr`, `.dock`? NO (dock follows theme). Exactly: topbar, hero, phead, cohero, itband, cta-in, ftr.
- Decorative elements are empty and `aria-hidden="true"`.
- Wrap phrases in `<span class="gold">` only where listed in 3.9.

### 3.1 Global chrome (every page)
**Head**: see 4.2 for exact tags.

**Topbar** (`.topbar` + `data-tone="dark"`): unchanged content. B: height 38px, background `#070708` with bottom hairline gradient, links `--txt2`, hover gold2, open badge pill with pulsing green dot (existing pulse). Keep `hide-sm` behaviour.

**Header** `.hdr`: unchanged markup except: `.hdr-book` gets `data-magnetic data-shine="idle"`, `.hdr-quote` gets `data-magnetic`. B: glass (light: cream glass `rgba(250,247,240,.78)`), nav links Inter 500 .94rem with animated underline, active link color `--gold2` (light `--gold`). `.hdr-book` = gold gradient pill with shine; `.hdr-quote` = line pill with gold border and 8% gold fill on hover. Theme toggle: 40px circle, glass, icon rotates 180deg on toggle (CSS transition on `.ic` keyed to `[data-theme]`). Logo image: never resize except the existing 56 to 48 equal-sides shrink; keep `[data-theme=light] .hdr .brand img{background:#000}`.

Mobile nav (<= 860px, `.nav.open`): full-width glass sheet under the header, links 1.05rem, 52px rows separated by hairlines, each link animates in with `sg-intro` staggered 40ms via `.nav.open a:nth-child(n)` (CSS only). Burger morphs into an X when `aria-expanded="true"` (CSS on spans: rotate 45 / opacity 0 / rotate -45).

**Footer** `.ftr` (`data-tone="dark"`): add `.sg-aurora` as first child (A). Top edge: 1px `--sg-hairline`. Columns: `ftr-grid` gets `data-stagger`, each of its 3 direct `div` children `data-reveal="up"`. Headings `.ftr h3` Inter 600 .8rem uppercase .2em gold (AR Tajawal .95rem no uppercase). Links get the nav-underline effect. Contact icons in 32px round gold-tinted chips (`--sg-gold-a10` bg). Bottom bar unchanged content, smaller (.82rem).

**Dock** (phones): unchanged markup and items. B: glass, 64px tall plus safe area, `dock-main` gold gradient with `data-shine="idle"` (A adds it), press scale. Must remain `z-index: 80` and always visible.

**wa-float, to-top, ios-tip**: unchanged markup. B: wa-float gets soft ring pulse every 4s (box-shadow keyframe, reduced-motion off). to-top gets progress ring (needs app.js edit 4, see 4.4). ios-tip: glass box, scale-in 300ms when shown.

**Buttons (all pages)**: `.btn-gold` = `--sg-grad` with `background-size: 160% 100%`, hover moves `background-position` to 100% and lifts 2px, `box-shadow: var(--sg-sh-gold)`, inner `inset 0 1px 0 rgba(255,255,255,.45)`, shine sweep on hover. `.btn-line` = transparent, 1px `--gold3` border, text `--gold2` (light `--gold`), hover fill `--sg-gold-a10`. Min height 46px (`.sm` 40px), focus: `outline: 2px solid var(--gold2); outline-offset: 3px; box-shadow: var(--sg-ring)`. `.link` arrow slides 4px toward inline-end on hover (RTL mirrored via existing `.flip`).

### 3.2 Home (`index.html`, `ar/index.html`), sections in current order

1. **Hero** `section.hero.hero2` + `data-tone="dark" data-glow`
   - A: inside `.hero-bg` add as first children `<div class="sg-aurora" aria-hidden="true"></div>`; on `img.hero-sky` add `data-parallax="0.12"`; after `.hero-grid` add `<span class="sg-scrollcue" aria-hidden="true"></span>`.
   - Replace `reveal` with: `.hx-chip` `data-intro="1"`, `h1.hx-name` `data-intro="2" data-intro-keep`, `.hx-line` `data-intro="3"`, `.hx-lead` `data-intro="4"`, `.hx-trust` `data-intro="5"`, `form#qcard.qbar` `data-intro="6" data-border="spin"`.
   - Counters: `.hx-trust li:nth-child(1) b` `data-count="6"`; `.hx-trust li:nth-child(2) b` `data-count="60" data-count-suffix="+"`.
   - `#q-quote` `data-magnetic data-shine="idle"`; the submit button `data-magnetic`.
   - B: hero min-height `min(92vh, 860px)` on >= 1000px, content centred (existing `.hero-center`). `.hx-big` keeps its gradient + shine; add a soft gold `text-shadow`-free glow via existing drop-shadow. `.hx-chip` glass pill. `.hx-trust` items separated by gold hairlines. `.qbar`: glass, radius `--sg-r-xl`, spinning border, `.qopt` tiles 12px radius, selected tile gets gold border + inner glow + icon in gold gradient circle with `scale` pop (`--sg-ease-back`, 240ms). Skyline: keep image and blend; parallax via `translate`; keep the existing RTL `transform: scaleX(-1)`.
2. **Deck** `section.deck-sec`
   - A: `.deck-copy` `data-reveal="start"`, its `h2` `data-split` (and gold span, 3.9), `.deck` `data-reveal="scale"`.
   - B: background `--bg2` with a large blurred gold radial at inline-end (existing) plus `.sg-aurora`-like static glow; deck cards: glass (dark) / porcelain (light, existing values), 24px radius, front card `box-shadow: var(--sg-sh-3)`, `.dc-q` line pill, `.dc-b` gold pill. Deck dots: 8px dots, active one stretches to 24px pill in gold (width transition 300ms). Do not touch `.p0/.p1/.p2` transforms.
3. **Ticker** `.ticker`: no markup change. B: marquee effect (2.4), font 600 .92rem, `--txt2`, background `--bg` with hairlines top/bottom.
4. **Showcase** `section.show#companies`
   - A: `.sec-head` `data-reveal="up"`, its `h2` `data-split` + gold span; `.show-in` `data-reveal="up"`; each `.show-tab` `data-spotlight`; each `.sp-body .btns .btn-gold` `data-magnetic`.
   - B: tabs column: 16px radius rows, selected tab = surface card with gold inline-start bar 3px (logical `border-inline-start`) + `--sg-sh-2`, icon tile gold gradient. Progress `.st-bar` 2px gold glow. Panel: radius `--sg-r-xl`, `box-shadow: var(--sg-sh-3)`, media side with gradient overlay into the body edge, `.eyebrow` "01 / 06" in Inter 700 tabular. `.sp-svc` items with check icons in gold, hover moves 3px inline-end. Panel swap animation (2.4).
5. **Steps** `section.steps-sec`
   - A: `.sec-head` `data-reveal`, h2 `data-split`; `ol.steps` `data-stagger="120" data-reveal="fade"` (so the parent itself also gets `.is-in` for the connector line); each `li` `data-reveal="up" data-tilt="4" data-spotlight`; `.steps-cta` `data-reveal="up"`; its gold button `data-magnetic data-shine="idle"`.
   - B: cards with big outlined numeral `.step-n` (Inter 700 3.2rem, transparent fill, `-webkit-text-stroke: 1px var(--gold3)`, fills with gold gradient on card hover), icon in 64px circle with gold ring that rotates its conic border slowly on hover. Connector line draws.
6. **About split** `section.sec` (with `.split`)
   - A: text column div `data-reveal="start"`; its h2 `data-split`; `.stats` `data-stagger`; each stats `div` `data-reveal="scale" data-spotlight data-tilt="4"`; counters: `b` values `6`, `60+`, `6`, `1` get `data-count="6"`, `data-count="60" data-count-suffix="+"`, `data-count="6"`, `data-count="1"`.
   - B: stats tiles: surface card, numeral Inter 700 `clamp(2.6rem,5vw,3.6rem)` in `.gold`-style gradient (`--sg-grad-text`), label `--mut`. 2x2 grid, 16px gap.
7. **IT band** `section.itband` + `data-tone="dark" data-glow`
   - A: add `<div class="sg-aurora" aria-hidden="true"></div>` as first child of the section; `.itband-in` remove `reveal`, add `data-stagger`; its children: `img` `data-reveal="scale"`, text `div` `data-reveal="up"`, `a.btn` `data-reveal="up" data-magnetic data-shine="idle"`; the h2 `data-split`.
   - B: `--band` background, logo on a glass plate (`--sg-r-lg`, padding 18px), external link button gold. Section top and bottom hairlines.
8. **Why choose us** `section.sec`
   - A: `.sec-head` `data-reveal`, h2 `data-split`; `why()` output: `.grid4` gets `data-stagger`, each `.why` `data-reveal="up" data-tilt="5" data-spotlight` (A edits the `why` helper, affects About too); `ul.approvals` `data-stagger="50"`, each `li` `data-reveal="fade"`.
   - B: `.why` cards: icon in 56px rounded-square tile with `--sg-gold-a10` bg and gold icon, hover tile turns gold gradient with dark icon. Approvals: pills (`--sg-r-pill`), glass/porcelain, check icon gold.
9. **FAQ** (EN only, from `faqSection`)
   - A: `.sec-head` `data-reveal`, h2 `data-split`; `.faq` `data-stagger="60"`; each `details` `data-reveal="up"`.
   - B: accordion cards 16px radius, summary 1.02rem 600, plus icon drawn with two bars rotating to X (45deg), open state gold border + `--sg-sh-1`, smooth height (2.4). Keep native `details/summary` (keyboard and aria are native).
10. **CTA** (`cta()` helper, used on most pages)
    - A: `.cta-in` remove `reveal`, add `data-tone="dark" data-reveal="scale" data-border="spin" data-glow`; add `<div class="sg-aurora" aria-hidden="true"></div>` as first child of `.cta-in`; its `h2` `data-split`; WhatsApp gold button `data-magnetic data-shine="idle"`; the two line buttons `data-magnetic`.
    - B: dark panel in both modes (`--cta` dark value), radius `--sg-r-xl`, padding `clamp(32px,5vw,64px)`, content above aurora (`position:relative; z-index:1`).

### 3.3 Page head (`head()` helper: companies, services, about, contact, booking, 404)
A: change `head()` to output:
```
<section class="phead" data-tone="dark" data-glow><div class="sg-aurora" aria-hidden="true"></div><div class="wrap phead-in">${nav}<p class="eyebrow" data-intro="2">${eyebrow}</p><h1 data-intro="3" data-intro-keep>${h1}</h1>${p ? `<p class="lead" data-intro="4">${p}</p>` : ''}</div></section>
```
and `crumbs()` adds `data-intro="1"` on `nav.crumbs` (affects cohero too). Add an optional 5th param `cls` to `head()` appended to the section class; the 404 page passes `' phead--404'`.

B: `.phead` is a dark band in both modes: `background: radial-gradient(ellipse at 85% 0%, rgba(212,175,55,.22), transparent 55%), linear-gradient(180deg, #0b0b0c, #111113)`; `::before` dot grid; `::after` the skyline image `url(../img/hero-skyline.webp)` bottom inline-end, width min(720px, 70%), opacity .28, `mix-blend-mode: screen`, mirrored in RTL (`scale: -1 1`), masked to fade at top. Padding `clamp(84px,11vw,140px) 0 clamp(56px,7vw,88px)`. h1 sizes per 1.2, `.lead` `--txt2` max 46em. Bottom edge: 1px `--sg-hairline`. Remove the old light-mode cream `.phead` look (override `[data-theme=light] .phead`).
`.phead--404 .eyebrow`: Inter 700 `clamp(5rem,16vw,11rem)` line-height .9, letter-spacing -.05em, transparent fill with `-webkit-text-stroke: 1px rgba(243,215,122,.7)`, gold gradient sweeping through the stroke (`background-clip:text` at 25% opacity) and `sg-shine` animation.

### 3.4 Companies index (`companies.html`)
- phead (3.3), h1 gets gold span (3.9).
- A: `.cogrid` `data-stagger="90"`; `card()` helper: `article.co` remove `reveal`, add `data-reveal="up" data-tilt="3" data-spotlight`; `.co-media` add `data-reveal="img"`; `.co-actions .btn-gold` `data-magnetic`.
- B: bento layout kept (`co-wide` spans 2 columns). Card: surface, radius `--sg-r-lg`, image zoom 1.06 on hover (existing), `.co-num` becomes Inter 700 3rem outlined (`-webkit-text-stroke: 1px rgba(243,215,122,.85)`), eyebrow with icon, tags pills `--sg-gold-a06` bg. Hover: lift, gold border, spotlight. `.co-ext` link small with ext icon.
- CTA (3.2.10).

### 3.5 Company page template (`interior-technical.html` etc., 6 pages x 2 langs)
1. **Company hero** `section.cohero` + `data-tone="dark" data-glow`.
   - A: `img.cohero-bg` add `data-parallax="0.08"` (keeps Ken Burns `kb` on transform; parallax uses `translate`); `.cohero-copy` children: `.eyebrow` `data-intro="2"`, `h1` `data-intro="3" data-intro-keep`, `.lead` `data-intro="4"`, `.btns` `data-intro="5"`; `.cohero-mark` `data-intro="6"`; first `.btn-gold` `data-magnetic data-shine="idle"`; the other two `data-magnetic`. Add `<div class="sg-aurora" aria-hidden="true"></div>` only on `.cohero-logo` variant (IT Oasis Gulf, no photo), as first child.
   - B: min-height `min(78vh, 680px)`; overlay gradient kept (direction mirrored in RTL, existing); add bottom 1px hairline and a 120px fade into `--bg` at the bottom edge for continuity. h1 per 1.2 at up to 4.25rem, `.lead` `--txt2`. Buttons row gap 12px, at 390px buttons full-width stacked.
2. **Services + quote aside** `section.sec > .wrap.split.top`
   - A: the services `h2.h3` `data-reveal="up"`; `ul.svc.svc2` `data-stagger="50"`; each `li` remove `reveal`, add `data-reveal="up" data-spotlight`; `aside.side` remove `reveal`, add `data-reveal="end" data-border="spin"`; inside aside: `.side-img` `data-reveal="img"` (wrap NOT needed), first `.btn-gold` `data-magnetic data-shine="idle"`.
   - B: services as 2-col grid of 14px-radius tiles; icon check in 28px gold-tinted circle; `.svc-book` link appears as a small gold pill on the inline-end, slides in 6px on hover (always visible on touch). Aside: sticky `top: 96px` (existing), glass/porcelain card, radius `--sg-r-xl`, spinning border, image radius 14px.
3. **FAQ** (EN) as 3.2.9.
4. **Other companies** `section.sec.alt`: A: `h2.h3` `data-reveal="up"`, `ul.pills.dark` `data-stagger="50"`, each `li` `data-reveal="fade"`. B: pills 48px tall, icon gold, hover lift + gold border + `--sg-sh-1`.
5. **CTA**.

### 3.6 Services (`services.html`)
- phead (3.3) with gold span.
- A: `.svc-tools` remove `reveal`, add `data-reveal="up"`; each `.svc-group` `data-reveal="up"`; each `ul.svc-cards` `data-stagger="40"` (children `li` get NO `data-reveal`: the filter toggles `hidden`, so they only use the `@starting-style` fade; the stagger index still offsets nothing harmful). Areas section: `.sec-head` `data-reveal`, h2 `data-split`, `ul.approvals` `data-stagger="40"` + `li` `data-reveal="fade"`. Each `.svc-cards li` `data-spotlight`.
- B: `.svc-tools` becomes a sticky glass toolbar: `position: sticky; top: 72px` (62px when header scrolled is fine: use 64px), `z-index: 40`, padding 12px, radius `--sg-r-lg`, so search and chips stay reachable while scrolling. Search field 48px tall pill with gold focus ring. Chips: `.chip.on` gold gradient; chip hover gold border. Group headings: icon in gold tile + company link with underline effect, top hairline between groups. Service cards 3/2/1 columns (existing breakpoints), radius 14px, `.link` "Book" in gold. `#svc-none` styled as a dashed-border notice card.

### 3.7 About (`about.html`)
- phead with gold span.
- A: mission/promise text div remove `reveal`, add `data-reveal="start"`; both its `h2` get `data-split`; `.ceo` remove `reveal`, add `data-reveal="end" data-spotlight`; `.ceo-photo` add `data-reveal="img"` (the img itself: wipe applies via clip-path on the element). Second section uses `why()` (3.2.8). CTA.
- B: mission column large type: `p` 1.1rem `--txt2`, max 36em. CEO card: radius `--sg-r-xl`, portrait 240px wide with 2px gold gradient frame (padding-box/border-box gradient border, radius 18px) and soft gold glow; name Inter 700 1.4rem; role eyebrow; quote in accent serif (1.2). Card has a subtle `.sg-aurora`-like radial (CSS background only, no markup).

### 3.8 Contact (`contact.html`) and Booking (`booking.html`)
Contact:
- A: left column div remove `reveal`; `ul.cards` `data-stagger="70"`, each `li` `data-reveal="up" data-spotlight`; `iframe.map` `data-reveal="fade"`; `form#quote.form` remove `reveal`, add `data-reveal="end" data-border="spin"`; its WhatsApp submit button `data-magnetic data-shine="idle"`.
Booking:
- A: `form#book.form` remove `reveal`, add `data-reveal="start" data-border="spin"`; WhatsApp button `data-magnetic data-shine="idle"`; right column div remove `reveal`; its `ul.cards` `data-stagger="70"`, each `li` `data-reveal="up" data-spotlight`.
B (both):
- `.cards li`: surface card radius 16px, icon in 52px gold-tinted rounded tile; links gold with underline effect; open badge pill.
- `.map`: radius `--sg-r-lg`, 1px gold-tinted border, `filter: grayscale(.35) contrast(1.05)`; dark mode adds `filter: grayscale(.6) invert(.9) hue-rotate(180deg) brightness(.95)` ONLY under `[data-theme=dark]` (decorative, map remains readable). Height 320px.
- `.form`: glass/porcelain, radius `--sg-r-xl`, padding `clamp(22px,3vw,36px)`, spinning border; labels 600 .9rem; inputs 50px tall, radius 12px, background `--input`, border `--line`; focus: border `--gold3` + `box-shadow: var(--sg-ring)` + label color gold (`label:focus-within`); invalid after submit attempt: `.err` visible shakes once (`sg-shake` 400ms, translate only). Select gets custom chevron via `background-image` data SVG (inline-end, mirrored in RTL via `background-position`). Date input keeps `dir="ltr"`. Buttons row: 2 equal columns at >= 600px, stacked full width below.
- Do not change element order, names, ids, `novalidate`, `data-via`.

### 3.9 Gold phrase spans (A, exact; text unchanged, just wrapped)
| Where | EN | AR |
|---|---|---|
| Home deck h2 | `Meet the companies <span class="gold">behind the group</span>` | `تعرّف على <span class="gold">شركات المجموعة</span>` |
| Home showcase h2 | `Six companies. <span class="gold">One trusted group.</span>` | `ست شركات. <span class="gold">مجموعة واحدة موثوقة.</span>` |
| Companies h1 | `Specialist services. <span class="gold">One trusted group.</span>` | `خدمات متخصصة. <span class="gold">مجموعة واحدة موثوقة.</span>` |
| About h1 | `People. Solutions. <span class="gold">Sustainability.</span>` | `الناس. الحلول. <span class="gold">الاستدامة.</span>` |
| Services h1 | `Every service, <span class="gold">one trusted group</span>` | `كل الخدمات، <span class="gold">مجموعة واحدة موثوقة</span>` |
| Contact h1 | `Let's work <span class="gold">together</span>` | `لنعمل <span class="gold">معاً</span>` |
| Booking h1 | `Book a site visit <span class="gold">or consultation</span>` | `احجز زيارة موقع <span class="gold">أو استشارة</span>` |
Wrap ONLY inside the h1/h2 argument. "Book a site visit or consultation" (EN and AR) also appears in the booking meta description: never touch title/desc strings. Verify after build that the visible text of these headings (textContent) is byte-identical to before.

### 3.10 404
- `head('404', nf[0], nf[1], '', ' phead--404')`; button section: `.wrap` gets `data-reveal="up"`; the button `data-magnetic data-shine="idle"`. EN 404 keeps `<base href="/">` behaviour (paths are root-relative via base; the new `assets/css/ui.css` and `assets/js/motion.js` links use `${base}` like the others so they resolve).

### 3.11 Classes/IDs that app.js relies on (MUST keep, names and structure)
`.burger`, `#nav` (+ `.open`), `#yr`, `.theme-t`, `meta[name=theme-color]`, `.hdr` (+ `.scrolled`), `.progress`, `.to-top` (+ `.show`), `.hero-sky`, `[data-open]` (+ `.is-open/.is-closed`), `.show-tab` with `id="st-*"`/`aria-controls="sp-*"`/`aria-selected`/`tabindex`, `.show-panel` `id="sp-*"` with `hidden`, `.st-bar`, `.playing`, `.show-in` (+ `data-touched`), `#qcard`, `#q-quote`, `input[name=s][data-wa]`, `[data-deck]`, `.dcard` (+ `.p0 .p1 .p2`), `[data-go]`, `[data-install]`, `#ios-tip`, `.ios-x`, `.tip-add`, `.tip-chrome`, `.tip-or`, `[data-os]`, `#quote`, `#book`, `.err`, `button[data-via]`, form field names (`name, phone, service, area, date, time, msg`), `#svc-q`, `.svc-group[data-g]`, `li[data-t]`, `#svc-none`, `.chips`, `.chip` (+ `.on`, `data-f`). CSS also relies on `.dock`, `.dock-main`, `.wa-float`, `.hdr-quote`, `.hdr-book`, `.nav-lang`, `.tb-*`, `.qopt`, `.qbar`, `.hero-center`.

---

## 4. File ownership and contracts

### 4.1 Owners
| Implementer | Owns (may edit) | Must not edit |
|---|---|---|
| A (markup) | `build.js` only; runs `node build.js` and `node profile.js` to regenerate | styles.css, app.js, assets/** |
| B (styles) | NEW `assets/css/ui.css` only | styles.css (no edits at all, override instead; dead rules stay), build.js, any JS |
| C (motion) | NEW `assets/js/motion.js`; minimal listed edits in `app.js`; the listed edit in `assets/theme.js` | build.js, any CSS |

Nobody touches `.github/`, generated `.html` by hand, `profile.js` source, images, fonts, manifest.

### 4.2 Exact tags A adds in `page()` head and body
In `<head>`, replace the current `fonts` preload line with:
- EN: `<link rel="preload" href="${base}assets/fonts/Inter-400-latin.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="${base}assets/fonts/Inter-700-latin.woff2" as="font" type="font/woff2" crossorigin>`
- AR: `<link rel="preload" href="${base}assets/fonts/Tajawal-700-arabic.woff2" as="font" type="font/woff2" crossorigin>`
On the home page `preload`, remove the unused Great Vibes preload (keep the hero image preload exactly).
Directly after `<link rel="stylesheet" href="${base}styles.css">` add:
```
<link rel="stylesheet" href="${base}assets/css/ui.css">
```
Directly after `<script src="${base}app.js" defer></script>` add:
```
<script src="${base}assets/js/motion.js" defer></script>
```
Keep `<script src="${base}assets/theme.js"></script>` where it is (sync, before CSS). No inline scripts, no inline styles, no `style=""` attributes. JSON-LD script stays as is (it is data, already allowed).

### 4.3 HTML classes and attribute contract
| Hook | Set by | Values | Consumer |
|---|---|---|---|
| `html.js-motion` | theme.js (C) | present unless reduced motion; removed by failsafe at 3000ms | B (hidden initial states) |
| `html.motion-ready` | motion.js (C) | added first thing | theme.js failsafe |
| `data-tone="dark"` | A | flag | B (dark token scope in light mode) |
| `data-reveal` | A | `up` (default if empty), `fade`, `start`, `end`, `scale`, `blur`, `img` | C observes; B styles initial/in states |
| `.is-in` | C | added once when revealed (also on `data-split`, `data-stagger`, `data-count` hosts) | B |
| `data-reveal-delay` | A | ms integer | C sets `--sg-delay` |
| `data-stagger` | A | empty or ms integer | C sets `--sg-i` on direct children and `--sg-stagger` on parent |
| `--sg-i`, `--sg-delay`, `--sg-stagger` | C | integer / ms | B uses in `transition-delay` |
| `data-split` | A | flag (words) | C creates `.sg-w > .sg-wi`, sets `--sg-wi`, adds `.is-split` |
| `data-intro` | A | `1`..`7` | B only (CSS keyframes); C ignores |
| `data-intro-keep` | A | flag (no opacity in intro) | B |
| `data-count` / `data-count-suffix` | A | integer / string from existing text | C |
| `data-tilt` | A | empty or max deg | C sets `--sg-rx/--sg-ry`; B composes transform |
| `data-spotlight` | A | flag | C sets `--mx/--my`, adds `.is-spot` while hovered; B draws |
| `data-magnetic` | A | flag | C sets `--sg-mx/--sg-my`; B composes `.btn` transform |
| `data-shine` | A | empty (hover only) or `idle` | B only |
| `data-parallax` | A | speed float (0.05 to 0.2) | C sets `--sg-py`; B uses `translate` |
| `data-glow` | A | flag | C injects `.sg-glow`, sets `--sg-gx/--sg-gy`, toggles `.is-glow`; B styles |
| `data-border="spin"` | A | `spin` | B only |
| `.sg-aurora` | A (empty div, aria-hidden) | n/a | B |
| `.sg-scrollcue` | A (empty span, aria-hidden) | n/a | B |
| `.phead-in`, `.phead--404` | A | n/a | B |
| `.gold` spans | A (3.9) | n/a | B (existing class re-skinned) |
| `--p` on `.to-top` | app.js (C edit) | 0..1 | B ring |

Pointer-fine gate for C: `matchMedia('(hover: hover) and (pointer: fine)')`. Tilt, spotlight, magnetic, glow only bind when it matches.

### 4.4 C: motion.js requirements and app.js / theme.js edits
motion.js:
- IIFE, `'use strict'`, no globals, no dependencies, target < 9 KB unminified-friendly (keep it readable). Runs after app.js (both `defer`).
- Order: add `motion-ready`; if no `js-motion`, bind nothing that hides; still allow nothing else (exit). Else: split all `[data-split]` (synchronously, before observing), assign stagger indices, set delays, create ONE IntersectionObserver for reveals (threshold .15, rootMargin `0px 0px -8% 0px`), observe `[data-stagger]` and every `[data-reveal]`, `[data-split]`, `[data-count]` that is not inside a `[data-stagger]`; on intersect add `.is-in` (to the target and, for stagger parents, to all descendant `[data-reveal]`, `[data-split]`, `[data-count]`), start counters inside, unobserve.
- Counters: run when their host (or the stagger parent containing them) gets `.is-in`.
- Pointer effects: one delegated `pointermove` listener on `document` (passive) that finds the closest `[data-tilt],[data-spotlight],[data-magnetic],[data-glow]` hosts; cache `getBoundingClientRect()` on `pointerenter`/first move and on `scroll`/`resize` invalidate the cache; writes happen in one rAF per frame; `pointerleave` resets.
- Parallax: separate IO (rootMargin 20%) toggling an active set; a passive `scroll` listener that schedules one rAF only when the set is non-empty; read `scrollY` once per frame; write `--sg-py` with `style.setProperty`. Do not read layout per frame except once on activation and on resize.
- `will-change` is never set permanently.
- Never alter text content except counters (and they end on the original string). Split must preserve every character and whitespace exactly (verify `el.textContent` before === after).
- Listen to `matchMedia('(prefers-reduced-motion: reduce)')` change: if it becomes reduce, add `.is-in` to everything and remove `js-motion`.

app.js edits (only these):
1. In `onScroll`, delete the hero skyline drift line (`if (sky && !still ...) sky.style.transform = ...`) and the `sky` variable. Parallax moves to motion.js; the RTL mirror stays in CSS.
2. Delete the "Cursor spotlight on cards" `pointermove` block (replaced by `data-spotlight`).
3. Delete `countUp`, the "Stagger" block, and the final `.reveal` IntersectionObserver block (A removes all `.reveal`).
4. In `onScroll`, add `if (top) top.style.setProperty('--p', h > 0 ? Math.min(1, y / h).toFixed(3) : 0);` (to-top ring).
5. Fix the stale comment "dark is the default" to "light is the default" (comment only).
Everything else in app.js stays byte-identical.

theme.js edit (append inside the existing IIFE, after `setAttribute`):
```
try { if (!matchMedia('(prefers-reduced-motion: reduce)').matches) { var d = document.documentElement; d.classList.add('js-motion'); setTimeout(function () { if (!d.classList.contains('motion-ready')) d.classList.remove('js-motion'); }, 3000); } } catch (e) {}
```

### 4.5 B: ui.css structure (in this order)
1. `@property` registrations. 2. Tokens (`:root`, `[data-theme=light]`, `[dir=rtl]`, `[data-theme=light] [data-tone=dark]`). 3. Base typography overrides (h1-h3, `.h3`, eyebrow, lead, numerals, RTL). 4. Buttons, links, focus. 5. Chrome: topbar, header, nav, mobile nav, dock, floats, to-top, ios-tip, footer. 6. Decorative: aurora, scrollcue, glow, border-spin, shine, gold text, hairlines. 7. Components per section (3.2 to 3.10). 8. Motion states (`data-reveal`, `data-intro`, split, stagger, panel swap, faq, starting-style). 9. Keyframes (`sg-intro`, `sg-intro-keep`, `sg-shine`, `sg-shine-idle`, `sg-spin`, `sg-drift`, `sg-wipe`, `sg-cue`, `sg-shake`, `sg-ring`). 10. Responsive (1100, 1000, 860, 600, 420 breakpoints, mobile first where new). 11. Reduced motion + print.
Rules: logical properties only (`margin-inline`, `padding-inline-start`, `inset-inline-end`, `border-inline-start`, `text-align: start`); every directional keyframe uses `--sg-dir`. Match or exceed styles.css specificity instead of `!important` (allowed only to defeat an existing `!important`). Animate only `transform`/individual transforms/`opacity`/`filter`/`clip-path`/registered custom props, and `background-position` for gradient shine on text/buttons. Keep total ui.css under ~45 KB.

### 4.6 Integration order
A, B, C work in parallel. Integrator: run `node build.js && node profile.js`, then verify section 5. If `.reveal` is still present anywhere after A, it is a defect (it would no longer animate after app.js edit 3 and is harmless but inconsistent).

---

## 5. Acceptance checklist

Content integrity
- [ ] For every page EN + AR, `document.body.innerText` (with JS disabled) is identical to the pre-redesign build except whitespace. Diff the before/after text dumps.
- [ ] No em dash (U+2014) in any generated file, build.js strings, ui.css or motion.js comments.
- [ ] Title, meta description, canonical, hreflang, OG, JSON-LD, CSP meta unchanged (diff `<head>` apart from the font preloads and two new tags).
- [ ] After JS runs, split headings have identical `textContent`; counters end on their original strings.

Visual
- [ ] All h1/h2/h3 use Inter (EN) / Tajawal (AR); serif only in `.brand` and CEO quote.
- [ ] Palette: only existing hexes and the derived `--sg-*` values in 1.4.
- [ ] Logo image dimensions and proportions unchanged (56x56, 48x48 when scrolled), colours untouched.
- [ ] Light mode: hero, phead, cohero, IT band, CTA panel, footer, topbar, qbar render dark; other sections cream/white; both modes look intentional (screenshot home, interior-technical, services, about, contact, booking, companies, 404 in both modes).
- [ ] "Book a visit" and "Get a quote" visible above the fold on every page at 1366x768 and at 390x844 (dock).

Motion
- [ ] Hero text visible within 300ms of first paint; `.hx-big` and every h1 never at opacity 0.
- [ ] Sections reveal once on scroll; staggered grids cascade; split headings rise word by word; counters count; tilt/spotlight/magnetic only with a mouse; parallax smooth; spinning borders on qbar, CTA, aside, forms.
- [ ] Showcase tabs, deck, ticker, quick bar radio swap, theme toggle, mobile menu, FAQ open/close, services filter all still work and animate.
- [ ] No console errors; no CSP violations (check DevTools console with the CSP meta active).

Progressive enhancement / reduced motion
- [ ] With JS disabled: all content visible, nothing stuck at opacity 0, layout intact.
- [ ] With motion.js blocked (DevTools request blocking): content becomes visible by 3s.
- [ ] Emulate `prefers-reduced-motion: reduce`: no reveals, no loops (aurora, shine, spin, ticker, pulse, scroll cue), content fully visible immediately.

Accessibility
- [ ] WCAG AA: body text >= 4.5:1, large text and UI >= 3:1 in both themes (check `--mut` on `--bg2`, gold text on cream, button text on gold).
- [ ] Visible focus ring on every interactive element (gold outline + ring), including chips, tabs, qopt tiles, dock, deck dots.
- [ ] Keyboard: tabs arrow keys, deck dots, FAQ (Enter/Space), mobile menu, skip link, ios-tip Escape.
- [ ] Decorative elements `aria-hidden="true"`; split spans do not change accessible names.

Performance
- [ ] Lighthouse mobile on home and a company page: Performance >= 90, CLS < 0.05, LCP < 2.5s (local), TBT < 150ms.
- [ ] No scroll handlers except app.js existing one and motion.js parallax (rAF, active-only). No forced reflow warnings in the Performance panel while scrolling.
- [ ] Only transform/opacity/filter/clip-path/background-position animate (check with Rendering > Paint flashing; no large repaints per frame).

RTL
- [ ] `ar/` pages: all directional reveals, wipes, shine sweeps, underlines, progress, steps line, nav underline mirror correctly; skyline mirrored; no Latin letter-spacing on Arabic; no clipped Arabic ascenders/descenders in split headings.

Responsive
- [ ] 390px wide: no horizontal scroll (check `document.documentElement.scrollWidth === 390`), dock visible and not overlapping content (body padding-bottom), qbar usable, services toolbar sticky and not covering headings, forms full width.
- [ ] 768px, 1024px, 1366px, 1920px screenshots reviewed.

Build
- [ ] `node build.js` and `node profile.js` run without errors; `git status` shows only build.js, generated pages, sitemap.xml, app.js, assets/theme.js, assets/css/ui.css, assets/js/motion.js, docs/redesign-spec.md changed/added.
