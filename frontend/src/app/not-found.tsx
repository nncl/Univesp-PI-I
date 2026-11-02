import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="conteudo" tabIndex={-1} className="mx-auto max-w-3xl px-6 py-32 text-center">
        <p className="text-xs uppercase tracking-widest text-ink/60">Erro 404</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">Página não encontrada</h1>
        <p className="mx-auto mt-4 max-w-xl text-ink/70">
          O endereço que você acessou não existe ou foi removido.
        </p>
        <Link
          href="/"
          data-track-action="cta_click"
          data-track-description="voltar_inicio"
          className="mt-8 inline-block border border-ink bg-ink px-8 py-3 text-sm uppercase tracking-widest text-paper transition hover:bg-paper hover:text-ink"
        >
          Voltar ao início
        </Link>
      </main>
      <Footer />
    </>
  );
}
