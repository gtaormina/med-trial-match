# The Clinical Trials Regulation and the European Health Data Space

> **Not legal advice.** Texts read on 2026-10-27.
> The prototype in this repository is not a medical device: it runs on synthetic data and
> is not placed on the market.

## Clinical Trials Regulation (EU) 536/2014 (consolidated 05.12.2022)

- **Art. 2(2)(25)**: "'Start of a clinical trial' means the first act of recruitment of a
  potential subject". **Annex I, K.59**: the application describes "the procedures for
  inclusion of subjects" and gives "a clear indication of what the first act of recruitment
  is". **Art. 29(1)**: consent is "written, dated and signed".
- The Regulation does **not** address reviewing records before consent; the Commission's CTR
  Q&A (version 7.2, 27 March 2026) does not mention pre-screening.
- The **MedEthicsEU/CTAG recruitment and informed consent procedure template** (version 2.0,
  January 2026) — whose content is mandatory for all trials — asks to "specify how potential
  participants will be identified and if it involves access to identifiable information
  (e.g.… existing patient lists and medical records…)" (item 1.1), whether "there is an
  external service provider for pre-screening of potential participants" (1.5), and lists AI
  tools among communication formats (1.3).

**Interpretation:** using this tool is part of the recruitment procedure: it is declared in
Part II of the application and reviewed by the ethics committee; the record review it does
before consent needs its own legal basis ([gdpr-italy.md](gdpr-italy.md)).

## European Health Data Space, Regulation (EU) 2025/327

- Published on 5.3.2025, **in force on 25 March 2025**, applying from 26 March 2027 and, for
  secondary use (Chapter IV), from 26 March 2029.
  The entry-into-force date is EUR-Lex's; the Commission's EHDS page gives 26 March 2025.
- **First implementing regulations**, in force on 11–12 October 2026 (dates from the
  Publications Office metadata behind EUR-Lex): **2026/2083** on MyHealth@EU and **2026/2099**
  on cross-border identification and authentication, applying from 26 March 2027; **2026/2098**
  on the minimum metadata a health data holder gives to describe a dataset for secondary use
  (Art. 77(4) EHDS), applying from 26 March 2029.
- **Art. 53(1)(e)** permits secondary use for "scientific research related to health or care
  sectors… including: (i) development and innovation activities for products or services;
  (ii) training, testing and evaluation of algorithms, including in… AI systems".
  **Art. 61(3)**: users "shall not re-identify or attempt to re-identify". **Art. 54(a)**
  prohibits "taking decisions detrimental to a natural person". Trial recruitment is not a
  listed purpose.

**Interpretation:** the EHDS could provide data to build and evaluate such a tool, not to find
and contact patients. A dataset card such as `datasets/trec-ct-2022-it/README.md` is the kind
of description 2026/2098 standardises; it does not apply here, since the data are public NIST
cases and not held by a health data holder.

## Sources

- CTR 536/2014, consolidated 05.12.2022: <https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02014R0536-20221205>
- CTAG recruitment and informed consent procedure template v2.0: <https://health.ec.europa.eu/document/download/dbe5bb25-dd62-4286-95b9-bd8d3ec8678d_en?filename=informedconsent_patientrecruitmentprocedure_en.pdf>
- CTR Q&A v7.2: <https://health.ec.europa.eu/document/download/bd165522-8acf-433a-9ab1-d7dceae58112_en>
- EHDS, Regulation (EU) 2025/327: <https://eur-lex.europa.eu/eli/reg/2025/327/oj>
- EHDS implementing regulations: <https://eur-lex.europa.eu/eli/reg_impl/2026/2083/oj>, <https://eur-lex.europa.eu/eli/reg_impl/2026/2098/oj>, <https://eur-lex.europa.eu/eli/reg_impl/2026/2099/oj>
- EHDS dates: entry into force 2025-03-25 in the Publications Office metadata behind EUR-Lex (CELEX 32025R0327, checked 2026-10-29); the Commission's page: <https://health.ec.europa.eu/ehealth-digital-health-and-care/european-health-data-space-regulation-ehds_en>
