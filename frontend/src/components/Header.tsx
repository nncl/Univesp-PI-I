import Link from "next/link";

const links = [
  { href: "/", label: "Início" },
  { href: "/portfolio", label: "Portfólio" },
  { href: "/quem-sou-eu", label: "Quem sou eu" },
  { href: "/agenda-orcamento", label: "Agendar orçamento" },
];

export default function Header() {
  return (
    <header className="border-b border-ink/10 bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="font-serif text-2xl tracking-wide">
          Yara Oliveira
        </Link>
        <nav className="hidden gap-8 text-sm uppercase tracking-widest md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:opacity-60">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
