"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import AdminNav from "@/components/AdminNav";
import { adminApi } from "@/lib/api";

export default function AdminDashboard() {
  const [portfolioCount, setPortfolioCount] = useState<number | null>(null);
  const [contactsCount, setContactsCount] = useState<number | null>(null);

  useEffect(() => {
    adminApi.listPortfolio().then((d) => setPortfolioCount(d.count)).catch(() => {});
    adminApi.listContacts().then((d) => setContactsCount(d.count)).catch(() => {});
  }, []);

  return (
    <AdminGuard>
      <AdminNav />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-10 font-serif text-3xl">Painel</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/admin/portfolio"
            className="block border border-ink/10 bg-paper-warm p-8 transition hover:border-ink"
          >
            <p className="text-xs uppercase tracking-widest text-ink/60">Portfólio</p>
            <p className="mt-3 font-serif text-5xl">
              {portfolioCount ?? "—"}
            </p>
            <p className="mt-2 text-sm text-ink/60">trabalhos cadastrados</p>
          </Link>
          <Link
            href="/admin/contacts"
            className="block border border-ink/10 bg-paper-warm p-8 transition hover:border-ink"
          >
            <p className="text-xs uppercase tracking-widest text-ink/60">Solicitações</p>
            <p className="mt-3 font-serif text-5xl">
              {contactsCount ?? "—"}
            </p>
            <p className="mt-2 text-sm text-ink/60">orçamentos recebidos</p>
          </Link>
        </div>
      </main>
    </AdminGuard>
  );
}
