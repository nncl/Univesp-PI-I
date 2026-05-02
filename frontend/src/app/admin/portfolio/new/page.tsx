"use client";

import { useRouter } from "next/navigation";
import AdminGuard from "@/components/AdminGuard";
import AdminNav from "@/components/AdminNav";
import PortfolioForm from "@/components/PortfolioForm";
import { adminApi } from "@/lib/api";

export default function AdminPortfolioNew() {
  const router = useRouter();

  return (
    <AdminGuard>
      <AdminNav />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-10 font-serif text-3xl">Novo trabalho</h1>
        <PortfolioForm
          submitLabel="Criar"
          onSubmit={async (values) => {
            await adminApi.createPortfolio(values);
            router.push("/admin/portfolio");
          }}
        />
      </main>
    </AdminGuard>
  );
}
