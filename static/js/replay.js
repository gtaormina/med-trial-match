/* Replay of a recorded pre-screening run: one step at a time, with the keyboard, the
   buttons or the play button. Without JavaScript every step stays on the page. */
(function () {
  "use strict";
  var lettore = document.querySelector(".lettore");
  if (!lettore) return;
  var tappe = Array.prototype.slice.call(lettore.querySelectorAll(".tappa"));
  var punti = Array.prototype.slice.call(lettore.querySelectorAll(".puntini li"));
  var indietro = lettore.querySelector('[data-azione="indietro"]');
  var avanti = lettore.querySelector('[data-azione="avanti"]');
  var play = lettore.querySelector('[data-azione="play"]');
  var calmo = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var i = 0, timer = null;

  function mostra(n, focus) {
    i = Math.max(0, Math.min(tappe.length - 1, n));
    tappe.forEach(function (t, k) { t.classList.toggle("corrente", k === i); });
    punti.forEach(function (p, k) { p.classList.toggle("fatto", k < i); p.classList.toggle("corrente", k === i); });
    indietro.disabled = i === 0;
    avanti.disabled = i === tappe.length - 1;
    if (focus) { var h = tappe[i].querySelector("h2"); if (h) h.focus({ preventScroll: true }); }
    if (history.replaceState) history.replaceState(null, "", "#passo-" + (i + 1));
    if (i === tappe.length - 1) ferma();
  }
  function ferma() {
    if (timer) { clearInterval(timer); timer = null; }
    play.textContent = "▶ " + play.dataset.play;
  }
  function parti() {
    if (i === tappe.length - 1) mostra(0, false);
    timer = setInterval(function () { mostra(i + 1, false); }, 4500);
    play.textContent = "❚❚ " + play.dataset.pause;
  }

  lettore.classList.add("attivo");
  if (calmo) play.style.display = "none"; // no auto-advance when motion is reduced
  indietro.addEventListener("click", function () { ferma(); mostra(i - 1, true); });
  avanti.addEventListener("click", function () { ferma(); mostra(i + 1, true); });
  play.addEventListener("click", function () { if (timer) ferma(); else parti(); });
  punti.forEach(function (p, k) { p.addEventListener("click", function () { ferma(); mostra(k, true); }); });
  document.addEventListener("keydown", function (e) {
    if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
    if (e.key === "ArrowRight") { ferma(); mostra(i + 1, true); }
    if (e.key === "ArrowLeft") { ferma(); mostra(i - 1, true); }
  });
  var m = /^#passo-(\d+)$/.exec(location.hash);
  mostra(m ? parseInt(m[1], 10) - 1 : 0, false);
  if (m) { // the browser's jump to the anchor can come after this script: align once loaded too
    var allinea = function () { lettore.scrollIntoView({ block: "start" }); };
    allinea();
    window.addEventListener("load", function () { requestAnimationFrame(allinea); });
  }
})();
