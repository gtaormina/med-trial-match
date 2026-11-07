# DPIA outline (Art. 35 GDPR)

A template filled with what the prototype already does; a real product completes it with its
controller, purposes, legal basis and consultation of the DPO.

1. **Processing**: structuring free-text clinical notes into FHIR resources with an LLM;
   human review of uncertain data; an agent proposing follow-up gaps to clinicians.
2. **Data**: notes (health data, identifiers inside the text), extracted clinical data,
   reviewer decisions, LLM logs (tokens, cost, no text), agent traces (pseudonymous).
3. **Necessity and proportionality**: only pseudonymised text leaves the controller; the
   agent reads only coded data; humans keep the decision.
4. **Risks to people** and **measures**:

| risk | measure in place | evidence | residual |
|---|---|---|---|
| identifiers reach the LLM provider | pseudonymisation + outbound guard | `reports/pseudonymisation.md`, `reports/security.md` | evasion formats; quasi-identifiers |
| wrong clinical datum written to the record | confidence gate, human review, audit sampling | `reports/eval-*.md`, `reports/learning.md` | residual error 5–8% on auto-written data in tests |
| injected instructions change the record | injection detector routes the note to review; hardened prompts; verifier | `reports/security.md` | novel phrasings |
| agent proposes unfounded actions | code verifier; physician approval | `reports/care-gaps.md` | verifier rejects, does not correct |
| re-identification from the vault | local SQLite, mode 600, never sent, never in demo data | `tests/test_pseudo.py` | host compromise |
| automation bias of reviewers | uncertainty shown; error rates published | `/affidabilita` | needs training and monitoring |

5. **Consultation**: DPO, clinical safety officer, information security; prior consultation
   (Art. 36) if residual risk stays high.
