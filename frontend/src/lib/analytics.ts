export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const MAX_PARAM_LENGTH = 100;

type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFn;
  }
}

export type PageViewParams = {
  page_path: string;
  page_title: string;
};

export type InteractionParams = {
  action: string;
  description?: string;
  step?: string | number;
};

/** Não fazemos tracking do admin */
export function isTrackedPath(pathname: string): boolean {
  return pathname !== "/admin" && !pathname.startsWith("/admin/");
}

const PAGE_TITLES: Record<string, string> = {
  "/": "Início",
  "/portfolio": "Portfólio",
  "/quem-sou-eu": "Quem sou eu",
  "/agenda-orcamento": "Agendar orçamento",
};

/**
 * Maeamento de title por rota, visto que document.title não é confiável por não ser atualizado quando o effect de
 * rota é disparado.
 */
export function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (/^\/portfolio\/[^/]+\/?$/.test(pathname)) return "Portfólio – Detalhe";
  return "Página não encontrada";
}

// 1 page_view por troca de rota
let lastPageViewPath: string | null = null;

function truncate(value: string): string {
  return value.length > MAX_PARAM_LENGTH ? value.slice(0, MAX_PARAM_LENGTH) : value;
}

function getGtag(): GtagFn | null {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined") return null;
  if (window.gtag) return window.gtag;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
    ...(process.env.NODE_ENV !== "production" && { debug_mode: true }),
  });
  return window.gtag;
}

export function trackPageView({ page_path, page_title }: PageViewParams) {
  if (page_path === lastPageViewPath) return;
  if (!isTrackedPath(page_path)) {
    lastPageViewPath = page_path;
    return;
  }
  const gtag = getGtag();
  if (!gtag) return;
  lastPageViewPath = page_path;
  gtag("event", "page_view", {
    page_path: truncate(page_path),
    page_title: truncate(page_title),
    page_location: window.location.href,
  });
}

export function trackInteraction({ action, description = "", step = "" }: InteractionParams) {
  if (typeof window === "undefined") return;
  const page_path = window.location.pathname;
  if (!isTrackedPath(page_path)) return;
  const gtag = getGtag();
  if (!gtag) return;
  gtag("event", "user_interaction", {
    action: truncate(action),
    page_path: truncate(page_path),
    description: truncate(description),
    step: String(step),
  });
}
