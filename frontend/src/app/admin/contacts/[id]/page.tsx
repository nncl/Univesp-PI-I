"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import AdminNav from "@/components/AdminNav";
import { adminApi } from "@/lib/api";
import type { ContactRequest } from "@/lib/types";
import { formatDateTimeBR } from "@/lib/format";

export default function AdminContactDetail({ params }: { params: { id: string } }) {
  const [c, setC] = useState<ContactRequest | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .getContact(params.id)
      .then(setC)
      .catch((err) => setError(err instanceof Error ? err.message : "Erro ao carregar."));
  }, [params.id]);

  return (
    <AdminGuard>
      <AdminNav />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <Link
          href="/admin/contacts"
          className="mb-6 inline-block text-xs uppercase tracking-widest hover:opacity-60"
        >
          ← Voltar
        </Link>

        {error && <p className="text-red-700">{error}</p>}
        {!c && !error && <p className="text-ink/60">Carregando…</p>}

        {c && (
          <article className="space-y-8 border border-ink/10 bg-paper-warm p-8">
            <header className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-ink/60">Solicitação</p>
              <h1 className="font-serif text-3xl">{c.name}</h1>
            </header>

            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="WhatsApp" value={c.phone} />
              <Field label="E-mail" value={c.email || "—"} />
              <Field label="Tamanho" value={c.tattoo_size || "—"} />
              <Field label="Data sugerida" value={formatDateTimeBR(c.suggested_date)} />
              <Field label="Recebido em" value={formatDateTimeBR(c.created_at)} />
            </dl>

            <div>
              <p className="text-xs uppercase tracking-widest text-ink/60">Descrição</p>
              <p className="mt-2 whitespace-pre-line text-ink/80">{c.description}</p>
            </div>
          </article>
        )}
      </main>
    </AdminGuard>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-widest text-ink/60">{label}</dt>
      <dd className="mt-1 text-ink/80">{value}</dd>
    </div>
  );
}
