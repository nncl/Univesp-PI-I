export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 px-6 py-10 text-sm text-ink/70 md:flex-row md:items-center md:justify-between">
        <p className="font-serif text-base">Yara Oliveira</p>
        <p className="uppercase tracking-widest">Campinas — SP</p>
        <a
          href="https://www.instagram.com/yaa_tattoo"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram da Yara — @yaa_tattoo"
          className="inline-flex items-center gap-2 transition hover:text-ink"
        >
          <InstagramIcon className="h-5 w-5" />
          <span className="tracking-wide">@yaa_tattoo</span>
        </a>
        <p>© {new Date().getFullYear()} — Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
