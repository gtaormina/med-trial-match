# Intended purpose of a pre-screening product

> **Not legal advice.** A statement of what a product built on this prototype would be for,
> written so that the qualification in the other documents can be checked against it. The
> prototype itself runs on synthetic data, is not placed on the market, and is
> not a medical device.

## Intended purpose (proposed wording)

> Software that helps a clinical research site **find which of its patients are worth a
> closer look for a given clinical trial**. For each patient and trial it lists the trial's
> eligibility criteria, shows the evidence in the patient's record for each one, and orders
> the patients so that the site's research staff can decide whom to screen first. It does not
> diagnose, does not recommend or change any treatment, and does not decide eligibility:
> eligibility is decided by the investigator, after informed consent, under the trial
> protocol.

## Users, setting, data

- **Users:** research coordinators and investigators at a trial site, trained on the tool.
- **Setting:** the site's own systems; the record is read through a read-only interface
  (`src/cn2f/mcp_server/server.py`), pseudonymised before any external model call
  (`src/cn2f/pseudo/engine.py`).
- **Output:** a ranked list with "likely eligible / needs review / likely excluded" and the
  evidence; never a statement that a patient *is* eligible.

## What the design does to stay inside that purpose

| design choice | evidence |
|---|---|
| The investigator decides; the coordinator's confirm/reject is recorded | `tests/test_site_prescreen.py::test_prescreen_decision_is_stored_and_audited` |
| Every criterion shows verbatim evidence; the model's own words are never shown | `tests/test_site_prescreen.py::test_replay_never_shows_the_models_reason` |
| A citation counts only if the cited text contains the quote | `tests/test_prescreen.py::test_quote_needs_two_words_on_word_boundaries` |
| Verdicts rank, they do not filter: one model claim can make a pair "likely excluded", and the measured false-exclusion rate is published | `reports/prescreen.md` |

## Wording to avoid

Phrases such as "identifies patients with condition X", "detects undiagnosed disease" or
"recommends enrolment" would move the purpose towards diagnosis or treatment decisions and
change the qualification (see [mdr-qualification.md](mdr-qualification.md)).

## Sources

- MDR (Regulation (EU) 2017/745), Art. 2(1) and Art. 2(12) "intended purpose", consolidated
  text of 09.11.2026: <https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02017R0745-20261109>
- MDCG 2019-11 rev.1 (June 2025): <https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en?filename=mdcg_2019_11_en.pdf>
