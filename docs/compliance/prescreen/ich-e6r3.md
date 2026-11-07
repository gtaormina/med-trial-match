# ICH E6(R3): what Good Clinical Practice asks of a computerised system

> **Not legal advice.** ICH E6(R3), EMA Step 5 (EMA/CHMP/ICH/162879/2026, 14 July 2026):
> principles and Annex 1 effective in the EU from 23 July 2025, Annex 2 from 15 January 2027.
> The prototype in this repository is not a medical device: it runs on synthetic data and
> is not placed on the market.

## What the guideline says, and what this repository has

| section | what it says | evidence here |
|---|---|---|
| Principle 9.3 | computerised systems "should be fit for purpose (e.g., through risk-based validation, if appropriate)" | measured fitness: `reports/prescreen.md`, regression gate `regression/prescreen-thresholds.json` (`tests/test_prescreen_eval.py::test_check_fails_below_thresholds`) |
| 1.5, 2.7.1(a) | a qualified physician is responsible for "trial-related medical care and decisions" | the investigator decides; the tool ranks: [intended-purpose.md](intended-purpose.md) |
| 4.2.2 | audit trails and logs, (b) not disabled, (d) unambiguous timestamps (e.g. UTC) | hash-chained audit with Unix timestamps: `src/cn2f/trust/audit.py`, `tests/test_trust.py::test_audit_detects_tampering`; a decision the log cannot record is not saved: `tests/test_site_prescreen.py::test_prescreen_decision_is_rolled_back_when_the_audit_fails` |
| 4.3.4(a), (g) | validation "based on a risk assessment that considers the intended use", systems "validated as fit for purpose… including those developed by other parties" | the model is another party: every claim is checked in code (`src/cn2f/prescreen/verify.py`), its errors are measured per track (`reports/prescreen.md`) |
| 3.16.1(x)(i), (vii) | a record of the important computerised systems; EHRs used in trials | `README.md` (architecture), `MODEL_CARD.md` §9 |
| Appendix B.5.3 | protocol content: "Mechanism for pre-screening, where appropriate, and screening of participants" | the site would describe this tool there |
| Appendix C(z) | essential records: "Documents the recruitment, pre-trial screening and consenting process" | the audited decisions and the per-pair trace (`tests/test_site_prescreen.py::test_prescreen_decision_is_stored_and_audited`) |
| Annex 2, 3.4 | real-world data "fit for purpose", used in line with "consent and permission" | [gdpr-italy.md](gdpr-italy.md) |

## Interpretation

E6(R3) names pre-screening explicitly (protocol content and essential records). A site using
this tool would describe it in the protocol, keep the audit trail as an essential record, and
validate it against its intended use; the repository already produces the measurements and the
trail such a validation would start from. A real validation needs the site's own data.

## Sources

- ICH E6(R3), EMA Step 5: <https://www.ema.europa.eu/en/documents/scientific-guideline/ich-e6r3-guideline-good-clinical-practice-step-5_en.pdf>
- EMA page with the effective dates: <https://www.ema.europa.eu/en/ich-e6-good-clinical-practice-scientific-guideline>
