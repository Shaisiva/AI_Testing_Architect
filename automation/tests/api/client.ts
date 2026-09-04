import { APIRequestContext, request } from '@playwright/test';
import { config } from '../config';
import { tokenSchema } from './schemas';

export type ApiResult<T = unknown> = {
  status: number;
  body: T;
  raw: string;
};

export class InvenTreeApi {
  constructor(
    private readonly ctx: APIRequestContext,
    readonly token: string,
  ) {}

  static async login(
    username = config.user,
    password = config.password,
    extraHeaders: Record<string, string> = {},
  ): Promise<InvenTreeApi> {
    const ctx = await request.newContext({
      baseURL: config.baseURL,
      extraHTTPHeaders: extraHeaders,
    });
    const response = await ctx.get('/api/user/me/token/', {
      headers: {
        Authorization: basicAuth(username, password),
      },
    });
    const raw = await response.text();
    if (!response.ok()) {
      throw new Error(`Token request failed (${response.status()}): ${raw}`);
    }
    const { token } = tokenSchema.parse(JSON.parse(raw));
    await ctx.dispose();

    const authed = await request.newContext({
      baseURL: config.baseURL,
      extraHTTPHeaders: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...extraHeaders,
      },
    });
    return new InvenTreeApi(authed, token);
  }

  static async anonymous(): Promise<APIRequestContext> {
    return request.newContext({
      baseURL: config.baseURL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }

  async get<T = unknown>(path: string, params?: Record<string, string | number | boolean>): Promise<ApiResult<T>> {
    const url = withQuery(path, params);
    const response = await this.ctx.get(url);
    return this.wrap<T>(response);
  }

  async post<T = unknown>(path: string, data?: unknown): Promise<ApiResult<T>> {
    const response = await this.ctx.post(path, { data });
    return this.wrap<T>(response);
  }

  async patch<T = unknown>(path: string, data?: unknown): Promise<ApiResult<T>> {
    const response = await this.ctx.patch(path, { data });
    return this.wrap<T>(response);
  }

  async put<T = unknown>(path: string, data?: unknown): Promise<ApiResult<T>> {
    const response = await this.ctx.put(path, { data });
    return this.wrap<T>(response);
  }

  async delete<T = unknown>(path: string): Promise<ApiResult<T>> {
    const response = await this.ctx.delete(path);
    return this.wrap<T>(response);
  }

  async dispose(): Promise<void> {
    await this.ctx.dispose();
  }

  private async wrap<T>(response: { status: () => number; text: () => Promise<string> }): Promise<ApiResult<T>> {
    const raw = await response.text();
    let body: T;
    try {
      body = raw ? (JSON.parse(raw) as T) : (undefined as T);
    } catch {
      body = raw as T;
    }
    return { status: response.status(), body, raw };
  }
}

export function basicAuth(username: string, password: string): string {
  const encoded = Buffer.from(`${username}:${password}`).toString('base64');
  return `Basic ${encoded}`;
}

function withQuery(path: string, params?: Record<string, string | number | boolean>): string {
  if (!params) {
    return path;
  }
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    search.set(key, String(value));
  }
  return `${path}?${search.toString()}`;
}
