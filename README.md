# InvenTree Parts — Quality Architect Assessment

Agent-assisted QA pack for the **InvenTree Parts** module.

- **AUT:** [InvenTree](https://docs.inventree.org/en/stable/part/) (Python/Django inventory)
- **Stack:** TypeScript + Playwright (UI and API in one project)
- **Default target:** https://demo.inventree.org (`allaccess` / `nolimits`)
- **Local target:** Docker Compose — see [infra/inventree/README.md](infra/inventree/README.md)

## Repository map

```
├── README.md
├── docs/walkthrough.html              # easy-understanding document
├── docs/requirements-traceability.md
├── agent-artefacts/                   # prompts, review notes, conversation log
├── test-cases/                        # UI + API manual cases
├── automation/                        # Playwright project
├── infra/inventree/                   # Docker setup notes
└── recordings/                        # generated walkthrough + smoke videos
```

## Quick start

From the **repo root** (`AI_Project`):

```bash
npm test          # API + UI (runs inside automation/)
npm run report    # open the HTML report (do not run npx playwright show-report here)
```

Or from `automation/`:

```bash
cd automation
copy .env.example .env    # Windows
npm install
npx playwright install chromium
npx playwright test --project=api
npx playwright test --project=chromium
npm run report
```

Smoke only:

```bash
npx playwright test --grep @smoke
```

Walkthrough video (serves `docs/walkthrough.html` automatically if you start a static server — see below):

```bash
npx playwright test --project=walkthrough
```

## What the agent did

Cursor ingested the official Parts docs and live OpenAPI schema, generated the case packs and scripts, then the architect loop ran them against the demo and corrected live-API/PUI mismatches. Those corrections are listed in [agent-artefacts/agent-review-notes.md](agent-artefacts/agent-review-notes.md).

This is the workflow the brief asks for: **AI does the heavy lifting under architectural direction**.

## Credentials

Demo accounts are public ([inventree.org/demo](https://inventree.org/demo.html)). Do not put private passwords in git. `.env` is gitignored; ship `.env.example`.
