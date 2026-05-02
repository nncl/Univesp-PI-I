"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import AdminNav from "@/components/AdminNav";
import PortfolioForm from "@/components/PortfolioForm";
import { adminApi } from "@/lib/api";
import type { PortfolioItem } from "@/lib/types";

export default function AdminPortfolioEdit({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .getPortfolio(params.id)
      .then(setItem)
      .catch((err) => setError(err instanceof Error ? err.message : "Erro ao carregar."));
  }, [params.id]);

  return (
    <AdminGuard>
      <AdminNav />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-10 font-serif text-3xl">Editar trabalho</h1>
        {error && <p className="text-red-700">{error}</p>}
        {!item && !error && <p className="text-ink/60">Carregando…</p>}
        {item && (
          <PortfolioForm
            initial={{
              title: item.title,
              description: item.description,
              image_url: item.image_url,
            }}
            submitLabel="Salvar alterações"
            onSubmit={async (values) => {
              await adminApi.updatePortfolio(item.id, values);
              router.push("/admin/portfolio");
            }}
          />
        )}
      </main>
    </AdminGuard>
  );
}
