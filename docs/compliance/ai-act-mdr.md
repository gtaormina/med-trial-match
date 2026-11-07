# AI Act and MDR: qualification, classification, obligations

## 1. Would a product built on this pipeline be a medical device?

Under the MDR (Regulation (EU) 2017/745) software is a medical device when its manufacturer
intends it for a medical purpose (Art. 2(1)); MDCG 2019-11 gives the qualification steps.
The answer depends on the **intended purpose**, not on the technology:

| intended purpose of a hypothetical product | likely qualification |
|---|---|
| structure clinical notes into FHIR for archiving, interoperability or statistics, every datum confirmed by staff | probably **not** a medical device (data management) |
| propose care gaps / follow-up tests for individual patients (the M9 agent) | **medical device software**: information used to take decisions for diagnostic or therapeutic purposes |

MDR Annex VIII **Rule 11**: such software is **class IIa**, IIb or III if the decisions could
cause serious deterioration, death or irreversible harm. Class IIa needs a notified body.

## 2. AI Act classification

- The AI Act (Regulation (EU) 2024/1689) lists the MDR in **Annex I, Section A (entry 11)**.
  An AI system that is (or is a safety component of) a product under the MDR **and** needs
  third-party conformity assessment is **high-risk** under **Art. 6(1)**.
- A class IIa product (notified body) meets both conditions → **high-risk AI system**.
- **Dates**: the Digital Omnibus on AI (**Regulation (EU) 2026/1744**, in force since
  27 July 2026) moved the application of the high-risk obligations to **2 August 2028** for
  Art. 6(1)/Annex I systems and to **2 December 2027** for Annex III systems. Prohibited
  practices and AI literacy (Art. 4, revised by the Omnibus) have applied since 2 February 2025.
- The Omnibus also adds **Art. 4a**: processing special-category data (health data included)
  to detect and correct bias, under strict safeguards.

## 3. Obligation-by-obligation mapping (high-risk provider)

| AI Act | obligation | what exists in this repository | evidence | gap for a product |
|---|---|---|---|---|
| Art. 9 | risk management system | risk register; known failure modes measured, not assumed | [risk-register.md](risk-register.md), `reports/error-analysis.md`, `reports/security.md` | lifecycle process, post-market monitoring |
| Art. 10 | data and data governance | synthetic data with fixed seeds, patient-level split, dev/test separation, bias and limits documented | `MODEL_CARD.md`, `src/cn2f/synth/`, `tests/test_notes.py` | real, representative Italian data under a governance plan |
| Art. 11 + Annex IV | technical documentation | README, model card, design specs, evaluation reports with intervals | `README.md`, `MODEL_CARD.md`, `docs/`, `reports/` | Annex IV structure, versioned per release |
| Art. 12 | record-keeping (logs) | every LLM call in a ledger (model, tokens, cost, latency); a hash-chained audit log, with no text in it, of every model call (refused ones included), agent tool call, verifier outcome and human decision; agent traces of every tool call | `src/cn2f/llm/client.py` (`tests/test_llm_client.py`), `src/cn2f/trust/audit.py`, `tests/test_trust.py::test_audit_detects_tampering`, `tests/test_trust.py::test_audit_refuses_free_text`, `tests/test_site_prescreen.py::test_prescreen_decision_is_rolled_back_when_the_audit_fails`, `src/cn2f/review/store.py`, `reports/care-gaps-*.json` | retention policy, write-once storage, log export; anchoring the last hash outside `data/` or a keyed HMAC (the chain alone does not detect a truncated tail or a fully rewritten chain) |
| Art. 13 | transparency to deployers | two-faced site: plain clinical explanation and technical view; error rates shown with intervals; "not a medical device" on every page | `/affidabilita`, `tests/test_faces.py::test_notice_on_both_faces` | instructions for use |
| Art. 14 | human oversight | below-threshold data go to a physician; agent proposals need approval; nothing the agent says is shown unless a code verifier confirms it | `tests/test_score_review.py`, `tests/test_site.py::test_care_gap_decision_is_stored`, `tests/test_care_gaps.py::test_verifier`, `tests/test_site.py::test_care_gap_card_shows_only_verified_facts_not_the_agents_words`, `tests/test_site_prescreen.py::test_prescreen_decision_is_stored_and_audited`, `tests/test_site_prescreen.py::test_replay_never_shows_the_models_reason` | training of overseers, automation-bias measures |
| Art. 15 | accuracy, robustness, cybersecurity | metrics with bootstrap intervals; regression gate in CI (`make eval`); prompt-injection and PII-evasion benchmark; outbound guard; read-only MCP with token | `reports/eval-*.md`, `regression/thresholds.json`, `reports/security.md`, `tests/test_pseudo.py`, `tests/test_mcp.py`, `tests/test_trust.py::test_no_model_call_bypasses_the_trust_layer` | adversarial testing on real data, monitoring in production |
| Art. 17 | quality management system | small commits, tests before code, reviews per milestone | git history, `docs/superpowers/` | ISO 13485 QMS shared with the MDR |
| Art. 4 | AI literacy | site explains how the system works and fails, in plain Italian | `/`, `/affidabilita`, `/controlli` | staff training records |

## 4. Interplay with the EHDS

The European Health Data Space (Regulation (EU) 2025/327, in force since 25 March 2025,
applying in phases from 26 March 2027; the date is EUR-Lex's, while the Commission's EHDS page gives 26 March 2025) sets requirements for EHR systems and common exchange
formats. FHIR output and the HL7 Italia notes (`docs/hl7-italia.md`) are the starting point;
a product feeding an EHR system would need the European EHR exchange format and the EHDS
logging and interoperability components.

## Sources

- AI Act text by article and Annex I: <https://artificialintelligenceact.eu/article/6/>, <https://artificialintelligenceact.eu/annex/1/>, <https://artificialintelligenceact.eu/article/113/>
- Digital Omnibus on AI, Regulation (EU) 2026/1744: <https://artificialintelligenceact.eu/ai-act-explorer/digital-omnibus/>
- MDR Rule 11 and MDCG 2019-11: <https://namsa.com/resources/blog/mdr-stricter-rules-medical-device-software/>, <https://www.penningtonslaw.com/insights/new-guidance-on-the-classification-of-software-as-medical-devices/>
- EHDS, Regulation (EU) 2025/327 (Official Journal): <https://eur-lex.europa.eu/eli/reg/2025/327/oj>
- EHDS dates: entry into force 2025-03-25 in the Publications Office metadata behind EUR-Lex (CELEX 32025R0327, checked 2026-10-29); the Commission's page: <https://health.ec.europa.eu/ehealth-digital-health-and-care/european-health-data-space-regulation-ehds_en>
- AI Act (Official Journal): <https://eur-lex.europa.eu/eli/reg/2024/1689/oj>; Digital Omnibus: <https://eur-lex.europa.eu/eli/reg/2026/1744/oj>
- MDR (consolidated): <https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02017R0745-20261109>; MDCG 2019-11 rev.1: <https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en?filename=mdcg_2019_11_en.pdf>
