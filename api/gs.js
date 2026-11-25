// وسيط بين الموقع وجوجل سكريبت للبيانات العامة بس (الفعاليات والعدادات).
// Vercel بيحفظ آخر نسخة ويرجّعها للزائر فورًا، ويجدّدها من جوجل في الخلفية.
// مفيش أي بيانات متطوعين هنا: الدخول والصفحة الشخصية بيروحوا لجوجل سكريبت مباشرة.
const GS = 'https://script.google.com/macros/s/AKfycbwBlKVviiYyzjdHLlJhpzTbl2DsHEpVujv-PfBwRLx4pEjG5UuvQj7Lgqw4tpbumKxo/exec';
const ALLOWED = { events: 1, stats: 1, count: 1, home: 1, profile: 1 };

module.exports = async function (req, res) {
  const api = String((req.query && req.query.api) || 'count');
  if (!ALLOWED[api]) { res.status(400).json({ ok: false, error: 'bad_api' }); return; }
  try {
    // البروفايل العام: كود ٧ حروف بس (مفيش أي بيانات شخصية في الرد)
    const id = api === 'profile' ? String((req.query && req.query.id) || '').replace(/[^0-9a-f]/g, '').slice(0, 7) : '';
    if (api === 'profile' && id.length !== 7) { res.status(400).json({ ok: false, error: 'bad_id' }); return; }
    const r = await fetch(api === 'count' ? GS : GS + '?api=' + api + (id ? '&id=' + id : ''), { redirect: 'follow' });
    const text = await r.text();
    JSON.parse(text);                                   // لو جوجل رجّع صفحة خطأ مانحفظهاش
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.setHeader('CDN-Cache-Control', 'public, s-maxage=120, stale-while-revalidate=86400, stale-if-error=86400');
    res.status(200).send(text);
  } catch (err) {
    res.setHeader('Cache-Control', 'no-store');
    res.status(502).json({ ok: false, error: 'upstream' });
  }
};