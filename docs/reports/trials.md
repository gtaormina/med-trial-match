# Demo trials and their criteria

Data from ClinicalTrials.gov (U.S. National Library of Medicine); see `trials/README.md`
for the terms and the modifications made. `rule` is the part code can decide; criteria
without a rule stay free text for the agent and the coordinator.

Overall, criteria with at least one rule: **22 of 52 (42%)**.

## NCT07351058 — A Clinical Study to Evaluate the Effects of Enicepatide (RO7795068) in Participants With Obesity or Overweight and Type 2 Diabetes

Data as processed by ClinicalTrials.gov on 2026-10-27T09:00:04 (API data timestamp); record last updated 2026-10-13.

Conditions: Obesity or Overweight, Type 2 Diabetes Mellitus. Retrieved 2026-10-27. Criteria with rules: **4 of 14**, fully decided by code: **1**.

| id | kind | text | rules | codes | complete | reviewed |
|---|---|---|---|---|---|---|
| I1 | inclusion | Ability and willingness to self-administer the study drug (or receive an injection from a trained individual if visually impaired or with physical limitations) | — |  | no | yes |
| I2 | inclusion | Diagnosis of type 2 diabetes mellitus (T2DM) according to WHO classification or other locally applicable standards with HbA1c ≥6.5% to ≤10% determined by laboratory test at screening, and on stable oral therapy for at least 3 months prior to screening (if applicable). T2DM may be treated with diet/exercise alone or any oral anti-hyperglycemic medication (as per local labeling) EXCEPT dipeptidyl peptidase 4 (DPP-4) inhibitors or GLP-1 RA-based therapy. | condition present + lab >= 6.5 % (recent) + lab <= 10 % (recent) + … | 44054006, 4548-4 | no | yes |
| I3 | inclusion | Body mass index (BMI) ≥27.0 kg/m\^2 | lab >= 27 kg/m2 (recent) | 39156-5 | yes | yes |
| I4 | inclusion | History of ≥1 self-reported unsuccessful diet/exercise effort to lose body weight | — |  | no | yes |
| E1 | exclusion | History of type 1 diabetes mellitus (T1DM) or any lifetime history of ketoacidosis or history of hyperosmolar state/coma within 12 months prior to screening | — |  | no | yes |
| E2 | exclusion | Have had 1 or more episodes of severe hypoglycemia and/or has hypoglycemia unawareness within the 6 months prior to screening | — |  | no | yes |
| E3 | exclusion | At least 2 confirmed fasting blood glucose values >270 mg/dL (15.0 mmol/L) (on 2 non-consecutive days) during screening | — |  | no | yes |
| E4 | exclusion | Self-reported change in body weight >5 kg within 3 months prior to screening | — |  | no | yes |
| E5 | exclusion | Obesity induced by other endocrinologic disorders (e.g., Cushing's syndrome) or diagnosed monogenetic or syndromic forms of obesity (e.g., melanocortin 4 receptor deficiency or Prader-Willi syndrome) | — |  | no | yes |
| E6 | exclusion | Prior or planned surgical treatment for obesity. Liposuction or abdominoplasty if performed more than 1 year prior to screening is allowed. | — |  | no | yes |
| E7 | exclusion | Known clinically significant gastric emptying abnormality (e.g., severe gastroparesis or gastric outlet obstruction) | — |  | no | yes |
| E8 | exclusion | Poorly controlled hypertension at screening | condition present + … | 59621000 | no | yes |
| E9 | exclusion | Have any of the following cardiovascular conditions within 3 months prior to screening: Acute myocardial infarction; Cerebrovascular accident (stroke)/transient ischemic attack; Unstable angina; Hospitalization due to congestive heart failure | condition present in 90 d **or** condition present in 90 d **or** … | 22298006, 230690007, 401303003 | no | yes |
| E10 | exclusion | Treatment with any approved or investigational GLP-1-RA-based therapy (e.g., GLP-1 receptor mono agonist, GLP-1/GIP receptor dual agonist, GLP-1/GIP/Gluc receptor triple agonist) within 6 months prior to randomization | — |  | no | yes |

## NCT07624305 — A Phase III Study to Evaluate the Effect of Balcinrenone/Dapagliflozin in Patients With CKD Stage 3b and 4 (BalanceD-CKD)

Data as processed by ClinicalTrials.gov on 2026-10-27T09:00:04 (API data timestamp); record last updated 2026-09-24.

Conditions: Renal Insufficiency, Chronic. Retrieved 2026-10-27. Criteria with rules: **9 of 19**, fully decided by code: **5**.

| id | kind | text | rules | codes | complete | reviewed |
|---|---|---|---|---|---|---|
| I1 | inclusion | Age ≥ 18 years | age 18.0– |  | yes | yes |
| I2 | inclusion | Diagnosis of CKD and at least one of the following: 1. eGFR ≥ 15 to < 45 mL/min/1.73 m2 AND: UACR ≥ 30 mg/g (central laboratory) or UACR ≥ 100 mg/g (local laboratory ) or UPCR ≥ 200 mg/g (local laboratory). 2. eGFR ≥ 15 to < 30 mL/min/1.73 m2 and UACR < 30 mg/g (local or central laboratory UACR value). | condition present + lab >= 15 mL/min/1.73 m2 (recent) + lab < 45 mL/min/1.73 m2 (recent) + … **or** condition present + lab >= 15 mL/min/1.73 m2 (recent) + lab < 30 mL/min/1.73 m2 (recent) + lab < 30 mg/g (recent) | 127013003, 14959-1, 33914-3, 431855005, 431856006, 431857002, 433144002, 46177005 | no | yes |
| I3 | inclusion | Serum/plasma K+ ≤ 5.0 mmol/L | lab <= 5 mmol/L (recent) | 2823-3, 6298-4 | yes | yes |
| I4 | inclusion | Maximum tolerated dose of an ACEi or an ARB, unless contraindicated or not tolerated. The dose should be stable for at least 4 weeks before screening. | — |  | no | yes |
| E1 | exclusion | Recent (within 90 days prior to screening) or ongoing dialysis, or likely to require dialysis within 3 months following randomisation | — |  | no | yes |
| E2 | exclusion | UACR ≥ 5000 mg/g or UPCR ≥ 7000 mg/g at screening. | lab >= 5000 mg/g (recent) **or** … | 14959-1 | no | yes |
| E3 | exclusion | SBP > 180 mmHg or DBP > 110 mmHg at screening. | lab > 180 mmHg (recent) **or** lab > 110 mmHg (recent) | 8462-4, 8480-6 | yes | yes |
| E4 | exclusion | SBP < 90 mmHg at screening. | lab < 90 mmHg (recent) | 8480-6 | yes | yes |
| E5 | exclusion | HbA1c > 9% at screening | lab > 9 % (recent) | 4548-4 | yes | yes |
| E6 | exclusion | T1DM, except: For US only: patients with T1DM treated with SGLT2i for at least 4 months prior to screening, without DKA during that period, and who have experience with ketone monitoring are eligible. For Japan only: patients with T1DM treated with dapagliflozin 10 mg for at least 4 months prior to Screening, without DKA during the period of dapagliflozin treatment are eligible for inclusion. | — |  | no | yes |
| E7 | exclusion | Autosomal dominant polycystic kidney disease. | — |  | no | yes |
| E8 | exclusion | Major cardiac or valvular surgery, acute coronary syndrome (myocardial infarction or unstable angina), stroke, transient ischaemic attack within 12 weeks prior to screening. | condition present in 84 d **or** condition present in 84 d **or** … | 22298006, 230690007, 401303003 | no | yes |
| E9 | exclusion | Severe hepatic impairment (Child-Pugh Class C). | — |  | no | yes |
| E10 | exclusion | Adrenal insufficiency. | — |  | no | yes |
| E11 | exclusion | Clinically significant acute kidney injury within 12 weeks prior to the screening. | — |  | no | yes |
| E12 | exclusion | New York Heart Association functional HF class IV at screening, or hospitalisation for heart failure within 4 weeks prior to screening. | — |  | no | yes |
| E13 | exclusion | Any clinical condition requiring systemic immunosuppression therapy other than maintenance therapy (stable for at least 3 months) prior to screening. | — |  | no | yes |
| E14 | exclusion | Solid organ or bone marrow transplant or a plan for transplant within 6 months following randomisation. | condition present (history) **or** condition present (history) **or** … | 108631000119101, 161665007 | no | yes |
| E15 | exclusion | Any use of the following medications and supplements: MRAs Aldosterone analogues Aldosterone synthase inhibitors Any use of potassium binders within 2 weeks prior to screening. Use is allowed after randomisation. Strong or moderate inducers or inhibitors of CYP3A4, prohibited at least one week prior to randomisation | — |  | no | yes |

## NCT07784725 — A Study to Evaluate Effect of AZD6234 in Adult Participants With Obesity or Overweight With Weight-related Comorbidity Without Type 2 Diabetes Mellitus

Data as processed by ClinicalTrials.gov on 2026-10-27T09:00:04 (API data timestamp); record last updated 2026-08-25.

Conditions: Obesity or Overweight. Retrieved 2026-10-27. Criteria with rules: **3 of 8**, fully decided by code: **1**.

| id | kind | text | rules | codes | complete | reviewed |
|---|---|---|---|---|---|---|
| I1 | inclusion | Males & females (inclusive of all gender identities) age ≥18 years | age 18.0– |  | yes | yes |
| I2 | inclusion | BMI ≥30 kg/m2 OR BMI ≥27 kg/m2 with at least one of the following weight related comorbidities (treated or untreated): hypertension, dyslipidaemia, obstructive sleep apnoea, cardiovascular disease, heart failure, chronic kidney disease, metabolic dysfunction-associated steatotic liver disease, osteoarthritis of the knee, or stress urinary incontinence | lab >= 30 kg/m2 (recent) **or** lab >= 27 kg/m2 (recent) + … | 39156-5 | no | yes |
| I3 | inclusion | Stable body weight (≤5% body weight change) for at least 3 months prior to Randomisation | — |  | no | yes |
| I4 | inclusion | History of at least one self-reported unsuccessful attempt to lose body weight in their lifetime | — |  | no | yes |
| E1 | exclusion | Obesity primarily caused by other endocrine disorders | — |  | no | yes |
| E2 | exclusion | History of Type 1 or Type 2 Diabetes Mellitus, HbA1c ≥6.5% (48 mmol/mol), and/or treatment with glucose-lowering agent(s) within 3 months prior to Screening | condition present (history) **or** lab >= 6.5 % (recent) **or** medication present in 90 d **or** … | 106892, 44054006, 4548-4, 860975 | no | yes |
| E3 | exclusion | Significant hepatobiliary disease and/or any of the following results at Screening: ALT ≥ 3.0 × ULN AST ≥ 3.0 × ULN TBL > 1.5 × ULN (except for cases of known Gilbert's Syndrome) | — |  | no | yes |
| E4 | exclusion | Has received treatment with a GLP-1 receptor agonist or GLP-1 containing medication for any indication within 3 months before Randomisation. | — |  | no | yes |

## NCT07817290 — Development of Smart Food /Nutraceutical Solutions Dedicated to Cardiometabolic Disorders in Ageing

Data as processed by ClinicalTrials.gov on 2026-10-27T09:00:04 (API data timestamp); record last updated 2026-09-14.

Conditions: Prediabetes. Retrieved 2026-10-27. Criteria with rules: **6 of 11**, fully decided by code: **1**.

| id | kind | text | rules | codes | complete | reviewed |
|---|---|---|---|---|---|---|
| I1 | inclusion | Patients of either gender, over 65 years of age, able to understand the protocol procedures. | age 65.0– + … |  | no | yes |
| I2 | inclusion | Known cardiovascular disease | condition present (history) **or** condition present (history) **or** … | 22298006, 230690007, 399211009, 399261000, 401303003 | no | yes |
| I3 | inclusion | Prediabetes or type 2 diabetes mellitus with HbA1c \< 7.0% on diet alone or metformin. | condition present + lab < 7 % (recent) + … | 44054006, 4548-4, 714628002 | no | yes |
| E1 | exclusion | Age under 65 | age –64.0 |  | yes | yes |
| E2 | exclusion | Previous diagnosis of type 2 diabetes mellitus already undergoing drug therapy (except metformin) | condition present (history) + … | 44054006 | no | yes |
| E3 | exclusion | Contraindications such as allergy to product components | — |  | no | yes |
| E4 | exclusion | Obesity secondary to diseases: genetic (Prader-Willi syndrome, Down syndrome); metabolic and endocrine (Cushing's syndrome, hypothyroidism) | — |  | no | yes |
| E5 | exclusion | Endocrine or liver disease or clinical evidence of chronic disease or gastrointestinal disorders or malabsorption disorders | — |  | no | yes |
| E6 | exclusion | History of adrenal adenoma or secondary arterial hypertension due to renal/adrenal causes | — |  | no | yes |
| E7 | exclusion | Arterial hypertension treated with an ACE inhibitor or ARB | condition present + … | 59621000 | no | yes |
| E8 | exclusion | Previous bariatric surgery | — |  | no | yes |

