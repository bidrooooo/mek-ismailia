// صورة المعاينة للشير (واتساب/فيسبوك/تيليجرام): صورة الفعالية من درايف بمقاس 1200×630 وبصيغة JPG.
// بيقبل بس صور موجودة فعلًا في بيانات الفعاليات العامة (مش بروكسي مفتوح).
const SITE = 'https://mek-ismailia.vercel.app';
const GS = 'https://script.google.com/macros/s/AKfycbwBlKVviiYyzjdHLlJhpzTbl2DsHEpVujv-PfBwRLx4pEjG5UuvQj7Lgqw4tpbumKxo/exec';

async function eventsText(host) {
  const tries = [];
  if (/^[\w.-]+\.vercel\.app$/.test(host || '')) tries.push('https://' + host + '/api/gs?api=events');
  tries.push(SITE + '/api/gs?api=events', GS + '?api=events');
  for (const u of tries) {
    try { const r = await fetch(u, { redirect: 'follow' }); if (r.ok) return await r.text(); } catch (e) { /* اللي بعده */ }
  }
  return '';
}

module.exports = async function (req, res) {
  const id = String((req.query || {}).i || '');
  const fail = () => { res.setHeader('Cache-Control', 'public, max-age=60'); res.redirect(302, SITE + '/assets/images/hero.jpg'); };
  if (!/^[\w-]{20,80}$/.test(id)) return fail();
  const known = await eventsText(String((req.headers && req.headers.host) || ''));
  if (known.indexOf(id) === -1) return fail();
  for (const p of ['=w1200-h630-c-rj', '=w1200-h630-c', '=w1200']) {
    try {
      const r = await fetch('https://lh3.googleusercontent.com/d/' + id + p, { redirect: 'follow' });
      const ct = r.headers.get('content-type') || '';
      if (!r.ok || !/^image\//.test(ct)) continue;
      const buf = Buffer.from(await r.arrayBuffer());
      res.setHeader('Content-Type', ct);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.setHeader('CDN-Cache-Control', 'public, s-maxage=604800, stale-while-revalidate=2592000');
      res.status(200).send(buf);
      return;
    } catch (e) { /* اللي بعده */ }
  }
  fail();
};