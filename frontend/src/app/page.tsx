import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { api, ApiError } from "@/lib/api";
import type { PortfolioItem } from "@/lib/types";

async function fetchHomeGallery(): Promise<PortfolioItem[]> {
  try {
    const data = await api.listPortfolio();
    return data.results.slice(0, 6);
  } catch (err) {
    if (err instanceof ApiError) return [];
    return [];
  }
}

export default async function HomePage() {
  const gallery = await fetchHomeGallery();

  return (
    <>
      <Header />
      <main>
        {/* hero */}
        <section className="border-b border-ink/10">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-2 md:items-center md:py-32">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-widest text-ink/60">
                Tatuadora · Campinas — SP
              </p>
              <h1 className="font-serif text-5xl leading-tight md:text-7xl">Yara Oliveira</h1>
              <p className="max-w-md text-lg text-ink/70">
                Tatuagens autorais com traço minimalista, feitas sob medida para cada história.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/agenda-orcamento"
                  className="border border-ink bg-ink px-6 py-3 text-sm uppercase tracking-widest text-paper transition hover:bg-paper hover:text-ink"
                >
                  Agendar orçamento
                </Link>
                <Link
                  href="/portfolio"
                  className="border border-ink px-6 py-3 text-sm uppercase tracking-widest transition hover:bg-ink hover:text-paper"
                >
                  Ver portfólio
                </Link>
              </div>
            </div>
            <div className="aspect-[4/5] w-full overflow-hidden border border-ink/10 bg-paper-warm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/placeholder-artist.jpg"
                alt="Yara Oliveira"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* gallery */}
        <section className="border-b border-ink/10">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="mb-10 flex items-end justify-between">
              <h2 className="font-serif text-3xl md:text-4xl">Trabalhos recentes</h2>
              <Link
                href="/portfolio"
                className="text-xs uppercase tracking-widest hover:opacity-60"
              >
                Ver todos →
              </Link>
            </div>
            {gallery.length === 0 ? (
              <p className="text-ink/60">Em breve, novas peças por aqui.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {gallery.map((item) => (
                  <Link
                    key={item.id}
                    href={`/portfolio/${item.id}`}
                    className="group block aspect-[4/5] overflow-hidden border border-ink/10"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="mx-auto max-w-3xl px-6 py-24 text-center">
            <h2 className="font-serif text-3xl md:text-4xl">
              Sua próxima tatuagem começa com uma conversa.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-ink/70">
              Conte sua ideia, escolha uma data e receba um orçamento personalizado.
            </p>
            <Link
              href="/agenda-orcamento"
              className="mt-8 inline-block border border-ink bg-ink px-8 py-3 text-sm uppercase tracking-widest text-paper transition hover:bg-paper hover:text-ink"
            >
              Solicitar orçamento
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
