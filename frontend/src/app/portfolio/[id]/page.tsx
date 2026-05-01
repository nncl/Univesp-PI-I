import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { api, ApiError } from "@/lib/api";

type Params = { params: { id: string } };

export default async function PortfolioDetail({ params }: Params) {
  let item;
  try {
    item = await api.getPortfolioItem(params.id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <>
      <Header />
      <main>
        <section className="border-b border-ink/10">
          <div className="aspect-[16/9] w-full overflow-hidden bg-ink/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image_url}
              alt={item.title}
              className="h-full w-full object-cover"
            />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-12 md:grid-cols-2 md:items-start">
            <div className="aspect-[4/5] w-full overflow-hidden border border-ink/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image_url}
                alt={item.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-widest text-ink/60">Trabalho</p>
              <h1 className="font-serif text-4xl md:text-5xl">{item.title}</h1>
              <p className="whitespace-pre-line text-lg leading-relaxed text-ink/80">
                {item.description}
              </p>
              <div className="flex gap-4 pt-4">
                <Link
                  href="/agenda-orcamento"
                  className="border border-ink bg-ink px-6 py-3 text-sm uppercase tracking-widest text-paper transition hover:bg-paper hover:text-ink"
                >
                  Quero algo assim
                </Link>
                <Link
                  href="/portfolio"
                  className="border border-ink px-6 py-3 text-sm uppercase tracking-widest transition hover:bg-ink hover:text-paper"
                >
                  ← Voltar
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
