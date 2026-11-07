# Would a pre-screening product be a medical device?

> **Not legal advice.** Each point separates what the official text says from our
> interpretation. Texts read on 2026-10-27 (versions below).
> The prototype in this repository is not a medical device: it runs on synthetic data and
> is not placed on the market.

## What the texts say

- **MDR Art. 2(1)** (Regulation (EU) 2017/745, consolidated 09.11.2026): a medical device is
  intended by the manufacturer for "one or more of the following specific medical purposes:
  — diagnosis, prevention, monitoring, prediction, prognosis, treatment or alleviation of
  disease, …". **Recital 19**: "software for general purposes, even when used in a healthcare
  setting… is not a medical device."
- **MDR Annex VIII, Rule 11**: "Software intended to provide information which is used to take
  decisions with diagnosis or therapeutic purposes is classified as class IIa", IIb or III by
  the severity of the possible harm; "All other software is classified as class I."
- **MDCG 2019-11 rev.1** (June 2025), decision steps:
  - step 3: software that "performs an action beyond storage, archival, communication, simple
    search, lossless compression… may be a MDSW"; a search using natural language processing
    is not "simple search" if it contributes to a medical purpose;
  - step 4: "is the action for the benefit of individual patients? Examples… not… for the
    benefit of individual patients are those which are intended only to aggregate population
    data… as well as software intended only for epidemiological studies or registers";
  - section 3.1: "Software must have a medical purpose on its own".
- The guidance has **no example on clinical trials, recruitment, research or eligibility**;
  the Manual on borderline and classification (version 5, April 2026) has no such entry
  either.

## Interpretation

- With the purpose in [intended-purpose.md](intended-purpose.md) — support for recruitment to
  research, no diagnosis, no treatment, no eligibility decision — the most likely answer is
  **not a medical device**: matching a patient to a protocol's criteria is not one of the
  medical purposes listed in Art. 2(1).
- **The open question is step 4.** The output concerns one identified patient, but it serves
  the trial's enrolment rather than that patient's care. No official example settles it.
- **If it did qualify**, Rule 11 places it in class IIa or higher only if the information it
  gives is used to take decisions with diagnostic or therapeutic purposes; otherwise it is
  class I, which needs no notified body. Only the first case would make it high-risk under
  AI Act Art. 6(1), which requires a third-party conformity assessment
  ([ai-act.md](ai-act.md)).
- What would tip it over: claiming to find undiagnosed disease, suggesting treatment, or
  presenting "eligible" as a decision.

- **Outside the EU**, the US FDA published a discussion paper on generative-AI-enabled medical
  devices and asked for feedback on risk assessment, premarket evaluation and postmarket
  monitoring by 19 October 2026 (docket FDA-2026-N-7874). It is a discussion paper, not
  guidance; the paper itself could not be downloaded for this note, only the FDA's notice.

## Evidence the design stays on the safe side

- Verdicts are worded as pre-screening and the investigator decides:
  `tests/test_site_prescreen.py::test_pages_render_in_english`.
- No model text is shown as fact: `tests/test_site_prescreen.py::test_replay_never_shows_the_models_reason`.

## Sources

- MDR, consolidated text 09.11.2026: <https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02017R0745-20261109>; Official Journal: <https://eur-lex.europa.eu/eli/reg/2017/745/oj>
- MDCG 2019-11 rev.1 (June 2025): <https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en?filename=mdcg_2019_11_en.pdf>
- FDA, discussion paper on GenAI-enabled medical devices (notice, docket FDA-2026-N-7874): <https://content.govdelivery.com/accounts/USFDA/bulletins/424f94a>
- Manual on borderline and classification, version 5 (April 2026): <https://health.ec.europa.eu/system/files/2023-09/md_borderline_manual_en.pdf>
