// The code-only checks of a recorded pre-screening run, in the browser: the verifier, the
// merge of the recorded correction, the verdict, and the prepared "what if" changes. A port
// of cn2f.prescreen.recheck (with cn2f.prescreen.verify, cn2f.prescreen.run.aggregate and the
// age and sex rules of cn2f.trials.rules), held equal to it by tests/js/recheck-cases.json.
// No model is called: the model's answers are the recorded ones.
(function (root) {
  "use strict";

  var W = "\\p{L}\\p{N}_"; // Python's \w on str
  var KEEP = new RegExp("[^" + W + "\\s%.,<>=≤≥/\\-]", "gu");
  var WORDS = new RegExp("[" + W + "]+", "gu");
  var MIN_QUOTE_WORDS = 2, MIN_QUOTE_CHARS = 6;
  var TIER = { likely_eligible: 2, needs_review: 0, likely_excluded: -2 };
  var DEMO = /^Sex: (male|female|unknown)(?:; born (\d{4}))?$/;

  function NeedsModel(message) {
    var e = new Error("NeedsModel: " + message);
    e.name = "NeedsModel";
    return e;
  }

  function stripChars(s, chars) {
    var a = 0, b = s.length;
    while (a < b && chars.indexOf(s[a]) >= 0) a++;
    while (b > a && chars.indexOf(s[b - 1]) >= 0) b--;
    return s.slice(a, b);
  }

  function normaliseQuote(s) {
    s = String(s).toLowerCase().replace(/’/g, "'").replace(/“/g, '"').replace(/”/g, '"');
    s = s.replace(KEEP, " ");
    return stripChars(s.replace(/\s+/gu, " "), " .,");
  }

  function has(obj, key) { return Object.prototype.hasOwnProperty.call(obj, key); }

  // the quote on word boundaries, as Python's verifier matches it, without a lookbehind
  // (Safari before 16.4 cannot build one)
  var WORD_CHAR = new RegExp("^[" + W + "]$", "u");
  function charBefore(t, i) {
    if (i <= 0) return "";
    var low = t.charCodeAt(i - 1);
    return (low >= 0xdc00 && low <= 0xdfff && i >= 2) ? t.slice(i - 2, i) : t.slice(i - 1, i);
  }
  function charAfter(t, i) {
    if (i >= t.length) return "";
    var cp = t.codePointAt(i);
    return String.fromCodePoint(cp);
  }
  function quoteFound(quote, text) {
    var t = normaliseQuote(text), from = 0;
    for (;;) {
      var i = t.indexOf(quote, from);
      if (i < 0) return false;
      var a = charBefore(t, i), b = charAfter(t, i + quote.length);
      if (!(a && WORD_CHAR.test(a)) && !(b && WORD_CHAR.test(b))) return true;
      from = i + 1;
    }
  }

  function check(claim, status, units, allowed, flagged) {
    var evidence = (claim.evidence || []).map(String);
    var quote = String(claim.quote || "");
    var out = { evidence: evidence, quote: quote, rejection: null };
    var missing = evidence.filter(function (e) { return !has(units, e); });
    var q = normaliseQuote(quote);
    var words = (q.match(WORDS) || []).length;
    if (["met", "not_met", "unknown"].indexOf(status) < 0) out.rejection = "invalid status";
    else if (missing.length) out.rejection = "unknown evidence id: " + missing.join(", ");
    else if (status === "unknown") { /* nothing to check */ }
    else if (!evidence.length) out.rejection = "no evidence";
    else if (allowed !== null && evidence.some(function (e) { return allowed.indexOf(e) < 0; })) out.rejection = "evidence not listed for this criterion";
    else if (evidence.some(function (e) { return flagged.has(e); })) out.rejection = "evidence flagged as instructions to the AI";
    else if (words < MIN_QUOTE_WORDS || Array.from(q).length < MIN_QUOTE_CHARS) out.rejection = "quote too short";
    else if (!evidence.some(function (e) { return quoteFound(q, units[e].text); })) out.rejection = "quote not in cited evidence";
    return out;
  }

  function verify(claims, units, criteria, code, allowed, flagged) {
    var byCriterion = {};
    (claims || []).forEach(function (c) {
      if (c && typeof c === "object" && !Array.isArray(c)) {
        var id = String(c.criterion_id);
        if (!has(byCriterion, id)) byCriterion[id] = c;
      }
    });
    return criteria.map(function (crit) {
      var claim = byCriterion[crit.id];
      var modelStatus = claim ? (claim.status === undefined ? null : claim.status) : null;
      var rec = { criterion_id: crit.id, status: "unknown", evidence: [], quote: "", source: "none", verified: false, rejection: null };
      var ok = allowed === null ? null : (allowed[crit.id] || []);
      var cs = code[crit.id] || ["unknown", []];
      var codeStatus = cs[0], codeIds = cs[1];
      if (codeStatus === "met" || codeStatus === "not_met") {
        rec.status = codeStatus; rec.evidence = codeIds.slice(); rec.source = "code"; rec.verified = true;
        if ((modelStatus === "met" || modelStatus === "not_met") && modelStatus !== codeStatus) {
          var c1 = check(claim, modelStatus, units, ok, flagged);
          if (!codeIds.length && c1.rejection === null) {
            rec.status = "unknown"; rec.source = "conflict"; rec.verified = false;
            rec.evidence = c1.evidence; rec.quote = c1.quote;
            rec.rejection = "no record found (" + codeStatus + " by code), a note says " + modelStatus;
          } else {
            rec.rejection = "contradicted by code";
          }
        }
        return rec;
      }
      if (!claim) { rec.rejection = "no answer"; return rec; }
      rec.source = "model";
      var c2 = check(claim, modelStatus, units, ok, flagged);
      if (c2.rejection) rec.rejection = c2.rejection;
      else if (modelStatus === "unknown") { rec.verified = true; rec.evidence = c2.evidence; rec.quote = c2.quote; }
      else { rec.status = modelStatus; rec.verified = true; rec.evidence = c2.evidence; rec.quote = c2.quote; rec.rejection = c2.rejection; }
      return rec;
    });
  }

  function fmtG(x) { return Number.isInteger(x) ? String(x) : String(x); }

  function trialLevel(trial, birthYear, sex, evalDate) {
    var reasons = [];
    if (birthYear !== null) {
      var year = parseInt(evalDate.slice(0, 4), 10);
      var lo = year - birthYear - 1, hi = year - birthYear;
      if (trial.min_age_years !== null && trial.min_age_years !== undefined && hi < trial.min_age_years) reasons.push("trial: age range, younger than " + fmtG(trial.min_age_years));
      if (trial.max_age_years !== null && trial.max_age_years !== undefined && lo > trial.max_age_years) reasons.push("trial: age range, older than " + fmtG(trial.max_age_years));
    }
    if (sex && trial.sex !== "ALL" && trial.sex.toLowerCase() !== sex) reasons.push("trial: sex, " + trial.sex.toLowerCase() + " only");
    return reasons;
  }

  // Python's round(x, 3): halves go to the even neighbour
  function round3(x) {
    var y = x * 1000, r = Math.round(y);
    if (Math.abs(y % 1) === 0.5) r = 2 * Math.round(y / 2);
    return (r === 0 ? 0 : r) / 1000;
  }

  function count(list, v) { return list.filter(function (x) { return x === v; }).length; }

  function aggregate(trial, checked, birthYear, sex, evalDate, flaggedShown, flaggedCriteria) {
    var kinds = {};
    trial.criteria.forEach(function (c) { kinds[c.id] = c.kind; });
    var order = [], status = {}, source = {};
    checked.forEach(function (r) {
      if (!(r.criterion_id in status)) order.push(r.criterion_id);
      status[r.criterion_id] = r.status;
      source[r.criterion_id] = r.source || "model";
    });
    var reasons = trialLevel(trial, birthYear, sex, evalDate);
    order.forEach(function (cid) { if (kinds[cid] === "inclusion" && status[cid] === "not_met") reasons.push(source[cid] + ": " + cid + " inclusion not met"); });
    order.forEach(function (cid) { if (kinds[cid] === "exclusion" && status[cid] === "met") reasons.push(source[cid] + ": " + cid + " exclusion met"); });
    var inc = order.filter(function (c) { return kinds[c] === "inclusion"; }).map(function (c) { return status[c]; });
    var exc = order.filter(function (c) { return kinds[c] === "exclusion"; }).map(function (c) { return status[c]; });
    var verdict;
    if (reasons.length) verdict = "likely_excluded";
    else if (order.length && inc.every(function (s) { return s === "met"; }) && exc.every(function (s) { return s === "not_met"; })) verdict = "likely_eligible";
    else verdict = "needs_review";
    if (flaggedShown.length || flaggedCriteria.length) {
      var byRecord = reasons.some(function (r) { return r.indexOf("trial:") === 0 || r.indexOf("code:") === 0; });
      if (!(verdict === "likely_excluded" && byRecord)) verdict = "needs_review";
    }
    if (flaggedShown.length) reasons.push("review: units " + flaggedShown.join(", ") + " addressed to the AI");
    flaggedCriteria.forEach(function (cid) { reasons.push("review: criterion " + cid + " addressed to the AI"); });
    var n = Math.max(order.length, 1);
    var within = (count(inc, "met") - count(inc, "not_met") - count(exc, "met")) / n;
    return { verdict: verdict, score: round3(TIER[verdict] + within), reasons: reasons };
  }

  function demographics(pair) {
    var units = pair.units || {};
    for (var id in units) {
      if (units[id].kind === "demographics") {
        var m = DEMO.exec(units[id].text);
        if (m) return [m[2] ? parseInt(m[2], 10) : null, m[1] === "unknown" ? null : m[1]];
      }
    }
    return [null, null];
  }

  // ---- the coordinator's memory (cn2f.prescreen.memory.apply_memory) ----
  function daysBetween(earlier, later) {
    var a = earlier.slice(0, 10).split("-").map(Number), b = later.slice(0, 10).split("-").map(Number);
    return Math.round((Date.UTC(b[0], b[1] - 1, b[2]) - Date.UTC(a[0], a[1] - 1, a[2])) / 86400000);
  }

  function applyMemory(checked, units, evalDate, rules) {
    var byId = {};
    checked.forEach(function (r) { byId[r.criterion_id] = r; });
    rules.forEach(function (rule) {
      var rec = has(byId, rule.criterion_id) ? byId[rule.criterion_id] : null, why = null;
      if (!rec || rec.status === "unknown") return;
      if (rule.kind === "always_review") why = "always checked by a person (coordinator rule)";
      else if (rule.kind === "max_evidence_age" && rec.source === "model") {
        var dated = (rec.evidence || []).map(function (e) { return has(units, e) ? units[e].date : null; })
          .filter(function (d) { return d; });
        if (!dated.length) return;
        if (!dated.every(function (d) { return daysBetween(d, evalDate) > rule.days; })) return;
        why = "evidence older than " + rule.days + " days (coordinator rule)";
      } else return;
      rec.status = "unknown"; rec.source = "none"; rec.verified = false; rec.rejection = why; rec.memory = rule.id;
    });
  }

  function recheck(trial, pair, evalDate, birthYear, sex, memory) {
    var trace = pair.trace;
    var units = pair.units, code = trace.code, allowed = trace.offered;
    var flaggedShown = trace.flagged_units || [], flagged = new Set(flaggedShown);
    var flaggedCriteria = trace.flagged_criteria || [];
    var follow = trace.follow_up || {};
    var calls = trace.calls || [];
    var first = calls.length && calls[0].claims ? calls[0].claims : [];
    var checked = verify(first, units, trial.criteria, code, allowed, flagged);
    checked.forEach(function (r) {
      if (flaggedCriteria.indexOf(r.criterion_id) >= 0 && r.source !== "code") {
        r.status = "unknown"; r.source = "none"; r.verified = false; r.rejection = "criterion text addressed to the AI";
      }
    });
    var rejected = {}, anyRejected = false;
    checked.forEach(function (r) {
      if ((r.source === "model" || r.source === "none") && !r.verified && r.rejection &&
          flaggedCriteria.indexOf(r.criterion_id) < 0 && has(follow, r.criterion_id)) {
        rejected[r.criterion_id] = r.rejection; anyRejected = true;
      }
    });
    if (anyRejected && calls.length > 1) {
      var second = calls[1], fixed = {};
      if (second.error !== undefined) {
        Object.keys(rejected).forEach(function (cid) { fixed[cid] = { rejection: rejected[cid] + "; follow-up failed (" + second.error + ")" }; });
      } else {
        var again = trial.criteria.filter(function (c) { return has(rejected, c.id); });
        verify(second.claims || [], units, again, code, allowed, flagged).forEach(function (r) { fixed[r.criterion_id] = r; });
      }
      checked.forEach(function (r) {
        var nw = fixed[r.criterion_id];
        if (!nw) return;
        if (nw.verified) { Object.assign(r, nw); r.corrected = true; }
        else { r.rejection = nw.rejection || r.rejection; r.corrected = false; }
      });
    }
    if (memory && memory.length) applyMemory(checked, units, evalDate, memory);
    var out = aggregate(trial, checked, birthYear, sex, evalDate, flaggedShown, flaggedCriteria);
    return {
      criteria: checked.map(function (r) {
        var o = { criterion_id: r.criterion_id, status: r.status, source: r.source, verified: r.verified, rejection: r.rejection };
        if ("corrected" in r) o.corrected = r.corrected;
        if ("memory" in r) o.memory = r.memory;
        return o;
      }),
      verdict: out.verdict, score: out.score, reasons: out.reasons,
    };
  }

  // ---- the age and sex rules, for "what if" ----
  function daysInMonth(y, m) { return new Date(Date.UTC(y, m, 0)).getUTCDate(); }
  function age(by, bm, bd, oy, om, od) { return oy - by - ((om < bm || (om === bm && od < bd)) ? 1 : 0); }

  function ageInterval(birthDate, evalDate) {
    var p = birthDate.slice(0, 10).split("-").map(function (x) { return parseInt(x, 10); });
    var e = evalDate.slice(0, 10).split("-").map(function (x) { return parseInt(x, 10); });
    if (p.length === 3) { var a = age(p[0], p[1], p[2], e[0], e[1], e[2]); return [a, a]; }
    var y = p[0], m = p.length === 2 ? p[1] : null;
    var last = [y, m || 12, daysInMonth(y, m || 12)], first = [y, m || 1, 1];
    return [age(last[0], last[1], last[2], e[0], e[1], e[2]), age(first[0], first[1], first[2], e[0], e[1], e[2])];
  }

  function rules(c) { return [].concat.apply([], (c.alternatives || []).map(function (a) { return a.rules; })); }
  function ageSexOnly(c) { var r = rules(c); return r.length > 0 && r.every(function (x) { return x.type === "age" || x.type === "sex"; }); }
  function touchesDemographics(c) { return rules(c).some(function (x) { return x.type === "age" || x.type === "sex"; }); }

  function evaluateRule(rule, patient, evalDate) {
    if (rule.type === "age") {
      if (!patient.birthDate) return ["unknown", []];
      var iv = ageInterval(patient.birthDate, evalDate), lo = iv[0], hi = iv[1], v = [];
      if (rule.min_years !== null && rule.min_years !== undefined) v.push(lo >= rule.min_years ? "met" : hi < rule.min_years ? "not_met" : "unknown");
      if (rule.max_years !== null && rule.max_years !== undefined) v.push(hi <= rule.max_years ? "met" : lo > rule.max_years ? "not_met" : "unknown");
      var st = v.indexOf("not_met") >= 0 ? "not_met" : v.indexOf("unknown") >= 0 ? "unknown" : "met";
      return [st, [patient.id]];
    }
    if (patient.gender !== "male" && patient.gender !== "female") return ["unknown", []];
    return [patient.gender === rule.sex ? "met" : "not_met", [patient.id]];
  }

  function sortedUnique(ids) { return Array.from(new Set(ids)).sort(); }

  function evaluateAlternative(alt, patient, evalDate) {
    var results = alt.rules.map(function (r) { return evaluateRule(r, patient, evalDate); });
    if (results.some(function (x) { return x[0] === "not_met"; })) {
      return ["not_met", sortedUnique([].concat.apply([], results.filter(function (x) { return x[0] === "not_met"; }).map(function (x) { return x[1]; })))];
    }
    var ids = sortedUnique([].concat.apply([], results.map(function (x) { return x[1]; })));
    if (alt.complete !== false && results.every(function (x) { return x[0] === "met"; })) return ["met", ids];
    return ["unknown", ids];
  }

  function evaluateCriterion(c, patient, evalDate) {
    var alts = (c.alternatives || []).map(function (a) { return evaluateAlternative(a, patient, evalDate); });
    var met = alts.filter(function (x) { return x[0] === "met"; });
    if (met.length) return ["met", met[0][1]];
    var ids = sortedUnique([].concat.apply([], alts.map(function (x) { return x[1]; })));
    if (alts.length && c.exhaustive && alts.every(function (x) { return x[0] === "not_met"; })) return ["not_met", ids];
    return ["unknown", ids];
  }

  function demographicsText(birthYear, sex) {
    var bits = [sex ? "Sex: " + sex : "Sex: unknown", birthYear ? "born " + birthYear : ""];
    return bits.filter(Boolean).join("; ");
  }

  function whatIf(trial, pair, evalDate, change) {
    pair = JSON.parse(JSON.stringify(pair));
    var d = demographics(pair), birthYear = d[0], sex = d[1];
    if ("memory" in change) {  // a coordinator rule, applied in code: no model needed
      var rule = change.memory;
      var known = trial.criteria.some(function (c) { return c.id === rule.criterion_id; });
      if (!known || (rule.kind !== "max_evidence_age" && rule.kind !== "always_review")) throw new Error("not a rule for this trial");
      return recheck(trial, pair, evalDate, birthYear, sex, [rule]);
    }
    if ("remove_unit" in change) {
      var uid = change.remove_unit, unit = pair.units[uid];
      if (!unit || unit.kind !== "sentence") throw NeedsModel("only a note sentence can be removed, not " + uid);
      delete pair.units[uid];
      var offered = pair.trace.offered, next = {};
      Object.keys(offered).forEach(function (cid) { next[cid] = offered[cid].filter(function (i) { return i !== uid; }); });
      pair.trace.offered = next;
      return recheck(trial, pair, evalDate, birthYear, sex);
    }
    if ("birth_year" in change) birthYear = parseInt(change.birth_year, 10);
    else if ("sex" in change) {
      if (change.sex !== "male" && change.sex !== "female") throw new Error("unknown sex: " + change.sex);
      sex = change.sex;
    } else throw new Error("unknown change");
    if (trial.criteria.some(function (c) { return touchesDemographics(c) && !ageSexOnly(c); })) {
      throw NeedsModel("a rule mixes age or sex with what only the record can tell");
    }
    var patient = { id: pair.patient_id, birthDate: String(birthYear) };
    if (sex) patient.gender = sex;
    trial.criteria.forEach(function (c) { if (ageSexOnly(c)) pair.trace.code[c.id] = evaluateCriterion(c, patient, evalDate); });
    Object.keys(pair.units).forEach(function (id) {
      if (pair.units[id].kind === "demographics") pair.units[id].text = demographicsText(birthYear, sex);
    });
    return recheck(trial, pair, evalDate, birthYear, sex);
  }

  var api = { normaliseQuote: normaliseQuote, quoteFound: quoteFound, verify: verify, aggregate: aggregate,
              demographics: demographics, recheck: recheck, whatIf: whatIf, applyMemory: applyMemory };
  root.cn2fRecheck = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
