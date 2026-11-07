# med-trial-match

A study project: a first reading of Italian clinical notes to pre-screen patients for
clinical trials. Pseudonymisation before any LLM call, one trust gateway for every model
call, answers checked against the record in code, System One models as a second opinion,
HL7 AI Transparency on FHIR, and a person who always decides.

**Live demo:** https://gtaormina.github.io/med-trial-match/ (no sign-up, nothing collected)

## What is here

| | |
|---|---|
| [`docs/OVERVIEW.md`](docs/OVERVIEW.md) | how it works: architecture, privacy, trust layer, agent, results, limits |
| [`docs/reports/`](docs/reports/) | every measurement, with method and intervals: [pre-screening](docs/reports/prescreen.md), [panel of three System One models](docs/reports/panel.md), [Jev as a first stage](docs/reports/jev.md), [coordinator memory](docs/reports/memory.md), [security](docs/reports/security-prescreen.md), [pseudonymisation](docs/reports/pseudonymisation.md) |
| [`docs/MODEL_CARD.md`](docs/MODEL_CARD.md) | intended use, data, metrics, limits |
| [`docs/compliance/`](docs/compliance/) | EU dossier: AI Act, GDPR, MDR, ICH E6(R3), CTR and EHDS, with sources |
| the rest | the built pages of the demo |

The source code is not published here.

- **Not a medical device.** Research and study prototype; not for diagnosis, treatment or
  any decision about a person.
- **Invented patients only.** No real personal data anywhere. Trial texts come from
  ClinicalTrials.gov (public registry), with no link to their sponsors.
