import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-20">
        <header className="mb-12 max-w-2xl space-y-3">
          <p className="text-xs uppercase tracking-widest text-ink/60">Sobre</p>
          <h1 className="font-serif text-4xl md:text-5xl">Quem sou eu</h1>
        </header>

        <div className="grid gap-12 md:grid-cols-2 md:items-start">
          <div className="aspect-[4/5] w-full overflow-hidden border border-ink/10 bg-paper-warm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1586243287039-23f4c8e2e7ab?w=1000&q=80"
              alt="Yara Oliveira no estúdio"
              className="h-full w-full object-cover"
            />
          </div>

          <article className="space-y-5 text-lg leading-relaxed text-ink/80">
            <p>
              Sou a Yara, tatuadora baseada em Campinas — SP. Desenho e tatuo desde 2018, com
              foco em traços minimalistas e composições autorais que conversam com a história
              de quem me procura.
            </p>
            <p>
              Cada peça nasce de uma conversa: entender o significado, o lugar do corpo, o que
              precisa permanecer simples e o que pode ganhar nuance. Trabalho com agendamento
              prévio para garantir tempo dedicado a cada projeto.
            </p>
            <p>
              O estúdio segue protocolos rigorosos de biossegurança e usa materiais
              descartáveis. Atendo presencialmente em Campinas e, eventualmente, em estúdios
              parceiros pelo Brasil.
            </p>
            <p className="font-serif text-2xl">
              “Uma boa tatuagem começa muito antes da agulha tocar a pele.”
            </p>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
