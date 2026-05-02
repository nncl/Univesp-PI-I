"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import AdminNav from "@/components/AdminNav";
import { adminApi } from "@/lib/api";
import type { PortfolioItem } from "@/lib/types";

export default function AdminPortfolioList() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const data = await adminApi.listPortfolio();
      setItems(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Excluir este trabalho?")) return;
    try {
      await adminApi.deletePortfolio(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao excluir.");
    }
  }

  return (
    <AdminGuard>
      <AdminNav />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10 flex items-end justify-between">
          <h1 className="font-serif text-3xl">Portfólio</h1>
          <Link
            href="/admin/portfolio/new"
            className="border border-ink bg-ink px-5 py-2 text-xs uppercase tracking-widest text-paper transition hover:bg-paper hover:text-ink"
          >
            + Novo trabalho
          </Link>
        </div>

        {loading && <p className="text-ink/60">Carregando…</p>}
        {error && <p className="text-red-700">{error}</p>}

        {!loading && items.length === 0 && (
          <p className="text-ink/60">Nenhum trabalho cadastrado.</p>
        )}

        {items.length > 0 && (
          <div className="divide-y divide-ink/10 border border-ink/10">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden bg-ink/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-serif text-lg">{item.title}</p>
                  <p className="line-clamp-1 text-sm text-ink/60">{item.description}</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/portfolio/${item.id}/edit`}
                    className="border border-ink/30 px-3 py-1 text-xs uppercase tracking-widest hover:border-ink"
                  >
                    Editar
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="border border-red-700 px-3 py-1 text-xs uppercase tracking-widest text-red-700 hover:bg-red-700 hover:text-paper"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </AdminGuard>
  );
}
