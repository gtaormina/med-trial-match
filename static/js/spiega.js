// The one sentence above a verdict on the Try it page: the reason the aggregation gave
// (cn2f.prescreen.run.aggregate, mirrored in recheck.js) and who decided it, a rule or the AI.
// A classic script: the page reads window.cn2fExplain, the node tests require() it.
(function (root) {
  "use strict";

  // "{n}" and, as cn2f.web.site.story_copy.fmt does, "{n:one|many}" for a count and its noun
  function fill(text, values) {
    return text.replace(/\{(\w+)(?::([^|}]*)\|([^}]*))?\}/g, function (_, key, one, many) {
      var v = values[key];
      return one === undefined ? String(v) : v + " " + (v === 1 ? one : many);
    });
  }

  function shorten(text, max) {
    var line = String(text || "").split("\n")[0].trim();
    if (line.length <= max) return line;
    var cut = line.slice(0, max);
    return cut.slice(0, Math.max(cut.lastIndexOf(" "), 1)).replace(/[\s,;:(]+$/, "") + "…";
  }

  function explain(result, trial, W, lang) {
    var crit = {};
    trial.criteria.forEach(function (c) { crit[c.id] = c; });
    var label = function (id) {
      var c = crit[id];
      return shorten(c ? (lang === "it" ? c.text_it || c.text : c.text) : id, 90);
    };
    var B = W.because, head = W.verdict[result.verdict] + ": ";
    var reasons = result.reasons || [];
    if (result.verdict === "likely_excluded") {
      var first = function (prefix) { return reasons.filter(function (r) { return r.indexOf(prefix) === 0; })[0]; };
      var r = first("trial:") || first("code:") || first("model:") || reasons[0] || "";
      var m, why;
      if ((m = /^trial: age range, younger than ([\d.]+)/.exec(r))) why = fill(B.young, { n: m[1] });
      else if ((m = /^trial: age range, older than ([\d.]+)/.exec(r))) why = fill(B.old, { n: m[1] });
      else if ((m = /^trial: sex, (female|male) only/.exec(r))) why = B["sex_" + m[1]];
      else if ((m = /^(?:code|model): (\S+) inclusion not met/.exec(r))) why = fill(B.inclusion, { text: label(m[1]) });
      else if ((m = /^(?:code|model): (\S+) exclusion met/.exec(r))) why = fill(B.exclusion, { text: label(m[1]) });
      else why = r;
      return head + why + ". " + (r.indexOf("model:") === 0 ? B.by_ai : B.by_rule);
    }
    if (result.verdict === "needs_review") {
      if (reasons.some(function (x) { return x.indexOf("review:") === 0; })) return head + B.flagged + ".";
      var open = (result.criteria || []).filter(function (c) { return c.status === "unknown"; }).length;
      return head + fill(B.review, { open: open }) + ".";
    }
    return head + B.eligible + ".";
  }

  var api = { explain: explain, fill: fill, shorten: shorten };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.cn2fExplain = api;
})(this);
