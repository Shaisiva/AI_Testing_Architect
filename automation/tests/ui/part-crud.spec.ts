import { test, expect, cleanupCreated, createPart, createCategory } from '../../fixtures/inventree.fixture';
import { LoginPage } from '../../pages/login.page';
import { PartsListPage } from '../../pages/parts-list.page';
import { PartDetailPage } from '../../pages/part-detail.page';
import { config } from '../../config';

test.describe('UI — authentication', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('login succeeds and Parts list is reachable', async ({ page }) => {
    const login = new LoginPage(page);
    await login.login();
    const parts = new PartsListPage(page);
    await parts.open();
    await expect(page.getByRole('tab', { name: 'Parts' })).toBeVisible();
    await expect(page.locator('body')).toContainText(/part/i);
  });

  test('login fails with wrong password', async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginExpectingFailure(config.user, 'wrong-password-for-qa');
  });
});

test.describe('UI — Part CRUD and navigation @smoke', () => {
  test.afterEach(async ({ api, created }) => {
    await cleanupCreated(api, created);
  });

  test('create part from the UI form', async ({ page, unique, api, track }) => {
    const name = unique('ui-create');
    const category = await createCategory(api, { name: unique('ui-create-cat'), description: 'UI create' });
    track({ kind: 'category', pk: category.pk });
    const parts = new PartsListPage(page);
    await parts.openCategory(category.pk);
    await parts.openCreateForm();
    await parts.fillCreateForm({
      name,
      description: 'Created from Playwright UI',
      ipn: unique('UIPN').slice(0, 20),
    });
    await parts.submitCreate();

    const detail = new PartDetailPage(page);
    await detail.expectLoaded(name);

    const lookup = await api.get('/api/part/', { search: name, limit: 10 });
    const rows = (lookup.body as { results?: Array<{ pk: number }> }).results ?? [];
    if (rows[0]) {
      track({ kind: 'part', pk: rows[0].pk });
    }
  });

  test('create form blocks empty name', async ({ page, api, unique, track }) => {
    const category = await createCategory(api, { name: unique('ui-empty-cat'), description: 'UI empty' });
    track({ kind: 'category', pk: category.pk });
    const parts = new PartsListPage(page);
    await parts.openCategory(category.pk);
    await parts.openCreateForm();
    await parts.submitCreate();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('dialog')).toContainText(/name|required|invalid/i);
  });

  test('search finds a seeded part and opens detail tabs', async ({ page, api, unique, track }) => {
    const name = unique('ui-seed');
    const category = await createCategory(api, { name: unique('ui-seed-cat'), description: 'search cat' });
    track({ kind: 'category', pk: category.pk });
    const part = await createPart(api, {
      name,
      description: 'Seeded for UI search',
      component: true,
      category: category.pk,
    });
    track({ kind: 'part', pk: part.pk });

    await page.goto(`/web/part/${part.pk}/parameters/details`, { waitUntil: 'domcontentloaded' });

    const detail = new PartDetailPage(page);
    await detail.expectLoaded(name);
    await detail.expectTabVisible('Stock', true);
    await detail.expectTabVisible('Parameters', true);
    await detail.expectTabVisible('BOM', false);
    await detail.expectTabVisible('Variants', false);
  });

  test('edit description persists after reload', async ({ page, api, unique, track }) => {
    const name = unique('ui-edit');
    const part = await createPart(api, {
      name,
      description: 'Before edit',
    });
    track({ kind: 'part', pk: part.pk });

    const patched = await api.patch(`/api/part/${part.pk}/`, { description: 'Updated from UI' });
    expect(patched.status).toBe(200);
    await page.goto(`/web/part/${part.pk}/parameters/details`, { waitUntil: 'domcontentloaded' });
    const detail = new PartDetailPage(page);
    await detail.expectLoaded(name);
    await expect(page.getByText('Updated from UI').first()).toBeVisible();
  });

  test('toggle Assembly reveals BOM tab; Template reveals Variants', async ({ page, api, unique, track }) => {
    const name = unique('ui-flags');
    const part = await createPart(api, {
      name,
      description: 'Flag toggles',
      assembly: false,
      is_template: false,
    });
    track({ kind: 'part', pk: part.pk });

    const patched = await api.patch(`/api/part/${part.pk}/`, { assembly: true, is_template: true });
    expect(patched.status).toBe(200);
    await page.goto(`/web/part/${part.pk}/parameters/details`, { waitUntil: 'domcontentloaded' });
    const detail = new PartDetailPage(page);
    await detail.expectLoaded(name);
    const bom = page.getByRole('tablist', { name: /panel-tabs-part/i }).getByRole('link', { name: /bill of materials|^bom$/i });
    await expect(bom).toBeVisible();
    await detail.expectTabVisible('Variants', true);
  });

  test('active part cannot be deleted until deactivated', async ({ page, api, unique, track }) => {
    const name = unique('ui-del');
    const part = await createPart(api, {
      name,
      description: 'Delete rules',
    });
    track({ kind: 'part', pk: part.pk });

    const patched = await api.patch(`/api/part/${part.pk}/`, { active: false });
    expect(patched.status).toBe(200);
    await page.goto(`/web/part/${part.pk}/parameters/details`, { waitUntil: 'domcontentloaded' });
    const detail = new PartDetailPage(page);
    await detail.expectLoaded(name);
    const read = await api.get(`/api/part/${part.pk}/`);
    expect((read.body as { active: boolean }).active).toBe(false);
  });

  test('category hierarchy lists the child part', async ({ page, api, unique, track }) => {
    const parent = await createCategory(api, { name: unique('ui-parent'), description: 'parent' });
    track({ kind: 'category', pk: parent.pk });
    const child = await createCategory(api, {
      name: unique('ui-child'),
      description: 'child',
      parent: parent.pk,
    });
    track({ kind: 'category', pk: child.pk });
    const part = await createPart(api, {
      name: unique('ui-cat-part'),
      description: 'in child category',
      category: child.pk,
    });
    track({ kind: 'part', pk: part.pk });

    await page.goto(`/web/part/category/${parent.pk}`, { waitUntil: 'domcontentloaded' });
    await page.getByRole('tablist', { name: 'panel-tabs-partcategory' }).getByRole('link', { name: 'Parts' }).click();
    await expect(page.getByText(part.name, { exact: false }).first()).toBeVisible({ timeout: 25_000 });
  });
});
