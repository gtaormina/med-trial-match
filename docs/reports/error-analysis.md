# Error analysis (test split, first evaluation, 2026-10-26)

Read-only analysis of `reports/eval-2026-10-26.md`; nothing below was used to tune the
pipeline on the test split.

## 1. The dev-calibrated threshold does not hold its 5% target on test

| model | threshold (dev) | residual error, dev out-of-fold | residual error, test [95% CI] |
|---|---|---|---|
| claude-haiku-5.5 | 0.71 | <= 5% | 9.2% [4.9%, 13.9%] |
| gemini-2.5-flash-lite | 0.81 | 3.9% | 7.2% [4.2%, 10.3%] |
| mistral-small-3.2 | 0.83 | <= 5% | 5.2% [2.4%, 8.3%] |

The rule "lowest threshold whose dev error is <= 5%" picks the luckiest point of a noisy
curve (winner's curse) on ~100 dev notes. Proposed fix for the next iteration, decided by
principle and not by the test numbers: require the *upper bound* of a bootstrap interval
of the dev residual error to be <= 5%, and recalibrate on more dev notes.

## 2. Conditions and procedures are the weak types (F1 about 0.5)

Main causes for the best model (claude-haiku-5.5):

- **Synonyms the vocabulary matcher misses**: "Radiography of clavicle" vs "Plain X-ray of
  clavicle", "radiotherapy" vs "radiation therapy". The item stays uncoded and counts
  twice (one wrong prediction, one missed fact). Fix: let the LLM choose among the top-k
  vocabulary candidates (constrained coding).
- **Administrative Synthea procedures in the truth**: "History taking", "Taking patient
  vital signs", "Triage", "Discussion about signs and symptoms" — 39 of 65 missed
  procedures. A letter leaves them implicit; the extractor rightly ignores them. This is
  a ground-truth design flaw: they should be filtered like other administrative items.
- **Findings outside the closed vocabulary** ("Lethargy", "Thrombocytopenia",
  "Peripheral hypoperfusion"): stay uncoded, go to review (correct behaviour), but count
  against precision.

## 3. Observations and medications are strong

Observation F1 0.947 and medication F1 0.871 for claude-haiku-5.5; value accuracy on
matched observations is 99.6-100% for all models. Lab reports are the easiest notes
(F1 0.935), discharge letters the hardest (0.774).
