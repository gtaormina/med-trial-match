# GDPR

## Data in this project

Synthetic only: invented patients (Synthea) with fictitious Italian identities. No personal
data of real people is processed. The analysis below is for a product on real data.

## Key points for a real deployment

| topic | GDPR | design answer in this repository | evidence |
|---|---|---|---|
| health data | special category, Art. 9(1); a basis in Art. 9(2) is needed (e.g. 9(2)(h) care, 9(2)(i) public health, 9(2)(j) research with Art. 89 safeguards) | none needed for synthetic data; a product must document its basis and the Italian rules (Codice privacy, art. 2-sexies/2-septies) | — |
| pseudonymisation | Art. 4(5); pseudonymised data **remain personal data** (Recital 26) | Presidio + Italian recognizers before any external call; consistent placeholders; vault kept local | `reports/pseudonymisation.md`, `tests/test_pseudo.py` |
| data protection by design | Art. 25 | pseudonymisation enforced in code, not asked in a prompt; outbound guard refuses any vault value or valid fiscal code | `tests/test_pseudo.py::test_llm_client_with_guard_never_sends_original_text` |
| minimisation | Art. 5(1)(c) | the LLM receives only the note text with placeholders; the agent sees only pseudonymous ids and clinical codes | `tests/test_mcp.py`, `src/cn2f/agent/runner.py` |
| security | Art. 32 | no public ports; secrets in `.env`/settings with mode 600; read-only MCP with bearer token; vault mode 600 | `tests/test_settings_store.py`, `tests/test_mcp.py::test_http_requires_bearer_token_and_allowed_host` |
| processors | Art. 28 | an LLM provider receiving pseudonymised text is a processor: a data processing agreement is required | gap for a product |
| transfers | Chapter V (Art. 44 ff.) | pseudonymised data sent to non-EU providers is a transfer; options: EU-hosted models, open-weight models on premises, or a valid transfer mechanism | gap; M6 plan item "local model" |
| accuracy | Art. 5(1)(d) | measured error rates; human review below threshold; corrections stored | `reports/eval-*.md`, `src/cn2f/review/` |
| automated decisions | Art. 22 | no decision with legal or similarly significant effect is taken automatically; the agent only proposes | `tests/test_site.py::test_care_gap_decision_is_stored` |
| DPIA | Art. 35 (large-scale health data, new technologies) | outline in [dpia-outline.md](dpia-outline.md) | — |
| storage limitation | Art. 5(1)(e) | not addressed: no real data | gap: retention and purge jobs |

## Known residual risks

- Pseudonymisation is not perfect: 4 of 20 hand-written evasions pass the recognizers. The
  security benchmark (`reports/security.md`) measured which unusual formats would reach the
  processor when the same value also appears in the note in a usual format; after the fixes
  the outbound guard stops all of them except a surname written alone (3 of 51 notes). A
  value written only in an unusual format (a lowercase name, an identity-card number) is not
  in the vault and passes; formats nobody has measured yet may also pass.
- Free text can identify a person indirectly (rare disease, exact dates, small towns):
  placeholders do not remove quasi-identifiers.
