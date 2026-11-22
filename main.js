/* ============ بوابة متطوعي مصر الخير – الإسماعيلية ============ */
(function () {
  'use strict';

  var CFG = window.BASMA_CONFIG || {};
  var PHOTOS = window.EVENT_PHOTOS || [];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- أنواع الفعاليات ---------- */
  var ICONS = {
    orphans: 'M5.5 22v-7.5H4V9c0-1.1.9-2 2-2h3c1.1 0 2 .9 2 2v5.5H9.5V22zM18 22v-6h3l-2.54-7.63A2 2 0 0 0 16.56 7h-.12a2 2 0 0 0-1.9 1.37L12 16h3v6zM7.5 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm9 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
    elderly: 'M13.5 5.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM20 12.5V23h-1V12.5a.5.5 0 0 0-1 0v1h-1v-.69a5.9 5.9 0 0 1-3.51-2.52A8 8 0 0 0 13 13c0 .23.02.46.03.69L15 16.5V23h-2v-5l-1.85-2.64L11 19l-3 4-1.6-1.2L9 18.33V13c0-1.15.18-2.29.5-3.36l-1.5.85V13H6V9.31l5.4-3.03a1.5 1.5 0 0 1 2.21.79l.54 1.27a4.1 4.1 0 0 0 3.83 2.26h.52c.83 0 1.5.67 1.5 1.5z',
    special: 'M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm7 9h-5.07l-.47-2H17V7h-6a1 1 0 0 0-.98 1.2L11.2 14H17l2.6 5.2 1.8-.9L18.6 13H19zM10 20a4 4 0 0 1-1.5-7.7l-.4-2.1A6 6 0 1 0 15.9 17h-2.1A4 4 0 0 1 10 20z',
    hospital: 'M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4z',
    training: 'M5 13.18v4L12 21l7-3.82v-4L12 17zM12 3 1 9l11 6 9-4.91V17h2V9z',
    meeting: 'M16 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm-8 0a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05A4.2 4.2 0 0 1 17 16.5V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
    mothers: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09A6 6 0 0 1 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z',
    other: 'M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'
  };
  var TYPES = {
    elderly:  { label: 'دار مسنين',      plural: 'دور المسنين' },
    orphans:  { label: 'دار أيتام / رضع', plural: 'دور الأيتام والرضع' },
    special:  { label: 'ذوي الهمم',       plural: 'ذوي الهمم' },
    hospital: { label: 'مستشفى',          plural: 'مستشفيات' },
    mothers:  { label: 'أمهات',           plural: 'أيام للأمهات' },
    training: { label: 'تدريب',           plural: 'تدريبات' },
    meeting:  { label: 'اجتماع متطوعين',  plural: 'اجتماعات' },
    other:    { label: 'فعالية',          plural: 'فعاليات أخرى' }
  };
  var typeOf = function (k) { return TYPES[k] ? k : 'other'; };
  var icon = function (k) { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + ICONS[typeOf(k)] + '"/></svg>'; };
  var typeVar = function (k) { return 'var(--t-' + typeOf(k) + ')'; };

  /* ---------- أرقام وتواريخ بالعربي ---------- */
  var AR_DAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  var AR_MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  var n = function (x) { return Number(x || 0).toLocaleString('ar-EG'); };
  var parseD = function (s) { var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s || ''); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; };
  var ymd = function (d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); };
  var longDate = function (s) { var d = parseD(s); return d ? AR_DAYS[d.getDay()] + ' ' + n(d.getDate()) + ' ' + AR_MONTHS[d.getMonth()] : ''; };
  var shortDate = function (s) { var d = parseD(s); return d ? n(d.getDate()) + ' ' + AR_MONTHS[d.getMonth()] : ''; };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var safeUrl = function (u) { return /^https?:\/\//i.test(u || '') ? u : ''; };

  var I = {
    cal: '<svg viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V9h14z"/></svg>',
    pin: '<svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5z"/></svg>',
    clock: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm.5 11H7v-2h3.5V6h2z"/></svg>',
    people: '<svg viewBox="0 0 24 24"><path d="' + ICONS.meeting + '"/></svg>',
    close: '<svg viewBox="0 0 24 24"><path d="M19 6.4 17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12z"/></svg>'
  };

  /* ---------- صورة الفعالية ---------- */
  function photoFor(ev) {
    if (safeUrl(ev.image) || /^assets\//.test(ev.image || '')) return ev.image;
    var t = ev.title || '';
    for (var i = 0; i < PHOTOS.length; i++) {
      if (PHOTOS[i].date && PHOTOS[i].date !== ev.date) continue;
      if (t.indexOf(PHOTOS[i].match) !== -1) return PHOTOS[i].src;
    }
    return '';
  }
  function media(ev, extra) {
    var src = photoFor(ev);
    var k = typeOf(ev.type);
    var inner = src
      ? '<img src="' + esc(src) + '" alt="" loading="lazy" onerror="this.remove()">'
      : '<span class="type-art">' + icon(k) + '</span>';
    return '<div class="ev-media" style="--type:' + typeVar(k) + '">' + inner + (extra || '') + '</div>';
  }

  /* ---------- التنقل بين الشاشات ---------- */
  var VIEWS = ['home', 'volunteer', 'events', 'about', 'contact'];
  function route() {
    var id = (location.hash || '').replace('#', '') || 'home';
    if (VIEWS.indexOf(id) === -1) id = 'home';
    $$('.view').forEach(function (v) {
      var on = v.id === id;
      v.hidden = !on;
      v.classList.toggle('is-active', on);
    });
    window.scrollTo(0, 0);
    var h = $('#' + id + ' h2');
    if (h && id !== 'home') { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  }
  window.addEventListener('hashchange', route);
  $$('.back').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      if (history.length > 1 && document.referrer.indexOf(location.host) !== -1) history.back();
      else location.hash = '';
    });
  });

  /* ---------- التابات ---------- */
  function selectTab(name) {
    $$('.tab').forEach(function (t) { t.setAttribute('aria-selected', String(t.dataset.tab === name)); });
    $$('.tab-panel').forEach(function (p) { p.hidden = p.dataset.panel !== name; });
  }
  $$('.tab').forEach(function (t) { t.addEventListener('click', function () { selectTab(t.dataset.tab); }); });

  /* ---------- الكروت ---------- */
  function openCard(ev) {
    var meta = '<div class="ev-meta">' +
      '<span>' + I.cal + longDate(ev.date) + '</span>' +
      (ev.time ? '<span>' + I.clock + esc(ev.time) + '</span>' : '') +
      (ev.location ? '<span>' + I.pin + esc(ev.location) + '</span>' : '') + '</div>';
    var chip = '<span class="ev-type-chip">' + icon(ev.type) + esc(TYPES[typeOf(ev.type)].label) + '</span>';
    var note = '';
    var action = '';
    if (ev.status === 'open') {
      var left = ev.remaining != null ? 'باقي ' + n(ev.remaining) + ' أماكن · ' : '';
      if (ev.registrationDeadline && ev.registrationDeadline !== ev.date) note = left + 'آخر يوم للتسجيل ' + shortDate(ev.registrationDeadline);
      else if (left) note = left.replace(' · ', '');
      var url = safeUrl(ev.registrationUrl) || CFG.eventFormUrl;
      action = '<div class="ev-actions"><a class="btn btn-primary" href="' + esc(url) + '" target="_blank" rel="noopener">سجّل الآن</a></div>';
    } else if (ev.status === 'now') {
      note = 'الفعالية النهارده' + (ev.time ? ' · ' + ev.time : '') + ' – التسجيل اتقفل';
    } else if (ev.status === 'closed') {
      note = (ev.full ? 'العدد اكتمل' : 'التسجيل اتقفل') + ' · الفعالية ' + longDate(ev.date);
    } else {
      note = ev.opensOn ? 'التسجيل يفتح ' + longDate(ev.opensOn) : 'التسجيل يفتح قريبًا';
    }
    var badge = { open: 'open">مفتوح التسجيل', now: 'open">النهارده', closed: 'soon">التسجيل اتقفل' }[ev.status] || 'soon">قريبًا';
    return '<article class="ev-card">' +
      media(ev, '<span class="ev-status ' + badge + '</span>' + chip) +
      '<div class="ev-body"><h3>' + esc(ev.title) + '</h3>' + meta +
      (ev.description ? '<p class="ev-desc">' + esc(ev.description) + '</p>' : '') +
      (note ? '<p class="ev-note">' + esc(note) + '</p>' : '') + action + '</div></article>';
  }

  function emptyBox(title, text, btn) {
    return '<div class="empty"><strong>' + title + '</strong>' + text + (btn || '') + '</div>';
  }

  var DATA = null;
  var pastIndex = {};

  function renderLists(d) {
    var open = d.events || [], soon = d.upcoming || [], past = d.past || [];

    $('#listOpen').innerHTML = open.length ? open.map(function (e) { if (e.status !== 'now' && e.status !== 'closed') e.status = 'open'; return openCard(e); }).join('')
      : emptyBox('مفيش تسجيل مفتوح دلوقتي', 'التسجيل بيفتح قبل كل فعالية بـ ٣ أو ٤ أيام.',
        soon.length ? '<button class="btn btn-ghost" data-go="soon">شوف الفعاليات الجاية</button>' : '');
    $('#listSoon').innerHTML = soon.length ? soon.map(function (e) { e.status = 'soon'; return openCard(e); }).join('')
      : emptyBox('لسه مفيش فعاليات متعلنة', 'تابع جروب متطوعي الإسماعيلية عشان تعرف أول بأول.');

    // اللي تمت: متجمعة بالشهر
    pastIndex = {};
    var html = '', lastMonth = '';
    past.forEach(function (p, i) {
      var key = 'p' + i;
      pastIndex[key] = p;
      var d0 = parseD(p.date);
      var mk = d0 ? AR_MONTHS[d0.getMonth()] + ' ' + n(d0.getFullYear()).replace(/٬/g, '') : '';
      if (mk !== lastMonth) { html += '<h3 class="done-group">' + mk + '</h3>'; lastMonth = mk; }
      html += '<button class="done-card" data-past="' + key + '">' + media(p) +
        '<span class="done-body"><h3>' + esc(p.title) + '</h3><p><span>' + shortDate(p.date) + '</span>' +
        (p.attendance ? '<span>' + n(p.attendance) + ' متطوع</span>' : '') + '</p></span></button>';
    });
    $('#listDone').innerHTML = html || emptyBox('لسه مفيش فعاليات متسجلة', '');

    $$('[data-count="open"]').forEach(function (el) { el.textContent = open.length ? n(open.length) : ''; });
    $$('[data-count="soon"]').forEach(function (el) { el.textContent = soon.length ? n(soon.length) : ''; });
  }

  /* ---------- جدول الشهر ---------- */
  var calMonth = null;
  function renderCalendar() {
    var d = DATA || {};
    var items = (d.calendar || []).slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    var y = calMonth.getFullYear(), m = calMonth.getMonth();
    $('#calTitle').textContent = 'جدول التطوع – ' + AR_MONTHS[m] + ' ' + n(y).replace(/٬/g, '');
    var today = d.today || ymd(new Date());
    var byDay = {};
    items.forEach(function (it) { (byDay[it.date] = byDay[it.date] || []).push(it); });

    var stColor = { open: 'var(--st-open)', soon: 'var(--st-soon)', done: 'var(--st-done)', now: 'var(--st-open)', closed: 'var(--st-soon)' };
    var stText = { open: 'مفتوح التسجيل', soon: 'قريبًا', done: 'تمت', now: 'النهارده', closed: 'التسجيل اتقفل' };

    var grid = AR_DAYS.map(function (dn) { return '<div class="cal-dow">' + dn + '</div>'; }).join('');
    var first = new Date(y, m, 1), start = new Date(y, m, 1 - first.getDay());
    var weeks = Math.ceil((first.getDay() + new Date(y, m + 1, 0).getDate()) / 7);
    for (var i = 0; i < weeks * 7; i++) {
      var day = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      var key = ymd(day), out = day.getMonth() !== m;
      grid += '<div class="cal-cell' + (out ? ' out' : '') + (key === today ? ' today' : '') + '">' +
        (out ? '' : '<span class="cal-day">' + n(day.getDate()) + '</span>') +
        (out ? '' : (byDay[key] || []).map(function (it) {
          return '<button class="cal-ev ' + it.status + '" data-cal="' + esc(it.date + '|' + it.title) + '" title="' + esc(stText[it.status]) + '">' +
            '<span class="ic" style="--type:' + typeVar(it.type) + ';--st:' + stColor[it.status] + '">' + icon(it.type) + '</span>' +
            '<span class="nm">' + esc(it.title) + '</span></button>';
        }).join('')) + '</div>';
    }
    $('#calGrid').innerHTML = grid;

    var monthItems = items.filter(function (it) { var dd = parseD(it.date); return dd && dd.getFullYear() === y && dd.getMonth() === m; });
    $('#calList').innerHTML = monthItems.length ? monthItems.map(function (it) {
      var dd = parseD(it.date);
      return '<li class="cal-row ' + it.status + '" data-cal="' + esc(it.date + '|' + it.title) + '">' +
        '<span class="cal-date"><b>' + n(dd.getDate()) + '</b><small>' + AR_DAYS[dd.getDay()] + '</small></span>' +
        '<span class="ic" style="--type:' + typeVar(it.type) + '">' + icon(it.type) + '</span>' +
        '<span class="txt"><strong>' + esc(it.title) + '</strong><span><i class="dot" style="background:' + stColor[it.status] + '"></i>' + stText[it.status] + '</span></span></li>';
    }).join('') : '<li class="cal-empty">مفيش فعاليات متسجلة في الشهر ده.</li>';
  }
  $('#calPrev').addEventListener('click', function () { calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1); renderCalendar(); });
  $('#calNext').addEventListener('click', function () { calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1); renderCalendar(); });

  /* ---------- إنجازاتنا ---------- */
  function renderImpact(d) {
    var s = d.stats || { total: 0, attendance: 0, byType: {} };
    $('#impTotal').textContent = n(s.total);
    $('#impPeople').textContent = n(s.attendance);
    var order = ['elderly', 'orphans', 'special', 'hospital', 'mothers', 'training', 'meeting', 'other'];
    $('#impGrid').innerHTML = order.filter(function (k) { return s.byType && s.byType[k]; }).map(function (k) {
      return '<div class="imp-item"><span class="ic" style="--type:' + typeVar(k) + '">' + icon(k) + '</span>' +
        '<div><b>' + n(s.byType[k]) + '</b><span>' + TYPES[k].plural + '</span></div></div>';
    }).join('');
    var firstDate = (d.past || []).reduce(function (a, p) { return !a || p.date < a ? p.date : a; }, '');
    $('#impNote').textContent = firstDate ? 'من ' + longDate(firstDate).replace(/^\S+ /, '') + ' لحد النهارده، وبتتحدث لوحدها بعد كل فعالية.' : '';
  }

  /* ---------- تفاصيل فعالية (اللي تمت أو من الجدول) ---------- */
  var sheet = $('#eventSheet');
  function videoEmbed(url) {
    var yt = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{11})/.exec(url || '');
    if (yt) return '<div class="video-wrap"><iframe src="https://www.youtube-nocookie.com/embed/' + yt[1] + '" title="فيديو الفعالية" allowfullscreen loading="lazy"></iframe></div>';
    return '';
  }
  function showSheet(ev, status) {
    var k = typeOf(ev.type);
    var link = safeUrl(ev.link);
    var embed = videoEmbed(link);
    var body = '<button class="sheet-close" aria-label="إغلاق">' + I.close + '</button>' +
      media(ev, '<span class="ev-type-chip">' + icon(k) + esc(TYPES[k].label) + '</span>') +
      '<div class="ev-body"><h3>' + esc(ev.title) + '</h3>' +
      '<div class="ev-meta"><span>' + I.cal + longDate(ev.date) + '</span>' +
      (ev.attendance ? '<span>' + I.people + n(ev.attendance) + ' متطوع شاركوا</span>' : '') + '</div>' +
      (ev.description ? '<p class="ev-desc">' + esc(ev.description) + '</p>' : '') +
      embed +
      (link && !embed ? '<div class="ev-actions"><a class="btn btn-primary" href="' + esc(link) + '" target="_blank" rel="noopener">شوف الصور والفيديو</a></div>' : '') +
      (status === 'open' ? '<div class="ev-actions"><button class="btn btn-primary" data-go-open>سجّل في الفعالية</button></div>' : '') +
      (status === 'soon' ? '<p class="ev-note">التسجيل لسه مافتحش. هيظهر في «مفتوح التسجيل» أول ما يفتح.</p>' : '') +
      '</div>';
    $('#sheetBody').innerHTML = body;
    if (sheet.showModal) sheet.showModal(); else sheet.setAttribute('open', '');
  }
  function closeSheet() { if (sheet.close) sheet.close(); else sheet.removeAttribute('open'); }
  sheet.addEventListener('click', function (e) {
    if (e.target === sheet || e.target.closest('.sheet-close')) closeSheet();
    if (e.target.closest('[data-go-open]')) { closeSheet(); selectTab('open'); }
  });

  document.addEventListener('click', function (e) {
    var go = e.target.closest('[data-go]');
    if (go) { selectTab(go.dataset.go); return; }
    var p = e.target.closest('[data-past]');
    if (p && pastIndex[p.dataset.past]) { showSheet(pastIndex[p.dataset.past], 'done'); return; }
    var c = e.target.closest('[data-cal]');
    if (c && DATA) {
      var parts = c.dataset.cal.split('|');
      var it = (DATA.calendar || []).filter(function (x) { return x.date === parts[0] && x.title === parts[1]; })[0];
      if (!it) return;
      var full = (DATA.past || []).filter(function (x) { return x.date === it.date && x.title === it.title; })[0] ||
        (DATA.events || []).concat(DATA.upcoming || []).filter(function (x) { return x.date === it.date && x.title === it.title; })[0] || it;
      showSheet(Object.assign({}, full, { type: it.type }), it.status);
    }
  });

  /* ---------- الرئيسية ---------- */
  function renderHome(d) {
    var open = (d.events || []).filter(function (e) { return e.status === 'open'; }).length, soon = (d.upcoming || []).length, s = d.stats || {};
    var badge = $('#tileEventsBadge'), sub = $('#tileEventsSub');
    if (open) { badge.hidden = false; badge.textContent = n(open) + ' مفتوح'; sub.textContent = 'سجّل في الفعالية الجاية'; }
    else if (soon) { badge.hidden = true; sub.textContent = n(soon) + ' فعاليات جاية قريب'; }
    if (s.total) {
      var hs = $('#heroStats');
      hs.hidden = false;
      hs.textContent = n(s.total) + ' فعالية · ' + n(s.attendance) + ' مشاركة متطوعين من يوليو';
    }
  }

  /* ---------- تحميل البيانات ---------- */
  function load() {
    $('#listOpen').innerHTML = $('#listSoon').innerHTML = '<div class="loading"></div>';
    var src = CFG.events && CFG.events.mockData ? Promise.resolve(CFG.events.mockData)
      : CFG.events && CFG.events.endpoint ? fetch(CFG.events.endpoint).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      : Promise.reject(new Error('no endpoint'));
    src.then(function (d) {
      DATA = d || {};
      var today = parseD(DATA.today) || new Date();
      calMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      renderLists(DATA); renderCalendar(); renderImpact(DATA); renderHome(DATA);
      if (!(DATA.events || []).length && (DATA.upcoming || []).length) selectTab('soon');
    }).catch(function () {
      var msg = emptyBox('مقدرناش نحمّل الفعاليات', 'اتأكد من النت وجرّب تاني، أو تابع جروب متطوعي الإسماعيلية.',
        '<button class="btn btn-ghost" onclick="location.reload()">جرّب تاني</button>');
      $('#listOpen').innerHTML = msg; $('#listSoon').innerHTML = ''; $('#listDone').innerHTML = '';
      calMonth = new Date(); calMonth.setDate(1); DATA = {}; renderCalendar();
    });
  }

  function loadCount() {
    var vc = CFG.volunteerCount;
    if (!vc || !vc.enabled) return;
    var p = vc.mockCount != null ? Promise.resolve({ count: vc.mockCount })
      : fetch(vc.endpoint).then(function (r) { return r.json(); });
    p.then(function (d) {
      if (!d || !d.count) return;
      $('#volCount').textContent = n(d.count);
      $('#volCounter').hidden = false;
    }).catch(function () { /* العداد اختياري */ });
  }

  $('#year').textContent = n(new Date().getFullYear()).replace(/٬/g, '');
  route();
  load();
  loadCount();
})();