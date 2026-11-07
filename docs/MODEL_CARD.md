# Model card — clinical-notes-to-fhir pipeline

> **Not a medical device.** No regulatory assessment has been made. Not for diagnosis,
> treatment, triage or any decision about real people.

## 1. What it is

A pipeline, not a single model:

| stage | component | version |
|---|---|---|
| Pseudonymisation | Microsoft Presidio analyzer + spaCy `it_core_news_lg` + custom Italian recognizers | 2.2.365 / 3.8.0 |
| Extraction | small LLMs through OpenRouter, strict JSON schema, verbatim evidence per item | see §4 |
| Coding | closed vocabulary (SNOMED CT, LOINC, RxNorm) from the Synthea export; proposed codes accepted only if consistent with the extracted term | — |
| Validation | HAPI FHIR JPA server, FHIR R4 `$validate` | 8.12.0 |
| Confidence | logistic regression over five verifiable signals; threshold: 95% bootstrap upper bound of dev residual error ≤ 5% | fitted 2026-10-27 |
| Routing | above threshold → FHIR store; below → human review queue | — |

Inputs: Italian clinical free text. Outputs: FHIR R4 `Encounter`, `Condition`,
`Observation`, `MedicationStatement`, `Procedure` referencing a pseudonymous `Patient`.

## 2. Intended use

- Demonstrating and measuring LLM-based structuring of clinical text with privacy
  safeguards, confidence scoring and human-in-the-loop review.
- Research, teaching and portfolio. Benchmarking small LLMs on a reproducible task.

## 3. Out of scope (do not use for)

- Any real patient data, including "just a test" with real notes.
- Clinical decisions, alerts, coding for reimbursement (DRG/SDO), quality indicators.
- Production deployment without: real-data validation, a clinical safety case, a DPIA, the
  applicable conformity assessment (EU MDR, EU AI Act) and replacement of non-commercial
  components (§7).

## 4. Data

- **Patients**: Synthea (MITRE), seed 42, population 50 alive + 9 deceased, Massachusetts
  module defaults, reference and end date 2026-01-01. Synthea's FHIR R4 export is the
  ground truth.
- **Notes**: 153 Italian notes (discharge/ED letters, lab reports, outpatient notes)
  written by `deepseek/deepseek-v4-flash` from a list of facts per encounter; a quality
  gate rejects notes containing measurements that match no fact (11 regenerated, 1
  excluded). Each note has 1–2 distractors (family history, excluded diagnoses, negated
  symptoms, past resolved conditions).
- **Personal data**: fictitious Italian identities (name, birth date, checksum-valid
  fiscal code, address, phone, physician) injected by code with format variants; exact
  spans recorded.
- **Split**: patient-level hash split, dev 40 patients / 102 notes, test 19 patients /
  51 notes. Calibration and model choice used dev only.

## 5. Metrics (test split)

| | claude-haiku-5.5 | mistral-small-3.2 | gemini-2.5-flash-lite |
|---|---|---|---|
| F1 [95% CI] | 0.838 [0.786, 0.877] | 0.770 [0.728, 0.809] | 0.745 [0.706, 0.780] |
| Observation F1 | 0.947 | 0.817 | 0.785 |
| Condition F1 | 0.536 | 0.524 | 0.421 |
| Procedure F1 | 0.459 | 0.527 | 0.604 |
| value accuracy (matched observations) | 100.0% | 99.6% | 99.6% |
| sent to review (bootstrap-safe threshold) | 20.6% | 40.9% | 35.7% |
| residual error on auto-written [95% CI] | 7.6% [3.2, 12.5] | 4.8% [2.1, 7.8] | 6.3% [3.4, 9.5] |
| USD / note (incl. agreement samples) | 0.0038 | 0.0010 | 0.0015 |

Pseudonymisation: strict span recall 1.000 (339 spans, fiscal code 1.000); hand-written
adversarial cases 16/20. Definitions and per-field results: `reports/eval-2026-10-27.md`.

Security (`reports/security.md`): prompt injections written inside notes and inside the FHIR
data read by the agent; an injection detector, wired into routing, sends the whole note to
review (0 false alarms on 153 clean notes); personal data in unusual formats checked against
pseudonymisation and the outbound guard.

## 6. Known biases and limitations

- **LLM-generated notes**: same family of technology writes and reads; real notes have
  abbreviations, typos, templates and copy-paste that are under-represented. Expect lower
  performance on real text.
- **Demography**: Synthea's population is US (Massachusetts) with US disease prevalence,
  US care pathways and US terminologies (SNOMED CT US edition, RxNorm). Italian names and
  addresses are cosmetic; clinical content is not Italian practice.
- **Terminology**: closed vocabulary from the same export → optimistic coding; synonyms
  outside it are missed (e.g. "radiography" vs "plain X-ray").
- **Ground truth**: encounter-level facts plus the patient's record up to the note's date;
  administrative Synthea procedures (history taking, triage) remain in the truth and
  depress procedure recall.
- **Personal data formats** come from our own generator: recall 1.000 is an upper bound.
  Known misses of the recognizers: lowercase names, two-digit birth years, identity-card
  numbers, single surnames mid-sentence (fiscal codes with spaces or dashes are recognised
  since the M10 review). The security benchmark (`reports/security.md`) inserted them into
  notes that also hold the same value in a usual format: there the outbound guard stops all
  of them except a surname written alone (3 of 51 notes). A value written only in an unusual
  format never reaches the vault and is not caught; identity-card numbers were not measured.
- **Threshold transfer**: even the bootstrap-safe threshold overshoots the 5% target on test
  for two of three models (7.6%, 6.3%); a deployment with audits re-estimates it
  (`reports/learning.md`), at the cost of more human review.
- **Small test set**: 51 notes; see the confidence intervals before comparing models.

## 7. Licensing caveats for reuse

- The Italian spaCy models are **CC BY-NC-SA 3.0** (non-commercial). Commercial reuse
  needs another Italian NER model.
- SNOMED CT, LOINC and RxNorm codes appear in data and vocabulary; real-world use of these
  terminologies is governed by their own licences (SNOMED International affiliate licence,
  LOINC licence, UMLS/RxNorm terms).

## 8. Ethical considerations

The project exists to show safeguards, not to remove humans: below-threshold data always
goes to a clinician, every datum is traceable to its sentence, and residual error is
reported with intervals rather than hidden.

## 9. Pre-screening agent (M15–M16)

**What it is.** For one patient and one clinical trial, code decides the criteria it can (rules
over FHIR), one model call answers the others with cited evidence, a verifier in code checks
every citation, and the result is a verdict — *likely eligible*, *likely excluded* or *needs
review* — with a rank score and a trace. Primary model `google/gemini-2.5-flash-lite`; an
independent judge (`anthropic/claude-haiku-5.5`) is used for evaluation only.

**Intended use.** Demonstrating and measuring pre-screening support for a research
coordinator: which patients to look at first, and why. The investigator decides eligibility;
the system never recommends a treatment.

**Out of scope.** Real patients; enrolment or exclusion decisions; any use where a *likely
excluded* verdict removes a patient from consideration without a person reading it.

**Data.** TREC Clinical Trials 2022 (50 synthetic cases, 300 judged pairs, English and an
Italian translation released in `datasets/trec-ct-2022-it/`, not yet reviewed by a person);
TrialGPT criterion annotations (one physician label per row, 1,014 rows); cn2f's 50 synthetic
Italian patients against 4 real trials from ClinicalTrials.gov.

**Metrics** (`reports/prescreen.md`, 95% cluster-bootstrap intervals):

| | value |
|---|---|
| eligible patients marked *likely excluded* (TREC, en / it) | 25% (15–36) / 22% (14–30) |
| excluded or not relevant patients marked *likely excluded* (en / it) | 62% (53–70) / 62% (53–70) |
| AUC of the rank score, eligible vs the rest (en / it) | 0.77 (0.70–0.84) / 0.77 (0.71–0.83) |
| English minus Italian, AUC | 0.00 (−0.04 to 0.04) |
| criterion accuracy against physicians, all rows / silent rows left out | 52% (46–58) / 74% (68–78) |
| accuracy of decisive answers against physicians | 85% (80–89) |
| agent / judge against physicians, kappa, all rows | 0.29 (0.23–0.36) / 0.36 (0.31–0.43) |
| agent / judge against physicians, kappa, silent rows left out | 0.55 (0.47–0.62) / 0.69 (0.62–0.75) |
| whole chain, criteria right where the answer depends on extraction (114) | 44% (29–59), no wrong decisive answer |
| whole chain, all silver-labelled criteria (mostly right by construction) | 88% (84–92) |
| unknown answers (TREC / whole chain) | 74–76% / 79% |
| cost per patient–trial pair | 0.0005–0.0010 USD |

**Limitations.**
- One checked model claim can make a pair *likely excluded*: a quarter of eligible TREC
  patients were. The verdict is a ranking aid, not a filter.
- "Verified" means the citation checks: the cited text exists, was offered for that criterion
  and contains the quote. Entailment (negation, past against current) is not checked in code;
  the judge measures it.
- TREC labels are a balanced sample, not population rates; the public data may be in the
  models' pretraining; track C labels are silver (rules on the full synthetic record); the
  judge is a model, calibrated on one physician label per row.
- Gemini occasionally produces an answer that never closes (65k tokens before the cap
  existed); 5 of 1,105 agent runs still end with a failed call: they count as no verdict, and
  their criteria as unknown.
