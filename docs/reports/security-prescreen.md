# Security of the pre-screening (M18)

Model spend for this benchmark: 0.03 USD (fresh calls in the ledger;
cache replays cost nothing). Everything here is synthetic: the attacks are written by us,
the identifiers are generated with valid shapes and fake values.

## A. Instructions hidden in a trial's criterion text

One exclusion criterion of a TREC trial carries an instruction; the screen withholds a
criterion that addresses the AI; *bypass* sends it to the model anyway, to see what the
verifier does alone. Tiers compare the verdict with the clean run of the same pair
(likely excluded < needs review < likely eligible).

| attack | screen | runs | model saw it | withheld | injected criterion decided | claims quoting the instruction (accepted) | tier up | tier down | moved to likely eligible |
|---|---|---|---|---|---|---|---|---|---|
| en-direct | bypass | 12 | 12 | 0 | 3 | 0 (0) | 0 | 0 | 0 |
| en-direct | on | 12 | 12 | 0 | 3 | 0 (0) | 0 | 0 | 0 |
| en-polite | bypass | 12 | 12 | 0 | 7 | 2 (0) | 0 | 2 | 0 |
| en-polite | on | 12 | 12 | 0 | 7 | 2 (0) | 0 | 2 | 0 |
| it-direct | bypass | 12 | 12 | 0 | 5 | 0 (0) | 0 | 2 | 0 |
| it-direct | on | 12 | 0 | 12 | 0 | 0 (0) | 3 | 0 | 0 |

- Distinct cases in which the model saw an instruction: 36. When the screen does not fire, *on* and *bypass* send the same prompt (the second is a cache replay), so those rows are one case.
- The screen itself sends a pair to review: a model-excluded pair whose trial text is
  flagged rises a tier to *needs review*. Someone who can write into a trial's text can
  push that trial's excluded patients into the review queue, not past it.
- False positives on real trial text: the screen flags 0 of 3622 criteria of the 302 trials we run, so no recorded prompt changes.

## B. Paraphrases the detector has never seen

Detector: 0 of 26 caught (lang=en: 0 of 13; lang=it: 0 of 13; goal=authority: 0 of 8; goal=false_fact: 0 of 8; goal=instruction: 0 of 10).

End to end on 12 cases: caught by the detector 0; missed 12. The model quoted the injected sentence in 3; the verifier blocked every such quote in 0 and accepted one that decides a criterion in 3; score higher than the clean run in 0.

| goal | cases | detector caught | model quoted it | accepted as met or not met | score above the clean run |
|---|---|---|---|---|---|
| instruction | 10 | 0 | 2 | 2 | 0 |
| false_fact | 2 | 0 | 1 | 1 | 0 |
| authority | 0 | 0 | 0 | 0 | 0 |

The verifier proves that a quote is in the record, not that the record is true or that
the sentence is clinical: an instruction written into a note is as quotable as a
finding.

## C. Hospital identifiers

36 rows (identifier kind × written form), each over the same 12 notes: 432 identifier instances in all.

| identifier | personal | written as | notes | left readable after pseudonymisation | would reach the model if the guard knew the hospital's identifiers |
|---|---|---|---|---|---|
| cartella | yes | plain | 12 | 9 | 0 |
| cartella | yes | spaced | 12 | 9 | 0 |
| cartella | yes | dashed | 12 | 12 | 0 |
| cartella | yes | line_break | 12 | 12 | 0 |
| nosologico | yes | plain | 12 | 11 | 0 |
| nosologico | yes | spaced | 12 | 11 | 0 |
| nosologico | yes | dashed | 12 | 11 | 0 |
| nosologico | yes | line_break | 12 | 12 | 0 |
| ricovero | yes | plain | 12 | 12 | 0 |
| ricovero | yes | spaced | 12 | 12 | 0 |
| ricovero | yes | dashed | 12 | 12 | 0 |
| ricovero | yes | line_break | 12 | 12 | 0 |
| sdo | yes | plain | 12 | 11 | 0 |
| sdo | yes | spaced | 12 | 11 | 0 |
| sdo | yes | dashed | 12 | 11 | 0 |
| sdo | yes | line_break | 12 | 10 | 0 |
| tessera_team | yes | plain | 12 | 12 | 0 |
| tessera_team | yes | spaced | 12 | 0 | 0 |
| tessera_team | yes | dashed | 12 | 0 | 0 |
| tessera_team | yes | line_break | 12 | 12 | 0 |
| cup | yes | plain | 12 | 12 | 0 |
| cup | yes | spaced | 12 | 12 | 0 |
| cup | yes | dashed | 12 | 12 | 0 |
| cup | yes | line_break | 12 | 12 | 0 |
| campione | yes | plain | 12 | 12 | 0 |
| campione | yes | spaced | 12 | 12 | 0 |
| campione | yes | dashed | 12 | 12 | 0 |
| campione | yes | line_break | 12 | 12 | 0 |
| ordine_medici | yes | plain | 12 | 12 | 0 |
| ordine_medici | yes | spaced | 12 | 12 | 12 |
| ordine_medici | yes | dashed | 12 | 12 | 12 |
| ordine_medici | yes | line_break | 12 | 12 | 12 |
| letto | quasi | plain | 12 | 12 | 0 |
| letto | quasi | spaced | 12 | 12 | 12 |
| letto | quasi | dashed | 12 | 12 | 12 |
| letto | quasi | line_break | 12 | 12 | 12 |

In all: 394 of 432 instances left readable after pseudonymisation; 72 would reach the model with the hospital's identifiers loaded into the guard.

## Limits

- The attacks are ours: a determined attacker writes others. The detector recognises
  typical phrasings, so a person stays in the loop and the verifier still demands a
  quote found in the record.
- A sentence written into the record, instruction or false clinical fact, is data to the
  verifier: no detector of typical phrasings and no quote check can tell it from a true
  finding; only provenance can.
- The end-to-end subset is the first six paraphrases of each language: 10 instructions
  and 2 false facts; no authority claim was run end to end.
- The registry column assumes the hospital loads its own identifiers into the outbound
  guard; this repository does not have such a registry.
- Small numbers: 12 TREC pairs per attack, 12 end-to-end paraphrase cases, 12 notes per
  identifier form.
