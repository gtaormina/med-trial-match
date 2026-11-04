// The guided "Try it": pick a trial, see its people in the order the program ranks them, then
// replay one reading with its real timing and try a prepared "what if". The model's answers
// are the recorded ones; the verifier and the verdict are computed here, by cn2fRecheck
// (static/js/recheck.js), and the sentence above the verdict by cn2fExplain (static/js/spiega.js).
// Everything is built with textContent: no recorded text is ever read as HTML.
(function () {
  "use strict";
  var dataEl = document.getElementById("prova-dati");
  if (!dataEl || !window.cn2fRecheck || !window.cn2fExplain) return;
  var D = JSON.parse(dataEl.textContent);
  var R = window.cn2fRecheck, X = window.cn2fExplain;
  var L = D.labels, lang = document.documentElement.lang || "it";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var trials = {}, titles = {}, people = {}, missing = {};
  D.trials.forEach(function (t) { trials[t.nct_id] = t; });
  D.trial_titles.forEach(function (t) { titles[t.nct_id] = t; });
  D.persons.forEach(function (p) { people[p.patient_id] = p; });
  D.missing.forEach(function (m) { missing[m.patient_id + "|" + m.nct_id] = m; });
  var person = null, study = null, timer = null;

  var $ = function (id) { return document.getElementById(id); };
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function num(x, nd) { var s = x.toFixed(nd); return lang === "it" ? s.replace(".", ",") : s; }
  function word(key) { return L.words[key] || key; }
  var W = { because: L.because, verdict: {} };
  ["likely_excluded", "needs_review", "likely_eligible"].forEach(function (v) { W.verdict[v] = word("verdict." + v); });
  function plainRejection(text) {
    if (!text) return "";
    for (var i = 0; i < L.rejections.length; i++) if (text.indexOf(L.rejections[i][0]) === 0) return L.rejections[i][1];
    return word("rej.other");
  }
  function criterionText(crit) { return lang === "it" ? crit.text_it : crit.text; }
  function scrollTo(id) { $(id).scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" }); }
  function pressed(buttons, value, attr) {
    buttons.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset[attr] === value ? "true" : "false"); });
  }
  function personButtons() { return Array.prototype.slice.call(document.querySelectorAll("#persone [data-persona]")); }

  // 1 · trial, then its people in the program's order
  var studyButtons = Array.prototype.slice.call(document.querySelectorAll("[data-studio]"));
  function pickStudy(nct) {
    clearInterval(timer);
    study = nct; person = null;
    pressed(studyButtons, study, "studio");
    var list = $("persone"); list.textContent = "";
    (D.ranking[nct] || []).forEach(function (pid, i) {
      var key = pid + "|" + nct, pair = D.pairs[key], gone = missing[key], who = people[pid] || {};
      var b = el("button", "scelta persona");
      b.type = "button"; b.dataset.persona = pid; b.setAttribute("aria-pressed", "false");
      b.appendChild(el("span", "iniziale", String(i + 1)));
      var about = el("span", "chi-e");
      about.appendChild(el("b", null, who.label || pid));
      about.appendChild(el("small", "salute", who.health || ""));
      b.appendChild(about);
      if (pair) {
        about.appendChild(el("span", "verdetto v-" + pair.verdict, word("verdict." + pair.verdict)));
        b.addEventListener("click", function () { person = pid; pressed(personButtons(), pid, "persona"); run(); });
      } else {
        b.disabled = true;
        b.appendChild(el("span", "nondisp", L.unavailable + (gone && gone.why_label ? " · " + gone.why_label : "")));
      }
      var li = el("li"); li.appendChild(b); list.appendChild(li);
    });
    $("scelta-persona").hidden = false;
    $("esecuzione").hidden = true;
  }
  studyButtons.forEach(function (b) {
    b.addEventListener("click", function () { pickStudy(b.dataset.studio); scrollTo("scelta-persona"); });
  });

  function guarded(fn) {
    return function () {
      try { return fn.apply(null, arguments); }
      catch (err) {
        clearInterval(timer);
        var box = $("esec-errore");
        box.textContent = L.error; box.hidden = false; $("esecuzione").hidden = false;
        if (window.console) console.error(err);
      }
    };
  }
  run = guarded(run);
  whatIf = guarded(whatIf);
  var example = $("esempio");
  if (example && D.example) {
    example.addEventListener("click", function () {
      pickStudy(D.example.nct_id);
      person = D.example.patient_id;
      pressed(personButtons(), person, "persona");
      run();
    });
  }
  $("ricomincia").addEventListener("click", function () {
    clearInterval(timer);
    $("esecuzione").hidden = true; $("scelta-persona").hidden = true;
    person = study = null; pressed(studyButtons, "", "studio");
    scrollTo("scelta-studio");
  });

  function row(crit, rec, quote) {
    var li = el("li");
    li.dataset.kind = crit.kind; li.dataset.status = rec.status;
    // for an exclusion, "absent" is good news and "present" rules the person out
    var excl = crit.kind === "exclusion" && rec.status !== "unknown";
    var good = excl ? rec.status === "not_met" : rec.status === "met";
    var shown = rec.status === "unknown" ? "unknown" : good ? "met" : "not_met";
    var st = el("span", "stato s-" + shown);
    st.appendChild(el("span", "icona", shown === "met" ? "✓" : shown === "not_met" ? "✕" : "?"));
    st.appendChild(document.createTextNode(word(excl ? "status.excl." + rec.status : "status." + rec.status)));
    li.appendChild(st);
    var text = el("span", "testo-crit");
    text.appendChild(el("span", "tipo-crit", word("kind.short." + crit.kind)));
    text.appendChild(document.createTextNode(criterionText(crit)));
    li.appendChild(text);
    li.appendChild(el("span", "chi", rec.source === "code" ? L.rule : L.ai));
    if (quote) li.appendChild(el("span", "citazione", (quote === L.from_record ? quote : "«" + quote + "»") + " · " + L.quote_found));
    else if (rec.rejection) li.appendChild(el("span", "citazione respinta", plainRejection(rec.rejection)));
    return li;
  }

  function verdictBox(target, result) {
    target.textContent = "";
    target.appendChild(el("span", "etich", L.verdict));
    target.appendChild(el("span", "verdetto grande v-" + result.verdict, word("verdict." + result.verdict)));
    target.hidden = false;
  }

  // 3 · the recorded run, played again
  function run() {
    var key = person + "|" + study, pair = D.pairs[key], trial = trials[study];
    if (!pair) return;
    clearInterval(timer);
    var who = people[person] || { label: person };
    $("esec-titolo").textContent = who.label + " × " + titles[study].plain;
    $("esec-registrate").textContent = pair.recorded_label;
    $("esec-fallita").hidden = !pair.failed;
    var list = $("esec-criteri"); list.textContent = "";
    $("esec-esito").hidden = true; $("esec-perche").hidden = true;
    $("esec-whatif").hidden = true; $("esec-whatif-risultato").hidden = true;
    $("esecuzione").hidden = false;
    scrollTo("esecuzione");

    var demo = R.demographics(pair);
    var result = R.recheck(trial, pair, D.eval_date, demo[0], demo[1]);
    var crits = {}; trial.criteria.forEach(function (c) { crits[c.id] = c; });
    var seconds = pair.usage.reduce(function (a, u) { return a + (u.latency_s || 0); }, 0);
    var cost = pair.usage.reduce(function (a, u) { return a + (u.cost_usd || 0); }, 0);
    var rows = result.criteria.map(function (rec) {
      var q = (pair.shown_quotes || {})[rec.criterion_id] || "";
      return { at: rec.source === "code" ? 0.15 : null, li: row(crits[rec.criterion_id], rec, q) };
    });
    var model = rows.filter(function (r) { return r.at === null; });
    model.forEach(function (r, i) { r.at = 0.3 + (seconds || 1) * (i + 1) / (model.length + 1); });
    var end = Math.max(seconds, 0.6) + 0.3, t0 = performance.now();
    function tick() {
      var s = reduce ? end : (performance.now() - t0) / 1000;
      $("esec-tempo").textContent = L.seconds.replace("{s}", num(Math.min(s, seconds), 1));
      $("esec-costo").textContent = num(cost * Math.min(s / Math.max(seconds, 0.01), 1), 4) + " USD";
      rows.forEach(function (r) { if (!r.shown && s >= r.at) { r.shown = true; list.appendChild(r.li); } });
      if (s >= end) { clearInterval(timer); finish(trial, pair, result); }
    }
    timer = setInterval(tick, 50);
    tick();
  }

  function finish(trial, pair, result) {
    verdictBox($("esec-esito"), result);
    $("esec-perche").textContent = X.explain(result, trial, W, lang);
    $("esec-perche").hidden = false;
    var key = person + "|" + study, changes = D.prepared[key] || [], labels = D.prepared_labels[key] || [];
    var box = $("esec-whatif-bottoni"); box.textContent = "";
    if (!changes.length) return;
    changes.forEach(function (ch, i) {
      var b = el("button", "scelta piccola", labels[i]);
      b.type = "button"; b.dataset.change = Object.keys(ch)[0];
      b.addEventListener("click", function () { whatIf(trial, pair, result, ch); });
      box.appendChild(b);
    });
    $("esec-whatif").hidden = false;
  }

  function whatIf(trial, pair, before, change) {
    var after = R.whatIf(trial, pair, D.eval_date, change);
    var out = $("esec-whatif-risultato"); out.textContent = "";
    var crits = {}; trial.criteria.forEach(function (c) { crits[c.id] = c; });
    var old = {}; before.criteria.forEach(function (c) { old[c.criterion_id] = c; });
    var changed = after.criteria.filter(function (c) { return c.status !== old[c.criterion_id].status || c.rejection !== old[c.criterion_id].rejection; });
    out.appendChild(el("h4", null, L.changed));
    if (!changed.length) out.appendChild(el("p", null, L.nochange));
    var ol = el("ol", "esito-criteri");
    changed.forEach(function (c) { ol.appendChild(row(crits[c.criterion_id], c, "")); });
    out.appendChild(ol);
    var v = el("div", "esito-finale");
    verdictBox(v, after);
    out.appendChild(v);
    out.appendChild(el("p", "perche", X.explain(after, trial, W, lang)));
    out.hidden = false;
  }
})();
