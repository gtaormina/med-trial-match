# What it would take to adhere to the HL7 Italia profiles

Optional extension, not implemented. Checked on 2026-10-27 against the HL7 Italia
repositories on GitHub (`github.com/hl7-it`) and public descriptions of the Italian FHIR
programme.

## Where the Italian profiles are

HL7 Italia works on three levels:

1. **Base / core IG** — `hl7.fhir.it.core` (canonical `http://hl7.it/fhir/itcore`,
   version 0.2.0, status *draft*, FHIR 4.0.1). Profiles: `PatientItCore`, `AddressItCore`,
   `PractitionerItCore`, `PractitionerRoleItCore`, `OrganizationItCore`,
   `MedicationItCore`, `ProcedureItCore`, `CoverageItCore`, plus Italian extensions
   (birthplace coded with ISTAT, citizenship, profession, education, exemptions).
2. **Domain IGs** — e.g. `hl7.fhir.it.lab-report` (canonical `http://hl7.it/fhir/lab-report`,
   version 0.2.0, *active*), which depends on `hl7.fhir.eu.base` 2.0.0,
   `hl7.fhir.eu.laboratory` 2.0.0, `hl7.fhir.eu.extensions.r4` 1.3.0 and
   `hl7.fhir.it.core` 0.2.0.
3. **Programme IGs** — FSE 2.0 documents (patient summary, lab report, discharge letter,
   ED report, outpatient report, prescriptions…). Several of these exist today as Italian
   **CDA R2** profiles; FHIR versions are in progress.

## Gaps between this project and the Italian profiles

| area | this project today | Italian profile expectation | work needed |
|---|---|---|---|
| Patient | pseudonymous `Patient` with only an opaque id | `PatientItCore`: `identifier[codiceFiscale]` with system `http://hl7.it/fhir/itcore/CodeSystem/cs-codicefiscale`, ISTAT-coded birthplace, Italian address | keep the store pseudonymous; re-identify only at export, inside the trust boundary, from the vault |
| Medications | RxNorm (US) | `MedicationItCore`: `code.coding` slices for **AIC** (AIFA marketing authorisation) and **ATC** | map RxNorm → active ingredient → ATC, then AIC from the AIFA open data list; review ambiguities |
| Lab results | LOINC + UCUM | LOINC + UCUM (same); report as `DiagnosticReport` + `Composition` in a document `Bundle` | group observations per report, add specimen, author, validator, legal authenticator |
| Diagnoses | SNOMED CT | Italian hospital documents commonly use **ICD-9-CM** (Italian 2007 edition) for discharge diagnoses | map SNOMED → ICD-9-CM, or extract ICD-9-CM directly with a closed Italian vocabulary; needs ground truth not available from Synthea |
| Documents | individual resources | document `Bundle` with `Composition` per document type (lab report, discharge letter) | build documents from the routed resources and the note metadata |
| Validation | HAPI `$validate` against base FHIR R4 | validation against the IG packages | load `hl7.fhir.it.core` and the domain IG in HAPI (`hapi.fhir.implementationguides`) and validate with `profile=` |

## Suggested order

1. Load `hl7.fhir.it.core` 0.2.0 and `hl7.fhir.it.lab-report` 0.2.0 into HAPI and validate
   the current output against them, to get a list of concrete errors.
2. Start from **lab reports**: LOINC and UCUM already match, so the gap is mostly document
   structure (`Bundle`/`Composition`/`DiagnosticReport`).
3. Medications next (AIC/ATC mapping), diagnoses last (terminology and ground truth).

Because the core IG is still a draft, profiles may change; pin package versions and keep the
validation report in the regression suite.
