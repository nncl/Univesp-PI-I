export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-2 px-6 py-10 text-sm text-ink/70 md:flex-row md:items-center md:justify-between">
        <p className="font-serif text-base">Yara Oliveira</p>
        <p className="uppercase tracking-widest">Campinas — SP</p>
        <p>© {new Date().getFullYear()} — Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
