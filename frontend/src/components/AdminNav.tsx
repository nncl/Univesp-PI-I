"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/lib/api";
import { clearTokens, getRefreshToken } from "@/lib/auth";

const links = [
  { href: "/admin", label: "Painel" },
  { href: "/admin/portfolio", label: "Portfólio" },
  { href: "/admin/contacts", label: "Solicitações" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const refresh = getRefreshToken();
    if (refresh) {
      try {
        await auth.logout(refresh);
      } catch {
        /* ignore */
      }
    }
    clearTokens();
    router.replace("/admin/login");
  }

  return (
    <header className="border-b border-ink/10 bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/admin" className="font-serif text-xl">
          Yara · Admin
        </Link>
        <nav className="flex items-center gap-6 text-sm uppercase tracking-widest">
          {links.map((l) => {
            const active = pathname === l.href || pathname?.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={active ? "underline underline-offset-4" : "hover:opacity-60"}
              >
                {l.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={handleLogout}
            className="border border-ink px-3 py-1 text-xs uppercase tracking-widest hover:bg-ink hover:text-paper"
          >
            Sair
          </button>
        </nav>
      </div>
    </header>
  );
}
