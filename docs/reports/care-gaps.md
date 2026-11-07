# Care-gap agent

An LLM agent with read-only MCP tools checks five **didactic** follow-up rules per patient
(not clinical guidelines) and must cite the FHIR resources behind every finding. A
verifier written in code re-checks each claim (resources exist, codes and dates match, no
contradicting observation); rejected claims never reach a person. Evaluation date: the end
of the Synthea record (2026-01-01), living patients only.

| rule | condition | expected test | window |
|---|---|---|---|
| R1 | ipertensione | pressione arteriosa sistolica | 365 days |
| R2 | prediabete o diabete | emoglobina glicata (HbA1c) | 365 days |
| R3 | anemia | emoglobina | 180 days |
| R4 | obesità | peso o indice di massa corporea | 365 days |
| R5 | malattia renale cronica | filtrato glomerulare stimato (eGFR) | 365 days |

## Results

Gaps counted per (patient, rule). *Agent vs engine*: same data, measures the reasoning.
*Engine vs truth*: what the data in the store miss. *Agent vs truth*: end to end.

| scenario | model | patients | agreement with engine | gaps: agent vs truth (P / R) | engine vs truth (P / R) | claims rejected by verifier | patients submitted | USD / patient |
|---|---|---|---|---|---|---|---|---|
| ehr | `anthropic/claude-haiku-5.5` | 50 | 95.6% | 1.00 / 0.93 (13 of 14) | 1.00 / 1.00 | 8 / 247 | 50 / 50 | 0.0021 |
| ehr | `google/gemini-2.5-flash-lite` | 15 | 25.3% | – / 0.00 (0 of 2) | 1.00 / 1.00 | 21 / 40 | 8 / 15 | 0.0013 |
| extracted | `anthropic/claude-haiku-5.5` | 50 | 98.4% | 0.50 / 0.14 (2 of 14) | 0.50 / 0.14 | 4 / 250 | 50 / 50 | 0.0005 |

## What the verifier caught

| scenario | model | patient | rule | claimed | reason |
|---|---|---|---|---|---|
| ehr | `claude-haiku-5.5` | pt-98d89e2f75c1 | R4 | ok | unknown resource cited: 922fb35e-148d-9e82-162864005-placeholder |
| ehr | `claude-haiku-5.5` | pt-d70308fb43f6 | R3 | not_applicable | unknown resource cited: 6fbddf55-7096-b883-f3c8-cbd2-2d259dd1272c |
| ehr | `claude-haiku-5.5` | pt-42efe067c48c | R1 | gap | no cited condition of this rule active at the evaluation date |
| ehr | `claude-haiku-5.5` | pt-f84946051414 | R1 | gap | contradicted by an observation in the window |
| ehr | `gemini-2.5-flash-lite` | pt-a3084951fc51 | R3 | ok | no cited condition of this rule active at the evaluation date |
| ehr | `gemini-2.5-flash-lite` | pt-a3084951fc51 | R4 | ok | no cited observation of this rule within the window |
| ehr | `gemini-2.5-flash-lite` | pt-a3084951fc51 | R5 | ok | no cited condition of this rule active at the evaluation date |
| ehr | `gemini-2.5-flash-lite` | pt-7b6faebbe73b | R1 | ok | no cited condition of this rule active at the evaluation date |
| extracted | `claude-haiku-5.5` | pt-f84946051414 | R1 | gap | no cited condition of this rule active at the evaluation date |
| extracted | `claude-haiku-5.5` | pt-c9358a257742 | R1 | gap | no cited condition of this rule active at the evaluation date |
| extracted | `claude-haiku-5.5` | pt-c9358a257742 | R2 | gap | no cited condition of this rule active at the evaluation date |
| extracted | `claude-haiku-5.5` | pt-da434451461a | R2 | gap | no cited condition of this rule active at the evaluation date |

## Reading

- On a full record the agent's reasoning is faithful to its data and every surviving gap is
  a true gap; the misses come from claims the verifier rejected (an invented id, a mangled
  UUID, a gap contradicted by an observation in the window).
- On the store built from three notes per patient, chronic problems are rarely mentioned:
  the agent can only be as good as its data. Extraction from notes complements a problem
  list; it does not replace it.
- Tool-use reliability differs a lot between small models: one of them often never submitted
  its findings. The verifier makes this visible instead of letting wrong claims through.
- Small numbers: 14 true gaps in 50 patients. The rules are didactic.
