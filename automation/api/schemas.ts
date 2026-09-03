import { z } from 'zod';

export const partSchema = z
  .object({
    pk: z.number(),
    name: z.string(),
    description: z.string().nullable().optional(),
    IPN: z.string().nullable().optional(),
    active: z.boolean(),
    assembly: z.boolean(),
    component: z.boolean(),
    virtual: z.boolean(),
    purchaseable: z.boolean(),
    salable: z.boolean(),
    trackable: z.boolean(),
    is_template: z.boolean().optional(),
    category: z.number().nullable().optional(),
    units: z.string().nullable().optional(),
    revision: z.string().nullable().optional(),
    revision_of: z.number().nullable().optional(),
    default_location: z.number().nullable().optional(),
    in_stock: z.number().nullable().optional(),
    creation_date: z.string().nullable().optional(),
    full_name: z.string().optional(),
  })
  .passthrough();

export const paginatedPartsSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(partSchema),
});

export const categorySchema = z
  .object({
    pk: z.number(),
    name: z.string(),
    description: z.string().nullable().optional(),
    parent: z.number().nullable().optional(),
    pathstring: z.string().optional(),
    level: z.number().optional(),
    part_count: z.number().nullable().optional(),
    structural: z.boolean().optional(),
  })
  .passthrough();

export const paginatedCategoriesSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(categorySchema),
});

export const tokenSchema = z.object({
  token: z.string().min(1),
});

export const stockItemSchema = z
  .object({
    pk: z.number(),
    part: z.number(),
    quantity: z.union([z.string(), z.number()]),
    location: z.number().nullable().optional(),
  })
  .passthrough();

export const parameterTemplateSchema = z
  .object({
    pk: z.number(),
    name: z.string(),
    units: z.string().nullable().optional(),
  })
  .passthrough();

export const partParameterSchema = z
  .object({
    pk: z.number(),
    model_id: z.number().optional(),
    part: z.number().optional(),
    template: z.number(),
    data: z.union([z.string(), z.number()]).optional(),
  })
  .passthrough();

export type Part = z.infer<typeof partSchema>;
export type PartCategory = z.infer<typeof categorySchema>;
