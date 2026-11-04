// The guided story: one step at a time, kept in the address (#passo-N) so a reload, a shared
// link or the language switch lands on the same step. Without this script every step is
// shown in its final state; nothing here is needed to read the story.
(function () {
  "use strict";
  var root = document.querySelector(".racconto");
  if (!root) return;

  var steps = Array.prototype.slice.call(root.querySelectorAll(".passo"));
  var segs = Array.prototype.slice.call(document.querySelectorAll(".avanzamento .segmento"));
  var next = document.getElementById("avanti");
  var back = document.getElementById("indietro");
  var count = document.getElementById("contatore");
  var lang = document.querySelector("a.lingua");
  var n = steps.length;
  var current = 0;

  function label(key, values) {
    var text = root.dataset[key] || "";
    Object.keys(values || {}).forEach(function (k) { text = text.replace("{" + k + "}", values[k]); });
    return text;
  }

  function fromHash() {
    var m = /^#passo-(\d+)$/.exec(location.hash);
    return m ? parseInt(m[1], 10) : 1;
  }

  function go(i, initial) {
    i = Math.max(1, Math.min(n, i));
    if (i === current) return;
    steps.forEach(function (s, k) {
      var on = k + 1 === i;
      s.classList.remove("attivo");
      s.hidden = !on;
    });
    var step = steps[i - 1];
    void step.offsetWidth; // start this step's animations from their beginning
    requestAnimationFrame(function () { step.classList.add("attivo"); });
    document.querySelectorAll(".focus[data-item]").forEach(function (m) { m.classList.remove("focus"); });
    current = i;
    segs.forEach(function (b, k) {
      b.classList.toggle("fatto", k < i);
      if (k + 1 === i) b.setAttribute("aria-current", "step");
      else b.removeAttribute("aria-current");
    });
    count.textContent = label("labelStep", { n: i, of: n });
    var had = document.activeElement;
    back.disabled = i === 1;
    next.disabled = i === n;
    // a keyboard user whose button just went disabled lands on the step's title, not on the page
    if (!initial && (had === document.body || (had === next && next.disabled) || (had === back && back.disabled))) {
      var heading = step.querySelector("h2");
      if (heading) { heading.setAttribute("tabindex", "-1"); heading.focus({ preventScroll: true }); }
    }
    next.textContent = i === n ? label("labelEnd") : label("labelNext") + " →";
    var hash = "#passo-" + i;
    // on the first load without a step in the address, leave it bare: a fragment written while
    // the page loads makes the browser scroll to it, past the header
    if (location.hash !== hash && !(initial && !location.hash)) history.replaceState(null, "", hash);
    if (lang) lang.setAttribute("href", lang.getAttribute("href").split("#")[0] + hash);
    if (!initial) {
      var top = document.querySelector(".racconto-barra").getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight / 3) {
        document.querySelector(".racconto-pagina").scrollIntoView({ block: "start" });
      }
    }
  }

  next.addEventListener("click", function () { go(current + 1); });
  back.addEventListener("click", function () { go(current - 1); });
  segs.forEach(function (b, k) {
    b.addEventListener("click", function (e) { e.preventDefault(); go(k + 1); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if (e.key === "ArrowRight") go(current + 1);
    else if (e.key === "ArrowLeft") go(current - 1);
  });
  window.addEventListener("hashchange", function () { go(fromHash()); });

  // a swipe on a phone: left for the next step, right for the previous one
  var x0 = null, y0 = null;
  root.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  root.addEventListener("touchend", function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    x0 = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > 2 * Math.abs(dy)) go(current + (dx < 0 ? 1 : -1));
  });

  // the in-page x-ray switch drives the site's face switch, and follows it
  var xray = document.querySelector(".switch-raggi");
  if (xray) {
    var sync = function () { xray.setAttribute("aria-pressed", document.body.dataset.face === "tecnico" ? "true" : "false"); };
    xray.addEventListener("click", function () {
      if (window.cn2fSetFace) window.cn2fSetFace(document.body.dataset.face === "tecnico" ? "medico" : "tecnico", true);
      sync();
    });
    new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ["data-face"] });
    sync();
  }

  // one step at a time only once everything above worked: a failure leaves every step readable
  try {
    go(fromHash(), true);
    document.documentElement.classList.add("js");
  } catch (err) {
    document.documentElement.classList.remove("js");
    steps.forEach(function (s) { s.hidden = false; s.classList.add("attivo"); });
    if (window.console) console.error(err);
  }
})();
