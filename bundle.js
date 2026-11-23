// Bundles and minifies the editable sources into the files the pages load. Called by build.js (node build.js).
//   CSS  assets/css/site-en.min.css  = assets/fonts-en.css + styles.css + assets/css/ui.css   (cascade order kept)
//        assets/css/site-ar.min.css  = assets/fonts-ar.css + styles.css + assets/css/ui.css
//        assets/css/hero.min.css     = assets/css/hero.css          (home page only, linked after the site bundle)
//   JS   assets/js/site.min.js       = app.js + assets/js/motion.js (deferred, every page)
//        assets/js/hero.min.js       = assets/js/hero.js            (home page only)
// Edit the source files, never the .min files. Minifier: esbuild through npx (nothing is added to the repo).
// A bundle is only rebuilt when its inputs change; the first line of each output records an input hash.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const ROOT = __dirname;
const ESBUILD = 'esbuild@0.25.5';
const rd = f => fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/\r\n/g, '\n');
const sha = s => crypto.createHash('sha1').update(s).digest('hex');

function minify(src, loader) {
  try {
    return execSync('npx --yes ' + ESBUILD + ' --minify --legal-comments=none --loader=' + loader, { input: src, encoding: 'utf8', maxBuffer: 1 << 26, stdio: ['pipe', 'pipe', 'pipe'] });
  } catch (e) {
    console.warn('bundle: esbuild unavailable, writing the unminified bundle (' + String(e.message).split('\n')[0] + ')');
    return src;
  }
}

function make(out, parts, loader, post) {
  const src = parts.map(p => (post ? post(rd(p), p) : rd(p))).join(loader === 'js' ? ';\n' : '\n');
  const key = sha(ESBUILD + loader + src).slice(0, 12);
  const file = path.join(ROOT, out);
  let body;
  try {
    const cur = fs.readFileSync(file, 'utf8');
    if (cur.startsWith('/*' + key + '*/')) body = cur;
  } catch (e) { /* not built yet */ }
  if (!body) {
    body = '/*' + key + '*/' + minify(src, loader).trim() + '\n';
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, body);
  }
  return { file: out, v: sha(body).slice(0, 8) };
}

module.exports = function bundle() {
  // fonts css sits in assets/, the bundle in assets/css/, so font urls move one level up
  const fontFix = (css, p) => (/fonts-/.test(p) ? css.replace(/url\(fonts\//g, 'url(../fonts/') : css);
  return {
    css: {
      en: make('assets/css/site-en.min.css', ['assets/fonts-en.css', 'styles.css', 'assets/css/ui.css'], 'css', fontFix),
      ar: make('assets/css/site-ar.min.css', ['assets/fonts-ar.css', 'styles.css', 'assets/css/ui.css'], 'css', fontFix),
      hero: make('assets/css/hero.min.css', ['assets/css/hero.css'], 'css'),
    },
    js: {
      site: make('assets/js/site.min.js', ['app.js', 'assets/js/motion.js'], 'js'),
      hero: make('assets/js/hero.min.js', ['assets/js/hero.js'], 'js'),
    },
  };
};

if (require.main === module) console.log(JSON.stringify(module.exports(), null, 1));
