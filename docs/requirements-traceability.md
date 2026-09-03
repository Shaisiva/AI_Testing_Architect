# Requirements → Test Traceability

Maps the hiring brief and InvenTree Parts documentation to manual cases and the risk-based automation subset.

| Requirement (brief / docs) | Manual UI | Manual API | Automated |
|---|---|---|---|
| Part creation — manual entry | UI-007–UI-012, UI-075, UI-108, UI-112 | API-007 | UI create + API POST |
| Part creation — import flows | UI-013–UI-016 | — | Manual only (wizard + plugin) |
| Part detail — Stock tab | UI-020–UI-023 | API-065 | UI stock create + API stock |
| Part detail — BOM / Allocated / Builds | UI-024–UI-029 | API-079–080 | UI asserts BOM hidden for non-assembly |
| Part detail — Parameters | UI-031–UI-033 | API-061–064 | UI add parameter + API parameter |
| Part detail — Variants | UI-034–UI-036, UI-104–105 | API-025 | UI asserts tab hidden unless template |
| Part detail — Revisions | UI-083–UI-090 | API-069–071 | API circular / template revision |
| Part detail — Attachments / Related / Tests | UI-038–UI-044 | API-075–077 | Manual only |
| Categories — hierarchy | UI-067–UI-068 | API-058–059 | UI category + API parent/child |
| Categories — filtering | UI-069 | API-028 | Manual / API cascade |
| Categories — parametric tables | UI-070–UI-073, UI-109–110 | API-033 | Manual only |
| Attributes — Virtual / Template / Assembly / Component | UI-053–UI-056, UI-117 | API-019–021 | UI toggles + API filters |
| Attributes — Trackable / Purchaseable / Salable | UI-057–UI-059 | API-022–024 | API filters |
| Attributes — Active / Inactive | UI-062–UI-063, UI-093–094 | API-010, API-018 | UI deactivate + API filter |
| Locked / Testable / Consumable | UI-060–UI-066 | API-032 | Manual only |
| Units of measure | UI-075–UI-078 | — | UI default units |
| Revision constraints | UI-085–UI-089 | API-069–071 | API |
| Negative — duplicate IPN | UI-091 | API-068 | UI (when uniqueness on) |
| Negative — inactive restrictions | UI-093–UI-094 | — | Manual |
| Negative — delete active part | UI-095–UI-097 | API-012–013 | UI + API |
| API CRUD Parts + Categories | — | API-007–013, API-051–058 | Yes |
| API filter / pagination / search | — | API-014–034 | Yes (core set) |
| API field validation | — | API-035–044 | Yes |
| API relational integrity | — | API-046–050 | Yes |
| API unauthorised / conflict | — | API-003–006, API-068, API-072 | Yes |
| Cross-functional flow | UI-111 | API-061–065 | UI + API @smoke |

## Why some cases stay manual

Import wizard, supplier plugins, every detail-tab grid action, parametric multi-filter, and locking-setting variants are high-maintenance against a public demo that resets daily. They remain specified for a reviewer or a local Docker run.
