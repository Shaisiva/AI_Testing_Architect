import { test as base, expect } from '@playwright/test';
import { InvenTreeApi } from '../api/client';
import { Part, PartCategory } from '../api/schemas';
import { config } from '../config';

export type CreatedRecord = { kind: 'part' | 'category' | 'stock' | 'parameter' | 'parameter-template'; pk: number };

type InventreeFixtures = {
  api: InvenTreeApi;
  unique: (label: string) => string;
  track: (record: CreatedRecord) => void;
  created: CreatedRecord[];
};

export const test = base.extend<InventreeFixtures>({
  api: async ({}, use) => {
    const api = await InvenTreeApi.login();
    await use(api);
    await api.dispose();
  },
  unique: async ({}, use) => {
    const stamp = Date.now().toString(36);
    await use((label: string) => `${config.dataPrefix}-${stamp}-${label}`.slice(0, 100));
  },
  created: async ({}, use) => {
    const records: CreatedRecord[] = [];
    await use(records);
  },
  track: async ({ created }, use) => {
    await use((record) => {
      created.push(record);
    });
  },
});

export { expect };

export async function cleanupCreated(api: InvenTreeApi, records: CreatedRecord[]): Promise<void> {
  const reversed = [...records].reverse();
  for (const record of reversed) {
    try {
      if (record.kind === 'part') {
        await api.patch(`/api/part/${record.pk}/`, { active: false });
        await api.delete(`/api/part/${record.pk}/`);
      } else if (record.kind === 'category') {
        await api.delete(`/api/part/category/${record.pk}/`);
      } else if (record.kind === 'stock') {
        await api.delete(`/api/stock/${record.pk}/`);
      } else if (record.kind === 'parameter') {
        await api.delete(`/api/parameter/${record.pk}/`);
      } else if (record.kind === 'parameter-template') {
        await api.delete(`/api/parameter/template/${record.pk}/`);
      }
    } catch {
      // Demo instance may already have reset or blocked the delete.
    }
  }
}

export async function createPart(
  api: InvenTreeApi,
  data: Record<string, unknown>,
): Promise<Part> {
  const result = await api.post<Part>('/api/part/', data);
  expect(result.status, `Create part failed: ${result.raw}`).toBe(201);
  return result.body;
}

export async function createCategory(
  api: InvenTreeApi,
  data: Record<string, unknown>,
): Promise<PartCategory> {
  const result = await api.post<PartCategory>('/api/part/category/', data);
  expect(result.status, `Create category failed: ${result.raw}`).toBe(201);
  return result.body;
}

export async function firstStockLocation(api: InvenTreeApi): Promise<number | null> {
  const result = await api.get<{ results?: Array<{ pk: number }> }>('/api/stock/location/', {
    limit: 1,
  });
  if (result.status !== 200 || !result.body?.results?.length) {
    return null;
  }
  return result.body.results[0].pk;
}
