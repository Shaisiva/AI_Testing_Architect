# Recordings

| File | What it shows |
|---|---|
| `agent-workflow-walkthrough.webm` | Playwright-generated walkthrough of the explainer (`docs/walkthrough.html`): sources ingested, sample generated cases, generated scripts, architect review, how to run |
| `test-execution.webm` | Playwright video of a live UI smoke run against `https://demo.inventree.org` (login + Parts) |

Play in any browser or VLC. Re-generate:

```bash
cd automation
npx playwright test --project=walkthrough
npx playwright test --project=chromium --grep "@smoke"
```

Then copy a `test-results/**/video.webm` into this folder as `test-execution.webm`.
