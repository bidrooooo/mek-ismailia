// لينك البروفايل القصير /v/الكود: برامج المعاينة (واتساب، فيسبوك…) بتاخد الاسم والأرقام، والناس بتتحوّل لصفحة المتطوع.
// مفيش أي بيانات شخصية: الاسم المختصر وعدد المشاركات بس (نفس اللي في البروفايل العام).
const GS = 'https://script.google.com/macros/s/AKfycbwBlKVviiYyzjdHLlJhpzTbl2DsHEpVujv-PfBwRLx4pEjG5UuvQj7Lgqw4tpbumKxo/exec';
const SITE = 'https://mek-ismailia.vercel.app';
const IMG = { src: SITE + '/assets/images/hero.jpg', w: 1280, h: 960 };
const BOT = /bot|crawler|spider|preview|facebookexternalhit|facebot|whatsapp|telegram|slack|discord|linkedin|twitter|pinterest|viber|skype|vkshare|embedly|quora|outbrain|snapchat|instagram|google-inspectiontool|bingpreview|redditbot|applebot|iframely/i;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ar = n => Number(n || 0).toLocaleString('ar-EG');

module.exports = async function (req, res) {
  const id = String((req.query || {}).id || '').replace(/[^0-9a-f]/g, '').slice(0, 7);
  const to = '/#v-' + id;
  const ua = String((req.headers && req.headers['user-agent']) || '');
  res.setHeader('Cache-Control', 'no-store');
  if (id.length !== 7) return res.redirect(302, '/');
  if (!BOT.test(ua)) return res.redirect(302, to);
  let title = 'صفحة متطوع – متطوعي مصر الخير بالإسماعيلية', desc = 'شوف مشاركاته واكتبله كلمة حلوة 💚';
  try {
    const r = await fetch(GS + '?api=profile&id=' + id, { redirect: 'follow' });
    const d = await r.json();
    if (d && d.ok) {
      title = d.name + ' – متطوع مع مصر الخير بالإسماعيلية';
      desc = ar((d.events || 0) + (d.visits || 0)) + ' مشاركة تطوعية · ' + ar(d.hours) + ' ساعة' + ((d.badges || []).length ? ' · ' + d.badges.map(b => (b.icon || '') + ' ' + b.name).slice(0, 3).join('، ') : '') + ' – اكتبله كلمة حلوة 💚';
    }
  } catch (e) { /* المعاينة العامة */ }
  const url = SITE + '/v/' + id;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send('<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">' +
    '<title>' + esc(title) + '</title><meta name="description" content="' + esc(desc) + '">' +
    '<meta property="og:type" content="profile"><meta property="og:locale" content="ar_EG">' +
    '<meta property="og:site_name" content="متطوعي مصر الخير – الإسماعيلية">' +
    '<meta property="og:title" content="' + esc(title) + '"><meta property="og:description" content="' + esc(desc) + '">' +
    '<meta property="og:url" content="' + url + '"><link rel="canonical" href="' + url + '">' +
    '<meta property="og:image" content="' + IMG.src + '"><meta property="og:image:width" content="' + IMG.w + '"><meta property="og:image:height" content="' + IMG.h + '">' +
    '<meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="' + IMG.src + '">' +
    '<meta http-equiv="refresh" content="0;url=' + to + '"></head><body><a href="' + to + '">' + esc(title) + '</a></body></html>');
};