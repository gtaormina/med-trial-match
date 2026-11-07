# Where a pre-screening product sits under the AI Act

> **Not legal advice.** Texts read on 2026-10-27 (Italian decree on 2026-10-30): the AI Act consolidated on 27.07.2026, with
> the Digital Omnibus applied.
> The prototype in this repository is not a medical device: it runs on synthetic data and
> is not placed on the market.

## What the texts say

- **Digital Omnibus on AI: Regulation (EU) 2026/1744** of 8 July 2026, published on
  24.7.2026, in force on 27 July 2026. New **Art. 113(c)**: the high-risk rules apply from
  "2 December 2027 as regards… Article 6(2) and Annex III; and 2 August 2028 as regards…
  Article 6(1) and Annex I". Chapters I–II (Art. 4 included) have applied since 2 February
  2025; Art. 50 from 2 August 2026.
- **Italy: D.Lgs. 7 ottobre 2026, n. 179** (GU Serie Generale n. 234 of 8 October 2026,
  in force on 23 October 2026), "Adeguamento della normativa nazionale alle disposizioni del regolamento
  (UE) 2024/1689… in materia di poteri delle Autorità nazionali e di utilizzo dell'intelligenza
  artificiale nella formazione". Only its title and dates were read for this note, not its
  articles: which authority supervises what has to be checked in the text before relying on it.
- **Art. 6(1)**: high-risk when the system is, or is a safety component of, a product under
  Annex I legislation (the MDR is Section A, point 11) **and** that product needs third-party
  conformity assessment.
- **Annex III** has no area for clinical research or trial recruitment. Point 5(a) covers
  systems used "by public authorities or on behalf of public authorities to evaluate the
  eligibility of natural persons for essential public assistance benefits and services,
  including healthcare services".
- **Art. 6(3)**: an Annex III system is not high-risk when it performs "(a)… a narrow
  procedural task; … (d)… a preparatory task to an assessment", but it is "always…
  high-risk where the AI system performs profiling of natural persons". The Commission's
  Art. 6 guidelines exist only as a **draft** (19 May 2026); its para. 108 says a system
  producing "a specific recommendation or evaluation of the case… can therefore not be
  considered to perform a preparatory task".
- **Art. 2(6)** excludes systems "specifically developed and put into service for the sole
  purpose of scientific research and development", but **recital 25** adds that "any other AI
  system that may be used for the conduct of any research and development activity should
  remain subject" to the Regulation.
- **Art. 4** (as replaced by the Omnibus): providers and deployers "shall take measures to
  support the development of AI literacy of their staff", without requiring "any specific
  level".
- **Art. 50(1)**: people are told they interact with an AI "unless this is obvious";
  **Art. 50(2)**: synthetic text is marked in a machine-readable way, with exceptions for
  "assistive function for standard editing" or output that does "not substantially alter the
  input data".

## Interpretation

- If the product is **not a medical device**, Art. 6(1) does not apply and no Annex III area
  fits: it is **most likely not high-risk**.
- If it **is** a device of class IIa or higher, it is high-risk under Art. 6(1), from 2 August
  2028; a class I device, assessed by its manufacturer alone, is not.
- Art. 6(3)(d) would not help if an Annex III area applied: "likely eligible / excluded" is an
  evaluation of the case.
- **Do not rely on the research exclusion of Art. 2(6)**: a tool used to run recruitment for
  research is the kind of system recital 25 keeps in scope.
- **Art. 4 applies now** to the site as deployer: staff need to understand what the tool does
  and how it fails — the two-faced pages and the published error rates are written for that.
- Open question: whether Art. 50(2) marking applies to model-written rationales; this design
  never shows them.

## Evidence in this repository

| obligation (voluntary if not high-risk) | evidence |
|---|---|
| record-keeping (Art. 12) | `src/cn2f/trust/audit.py`, `tests/test_trust.py::test_audit_detects_tampering`, `tests/test_site_prescreen.py::test_prescreen_decision_is_rolled_back_when_the_audit_fails` |
| human oversight (Art. 14) | `tests/test_site_prescreen.py::test_prescreen_decision_is_stored_and_audited` |
| accuracy and robustness (Art. 15) | `reports/prescreen.md`, `regression/prescreen-thresholds.json`, `reports/security-prescreen.md`, `tests/test_prescreen.py::test_injected_trial_text_is_not_sent_and_the_pair_goes_to_review` |
| AI literacy (Art. 4) | `reports/prescreen.md` (limits section), the reliability page `/affidabilita` |

## Sources

- AI Act, consolidated 27.07.2026: <https://eur-lex.europa.eu/eli/reg/2024/1689/oj>
- Digital Omnibus on AI, Regulation (EU) 2026/1744: <https://eur-lex.europa.eu/eli/reg/2026/1744/oj>
- D.Lgs. 7 ottobre 2026, n. 179 (Gazzetta Ufficiale): <https://www.gazzettaufficiale.it/atto/serie_generale/caricaDettaglioAtto/originario?atto.dataPubblicazioneGazzetta=2026-10-08&atto.codiceRedazionale=26G00200>
- Draft Commission guidelines on the classification of high-risk AI systems (19 May 2026): <https://digital-strategy.ec.europa.eu/en/library/draft-commission-guidelines-classification-high-risk-ai-systems>
