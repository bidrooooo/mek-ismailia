// صفحة عامة لفعالية واحدة (للشير): بتفتح من غير دخول، وفيها بيانات الفعالية بس.
// مفيش أي بيانات متطوعين ولا أرقام تبرعات. البيانات من نفس /api/gs?api=events (العامة).
// الرابط المختصر: /e/1023k7 (شهر+يوم+حرفين من اسم الفعالية). والقديم /e?d=2026-10-23&t=اسم الفعالية لسه شغال.
const GS = 'https://script.google.com/macros/s/AKfycbwBlKVviiYyzjdHLlJhpzTbl2DsHEpVujv-PfBwRLx4pEjG5UuvQj7Lgqw4tpbumKxo/exec';
const SITE = 'https://mek-ismailia.vercel.app';
const FORM = 'https://forms.gle/H9G1W4HmCFJsfvEJ7';
const NEW_VOL = 'http://volunteer.frappe.cloud/mek_volunteer/new';
const DAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const TYPES = { elderly: 'دار مسنين', orphans: 'دار أيتام / رضع', special: 'ذوي الهمم', hospital: 'مستشفى', mothers: 'أمهات', training: 'تدريب', meeting: 'اجتماع متطوعين', other: 'فعالية' };

const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const url = u => /^https?:\/\/\S+$/i.test(String(u || '')) ? String(u) : '';
const n = x => Number(x || 0).toLocaleString('ar-EG');
function longDate(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s || '');
  if (!m) return '';
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return DAYS[d.getUTCDay()] + ' ' + n(d.getUTCDate()) + ' ' + MONTHS[d.getUTCMonth()] + ' ' + n(d.getUTCFullYear()).replace(/[٬,]/g, '');
}
const norm = s => String(s || '').replace(/\s+/g, ' ').trim();
/* كود قصير ثابت لكل فعالية: MMDD + حرفين من hash الاسم (نفس الحساب في js/share.js) */
function shortCode(date, title) {
  const s = norm(title); let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return String(date).slice(5, 7) + String(date).slice(8, 10) + ('0' + (h % 1296).toString(36)).slice(-2);
}
function findByCode(data, c) {
  const lists = [['events', data.events], ['upcoming', data.upcoming], ['past', data.past]];
  for (const [kind, list] of lists) for (const ev of list || []) if (ev.date && ev.title && shortCode(ev.date, ev.title) === c) return { kind, ev };
  return null;
}
/* صورة المعاينة (واتساب/فيسبوك/ستوري): صورة الفعالية بمقاس 1200×630 JPG من خلال /api/og، وإلا صورة البوابة */
function ogImage(ev) {
  const m = /\/d\/([\w-]{20,})|[?&]id=([\w-]{20,})/.exec(String((ev && ev.image) || ''));
  if (m) return { src: SITE + '/api/og?i=' + (m[1] || m[2]), w: 1200, h: 630 };
  return { src: SITE + '/assets/images/hero.jpg', w: 1280, h: 960 };
}

async function getData(host) {
  const tries = [];
  if (/^[\w.-]+\.vercel\.app$/.test(host || '')) tries.push('https://' + host + '/api/gs?api=events');
  tries.push(SITE + '/api/gs?api=events', GS + '?api=events');
  for (const u of tries) {
    try { const r = await fetch(u, { redirect: 'follow' }); if (r.ok) return await r.json(); } catch (e) { /* اللي بعده */ }
  }
  return null;
}

function find(data, d, t) {
  const lists = [['events', data.events], ['upcoming', data.upcoming], ['past', data.past]];
  const want = norm(t);
  for (const pass of [0, 1]) {
    for (const [kind, list] of lists) {
      for (const ev of list || []) {
        if (ev.date !== d) continue;
        const name = norm(ev.title);
        if (pass === 0 ? name === want : (name.includes(want) || want.includes(name))) return { kind, ev };
      }
    }
  }
  return null;
}

function videoEmbed(link) {
  const yt = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{11})/.exec(link || '');
  return yt ? '<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/' + yt[1] + '" title="فيديو الفعالية" allowfullscreen loading="lazy"></iframe></div>' : '';
}

function page({ title, desc, image, shareUrl, body }) {
  const img = image && typeof image === 'object' ? image : { src: SITE + '/assets/images/hero.jpg', w: 1280, h: 960 };
  return '<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<title>' + esc(title) + ' – متطوعي مصر الخير بالإسماعيلية</title>' +
    '<meta name="description" content="' + esc(desc) + '">' +
    '<meta property="og:type" content="website"><meta property="og:locale" content="ar_EG">' +
    '<meta property="og:site_name" content="متطوعي مصر الخير – الإسماعيلية">' +
    '<meta property="og:title" content="' + esc(title) + '"><meta property="og:description" content="' + esc(desc) + '">' +
    '<meta property="og:image" content="' + esc(img.src) + '"><meta property="og:image:secure_url" content="' + esc(img.src) + '">' +
    '<meta property="og:image:type" content="image/jpeg"><meta property="og:image:width" content="' + img.w + '"><meta property="og:image:height" content="' + img.h + '">' +
    '<meta property="og:image:alt" content="' + esc(title) + '"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="' + esc(img.src) + '">' +
    '<link rel="canonical" href="' + esc(shareUrl) + '">' +
    '<meta property="og:url" content="' + esc(shareUrl) + '">' +
    '<link rel="icon" href="/assets/mek-logo.jpg">' +
    '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
    '<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600;700&display=swap" rel="stylesheet">' +
    '<style>' + CSS + '</style></head><body>' +
    '<header class="top"><a href="/" class="brand"><img src="/assets/mek-logo.jpg" alt=""><span><b>متطوعي مصر الخير</b><small>مكتب الإسماعيلية</small></span></a></header>' +
    '<main>' + body + '</main>' +
    '<footer><a href="' + esc(NEW_VOL) + '" target="_blank" rel="noopener">أول مرة تتطوع معانا؟ سجّل بياناتك</a><span>مؤسسة مصر الخير – مكتب الإسماعيلية</span></footer>' +
    '<script>' + JS + '</script></body></html>';
}

const CSS = [
  ':root{--g:#01775f;--gd:#0b4d3c;--sand:#c9a27a;--bg:#f6f3ee;--card:#fff;--ink:#1f2b26;--mut:#5d6b64;--line:#e4e8e4}',
  '*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.65 "IBM Plex Sans Arabic",system-ui,"Segoe UI",Tahoma,sans-serif}',
  '.top{display:flex;align-items:center;justify-content:center;padding:12px 16px;background:var(--card);border-bottom:1px solid var(--line)}',
  '.brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--gd)}.brand img{width:40px;height:40px;border-radius:10px;object-fit:cover}.brand b{display:block;font-size:1rem}.brand small{color:var(--mut);font-size:.8rem}',
  'main{max-width:640px;margin:0 auto;padding:16px}',
  '.card{background:var(--card);border:1px solid var(--line);border-radius:20px;overflow:hidden;box-shadow:0 6px 24px rgba(11,77,60,.08)}',
  '.media{position:relative;aspect-ratio:16/10;background:#e7f3ef}.media img{width:100%;height:100%;object-fit:cover;display:block}',
  '.badge{position:absolute;top:12px;right:12px;padding:5px 12px;border-radius:999px;font-size:.82rem;font-weight:700;background:#fff;color:var(--gd)}.badge.open{background:var(--g);color:#fff}.badge.done{background:var(--gd);color:#fff}',
  '.body{padding:18px}h1{margin:0 0 6px;font-size:1.4rem;line-height:1.35;color:var(--gd)}',
  '.chip{display:inline-block;font-size:.78rem;color:var(--gd);background:#e7f3ef;border-radius:999px;padding:2px 10px;margin-bottom:10px}',
  '.meta{list-style:none;margin:0 0 12px;padding:0;display:grid;gap:6px;color:var(--mut)}.meta b{color:var(--ink);font-weight:600}',
  '.meta a{color:var(--g);font-weight:600}',
  '.desc{white-space:pre-line;margin:0 0 14px}',
  '.note{background:#fff7ec;border:1px solid #f1dfc6;color:#7a4b10;border-radius:12px;padding:10px 12px;margin:0 0 14px;font-size:.92rem}',
  '.big{display:flex;align-items:center;gap:12px;background:#e7f3ef;border-radius:14px;padding:12px 14px;margin:0 0 14px}.big b{font-size:1.8rem;color:var(--g);line-height:1}.big span{color:var(--gd)}',
  '.btns{display:grid;gap:10px}.btn{display:flex;align-items:center;justify-content:center;gap:8px;min-height:48px;border-radius:14px;padding:10px 16px;font:inherit;font-weight:700;text-decoration:none;border:0;cursor:pointer}',
  '.btn.pri{background:var(--g);color:#fff}.btn.sec{background:#fff;color:var(--gd);border:1.5px solid var(--line)}.btn.wa{background:#25d366;color:#08361c}',
  '.video{position:relative;aspect-ratio:16/9;border-radius:14px;overflow:hidden;margin:0 0 14px;background:#000}.video iframe{position:absolute;inset:0;width:100%;height:100%;border:0}',
  'footer{max-width:640px;margin:0 auto;padding:8px 16px 28px;display:grid;gap:6px;text-align:center;font-size:.85rem;color:var(--mut)}footer a{color:var(--g);font-weight:600}',
  '.empty{text-align:center;padding:32px 18px}.empty h1{margin-bottom:10px}',
  '.toast{position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:var(--gd);color:#fff;padding:10px 16px;border-radius:12px;font-size:.9rem;opacity:0;transition:opacity .2s;pointer-events:none}.toast.on{opacity:1}'
].join('');

const JS = "document.addEventListener('click',function(e){var b=e.target.closest('[data-share]');if(!b)return;e.preventDefault();" +
  "var m=document.querySelector('meta[property=\"og:url\"]'),u=m?m.content:location.href,t=document.title;if(navigator.share){navigator.share({title:t,url:u}).catch(function(){});return;}" +
  "var ok=function(){var x=document.querySelector('.toast');x.classList.add('on');setTimeout(function(){x.classList.remove('on')},1800)};" +
  "if(navigator.clipboard)navigator.clipboard.writeText(u).then(ok,function(){prompt('انسخ الرابط',u)});else prompt('انسخ الرابط',u);});";

module.exports = async function (req, res) {
  const q = req.query || {};
  const c = String(q.c || '').toLowerCase().slice(0, 12);
  const d = String(q.d || '').slice(0, 10);
  const t = String(q.t || '').slice(0, 200);
  const host = String((req.headers && req.headers.host) || '');
  const byCode = /^\d{4}[0-9a-z]{2}$/.test(c);
  const data = byCode || (/^\d{4}-\d{2}-\d{2}$/.test(d) && t) ? await getData(host) : null;
  const hit = data ? (byCode ? findByCode(data, c) : find(data, d, t)) : null;
  const shareUrl = hit ? SITE + '/e/' + shortCode(hit.ev.date, hit.ev.title) : SITE;

  // الناس بتفتح صفحة الفعالية في البوابة على طول، وبرامج المعاينة (واتساب/فيسبوك…) بتاخد الصفحة دي بالصورة والعنوان
  const ua = String((req.headers && req.headers['user-agent']) || '');
  if (!/bot|crawler|spider|preview|facebookexternalhit|facebot|whatsapp|telegram|slack|discord|linkedin|twitter|pinterest|viber|skype|vkshare|embedly|quora|outbrain|snapchat|instagram|google-inspectiontool|bingpreview|redditbot|applebot|iframely/i.test(ua) && !q.page) {
    res.setHeader('Cache-Control', 'no-store');
    return res.redirect(302, hit ? '/#e-' + shortCode(hit.ev.date, hit.ev.title) : '/#events');
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  if (!hit) {
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.setHeader('CDN-Cache-Control', 'public, s-maxage=60');
    const asked = byCode || d;
    res.status(data || !asked ? 404 : 503).send(page({
      title: 'الفعالية مش موجودة', desc: 'متطوعي مصر الخير – الإسماعيلية', image: '', shareUrl: SITE,
      body: '<div class="card empty"><h1>' + (data || !asked ? 'مش لاقيين الفعالية دي' : 'مقدرناش نحمّل الفعالية دلوقتي') + '</h1>' +
        '<p>' + (data || !asked ? 'ممكن الرابط يكون اتغير أو الفعالية اتشالت.' : 'جرّب تاني بعد شوية.') + '</p></div>'
    }));
    return;
  }

  const ev = hit.ev;
  const past = hit.kind === 'past';
  const status = past ? 'done' : (ev.status || (hit.kind === 'upcoming' ? 'soon' : 'open'));
  const image = url(ev.image);
  const type = TYPES[ev.type] || TYPES.other;
  const badge = { open: ['open', 'التسجيل مفتوح'], soon: ['', 'قريبًا'], now: ['open', 'النهارده'], closed: ['', 'التسجيل اتقفل'], done: ['done', 'تمت'] }[status] || ['', ''];
  let body = '<article class="card"><div class="media">' +
    (image ? '<img src="' + esc(image) + '" alt="' + esc(ev.title) + '">' : '<img src="/assets/images/group-ismailia.webp" alt="">') +
    '<span class="badge ' + badge[0] + '">' + badge[1] + '</span></div><div class="body">' +
    '<span class="chip">' + esc(type) + '</span><h1>' + esc(ev.title) + '</h1><ul class="meta">' +
    '<li>📅 <b>' + esc(longDate(ev.date)) + '</b>' + (ev.time ? ' · ' + esc(ev.time) : '') + '</li>' +
    (ev.location ? '<li>📍 ' + (url(ev.mapUrl) ? '<a href="' + esc(ev.mapUrl) + '" target="_blank" rel="noopener">' + esc(ev.location) + '</a>' : esc(ev.location)) + '</li>' : '') +
    '</ul>';
  let desc;
  if (past) {
    if (ev.attendance) body += '<div class="big"><b>' + n(ev.attendance) + '</b><span>متطوع شاركوا في اليوم ده 💚</span></div>';
    if (ev.description && !ev.pending) body += '<p class="desc">' + esc(ev.description) + '</p>';
    body += videoEmbed(ev.link);
    body += '<div class="btns">' +
      (url(ev.photos) ? '<a class="btn pri" href="' + esc(ev.photos) + '" target="_blank" rel="noopener">📷 شوف صور اليوم</a>' : '') +
      (url(ev.link) && !videoEmbed(ev.link) ? '<a class="btn sec" href="' + esc(ev.link) + '" target="_blank" rel="noopener">🎬 شوف الفيديو</a>' : '') +
      '<button class="btn sec" data-share>🔗 شارك الفعالية</button></div>';
    desc = longDate(ev.date) + (ev.attendance ? ' · ' + n(ev.attendance) + ' متطوع شاركوا' : '') + ' – متطوعي مصر الخير بالإسماعيلية';
  } else {
    if (ev.description) body += '<p class="desc">' + esc(ev.description) + '</p>';
    const reg = url(ev.registrationUrl) || FORM;
    if (status === 'open') {
      const left = typeof ev.remaining === 'number' ? 'باقي ' + n(ev.remaining) + ' أماكن' : '';
      const dl = ev.registrationDeadline && ev.registrationDeadline !== ev.date ? 'آخر يوم للتسجيل ' + longDate(ev.registrationDeadline) : '';
      if (left || dl) body += '<p class="note">' + esc([left, dl].filter(Boolean).join(' · ')) + '</p>';
    } else if (status === 'soon') {
      body += '<p class="note">' + esc(ev.opensOn ? 'التسجيل بيفتح ' + longDate(ev.opensOn) : 'التسجيل هيفتح قريب') + '</p>';
    } else if (status === 'now') {
      body += '<p class="note">الفعالية النهارده، والتسجيل اتقفل.</p>';
    } else if (status === 'closed') {
      body += '<p class="note">' + (ev.full ? 'العدد اكتمل' : 'التسجيل اتقفل') + '. تابعنا للفعالية الجاية 💚</p>';
    }
    body += videoEmbed(ev.link);
    body += '<div class="btns">' +
      (status === 'open' ? '<a class="btn pri" href="' + esc(reg) + '" target="_blank" rel="noopener">✍️ سجّل في الفعالية</a>' : '') +
      (url(ev.photos) ? '<a class="btn ' + (status === 'open' ? 'sec' : 'pri') + '" href="' + esc(ev.photos) + '" target="_blank" rel="noopener">📷 شوف صور اليوم</a>' : '') +
      (url(ev.link) && !videoEmbed(ev.link) ? '<a class="btn sec" href="' + esc(ev.link) + '" target="_blank" rel="noopener">🎬 شوف الفيديو</a>' : '') +
      '<button class="btn ' + (status === 'open' || url(ev.photos) ? 'sec' : 'pri') + '" data-share>🔗 شارك الفعالية</button></div>';
    desc = longDate(ev.date) + (ev.time ? ' · ' + ev.time : '') + (ev.location ? ' · ' + ev.location : '') +
      (status === 'open' ? ' – التسجيل مفتوح' : '');
  }
  body += '</div></article><div class="toast" role="status">اتنسخ الرابط ✅</div>';

  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.setHeader('CDN-Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');
  res.status(200).send(page({ title: ev.title, desc, image: ogImage(ev), shareUrl, body }));
};