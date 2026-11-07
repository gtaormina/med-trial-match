# Third-party components

Licences checked on 2026-10-27 from package metadata (`importlib.metadata`), upstream
repositories or the shipped licence files. The project's own code is MIT.

## Runtime (Python, pinned in `uv.lock`)

| component | version | licence |
|---|---|---|
| FastAPI | 0.162.0 | MIT |
| pydantic / pydantic-settings | 2.14.1 / 2.16.1 | MIT |
| uvicorn | 0.54.0 | BSD-3-Clause |
| httpx | 0.28.1 | BSD-3-Clause |
| Jinja2 | 3.1.6 | BSD-3-Clause |
| python-multipart | 0.0.32 | Apache-2.0 |
| Faker | 40.43.0 | MIT |
| MCP Python SDK (`mcp`) | 2.3.0 | MIT |
| Microsoft Presidio analyzer | 2.2.365 | MIT |
| spaCy | 3.8.16 | MIT |
| **spaCy `it_core_news_lg` / `it_core_news_md`** | 3.8.0 | **CC BY-NC-SA 3.0 (non-commercial)** — trained on UD Italian ISDT, WikiNER and fastText vectors |

## Services and tools (containers)

| component | version | licence |
|---|---|---|
| HAPI FHIR JPA server (`hapiproject/hapi`) | v8.12.0-2 | Apache-2.0 |
| PostgreSQL (`postgres:16-alpine`) | 16 | PostgreSQL License |
| Synthea (`synthea-with-dependencies.jar`, commit bd8a52b) | master 2026-10-21 | Apache-2.0 |
| Eclipse Temurin JRE | 21 | GPLv2 with Classpath Exception |
| Tailscale (optional sidecar) | stable | BSD-3-Clause |

## Web assets (self-hosted in `src/cn2f/web/static/`)

| asset | licence |
|---|---|
| Atkinson Hyperlegible (Braille Institute of America) | SIL OFL 1.1 |
| JetBrains Mono | SIL OFL 1.1 |
| htmx 2.0.11 | 0BSD |

Details and hashes: [`src/cn2f/web/static/LICENSES.md`](LICENSES-web.md).

## Data and terminologies

- **Synthea** output (synthetic patients) is generated locally; Synthea is Apache-2.0.
  Please cite: Walonoski J, Kramer M, Nichols J, et al. JAMIA 2018;25(3):230–238,
  doi:10.1093/jamia/ocx079.
- Codes from **SNOMED CT**, **LOINC** and **RxNorm** appear in the synthetic data, in
  `demo/demo.json.gz` and in the derived vocabulary. They are used here for research on
  synthetic data; production use is subject to the SNOMED International affiliate
  licence, the LOINC licence and the UMLS licence terms for RxNorm respectively.
- **HL7 AI Transparency on FHIR** (`hl7.fhir.uv.aitransparency`, CI build 1.0.0 of
  2026-10-27; <https://build.fhir.org/ig/HL7/aitransparency-ig/>) and the **HL7 Terminology**
  CodeSystem v3-ObservationValue 6.0.0 (<https://terminology.hl7.org/>): profiles, code
  systems and value set copied into `src/cn2f/fhir/conformance/`, both under CC0-1.0.

## LLMs

Notes were generated and data extracted through OpenRouter with the models named in
`reports/`; model outputs are subject to each provider's terms. No real personal data was
ever sent.
