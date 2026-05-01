import Link from "next/link";
import type { PortfolioItem } from "@/lib/types";

export default function PortfolioCard({ item }: { item: PortfolioItem }) {
  return (
    <Link
      href={`/portfolio/${item.id}`}
      className="group block overflow-hidden border border-ink/10 bg-paper-warm"
    >
      <div className="aspect-[4/5] w-full overflow-hidden bg-ink/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image_url}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="space-y-2 p-5">
        <h3 className="font-serif text-xl">{item.title}</h3>
        <p className="line-clamp-3 text-sm text-ink/70">{item.description}</p>
      </div>
    </Link>
  );
}
