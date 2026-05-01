import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PortfolioCard from "@/components/PortfolioCard";
import { api } from "@/lib/api";
import type { PortfolioItem } from "@/lib/types";

async function fetchAll(): Promise<PortfolioItem[]> {
  try {
    const data = await api.listPortfolio();
    return data.results;
  } catch {
    return [];
  }
}

export default async function PortfolioPage() {
  const items = await fetchAll();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-20">
        <header className="mb-12 max-w-2xl space-y-3">
          <p className="text-xs uppercase tracking-widest text-ink/60">Portfólio</p>
          <h1 className="font-serif text-4xl md:text-5xl">Trabalhos selecionados</h1>
          <p className="text-ink/70">
            Uma coletânea de peças autorais e parcerias recentes.
          </p>
        </header>

        {items.length === 0 ? (
          <p className="text-ink/60">Nenhum trabalho cadastrado ainda.</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <PortfolioCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
