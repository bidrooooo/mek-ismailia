// روابط قصيرة للشير: /app (البوابة) و /video (فيديو الانترو).
// برامج المعاينة (واتساب، فيسبوك، تيليجرام…) بتاخد صفحة صغيرة فيها العنوان والصورة،
// والناس بتتحوّل على طول للصفحة الأصلية.
const SITE = 'https://mek-ismailia.vercel.app';
const PAGES = {
  app: { to: '/?app=1', title: 'بوابة متطوعي مصر الخير بالإسماعيلية',
    desc: 'سجّل كمتطوع، اعرف الفعاليات الجاية وسجّل فيها، وشوف اللي عملناه سوا 💚' },
  video: { to: '/intro', title: 'يوم في حياة متطوع 🎬',
    desc: 'فيديو قصير عن يوم المتطوع مع مصر الخير بالإسماعيلية' }
};
const IMG = { src: SITE + '/assets/images/hero.jpg', w: 1280, h: 960 };
const BOT = /bot|crawler|spider|preview|facebookexternalhit|facebot|whatsapp|telegram|slack|discord|linkedin|twitter|pinterest|viber|skype|vkshare|embedly|quora|outbrain|snapchat|instagram|google-inspectiontool|bingpreview|redditbot|applebot|iframely/i;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

module.exports = function (req, res) {
  const k = String((req.query || {}).k || '');
  const p = PAGES[k];
  res.setHeader('Cache-Control', 'no-store');
  if (!p) return res.redirect(302, '/');
  const ua = String((req.headers && req.headers['user-agent']) || '');
  if (!BOT.test(ua)) return res.redirect(302, p.to);
  const url = SITE + '/' + k;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send('<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">' +
    '<title>' + esc(p.title) + '</title><meta name="description" content="' + esc(p.desc) + '">' +
    '<meta property="og:type" content="website"><meta property="og:locale" content="ar_EG">' +
    '<meta property="og:site_name" content="متطوعي مصر الخير – الإسماعيلية">' +
    '<meta property="og:title" content="' + esc(p.title) + '"><meta property="og:description" content="' + esc(p.desc) + '">' +
    '<meta property="og:url" content="' + url + '"><link rel="canonical" href="' + url + '">' +
    '<meta property="og:image" content="' + IMG.src + '"><meta property="og:image:secure_url" content="' + IMG.src + '">' +
    '<meta property="og:image:type" content="image/jpeg"><meta property="og:image:width" content="' + IMG.w + '"><meta property="og:image:height" content="' + IMG.h + '">' +
    '<meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="' + IMG.src + '">' +
    '<meta http-equiv="refresh" content="0;url=' + p.to + '"></head><body><a href="' + p.to + '">' + esc(p.title) + '</a></body></html>');
};