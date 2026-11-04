// Medico ⇄ Tecnico switch (scan sweep), X-ray lens, and evidence ⇄ datum highlighting.
// Without JS the switch is a plain form post to /faccia and pages stay fully readable.
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setFace(next, quiet) {
    document.cookie = "faccia=" + next + "; path=/; max-age=31536000; SameSite=Lax";
    document.body.dataset.face = next;
    var btn = document.getElementById("switch-faccia");
    if (btn) {
      btn.setAttribute("aria-pressed", next === "tecnico" ? "true" : "false");
      btn.value = next === "tecnico" ? "medico" : "tecnico";
    }
    document.querySelectorAll(".facce").forEach(function (main) {
      main.classList.remove("anim", "indietro");
      void main.offsetWidth; // restart the scan animation
      if (!reduce && !quiet) {
        main.classList.add("anim");
        if (next === "medico") main.classList.add("indietro");
      }
      main.dataset.face = next;
      main.querySelectorAll(":scope > .layer").forEach(function (layer) {
        var hidden = layer.classList.contains(next === "tecnico" ? "skin" : "xray");
        layer.inert = hidden;
        if (hidden) layer.setAttribute("aria-hidden", "true");
        else layer.removeAttribute("aria-hidden");
      });
    });
  }

  window.cn2fSetFace = setFace; // the story's in-page x-ray switch drives the same face

  function initSwitch() {
    var btn = document.getElementById("switch-faccia");
    if (!btn) return;
    // a static copy always ships the clinical face: apply the face chosen on another page
    var saved = (document.cookie.match(/(?:^|; )faccia=(medico|tecnico)/) || [])[1];
    if (saved && saved !== document.body.dataset.face) setFace(saved, true);
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      setFace(document.body.dataset.face === "tecnico" ? "medico" : "tecnico");
    });
  }

  function initLens() {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    document.querySelectorAll(".lente").forEach(function (box) {
      var x = box.querySelector(".lente-xray");
      if (!x) return;
      box.addEventListener("mousemove", function (e) {
        var r = box.getBoundingClientRect();
        x.style.clipPath = "circle(110px at " + (e.clientX - r.left) + "px " + (e.clientY - r.top) + "px)";
      });
      box.addEventListener("mouseleave", function () { x.style.clipPath = "circle(0 at 50% 50%)"; });
    });
  }

  // Elements sharing data-item light up together (datum card ⇄ evidence mark), on hover and focus.
  function initLinks() {
    function toggle(id, on) {
      document.querySelectorAll('[data-item="' + id + '"]').forEach(function (el) { el.classList.toggle("focus", on); });
    }
    ["mouseover", "focusin"].forEach(function (ev) {
      document.addEventListener(ev, function (e) {
        var el = e.target.closest && e.target.closest("[data-item]");
        document.querySelectorAll(".focus[data-item]").forEach(function (m) { m.classList.remove("focus"); });
        if (el) toggle(el.dataset.item, true);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () { initSwitch(); initLens(); initLinks(); });
})();
