/* إعدادات الموقع */
/* الفعاليات والعدادات بتيجي من /api/gs على Vercel (نسخة محفوظة سريعة)، والدخول بيروح لجوجل سكريبت مباشرة */
var MEK_API = (location.protocol === "https:" ? location.origin : "https://mek-ismailia.vercel.app") + "/api/gs";
window.BASMA_CONFIG = {
  // عداد المتطوعين (من شيت المتطوعين عن طريق Apps Script)
  volunteerCount: {
    enabled: true,
    endpoint: MEK_API + "?api=count"
  },
  // الفعاليات: المفتوحة والجاية واللي تمت وجدول الشهر وعداد الإنجاز
  events: {
    endpoint: MEK_API + "?api=events"
  },
  // العدادات الأربعة في الرئيسية (متطوعين – إيفنتات السنة – مشاركات الإيفنتات – مشاركات زيارات الأمهات)
  stats: {
    endpoint: MEK_API + "?api=stats"
  },
  // لو فعالية مفتوحة ومعهاش رابط تسجيل جاهز
  eventFormUrl: "https://forms.gle/H9G1W4HmCFJsfvEJ7",
  // دخول المتطوعين + الصفحة الشخصية + التعليقات والقلوب (js/members.js)
  members: {
    enabled: true,
    endpoint: "https://script.google.com/macros/s/AKfycbwBlKVviiYyzjdHLlJhpzTbl2DsHEpVujv-PfBwRLx4pEjG5UuvQj7Lgqw4tpbumKxo/exec",
    registerUrl: "http://volunteer.frappe.cloud/mek_volunteer/new",
    contactPhone: "01205579332"
  }
};

/* ===== دخول المتطوعين: بنقفل الصفحة من أول لحظة لو مفيش دخول، وبنحمّل members.js ===== */
(function () {
  var C = window.BASMA_CONFIG.members;
  if (!C || !C.endpoint || C.enabled === false) return;
  var ok = false;
  try {
    var m = JSON.parse(localStorage.getItem('mek_member') || sessionStorage.getItem('mek_member') || 'null');
    if (m && m.token) {
      var p = m.token.split('.')[0].replace(/-/g, '+').replace(/_/g, '/');
      while (p.length % 4) p += '=';
      var data = JSON.parse(decodeURIComponent(escape(atob(p))));
      ok = data.e > Date.now();
    }
  } catch (e) { ok = false; }
  if (!ok) { try { localStorage.removeItem('mek_member'); sessionStorage.removeItem('mek_member'); } catch (e) { /* */ } }
  document.documentElement.classList.add(ok ? 'mek-in' : 'mek-locked');

  var st = document.createElement('style');
  st.textContent = 'html.mek-locked body>*:not(#mekGate){display:none!important}';
  document.head.appendChild(st);
  var css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'css/mek.css?v=3';
  document.head.appendChild(css);

  // نلقط بيانات الفعاليات والعدادات من نفس الطلبات اللي الموقع بيعملها
  var _fetch = window.fetch;
  if (_fetch) window.fetch = function (url) {
    var pr = _fetch.apply(this, arguments);
    var u = typeof url === 'string' ? url : '';
    var kind = u.indexOf('api=events') !== -1 ? 'events' : u.indexOf('api=stats') !== -1 ? 'stats' : '';
    if (kind) {
      pr.then(function (r) { return r.clone().json(); }).then(function (d) {
        window[kind === 'events' ? '__MEK_EVENTS' : '__MEK_STATS'] = d;
        try { window.dispatchEvent(new CustomEvent('mek:' + kind, { detail: d })); } catch (e) { /* */ }
      }).catch(function () { /* */ });
    }
    return pr;
  };

  var s = document.createElement('script'); s.src = 'js/members.js?v=3'; document.body.appendChild(s);
  var sh = document.createElement('script'); sh.src = 'js/share.js?v=1'; document.body.appendChild(sh);
})();

/* =========================================================
   العدادات الأربعة في الصفحة الرئيسية
   كل الأرقام جاية من الشيتات عن طريق جوجل سكريبت (?api=stats)، مفيش رقم مكتوب هنا.
   لو السكريبت ماردش، القسم مابيظهرش خالص.
   ========================================================= */
(function () {
  var TILES = [
    { key: "volunteers",          label: "متطوع مسجّل",
      icon: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
    { key: "events",              label: "إيفنت في {year}",
      icon: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="m9 16 2 2 4-4"/>' },
    { key: "eventParticipations", label: "مشاركة في الإيفنتات",
      icon: '<path d="M7 11v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3a4 4 0 0 0 4-4V6a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1-2 2h-7a3 3 0 0 1-3-3"/>' },
    { key: "visitParticipations", label: "مشاركة في زيارات الأمهات",
      icon: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>' }
  ];

  var CSS =
    '.mek-stats{grid-column:1/-1;margin-top:14px}' +
    '.mek-stats h2{font-size:1.05rem;color:var(--green-dark,#0b4d3c);margin:0 0 10px;display:flex;align-items:center;gap:8px}' +
    '.mek-stats h2::before{content:"";width:4px;height:1.1em;border-radius:4px;background:var(--sand,#c9a27a)}' +
    '.mek-stats .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}' +
    '.mek-stats .st{background:var(--card,#fff);border:1px solid var(--line,#e4e8e4);border-radius:var(--radius,18px);box-shadow:var(--shadow);padding:14px 14px 12px;display:flex;flex-direction:column;gap:6px;min-width:0}' +
    '.mek-stats .st svg{width:26px;height:26px;fill:none;stroke:var(--sand,#c9a27a);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}' +
    '.mek-stats .num{font-family:"Readex Pro","IBM Plex Sans Arabic",sans-serif;font-size:clamp(1.7rem,6vw,2.3rem);font-weight:700;line-height:1.1;color:var(--green,#01775f);font-variant-numeric:tabular-nums}' +
    '.mek-stats .lbl{color:var(--muted,#5d6b64);font-size:.9rem;line-height:1.45}' +
    '.mek-stats .note{color:var(--muted,#5d6b64);font-size:.78rem;margin:8px 2px 0}' +
    '.mek-stats .skel{display:inline-block;width:3ch;height:.9em;border-radius:6px;background:var(--green-soft,#e7f3ef)}' +
    '@media (min-width:720px){.mek-stats{margin-top:4px}.mek-stats .grid{grid-template-columns:repeat(4,1fr)}.mek-stats .st{padding:18px}}';

  function fmt(n) { return Number(n).toLocaleString("ar-EG"); }

  function countUp(el, target) {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || target < 20 || !window.requestAnimationFrame) { el.textContent = fmt(target); return; }
    var start = null, dur = 1100;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }


  /* «إنجازاتنا» جوه صفحة الفعاليات: نخلي الإجماليات نفس أرقام الرئيسية.
     main.js بيكتب أرقامه (من يوليو بس) لما الفعاليات توصل، فبنراقب ونرجّع أرقامنا. */
  function syncImpact(d) {
    var want = {
      impTotal: isFinite(Number(d.events)) && d.events !== null ? fmt(d.events) : null,
      impPeople: isFinite(Number(d.eventParticipations)) && d.eventParticipations !== null ? fmt(d.eventParticipations) : null
    };
    var year = d.year ? fmt(d.year).replace(/[٬,]/g, "") : "";
    var note = "الإجماليات من أول " + year + " (من سجلات المتطوعين والفعاليات)، والتوزيع حسب نوع الفعالية من يوليو " + year + ".";
    function apply() {
      Object.keys(want).forEach(function (id) {
        var el = document.getElementById(id);
        if (el && want[id] !== null && el.textContent !== want[id]) el.textContent = want[id];
      });
      var n = document.getElementById("impNote");
      if (n && year && n.textContent !== note) n.textContent = note;
    }
    apply();
    if (window.MutationObserver) {
      var t = null;
      new MutationObserver(function () { clearTimeout(t); t = setTimeout(apply, 30); })
        .observe(document.body, { childList: true, subtree: true, characterData: true });
    }
  }

  function build() {
    var cfg = (window.BASMA_CONFIG || {}).stats || {};
    if (!/^https:\/\//i.test(cfg.endpoint || "")) return;

    var home = document.querySelector(".view-home");
    var tiles = document.querySelector(".tiles");
    var host = home || (tiles && tiles.parentNode) || document.querySelector("main");
    if (!host) return;

    var style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    var sec = document.createElement("section");
    sec.className = "mek-stats";
    sec.setAttribute("aria-labelledby", "mekStatsTitle");
    sec.hidden = true;   // مايظهرش غير لما الأرقام توصل
    sec.innerHTML =
      '<h2 id="mekStatsTitle">متطوعي الإسماعيلية بالأرقام</h2>' +
      '<div class="grid">' + TILES.map(function (t) {
        return '<div class="st" data-key="' + t.key + '">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true">' + t.icon + '</svg>' +
          '<div class="num"><span class="skel"></span></div>' +
          '<div class="lbl">' + t.label.replace(" {year}", "") + '</div></div>';
      }).join("") + '</div>' +
      '<p class="note"></p>';
    host.appendChild(sec);

    fetch(cfg.endpoint)
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(function (d) {
        var shown = 0;
        sec.hidden = false;
        // السطر القديم تحت العنوان (أرقام من يوليو بس) بيتشال لما الأرقام الجديدة توصل
        var hs = document.getElementById("heroStats");
        if (hs) hs.style.setProperty("display", "none", "important");
        TILES.forEach(function (t) {
          var tile = sec.querySelector('[data-key="' + t.key + '"]');
          var v = d[t.key], n = Number(v);
          if (v === null || v === undefined || v === "" || !isFinite(n) || n < 0) { tile.style.display = "none"; return; }
          shown++;
          tile.querySelector(".lbl").textContent = t.label.replace("{year}", d.year ? fmt(d.year).replace(/[٬,]/g, "") : "").trim();
          countUp(tile.querySelector(".num"), n);
        });
        if (!shown) { sec.remove(); return; }
        syncImpact(d);
        var u = d.updatedAt ? new Date(d.updatedAt) : null;
        if (u && !isNaN(u)) sec.querySelector(".note").textContent = "من سجلات المتطوعين والفعاليات · آخر تحديث " + u.toLocaleString("ar-EG", { dateStyle: "medium", timeStyle: "short" });
      })
      .catch(function () { sec.remove(); });   // مفيش أرقام = مفيش قسم (ومانعرضش أرقام غلط)
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();

/* ===== تخطيط الرئيسية: من غير الصورة الكبيرة، وكل حاجة تبان من غير ما تنزل لتحت ===== */
(function () {
  var st = document.createElement('style');
  st.textContent =
    '.view-home .hero{display:none!important}' +
    '.view-home:not([hidden]){display:block!important}' +
    '.view-home .tiles{margin-top:0!important}' +
    '.view-home .tile{min-height:112px!important}' +
    '.mek-stats{margin-top:14px!important}' +
    '.mek-stats h2{font-size:.95rem!important;margin-bottom:8px!important}' +
    '.mek-stats .grid{grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:6px!important}' +
    '.mek-stats .st{padding:8px 4px!important;gap:2px!important;align-items:center;text-align:center;border-radius:14px!important}' +
    '.mek-stats .st svg{width:18px!important;height:18px!important}' +
    '.mek-stats .num{font-size:1.15rem!important}' +
    '.mek-stats .lbl{font-size:.66rem!important;line-height:1.3!important}' +
    '.mek-stats .note{font-size:.68rem!important;text-align:center}' +
    '@media (min-width:720px){.view-home .tiles{grid-template-columns:repeat(4,1fr)!important}.view-home .tile{min-height:170px!important}' +
    '.mek-stats .st{padding:16px!important}.mek-stats .num{font-size:2rem!important}.mek-stats .lbl{font-size:.9rem!important}.mek-stats .st svg{width:24px!important;height:24px!important}}';
  document.head.appendChild(st);
})();