# InvenTree Parts — UI / Manual Test Cases

**AUT:** InvenTree Parts module  
**Sources ingested:**

- https://docs.inventree.org/en/stable/part/
- https://docs.inventree.org/en/stable/part/views/
- https://docs.inventree.org/en/stable/part/create/
- https://docs.inventree.org/en/stable/part/template/
- https://docs.inventree.org/en/stable/part/revision/
- https://docs.inventree.org/en/stable/concepts/parameters/

**Legend:** P = Positive, N = Negative, B = Boundary. Automated? refers to the Playwright UI suite in `automation/tests/ui`.

| ID | Title | Area | Type | Priority | Preconditions | Steps | Expected | Source | Automated? |
|---|---|---|---|---|---|---|---|---|---|
| UI-001 | Login with valid credentials | Auth | P | High | Demo/local user exists | Open app → enter valid username/password → Login | User lands on the web dashboard | PUI login | Yes |
| UI-002 | Login rejected with wrong password | Auth | N | High | User exists | Enter valid user + wrong password → Login | Error shown; user stays on login | PUI login | Yes |
| UI-003 | Navigate to Parts list | Navigation | P | High | Logged in | Open Parts from navigation | Parts table is visible with rows or empty state | Part views | Yes |
| UI-004 | Parts table shows name, category, stock | Part list | P | High | At least one part exists | Open Parts list | Columns include name/description, category, stock | Part category list | Yes |
| UI-005 | Search parts by name | Part list | P | High | Unique part exists | Type unique name in search | Only matching part(s) remain | Part filters | Yes |
| UI-006 | Search with no matches | Part list | N | Medium | Logged in | Search `ZZZ-NO-SUCH-PART` | Empty / no-results state | Part filters | No |
| UI-007 | Open Create Part form | Create | P | High | Create permission | Parts → Add Parts → Create Part | Create Part form opens | Creating a Part | Yes |
| UI-008 | Create part with required fields only | Create | P | High | Create permission | Fill Name + Description → Submit | Redirect to new part detail; name shown | Creating a Part | Yes |
| UI-009 | Create part blocked when Name is empty | Create | N | High | Form open | Leave Name blank → Submit | Validation error on Name; no part created | Creating a Part | Yes |
| UI-010 | Create part with IPN, keywords, units | Create | P | High | Form open | Fill Name, Description, IPN, keywords, units=pcs → Submit | Detail shows those fields | Part details | Yes |
| UI-011 | Create part with initial stock when setting enabled | Create | P | Medium | Create Initial Stock enabled | Check Create Initial Stock, qty=10, pick location → Submit | Stock tab shows quantity 10 | Creating a Part | No |
| UI-012 | Create purchaseable part with supplier options | Create | P | Medium | Form open | Mark Purchaseable, add supplier data if shown → Submit | Suppliers tab visible on detail | Creating a Part | No |
| UI-013 | Import parts from file — wizard opens | Import | P | Medium | Create permission | Add Parts → Import from File | Import wizard opens | Import from File | No |
| UI-014 | Import parts — cancel wizard | Import | N | Medium | Wizard open | Cancel/close wizard | No parts created; user returns to list | Import from File | No |
| UI-015 | Import parts — invalid file rejected | Import | N | High | Wizard open | Upload a `.txt` / malformed CSV | Error; import does not complete | Import from File | No |
| UI-016 | Import from supplier hidden without plugin | Import | B | Medium | No supplier plugin | Open Add Parts | Import from Supplier is hidden or disabled with explanation | Import from Supplier | No |
| UI-017 | Part detail shows header fields | Detail | P | High | Part exists | Open part | Name, IPN, description, category breadcrumb visible | Part details | Yes |
| UI-018 | Toggle Show Part Details | Detail | P | Medium | On detail | Click Show Part Details | Extra parameter panel expands/collapses | Part details | No |
| UI-019 | Category breadcrumb navigates to parent | Detail | P | Medium | Part has category | Click category in breadcrumb | Category view opens | Part views | No |
| UI-020 | Stock tab lists stock items | Tabs | P | High | Part has stock | Open Stock tab | Table shows locations and quantities | Stock tab | Yes |
| UI-021 | Stock tab — New Stock Item dialog | Tabs | P | High | Create stock permission | Stock → New Stock Item | Dialog opens | Stock tab | Yes |
| UI-022 | Create stock item from part | Tabs | P | High | Dialog open, location exists | Qty=5, location, Submit | Stock table includes the new row | Stock tab | Yes |
| UI-023 | Stock export launches export dialog | Tabs | P | Low | Stock exists | Stock → Export | Export options dialog / file download | Stock tab | No |
| UI-024 | Allocated tab visible for component | Tabs | P | Medium | Part is Component | Open part | Allocated tab is present | Allocations | No |
| UI-025 | Allocated tab hidden for non-component non-salable | Tabs | B | Medium | Part is neither component nor salable | Open part | Allocated tab not shown | Allocations | No |
| UI-026 | BOM tab visible only for Assembly | Tabs | P | High | Assembly part exists | Open assembly | BOM tab visible | BOM | No |
| UI-027 | BOM tab hidden for non-assembly | Tabs | B | High | Non-assembly part | Open part | BOM tab not shown | BOM | Yes |
| UI-028 | Add BOM line to assembly | Tabs | P | Medium | Assembly + component exist | BOM → add component qty=2 | Row appears in BOM | BOM | No |
| UI-029 | Build Orders tab on assembly | Tabs | P | Medium | Assembly part | Open Build Orders | Tab lists builds or empty table | Build Orders | No |
| UI-030 | Used In tab for component | Tabs | P | Medium | Part used in a BOM | Open Used In | Parent assemblies listed | Used In | No |
| UI-031 | Parameters tab lists parameters | Tabs | P | High | Part may have params | Open Parameters | Table (empty or populated) | Parameters | Yes |
| UI-032 | Add parameter to part | Tabs | P | High | Parameter template exists | Parameters → New → pick template, value → Submit | Parameter row shown | Parameters | Yes |
| UI-033 | Parameter unique constraint | Tabs | N | High | Unique template on category | Assign same unique value to two parts | Second save rejected | Parameters uniqueness | No |
| UI-034 | Variants tab visible on template part | Tabs | P | High | Template part | Open part | Variants tab visible | Templates | No |
| UI-035 | Variants tab hidden on non-template | Tabs | B | High | Non-template part | Open part | Variants tab not shown | Templates | Yes |
| UI-036 | Create variant from template | Tabs | P | High | Template part | Variants → New Variant → submit | New variant part created and linked | Templates | No |
| UI-037 | Revisions tab / selector when revisions exist | Tabs | P | Medium | Part has a revision | Open original part | Revision selector or Revisions info shown | Revisions | No |
| UI-038 | Attachments tab upload | Tabs | P | Medium | Part exists | Attachments → upload PDF | Attachment listed | Attachments | No |
| UI-039 | Attachments tab reject empty file | Tabs | N | Low | Attachments open | Submit without file | Validation error | Attachments | No |
| UI-040 | Related Parts add relationship | Tabs | P | Medium | Related parts enabled | Related → add another part | Row appears | Related Parts | No |
| UI-041 | Related Parts feature hidden when setting off | Tabs | B | Low | Setting disabled | Open part | Related tab hidden | Related Parts | No |
| UI-042 | Test Templates tab for testable part | Tabs | P | Medium | Testable part | Open Test Templates | Tab visible; can add template | Test Templates | No |
| UI-043 | Test Templates hidden when not testable | Tabs | B | Medium | Non-testable part | Open part | Test Templates tab hidden | Test Templates | No |
| UI-044 | Test Results tab for testable part | Tabs | P | Low | Testable + results exist | Open Test Results | Aggregated results table | Test Results | No |
| UI-045 | Notes tab saves markdown | Tabs | P | Low | Part exists | Notes → enter markdown → save | Notes persist after refresh | Notes | No |
| UI-046 | Suppliers tab only if purchaseable | Tabs | P | Medium | Purchaseable part | Open part | Suppliers tab visible | Suppliers | No |
| UI-047 | Purchase Orders tab if purchaseable | Tabs | P | Low | Purchaseable part | Open PO tab | PO table or empty | Purchase Orders | No |
| UI-048 | Sales Orders tab if salable | Tabs | P | Low | Salable part | Open SO tab | SO table or empty | Sales Orders | No |
| UI-049 | Return Orders tab if salable + feature on | Tabs | B | Low | Salable + RO enabled | Open part | Return Orders tab visible | Return Orders | No |
| UI-050 | Transfer Orders hidden for virtual part | Tabs | B | Medium | Virtual part | Open part | Transfer Orders tab hidden | Transfer Orders | No |
| UI-051 | Pricing tab aggregates sources | Tabs | P | Low | Part exists | Open Pricing | Pricing panel renders | Part Pricing | No |
| UI-052 | Stock History tab | Tabs | P | Low | Part exists | Open Stock History | History view or empty | Stock History | No |
| UI-053 | Set part Virtual | Attributes | P | High | Edit permission | Edit part → Virtual on → save | Virtual flag persisted; physical stock behaviour restricted | Attributes | Yes |
| UI-054 | Set part Template | Attributes | P | High | Edit permission | Toggle Template on | Variants tab appears | Templates | Yes |
| UI-055 | Set part Assembly | Attributes | P | High | Edit permission | Toggle Assembly on | BOM tab appears | Attributes | Yes |
| UI-056 | Set part Component | Attributes | P | High | Edit permission | Toggle Component on | Used In / Allocated become available | Attributes | No |
| UI-057 | Set part Trackable | Attributes | P | High | Edit permission | Toggle Trackable on | Serial/batch fields become relevant on stock | Trackable | No |
| UI-058 | Set part Purchaseable | Attributes | P | High | Edit permission | Toggle Purchaseable on | Suppliers tab appears | Attributes | No |
| UI-059 | Set part Salable | Attributes | P | High | Edit permission | Toggle Salable on | Sales-related tabs appear | Attributes | No |
| UI-060 | Set part Testable | Attributes | P | Medium | Edit permission | Toggle Testable on | Test Templates tab appears | Testable | No |
| UI-061 | Set part Consumable | Attributes | P | Medium | Edit permission | Toggle Consumable on | Consumable flag persisted | Consumable | No |
| UI-062 | Deactivate part | Attributes | P | High | Active part | Set Active off | Part remains; inactive styling; cannot be used in new orders | Active Parts | Yes |
| UI-063 | Inactive part remains searchable | Attributes | P | Medium | Inactive part | Search by name with inactive filter | Part still found | Active Parts | No |
| UI-064 | Lock part prevents edit | Attributes | P | High | Locking enabled | Lock part → try edit name / BOM / params | Edits rejected | Locked Parts | No |
| UI-065 | Unlock part restores edit | Attributes | P | Medium | Locked part | Unlock → edit description | Save succeeds | Locked Parts | No |
| UI-066 | Locking ignored when PART_ENABLE_LOCKING is off | Attributes | B | Low | Setting disabled | Lock flag on, edit anyway | Edit allowed | Locked Parts | No |
| UI-067 | Category hierarchy shows children | Categories | P | High | Parent + child exist | Open parent category | Child categories listed | Part Category | Yes |
| UI-068 | Category lists parts in sub-categories | Categories | P | High | Child has a part | Open parent category | Child part appears in list | Part Category | Yes |
| UI-069 | Category filters reduce table | Categories | P | Medium | Many parts | Apply a stock/attribute filter | Table updates | Part Category | No |
| UI-070 | Parametric view button on category | Categories | P | High | Params exist | Click Parametric View | Parameter columns appear | Parametric tables | No |
| UI-071 | Sort parametric column | Categories | P | Medium | Parametric view | Click parameter header | Rows reorder | Parametric tables | No |
| UI-072 | Filter parametric column by value | Categories | P | Medium | Parametric view | Filter parameter `=` value | Only matching parts remain | Parametric tables | No |
| UI-073 | Filter parametric with unit conversion | Categories | B | Medium | Parameter has units | Filter `10 mm` against metre template | Conversion applied | Parametric tables | No |
| UI-074 | Structural category cannot hold parts | Categories | N | Medium | Structural category | Try assign part to it | Error or assignment blocked | Category | No |
| UI-075 | Units default to blank / pcs | UoM | P | High | New part | Leave units blank | Part tracked as dimensionless pieces | Units of Measure | Yes |
| UI-076 | Set units to metres | UoM | P | High | Edit part | Units = m → save | Units shown on detail and stock | Physical Units | No |
| UI-077 | Incompatible supplier unit rejected | UoM | N | High | Part units = metres | Supplier part units = kg | Error displayed | Supplier Part Units | No |
| UI-078 | Compatible supplier unit accepted | UoM | P | Medium | Part units = metres | Supplier units = cm | Save succeeds | Supplier Part Units | No |
| UI-079 | Upload part image | Images | P | Medium | Part exists | Hover image → upload JPG | Image and thumbnail appear | Part Images | No |
| UI-080 | Select existing image | Images | P | Low | Other parts have images | Select from existing | Image associated | Part Images | No |
| UI-081 | Delete part image | Images | P | Low | Part has image | Delete image | Placeholder restored | Part Images | No |
| UI-082 | Reject unsupported image type | Images | N | Medium | Upload dialog | Upload `.exe` / `.txt` | Rejected | Part Images | No |
| UI-083 | Create revision via Duplicate Part | Revisions | P | High | Non-template part | Actions → Duplicate → set Revision Of + unique Revision → Submit | New part linked as revision | Create a Revision | No |
| UI-084 | Revision selector navigates between revisions | Revisions | P | Medium | ≥2 revisions | Use Select Part Revision | Other revision detail opens | Revision Navigation | No |
| UI-085 | Circular revision rejected | Revisions | N | High | Part A | Set A.revision_of = A | Validation error | Revision Restrictions | No |
| UI-086 | Duplicate revision code rejected | Revisions | N | High | Part A has rev `A` | Create another rev `A` of same original | Unique-code error | Revision Restrictions | No |
| UI-087 | Template part cannot have revisions | Revisions | N | High | Template part | Duplicate as revision of template | Rejected | Template Revisions | No |
| UI-088 | Variant revision must keep same template | Revisions | N | High | Variant of T | Create revision pointing at different template | Rejected | Template References | No |
| UI-089 | Revision-of-revision chain | Revisions | N | Medium | B is revision of A | Create C as revision of B (if disallowed) | Blocked or documented behaviour | revision-of-revision | No |
| UI-090 | Assembly-only revision setting | Revisions | B | Medium | Assembly Revision Only = true | Try revise a non-assembly | Blocked | Revision Settings | No |
| UI-091 | Duplicate IPN rejected when uniqueness on | Create | N | High | IPN uniqueness enabled, IPN in use | Create part with same IPN | Error; no second part | Negative / IPN | Yes |
| UI-092 | Duplicate part name allowed or rejected per setting | Create | B | Medium | Known name uniqueness setting | Create same name | Matches configured rule | Name uniqueness | No |
| UI-093 | Inactive part cannot be added to new BOM | Attributes | N | High | Inactive component | Add to assembly BOM | Blocked | Inactive restrictions | No |
| UI-094 | Inactive part cannot receive new stock (if restricted) | Attributes | N | Medium | Inactive part | New Stock Item | Blocked or warning | Inactive restrictions | No |
| UI-095 | Delete active part is blocked | Delete | N | High | Active part | Try delete | Error: still active | Delete constraint | Yes |
| UI-096 | Delete inactive unused part | Delete | P | High | Deactivated, no stock | Delete | Part removed; list no longer shows it | Delete | Yes |
| UI-097 | Delete part with stock blocked | Delete | N | High | Part has stock | Delete | Error until stock removed | Delete | No |
| UI-098 | Edit name and description persist | Edit | P | High | Part exists | Edit name/description → save → refresh | Values persist | Part details | Yes |
| UI-099 | External link opens | Detail | P | Low | Part has URL | Click external link | Opens in new tab | Part details | No |
| UI-100 | Minimum stock flags low stock | Stock | P | Medium | min stock = 10, on-hand = 2 | Open part / category | Low-stock indicator | Min / Max stock | No |
| UI-101 | Maximum stock flags overstock | Stock | P | Medium | max stock = 5, on-hand = 20 | Open part | Overstocked indicator | Min / Max stock | No |
| UI-102 | Create part without permission | Authz | N | High | Reader user | Open Parts | Add Parts hidden | Permissions | No |
| UI-103 | Reader can view but not edit part | Authz | N | High | Reader user | Open part, try edit | Edit controls hidden/disabled | Permissions | No |
| UI-104 | Serial numbers unique across template variants | Templates | N | High | Template + 2 variants, trackable | Assign same SN to both variants | Rejected | Template serials | No |
| UI-105 | Template stock includes variant stock | Templates | P | Medium | Variants have stock | Open template Stock | Aggregated stock includes variants | Stock reporting | No |
| UI-106 | Keyword search finds part | Search | P | Medium | Part has keywords | Search keyword | Part returned | Keywords | No |
| UI-107 | Name max length 100 | Create | B | High | Form open | Enter 101-char name | Client or server validation | Field limits | No |
| UI-108 | Description required if configured | Create | B | Medium | Description required | Submit without description | Validation | Creating a Part | No |
| UI-109 | Copy category parameters onto new part | Parameters | P | Medium | Category has default params | Create part in that category | Parameters copied | Category parameters | No |
| UI-110 | Unique category default not auto-applied | Parameters | B | Medium | Unique template on category | Create two parts | Unique param not defaulted | Category parameter caveats | No |
| UI-111 | Cross-functional: create part → parameter → stock → category | E2E | P | High | Category + location + template | Create part in category; add parameter; add stock; open category | Category list shows part and stock signal | Assessment cross-flow | Yes |
| UI-112 | Form cancel does not create part | Create | N | Medium | Form dirty | Fill fields → Cancel | No new part | Creating a Part | No |
| UI-113 | Browser back after create lands correctly | Navigation | P | Low | Just created part | Back button | Previous list/category, no duplicate create | Navigation | No |
| UI-114 | Part image thumbnail in category table | Images | P | Low | Part has image | Open category | Thumbnail shown | Image thumbnails | No |
| UI-115 | Star / unstar part | Detail | P | Low | Feature enabled | Toggle star | Starred state persists | Starred | No |
| UI-116 | Barcode / tracking panel for trackable part | Tracking | P | Low | Trackable part | Open Tracking | Tracking UI available | Tracking | No |
| UI-117 | Virtual part cannot be built as assembly physically | Attributes | N | Medium | Virtual + assembly | Attempt build | Restricted per virtual-parts rules | Virtual | No |
| UI-118 | Create part via REST from UI API docs (sanity) | Create | P | Low | Token available | Not UI — covered by API pack | n/a | Other creation methods | API |
| UI-119 | Mobile-width layout of part detail | Responsive | B | Low | Desktop suite | Resize to 375px | Tabs remain usable (scroll/overflow) | PUI | No |
| UI-120 | Concurrent edit conflict | Edit | N | Low | Two sessions | Edit same part differently, save both | Second save conflict or last-write documented | Conflict | No |

**Automation subset (risk-based):** UI-001, UI-002, UI-003, UI-004, UI-005, UI-007, UI-008, UI-009, UI-010, UI-017, UI-020, UI-021, UI-022, UI-027, UI-031, UI-032, UI-035, UI-053, UI-054, UI-055, UI-062, UI-067, UI-068, UI-075, UI-091, UI-095, UI-096, UI-098, UI-111.
