"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import AdminNav from "@/components/AdminNav";
import { adminApi } from "@/lib/api";
import type { ContactRequest } from "@/lib/types";
import { formatDateTimeBR } from "@/lib/format";

export default function AdminContactsList() {
  const [items, setItems] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .listContacts()
      .then((d) => setItems(d.results))
      .catch((err) => setError(err instanceof Error ? err.message : "Erro ao carregar."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminGuard>
      <AdminNav />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-10 font-serif text-3xl">Solicitações de orçamento</h1>

        {loading && <p className="text-ink/60">Carregando…</p>}
        {error && <p className="text-red-700">{error}</p>}

        {!loading && items.length === 0 && (
          <p className="text-ink/60">Nenhuma solicitação recebida ainda.</p>
        )}

        {items.length > 0 && (
          <div className="divide-y divide-ink/10 border border-ink/10">
            {items.map((c) => (
              <Link
                key={c.id}
                href={`/admin/contacts/${c.id}`}
                className="flex items-center justify-between p-4 transition hover:bg-paper-warm"
              >
                <div>
                  <p className="font-serif text-lg">{c.name}</p>
                  <p className="text-sm text-ink/60">{c.phone}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="text-ink/80">{formatDateTimeBR(c.suggested_date)}</p>
                  <p className="text-ink/50">recebido em {formatDateTimeBR(c.created_at)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </AdminGuard>
  );
}
