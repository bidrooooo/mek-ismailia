/* فيديو "يوم في حياة متطوع": يظهر مرة واحدة بعد دخول المتطوع، مع زرار تخطي */
(function () {
  "use strict";
  var SEEN = "mek_intro_seen_v1";
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  var css = document.createElement("style");
  css.textContent =
    "#mekIntro{position:fixed;inset:0;z-index:99999;background:#fff;display:flex;flex-direction:column}" +
    "#mekIntro iframe{flex:1;width:100%;border:0;display:block}" +
    "#mekIntroSkip{position:absolute;top:calc(14px + env(safe-area-inset-top,0px));left:calc(14px + env(safe-area-inset-left,0px));" +
    "font:700 16px/1 'IBM Plex Sans Arabic','Readex Pro',system-ui,sans-serif;background:#01775f;color:#fff;border:0;border-radius:999px;padding:12px 22px;cursor:pointer;box-shadow:0 4px 14px rgba(0,60,45,.25)}" +
    "#mekIntroSkip:focus-visible{outline:3px solid #FFC83D;outline-offset:2px}" +
    "#mekIntroHint{position:absolute;bottom:calc(18px + env(safe-area-inset-bottom,0px));left:0;right:0;text-align:center;font:500 14px 'IBM Plex Sans Arabic',system-ui,sans-serif;color:#5B7068;pointer-events:none}" +
    "@media (orientation:landscape){#mekIntroHint{display:none}}" +
    "@media (orientation:portrait){#mekIntro{inset:auto;top:50%;left:50%;width:100vh;height:100vw;transform:translate(-50%,-50%) rotate(90deg)}#mekIntroHint{display:none}}" +
    ".mek-intro-replay{background:none;border:0;color:inherit;font:inherit;text-decoration:underline;cursor:pointer;padding:0}";
  document.head.appendChild(css);

  function close() {
    set(SEEN, "1");
    var o = document.getElementById("mekIntro");
    if (o) o.remove();
    document.documentElement.style.overflow = "";
  }

  function open() {
    if (document.getElementById("mekIntro")) return;
    var o = document.createElement("div");
    o.id = "mekIntro";
    o.setAttribute("role", "dialog");
    o.setAttribute("aria-label", "فيديو يوم في حياة متطوع");
    o.innerHTML =
      '<iframe src="intro.html?embed=1" title="فيديو يوم في حياة متطوع" allow="autoplay; fullscreen"></iframe>' +
      '<button id="mekIntroSkip" type="button">تخطي الفيديو ›</button>' +
      '<p id="mekIntroHint">لف الموبايل بالعرض عشان تشوف الفيديو أوضح</p>';
    document.body.appendChild(o);
    document.documentElement.style.overflow = "hidden";
    document.getElementById("mekIntroSkip").onclick = close;
    setTimeout(function () { var b = document.getElementById("mekIntroSkip"); if (b) b.focus(); }, 300);
  }

  window.addEventListener("message", function (e) { if (e.data === "mek-intro-done") close(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && document.getElementById("mekIntro")) close(); });

  function check() { if (document.documentElement.classList.contains("mek-in") && !get(SEEN)) open(); }

  function addReplay() {
    var f = document.querySelector(".footer");
    if (!f || f.querySelector(".mek-intro-replay")) return;
    var b = document.createElement("button");
    b.type = "button";
    b.className = "mek-intro-replay";
    b.textContent = "شوف فيديو يوم في حياة متطوع";
    b.onclick = open;
    f.appendChild(b);
  }

  function start() {
    addReplay();
    check();
    var n = 0, iv = setInterval(function () {
      check();
      if (get(SEEN) || ++n > 900) clearInterval(iv);
    }, 1000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();