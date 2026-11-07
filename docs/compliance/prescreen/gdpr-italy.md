# Personal data: GDPR and the Italian rules for research

> **Not legal advice.** Texts read on 2026-10-27, updated on 2026-10-30; Italian law as in force on that date.
> The prototype in this repository is not a medical device: it runs on synthetic data and
> is not placed on the market.

## What the texts say

- **GDPR Art. 4(5)** defines pseudonymisation; **Art. 9(2)(j)** allows processing health data
  for scientific research when "based on Union or Member State law" with "suitable and
  specific measures"; **Art. 89(1)**: "Those measures may include pseudonymisation provided
  that those purposes can be fulfilled in that manner." No amending act was found.
- **Codice privacy, Art. 110** (D.Lgs. 196/2003, text in force since 1 May 2024, amended by
  L. 56/2024): consent "non è inoltre necessario quando… informare gli interessati risulta
  impossibile o implica uno sforzo sproporzionato…"; the programme needs a "motivato parere
  favorevole del competente comitato etico a livello territoriale", and the Garante sets the
  safeguards. **Art. 110-bis** (unchanged since 19 September 2018), c. 4: processing of
  clinical data for research by IRCCS is not third-party further processing.
- **Garante, provvedimento n. 298 of 9 May 2024** (GU n. 130, 5 June 2024): the safeguards
  for Art. 110, for subjects who are "deceduti o non contattabili"; reasons documented in the
  protocol; the controller must "svolgere e pubblicare la valutazione di impatto… dandone
  comunicazione al Garante". The 2018 rules of conduct for research stay in force.
- **L. 132/2025, Art. 8** (in force 10 October 2025): processing for research "nella
  realizzazione di sistemi di intelligenza artificiale" by public or non-profit bodies and
  IRCCS is of substantial public interest (Art. 9(2)(g) GDPR); secondary use of data "privi
  degli elementi identificativi diretti" with 30 days' notice to the Garante. **Art. 7(5)**:
  the decision "è sempre rimessa agli esercenti la professione medica".
- **Garante, provvedimento n. 710 of 23 September 2026** (IQVIA, 7 million euro): a database
  of one million patients of 800 general practitioners, used for studies, was not anonymous as
  the company claimed: "Il codice associato a ciascun paziente consentiva, infatti, di seguirlo
  nel tempo", and with detailed clinical information it made it possible to single out patients.
- **EDPB Guidelines 1/2026** on scientific research: adopted on 15 April 2026 for public
  consultation; no passage on pre-screening was found.

## Interpretation

- **Building and evaluating the tool** on de-identified data fits L. 132/2025 Art. 8 for
  public, non-profit or IRCCS developers (with the notice to the Garante).
- **Running it on identifiable patients** to find candidates before consent is different: it
  needs its own basis — consent, or Art. 110 with the ethics committee's opinion and the
  Garante's safeguards (including a published DPIA) — and the trial's consent does not cover
  the record review that precedes it.
- Art. 7(5) L. 132/2025 matches the design: the person decides.
- The data this project sends to a model are called **pseudonymised, never anonymous**: like the
  code in the IQVIA case, its patient identifiers (`pt-…`) follow one person across notes and
  trials, and the clinical text stays detailed, so they remain personal data (GDPR Recital 26).

## Measures already in the design

| measure | evidence |
|---|---|
| Pseudonymisation before any external model call | `src/cn2f/pseudo/engine.py`, `tests/test_trust.py::test_no_model_call_bypasses_the_trust_layer` |
| Data minimisation: birth year only, no names in the view | `src/cn2f/prescreen/view.py` |
| Outbound guard, also measured on hospital identifiers | `reports/security-prescreen.md` |
| An audit trail with no free text | `tests/test_trust.py::test_audit_refuses_free_text` |

## Sources

- GDPR: <https://eur-lex.europa.eu/eli/reg/2016/679/oj>
- Codice privacy, Art. 110: <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2003-06-30;196~art110>; Art. 110-bis: <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2003-06-30;196~art110bis>
- Garante, provv. n. 298 of 9 May 2024: <https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/10016146>
- L. 132/2025, Art. 8: <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2025-09-23;132~art8>
- Garante, IQVIA, provv. n. 710 of 23 September 2026 (press release): <https://www.garanteprivacy.it/web/guest/home/docweb/-/docweb-display/docweb/10302141>
- EDPB Guidelines 1/2026 (consultation): <https://www.edpb.europa.eu/public-consultations/guidelines-12026-on-processing-of-personal-data-for-scientific-research_en>
