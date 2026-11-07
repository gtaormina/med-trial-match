# Pre-screening evaluation

Three tracks (spec G3). Every rate has a 95% cluster-bootstrap interval in brackets (2,000 resamples, seed 7): topics for track A, patients for B and C. A run whose model call failed counts as no verdict, and its criteria as unknown.

## Track A — TREC 2022 cases, English and Italian

False exclusion: eligible patients the agent marks *likely excluded* (the costly error for recruitment). Exclusion recall: excluded or not relevant patients it marks *likely excluded*. AUC: the rank score separating eligible patients from the rest. Rejected: the share of the model's answers the verifier rejected (missing answers included) at the first call, and still rejected after the one correction.

| model | language | pairs (eligible/excluded/not relevant) | false exclusion | exclusion recall | needs review | AUC eligible | no verdict | unknown answers | rejected first / final | USD / pair | s / pair (wall clock) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| anthropic/claude-haiku-5.5 | en | 100 (27/41/32) | 30% (14–44) | 74% (63–84) | 38% (29–47) | 0.74 (0.65–0.83) | 0% (0–0) | 76% | 0% / 0% | 0.0010 | 7.8 |
| anthropic/claude-haiku-5.5 | it | 100 (27/41/32) | 37% (19–56) | 71% (59–82) | 38% (28–49) | 0.72 (0.62–0.82) | 0% (0–0) | 78% | 0% / 0% | 0.0011 | 8.3 |
| google/gemini-2.5-flash-lite | en | 300 (100/100/100) | 25% (15–36) | 62% (53–70) | 48% (41–55) | 0.77 (0.70–0.84) | 1% (0–2) | 74% | 6% / 1% | 0.0005 | 3.0 |
| google/gemini-2.5-flash-lite | it | 300 (100/100/100) | 22% (14–30) | 62% (53–70) | 50% (43–57) | 0.77 (0.71–0.83) | 0% (0–0) | 76% | 7% / 0% | 0.0005 | 3.3 |

The comparison model ran on every third pair of the sample, which is not balanced; the primary model on the same pairs:

| model | language | same pairs (eligible/excluded/not relevant) | false exclusion | exclusion recall | AUC eligible |
|---|---|---|---|---|---|
| anthropic/claude-haiku-5.5 | en | 100 (27/41/32) | 30% (14–44) | 74% (63–84) | 0.74 (0.65–0.83) |
| google/gemini-2.5-flash-lite | en | 100 (27/41/32) | 26% (11–42) | 63% (51–74) | 0.73 (0.61–0.84) |
| anthropic/claude-haiku-5.5 | it | 100 (27/41/32) | 37% (19–56) | 71% (59–82) | 0.72 (0.62–0.82) |
| google/gemini-2.5-flash-lite | it | 100 (27/41/32) | 19% (5–32) | 67% (55–78) | 0.81 (0.71–0.89) |

English minus Italian on the same pairs:

| model | pairs | Δ AUC eligible | Δ false exclusion |
|---|---|---|---|
| anthropic/claude-haiku-5.5 | 100 | 0.02 (-0.01–0.07) | -7% (-19–0) |
| google/gemini-2.5-flash-lite | 297 | -0.00 (-0.04–0.04) | 3% (-4–10) |

## Track B — TrialGPT physician labels, per criterion

105 patient–trial pairs; 55 not_applicable rows left out; 374 silent rows (a physician's *not met* with no evidence sentence). Agent runs failed: 1; judge runs failed: 0. Pairs the agent sent to review: 75%.

| who | criteria | accuracy | without silent rows | decisive answers | accuracy of decisive answers | kappa vs physician | kappa without silent rows |
|---|---|---|---|---|---|---|---|
| agent | 959 | 52% (46–58) | 74% (68–78) | 279 | 85% (80–89) | 0.29 (0.23–0.36) | 0.55 (0.47–0.62) |
| judge | 959 | 57% (52–62) | 81% (77–85) | 324 | 88% (85–92) | 0.36 (0.31–0.43) | 0.69 (0.62–0.75) |

Agent against judge, kappa: 0.47 (0.40–0.53).

Agent answers by physician label (rows: physician; columns: agent):

| physician | met | not_met | unknown |
|---|---|---|---|
| met | 106 | 7 | 47 |
| not_met | 6 | 130 | 370 |
| unknown | 13 | 17 | 263 |

## Track C — the whole chain (Italian notes → extracted FHIR → verdict)

50 synthetic patients × the demo trials = 200 pairs, 2600 criteria; 22% have a silver label (the rules evaluated on the full synthetic record).

Many silver labels cannot disagree with the chain: age and sex rules read the same birth year and sex on both sides, and a condition the full record lacks is missing from the extracted record too. The number that measures the chain is the rest, where the answer depends on what extraction kept:

| silver-labelled criteria | n | right | unknown | wrong |
|---|---|---|---|---|
| depends on what extraction kept | 114 | 50 | 64 | 0 |
| same input on both sides (age, sex) | 188 | 188 | 0 | 0 |
| not met because the full record lacks it | 258 | 257 | 1 | 0 |

- Right where extraction matters: **44% (29–59)**; no wrong decisive answer means the gap is unknowns, left to the coordinator
- All silver-labelled criteria: 88% (84–92) (test split only: 92% of 162); decisive answers right: 100% (100–100)
- By who decided: code 473 of 473 decisive answers right (473 rows); conflict 0 of 0 decisive answers right (1 rows); model 22 of 22 decisive answers right (83 rows); none 0 of 0 decisive answers right (3 rows)
- Conflicts (a status code reached on absence, contradicted by a note), sent to review: 7
- Verdict against the silver verdict, where the silver labels decide one: 160 of 161 agree (likely_excluded -> likely_excluded: 160, likely_excluded -> needs_review: 1); every silver verdict there is an exclusion on age or on a condition the record lacks
- Free-text criteria against the judge: agreement 55% on 2040 criteria, kappa 0.09 (0.03–0.15)
- All model answers unknown: 79%; rejected at first call 38%, after the correction 4%; pairs sent to review 13%; 0.0010 USD and 5.2 s (wall clock) per pair; failed runs: call_failed: 1

## Cost (production price, cached answers included)

| track and model | pairs | USD |
|---|---|---|
| A anthropic/claude-haiku-5.5 | 200 | 0.205 |
| A google/gemini-2.5-flash-lite | 600 | 0.279 |
| B google/gemini-2.5-flash-lite | 105 | 0.039 |
| B-judge anthropic/claude-haiku-5.5 | 105 | 0.047 |
| C google/gemini-2.5-flash-lite | 200 | 0.190 |
| C-judge anthropic/claude-haiku-5.5 | 200 | 0.174 |

## Limits

- **Verdicts, not decisions.** The investigator decides eligibility; the agent's output is a pre-screening aid (likely eligible / likely excluded / needs review). Not a medical device.
- **Track A labels are a 1:1:1 balanced sample** (100 eligible, 100 excluded, 100 not relevant pairs), so the rates are not population rates: in a real trial most patients are not relevant. The comparison model's subset (every third pair) is not balanced; it is shown next to the primary model on the same pairs.
- **Public data may be in the models' pretraining** (TREC 2022 topics, TrialGPT notes, ClinicalTrials.gov texts); the Italian translations are new.
- **Track B:** rows labelled not_applicable are excluded from accuracy. The annotators read silence as absence, so many 'not excluded' / 'not included' rows have no evidence sentence (the silent rows); the agent answers unknown there by design, so accuracy is reported with and without them. One physician label per row: there is no physician-to-physician agreement to use as a ceiling.
- **Track C labels are silver:** the rules evaluated on the full synthetic record, for the rule-expressible criteria only, and most of them cannot disagree with the chain by construction (same birth year, absences that carry over); only the extraction-dependent rows measure the chain. Free-text criteria are compared with the judge, a model calibrated on track B, not with a person. The patients are synthetic, and the extraction threshold was tuned on the dev split (both splits are used; the test split is shown).
- **Small numbers:** 50 TREC topics, 53 TrialGPT patients and 50 synthetic patients; the intervals are wide where the clusters are few.
