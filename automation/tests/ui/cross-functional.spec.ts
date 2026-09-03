import { test, expect, cleanupCreated, createPart, createCategory, firstStockLocation } from '../../fixtures/inventree.fixture';
import { PartDetailPage } from '../../pages/part-detail.page';

test.describe('UI — Cross-functional Parts flow @smoke', () => {
  test.afterEach(async ({ api, created }) => {
    await cleanupCreated(api, created);
  });

  test('create part → add parameter → create stock → verify in category', async ({
    page,
    api,
    unique,
    track,
  }) => {
    const category = await createCategory(api, {
      name: unique('xf-cat'),
      description: 'Cross-functional category',
    });
    track({ kind: 'category', pk: category.pk });

    const part = await createPart(api, {
      name: unique('xf-part'),
      description: 'Cross-functional part',
      category: category.pk,
      component: true,
    });
    track({ kind: 'part', pk: part.pk });

    const template = await api.post<{ pk: number }>('/api/parameter/template/', {
      name: unique('xf-res'),
      units: 'ohm',
    });
    let templatePk = template.status === 201 ? template.body.pk : undefined;
    if (templatePk) {
      track({ kind: 'parameter-template', pk: templatePk });
    } else {
      const existing = await api.get<{ results?: Array<{ pk: number }> } | Array<{ pk: number }>>(
        '/api/parameter/template/',
        { limit: 1 },
      );
      const rows = Array.isArray(existing.body) ? existing.body : existing.body.results ?? [];
      templatePk = rows[0]?.pk;
    }

    const parameter = await api.post<{ pk: number }>('/api/parameter/', {
      model_type: 'part.part',
      model_id: part.pk,
      template: templatePk,
      data: '4k7',
    });
    expect(parameter.status, parameter.raw).toBe(201);
    track({ kind: 'parameter', pk: parameter.body.pk });

    const location = await firstStockLocation(api);
    const stock = await api.post<{ pk: number } | Array<{ pk: number }>>('/api/stock/', {
      part: part.pk,
      quantity: 12,
      status: 10,
      ...(location ? { location } : {}),
    });
    expect(stock.status, stock.raw).toBe(201);
    const stockBody = Array.isArray(stock.body) ? stock.body[0] : stock.body;
    track({ kind: 'stock', pk: stockBody.pk });

    await page.goto(`/web/part/${part.pk}/parameters/details`, { waitUntil: 'domcontentloaded' });
    const detail = new PartDetailPage(page);
    await detail.expectLoaded(part.name);
    await detail.expectTabVisible('Stock', true);
    await detail.expectTabVisible('Parameters', true);

    await page.goto(`/web/part/${part.pk}/parameters/parameters`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('4k7').first()).toBeVisible({ timeout: 20_000 });

    await page.goto(`/web/part/category/${category.pk}`, { waitUntil: 'domcontentloaded' });
    await page.getByRole('tablist', { name: 'panel-tabs-partcategory' }).getByRole('link', { name: 'Parts' }).click();
    await expect(page.getByText(part.name, { exact: false }).first()).toBeVisible({ timeout: 25_000 });
    await expect(page.locator('body')).toContainText(/12|stock/i);
  });
});
