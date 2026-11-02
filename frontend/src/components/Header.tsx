"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { trackInteraction } from "@/lib/analytics";

const links = [
  { href: "/", label: "Início" },
  { href: "/portfolio", label: "Portfólio" },
  { href: "/quem-sou-eu", label: "Quem sou eu" },
  { href: "/agenda-orcamento", label: "Agendar orçamento" },
];

const MOBILE_MENU_ID = "menu-principal-mobile";

function isActive(pathname: string | null, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || Boolean(pathname?.startsWith(`${href}/`));
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close the menu after navigating.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Escape closes the menu and returns focus to the toggle button.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="border-b border-ink/10 bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          data-track-action="nav_click"
          data-track-description="logo"
          className="font-serif text-2xl tracking-wide"
        >
          Yara Oliveira
        </Link>
        <nav
          aria-label="Principal"
          className="hidden gap-8 text-sm uppercase tracking-widest md:flex"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(pathname, l.href) ? "page" : undefined}
              data-track-action="nav_click"
              data-track-description={`${l.label} (desktop)`}
              className="hover:opacity-60 aria-[current=page]:underline aria-[current=page]:underline-offset-4"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          ref={toggleRef}
          type="button"
          aria-expanded={open}
          aria-controls={MOBILE_MENU_ID}
          onClick={() => {
            trackInteraction({ action: "menu_toggle", description: open ? "close" : "open" });
            setOpen((v) => !v);
          }}
          className="border border-ink px-3 py-2 text-xs uppercase tracking-widest md:hidden"
        >
          Menu
        </button>
      </div>
      <nav
        id={MOBILE_MENU_ID}
        aria-label="Principal (mobile)"
        hidden={!open}
        className="border-t border-ink/10 md:hidden"
      >
        <ul className="mx-auto flex max-w-6xl flex-col px-6 py-2 text-sm uppercase tracking-widest">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={isActive(pathname, l.href) ? "page" : undefined}
                data-track-action="nav_click"
                data-track-description={`${l.label} (mobile)`}
                className="block py-3 aria-[current=page]:underline aria-[current=page]:underline-offset-4"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
