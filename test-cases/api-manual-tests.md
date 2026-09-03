# InvenTree Parts — API / Manual Test Cases

**AUT:** InvenTree Parts + Part Category REST API  
**Schema ingested:** https://docs.inventree.org/en/stable/api/schema/part/  
**Live demo schema version observed:** API 540 (`/api/parameter/`, `/api/parameter/template/`)  
**Auth:** `GET /api/user/me/token/` (Basic) then `Authorization: Token <token>`

| ID | Title | Area | Type | Priority | Preconditions | Request | Expected | Automated? |
|---|---|---|---|---|---|---|---|---|
| API-001 | Obtain token with valid basic auth | Auth | P | High | Valid user | GET `/api/user/me/token/` + Basic | 200 `{token}` | Yes |
| API-002 | Token rejected for wrong password | Auth | N | High | Valid user | GET token + bad password | 401 | Yes |
| API-003 | List parts without auth | Auth | N | High | None | GET `/api/part/` no header | 401/403 | Yes |
| API-004 | List parts with invalid token | Auth | N | High | None | `Authorization: Token bogus` | 401/403 | Yes |
| API-005 | Reader cannot create part | Authz | N | High | reader user | POST `/api/part/` | 403 | Yes |
| API-006 | noaccess cannot list parts | Authz | N | High | noaccess user | GET `/api/part/` | 403 | Yes |
| API-007 | Create part (name + description) | CRUD | P | High | Token | POST `/api/part/` | 201 schema-valid body, pk assigned | Yes |
| API-008 | Get part by id | CRUD | P | High | Part exists | GET `/api/part/{id}/` | 200, same pk/name | Yes |
| API-009 | Get unknown part | CRUD | N | Medium | None | GET `/api/part/99999999/` | 404 | No |
| API-010 | Patch description and active | CRUD | P | High | Part exists | PATCH `{description, active:false}` | 200, fields updated | Yes |
| API-011 | Put full replacement | CRUD | P | Low | Part exists | PUT complete body | 200 or documented 405 | No |
| API-012 | Delete active part blocked | CRUD | N | High | Active part | DELETE `/api/part/{id}/` | 400 `still active` | Yes |
| API-013 | Delete after deactivate | CRUD | P | High | Part deactivated | DELETE | 200/204 then GET 404 | Yes |
| API-014 | List parts paginated | List | P | High | Parts exist | GET `limit=5&offset=0` | `{count,next,previous,results}` length ≤5 | Yes |
| API-015 | Page 2 does not overlap page 1 | List | P | High | count > 3 | limit=3 offset=0 then offset=3 | Distinct pks; next set | Yes |
| API-016 | Search by unique name | List | P | High | Unique part | `search=<name>` | Results include that pk | Yes |
| API-017 | Search unknown string | List | N | Medium | None | `search=ZZZ-NOPE` | count 0 or empty results | No |
| API-018 | Filter active=false | List | P | High | Inactive part | `active=false&search=...` | Only inactive rows | Yes |
| API-019 | Filter assembly=true | List | P | High | Assembly part | `assembly=true&search=...` | All rows assembly=true | Yes |
| API-020 | Filter component=true | List | P | Medium | Component part | `component=true` | Matching only | Yes |
| API-021 | Filter virtual=true | List | P | Medium | Virtual part | `virtual=true` | Matching only | Yes |
| API-022 | Filter purchaseable=true | List | P | Medium | Flagged part | `purchaseable=true` | Matching only | Yes |
| API-023 | Filter salable=true | List | P | Medium | Flagged part | `salable=true` | Matching only | Yes |
| API-024 | Filter trackable=true | List | P | Medium | Flagged part | `trackable=true` | Matching only | Yes |
| API-025 | Filter is_template=true | List | P | Medium | Template part | `is_template=true` | Matching only | No |
| API-026 | Filter IPN exact | List | P | High | Unique IPN | `IPN=<value>` | Array or page containing the part | Yes |
| API-027 | Filter IPN regex | List | P | Low | Known prefix | `IPN_regex=QA-ARCH` | Matching IPNs | No |
| API-028 | Filter category without cascade | List | P | Medium | Parent + child parts | `category=parent&cascade=false` | Child parts excluded | No |
| API-029 | Filter category with cascade | List | P | High | Child part under parent | `category=parent&cascade=true` | Child part included | Yes |
| API-030 | Filter has_ipn=true | List | P | Low | Part with IPN | `has_ipn=true` | Rows have IPN | No |
| API-031 | Filter has_stock=true | List | P | Low | In-stock part | `has_stock=true` | Rows with stock | No |
| API-032 | Filter locked=true | List | P | Low | Locked part | `locked=true` | Locked only | No |
| API-033 | Include parameters on list | List | P | Medium | Part has params | `parameters=true` | `parameters` array present | No |
| API-034 | Ordering by name | List | P | Low | Several parts | `ordering=name` | Sorted by name | No |
| API-035 | Create without name | Validation | N | High | Token | POST `{}` or `{description}` | 400 mentioning name | Yes |
| API-036 | Create empty name | Validation | N | High | Token | `name:""` | 400 | Yes |
| API-037 | Name longer than 100 | Validation | B | High | Token | name 101 chars | 400 | Yes |
| API-038 | IPN longer than 100 | Validation | B | Medium | Token | IPN 101 chars | 400 | No |
| API-039 | Description / notes max | Validation | B | Low | Token | notes > 50000 | 400 | No |
| API-040 | Read-only in_stock ignored | Validation | N | High | Token | POST `in_stock:9999` | Created; in_stock not 9999 | Yes |
| API-041 | Read-only creation_date ignored | Validation | N | High | Token | POST `creation_date=1999-01-01` | Server date used | Yes |
| API-042 | Read-only allocated_* ignored | Validation | N | Medium | Token | POST allocations | Not persisted as input | No |
| API-043 | Invalid JSON body | Validation | N | High | Token | POST raw `{not-json` | 400/415 | Yes |
| API-044 | Wrong content-type | Validation | N | Low | Token | POST form to JSON endpoint | 400/415 | No |
| API-045 | Null vs omitted category | Validation | B | Medium | Token | `category:null` | 201, uncategorised | No |
| API-046 | Assign valid category | Relational | P | High | Category exists | POST `category=<pk>` | category stored | Yes |
| API-047 | Assign missing category | Relational | N | High | None | PATCH `category=99999999` | 400 | Yes |
| API-048 | Assign valid default_location | Relational | P | High | Location exists | POST `default_location=<pk>` | Stored | Yes |
| API-049 | Assign missing default_location | Relational | N | Medium | None | `default_location=99999999` | 400 | No |
| API-050 | Supplier linkage requires purchaseable | Relational | N | Medium | Non-purchaseable | POST supplier part for it | 400 or supplier API error | No |
| API-051 | Create category | Cat CRUD | P | High | Token | POST `/api/part/category/` | 201 | Yes |
| API-052 | Get category | Cat CRUD | P | High | Category exists | GET `/api/part/category/{id}/` | 200 | Yes |
| API-053 | Patch category description | Cat CRUD | P | High | Category exists | PATCH description | 200 | Yes |
| API-054 | Delete empty category | Cat CRUD | P | Medium | Empty category | DELETE | 200/204 or documented 400 | Yes |
| API-055 | Delete category with children | Cat CRUD | N | Medium | Has child | DELETE | 400 | No |
| API-056 | Category list paginated | Cat CRUD | P | High | Categories exist | GET limit=5 | Paginated schema | Yes |
| API-057 | Category without name | Cat CRUD | N | High | Token | POST description only | 400 | Yes |
| API-058 | Child category parent link | Cat CRUD | P | High | Parent exists | POST parent=pk | child.parent = pk | Yes |
| API-059 | Category tree endpoint | Cat CRUD | P | Low | Hierarchy | GET `/api/part/category/tree/` | Tree payload | No |
| API-060 | Circular parent rejected | Cat CRUD | N | Medium | Category A | PATCH A.parent = A | 400 | No |
| API-061 | Create parameter template | Parameters | P | High | Token | POST `/api/parameter/template/` | 201 | Yes |
| API-062 | Attach parameter to part | Parameters | P | High | Template + part | POST `/api/parameter/` `{model_type:part.part,model_id,template,data}` | 201 | Yes |
| API-063 | Parameter missing model_id | Parameters | N | High | Template | POST without model_id | 400 | Yes |
| API-064 | Parameter data empty | Parameters | N | Medium | Template | `data:""` | 400 minLength | No |
| API-065 | Create stock for part | Stock | P | High | Part + location | POST `/api/stock/` qty=25 | 201; part.in_stock ≥ 25 | Yes |
| API-066 | Stock without part | Stock | N | High | Token | POST qty only | 400 | No |
| API-067 | Stock negative quantity | Stock | N | High | Part exists | qty=-1 | 400 | No |
| API-068 | Duplicate IPN when uniqueness on | Conflict | N | High | Setting on | POST same IPN twice | 400 | Partial (UI) |
| API-069 | Circular revision_of | Revisions | N | High | Part A | PATCH revision_of=A | 400 or field cleared | Yes |
| API-070 | Revision of template part | Revisions | N | High | Template T | POST revision_of=T | 400 or 201 per server rule | Yes |
| API-071 | Unique revision codes | Revisions | N | Medium | Rev A exists | Second rev code A | 400 | No |
| API-072 | Conflict stale update (ETag if any) | Conflict | N | Low | Two clients | Concurrent PATCH | 409 or last-write | No |
| API-073 | GET part with category_detail | Detail | P | Medium | Categorised part | `category_detail=true` | category_detail object | Yes |
| API-074 | GET part with parameters=true | Detail | P | Medium | Has params | `parameters=true` | parameters array | No |
| API-075 | Related parts list | Related | P | Low | Relation exists | GET `/api/part/related/` | 200 | No |
| API-076 | Create related pair | Related | P | Low | Two parts | POST part_1, part_2 | 201 | No |
| API-077 | Test template CRUD | Tests | P | Low | Testable part | POST `/api/part/test-template/` | 201 | No |
| API-078 | Pricing endpoint | Pricing | P | Low | Part exists | GET `/api/part/{id}/pricing/` | 200 | No |
| API-079 | BOM copy | BOM | P | Low | Two assemblies | POST `/api/part/{id}/bom-copy/` | 200/201 | No |
| API-080 | Requirements endpoint | BOM | P | Low | Assembly | GET `/api/part/{id}/requirements/` | 200 | No |

**Automation subset:** API-001–008, 010, 012–016, 018–024, 026, 029, 035–037, 040–041, 043, 046–048, 051–054, 056–058, 061–063, 065, 069–070, 073.
