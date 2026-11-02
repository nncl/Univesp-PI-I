"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  GA_MEASUREMENT_ID,
  getPageTitle,
  isTrackedPath,
  trackInteraction,
  trackPageView,
} from "@/lib/analytics";

/**
 * Carrega script do gtag, envia um evento de page_view em toda troca de página e em cliques de
 * botões que possuem algum attr data-track-*.
 */
export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    trackPageView({ page_path: pathname, page_title: getPageTitle(pathname) });
  }, [pathname]);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;
    function onClick(e: MouseEvent) {
      const target = (e.target as Element | null)?.closest<HTMLElement>("[data-track-action]");
      if (!target) return;
      const { trackAction, trackDescription, trackStep } = target.dataset;
      trackInteraction({
        action: trackAction ?? "",
        description: trackDescription,
        step: trackStep,
      });
    }
    // Captura o valor do evento antes do redirect
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  if (!GA_MEASUREMENT_ID || !pathname || !isTrackedPath(pathname)) return null;

  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      strategy="afterInteractive"
    />
  );
}
