import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "./auth";
import type {
  AuthTokens,
  AuthUser,
  ContactRequest,
  ContactRequestPayload,
  Paginated,
  PortfolioItem,
} from "./types";

// On the server (RSC, Route Handlers) we prefer the container-internal URL;
// on the client we use the public URL exposed in the browser.
const API_BASE_URL =
  (typeof window === "undefined" ? process.env.INTERNAL_API_BASE_URL : null) ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8000/api";

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown, message?: string) {
    super(message ?? `Request failed with ${status}`);
    this.status = status;
    this.body = body;
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  auth?: boolean;
  retryOn401?: boolean;
};

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = false, retryOn401 = true } = opts;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (res.status === 401 && auth && retryOn401) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      return request<T>(path, { ...opts, retryOn401: false });
    }
    clearTokens();
    throw new ApiError(401, null, "Não autenticado.");
  }

  const text = await res.text();
  const parsed = text ? safeJson(text) : null;

  if (!res.ok) {
    throw new ApiError(res.status, parsed, extractMessage(parsed) ?? res.statusText);
  }
  return parsed as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function extractMessage(body: unknown): string | undefined {
  if (!body || typeof body !== "object") return undefined;
  const obj = body as Record<string, unknown>;
  if (typeof obj.detail === "string") return obj.detail;
  const firstKey = Object.keys(obj)[0];
  if (firstKey) {
    const v = obj[firstKey];
    if (Array.isArray(v) && typeof v[0] === "string") return `${firstKey}: ${v[0]}`;
    if (typeof v === "string") return `${firstKey}: ${v}`;
  }
  return undefined;
}

async function tryRefresh(): Promise<boolean> {
  const refresh = getRefreshToken();
  if (!refresh) return false;
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return false;
    const tokens = (await res.json()) as Partial<AuthTokens>;
    if (!tokens.access) return false;
    setTokens({ access: tokens.access, refresh: tokens.refresh ?? refresh });
    return true;
  } catch {
    return false;
  }
}

// Public
export const api = {
  listPortfolio: () => request<Paginated<PortfolioItem>>("/portfolio/"),
  getPortfolioItem: (id: number | string) => request<PortfolioItem>(`/portfolio/${id}/`),
  createContact: (payload: ContactRequestPayload) =>
    request<ContactRequest>("/contact/", { method: "POST", body: payload }),
};

