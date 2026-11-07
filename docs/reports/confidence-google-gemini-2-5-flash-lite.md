# Confidence calibration — google/gemini-2.5-flash-lite

Dev split: 102 documents, 1051 extracted resources, 783 correct (74.5%).

A resource is *correct* when it matches a ground-truth fact (lenient concept match: same code, or same LOINC analyte with another specimen) and, for observations, the value is right; for the encounter, the class is right. A condition, medication or procedure that is not among the note's facts but is in the patient's Synthea record up to the note's date (e.g. known hypertension in the history section) also counts as correct.

## Formula

`score = sigmoid(b + w_e*evidence + w_f*fields + w_v*valid + w_c*coding + w_a*agreement)`

| signal | meaning | weight | mean if correct | mean if wrong |
|---|---|---|---|---|
| evidence | quote found verbatim (1), after normalisation (0.8), else partial | -0.170 | 0.989 | 0.996 |
| fields | share of value/date fields readable inside the quote | +0.998 | 0.470 | 0.263 |
| valid | HAPI $validate without errors | -0.036 | 0.976 | 0.985 |
| coding | code from vocabulary: exact 1, fuzzy = similarity, none 0 | +3.009 | 0.815 | 0.185 |
| agreement | share of the 2 extra samples (T=0.7) with the same resource | +0.951 | 0.952 | 0.692 |
| bias | | -1.649 | | |

Out-of-fold AUC (5 folds grouped by document): **0.934** (baseline = plain mean of signals: 0.887).

Threshold: **0.81**, the lowest (step 0.01) whose out-of-fold residual error on auto-written resources is <= 5%: 34.8% of resources go to review, residual error 3.9% (the mean-of-signals baseline would need threshold 0.82).

## Threshold curve (out-of-fold, dev)

| threshold | to review (LR) | residual error (LR) | to review (mean) | residual error (mean) |
|---|---|---|---|---|
| 0.00 | 0.0% | 25.5% | 0.0% | 25.5% |
| 0.05 | 0.0% | 25.5% | 0.0% | 25.5% |
| 0.10 | 0.0% | 25.5% | 0.0% | 25.5% |
| 0.15 | 2.9% | 23.2% | 0.0% | 25.5% |
| 0.20 | 5.1% | 21.5% | 0.0% | 25.5% |
| 0.25 | 8.4% | 18.7% | 0.0% | 25.5% |
| 0.30 | 13.8% | 13.9% | 0.0% | 25.5% |
| 0.35 | 16.7% | 11.3% | 0.1% | 25.4% |
| 0.40 | 16.8% | 11.1% | 0.2% | 25.4% |
| 0.45 | 17.5% | 10.6% | 3.3% | 22.9% |
| 0.50 | 19.8% | 10.2% | 3.4% | 23.0% |
| 0.55 | 22.3% | 9.4% | 8.8% | 18.6% |
| 0.60 | 23.5% | 8.7% | 8.9% | 18.6% |
| 0.65 | 23.9% | 8.8% | 18.3% | 11.4% |
| 0.70 | 24.9% | 8.9% | 20.5% | 11.6% |
| 0.75 | 27.1% | 8.5% | 27.9% | 10.0% |
| 0.80 | 32.7% | 6.1% | 34.5% | 9.2% |
| 0.85 | 42.8% | 2.3% | 60.5% | 2.2% |
| 0.90 | 65.4% | 1.4% | 87.0% | 5.8% |
| 0.95 | 97.7% | 8.3% | 95.9% | 4.7% |
| 1.00 | 100.0% | 0.0% | 98.2% | 10.5% |
