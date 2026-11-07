# Pseudonymisation evaluation

Strict span recall on the PII injected into the synthetic notes (a span counts only if fully covered). Targets: overall >= 0.98, IT_FISCAL_CODE = 1.00.

Caveat: the PII in the corpus is injected by our own generator, mostly in headers and signatures and in a few formats, and the recognizers were tuned on the dev split (the test split was looked at once during tuning). These numbers are an upper bound; the hand-written hard cases below are a better picture of the limits.

Every occurrence of a detected value is redacted in the whole document. Remaining dev false positives are a newborn's lab dates equal to the birth date: leaving them in clear would disclose the birth date, so they are redacted on purpose.

| model | split | docs | ADDRESS | DATE_OF_BIRTH | IT_FISCAL_CODE | PERSON | PHONE_NUMBER | overall | false pos. | s/doc |
|---|---|---|---|---|---|---|---|---|---|---|
| it_core_news_lg | dev | 102 | 1.000 (102/102) | 1.000 (102/102) | 1.000 (102/102) | 1.000 (261/261) | 1.000 (102/102) | **1.000** | 3 | 0.11 |
| it_core_news_lg | test | 51 | 1.000 (51/51) | 1.000 (51/51) | 1.000 (51/51) | 1.000 (135/135) | 1.000 (51/51) | **1.000** | 0 | 0.07 |
| it_core_news_md | dev | 102 | 1.000 (102/102) | 1.000 (102/102) | 1.000 (102/102) | 1.000 (261/261) | 1.000 (102/102) | **1.000** | 3 | 0.10 |
| it_core_news_md | test | 51 | 1.000 (51/51) | 1.000 (51/51) | 1.000 (51/51) | 1.000 (135/135) | 1.000 (51/51) | **1.000** | 0 | 0.06 |

## Misses — it_core_news_lg, dev (0)

None.

## False positives — it_core_news_lg, dev (3)

- DATE_OF_BIRTH (3): `11/08/2025` ×3

## Misses — it_core_news_lg, test (0)

None.

## False positives — it_core_news_lg, test (0)

None.

## Misses — it_core_news_md, dev (0)

None.

## False positives — it_core_news_md, dev (3)

- DATE_OF_BIRTH (3): `11/08/2025` ×3

## Misses — it_core_news_md, test (0)

None.

## False positives — it_core_news_md, test (0)

None.

## Hand-written hard cases (16/20 pass, it_core_news_lg)

Probes outside the generator's formats, measured once and not used for tuning.

| case | result | detail | output |
|---|---|---|---|
| `name-mid-sentence` | pass |  | `Oggi si presenta in ambulatorio [PERSON_1] per controllo pressorio.` |
| `name-lowercase` | **fail** | leaked ['giulia moretti'] lost [] | `visita richiesta da giulia moretti, accompagnata dal figlio.` |
| `surname-first-single` | **fail** | leaked ['Brambilla'] lost [] | `Il sig. Brambilla riferisce dolore toracico.` |
| `relative-name` | pass |  | `Accompagnata dalla figlia [PERSON_1] (tel. [PHONE_NUMBER_1]).` |
| `cf-spaced` | pass |  | `C.F.: [IT_FISCAL_CODE_1]` |
| `cf-lowercase` | pass |  | `codice fiscale [IT_FISCAL_CODE_1]` |
| `phone-dots` | pass |  | `Recapito: [PHONE_NUMBER_1]` |
| `phone-intl-spaced` | pass |  | `cell. [PHONE_NUMBER_1]` |
| `email` | pass |  | `Referto inviato a [EMAIL_ADDRESS_1]` |
| `address-no-number` | pass |  | `Residente in [LOCATION_1].` |
| `address-lowercase` | pass |  | `abita in [ADDRESS_1], napoli` |
| `dob-in-prose` | pass |  | `Paziente di 71 anni, nato a [LOCATION_1] [DATE_OF_BIRTH_1].` |
| `dob-short-year` | **fail** | leaked ['03/03/54'] lost [] | `Nato il 03/03/54, iperteso.` |
| `clinical-date-kept` | pass |  | `Ricoverato il 12/05/2024, dimesso il 18/05/2024.` |
| `eponym-kept` | pass |  | `Diagnosi: morbo di Parkinson e tiroidite di Hashimoto.` |
| `eponym-bare` | pass |  | `Paziente con Alzheimer in fase iniziale.` |
| `drug-kept` | pass |  | `In terapia con Metformina 500 mg e Lisinopril 10 mg.` |
| `city-as-hospital` | pass |  | `Trasferito presso Ospedale di Careggi, Firenze.` |
| `identity-card` | **fail** | leaked ['CA00000AA'] lost [] | `Documento: carta d'identità CA00000AA` |
| `name-with-apostrophe` | pass |  | `Paziente: [PERSON_1]` |
