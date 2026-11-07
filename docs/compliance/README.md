# Compliance dossier

> **Not legal advice.** Written by the engineer who built the system, to show how each
> obligation maps to a concrete, testable control. Any real deployment needs review by
> regulatory, data-protection and clinical-safety professionals. Sources were checked on
> 2026-10-27 (list at the end of each document).

The project is a research prototype on synthetic data and is **not placed on the market**.
These documents answer a different question: *if a company turned this pipeline into a
product, which rules would apply, and what in this repository already counts as evidence?*

| document | content |
|---|---|
| [ai-act-mdr.md](ai-act-mdr.md) | qualification under the MDR, classification under the AI Act (as amended by the Digital Omnibus), obligation-by-obligation mapping |
| [gdpr.md](gdpr.md) | lawful basis for health data, pseudonymisation, processors and transfers, rights |
| [dpia-outline.md](dpia-outline.md) | Data Protection Impact Assessment outline with the measures already implemented |
| [risk-register.md](risk-register.md) | hazards, controls, evidence (test or report), residual risk |

**Pre-screening for clinical trials (M18).** Each document quotes the official text (with URL
and version), then gives the interpretation, labelled as such.

| document | content |
|---|---|
| [prescreen/intended-purpose.md](prescreen/intended-purpose.md) | what a product would be for, and wording to avoid |
| [prescreen/mdr-qualification.md](prescreen/mdr-qualification.md) | MDR Art. 2(1), Rule 11, MDCG 2019-11 rev.1 steps; the open question at step 4 |
| [prescreen/ai-act.md](prescreen/ai-act.md) | Art. 6, Annex III, Art. 2(6) and recital 25, Art. 4 and 50, Omnibus dates |
| [prescreen/gdpr-italy.md](prescreen/gdpr-italy.md) | GDPR Art. 9(2)(j) and 89; Codice privacy Art. 110 and 110-bis; Garante 298/2024; L. 132/2025 |
| [prescreen/ich-e6r3.md](prescreen/ich-e6r3.md) | Good Clinical Practice on computerised systems and pre-screening, mapped to evidence |
| [prescreen/ctr-and-ehds.md](prescreen/ctr-and-ehds.md) | Clinical Trials Regulation and recruitment; what the EHDS allows |

The principle throughout: **a control counts only if a test or a report proves it.**
