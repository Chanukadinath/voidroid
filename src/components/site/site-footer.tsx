import { Link } from "@tanstack/react-router";

const COLUMNS = [
  { title: "Shop", links: [["Men", "/shop"], ["Women", "/shop"], ["Limited edition", "/shop"], ["Gift cards", "/shop"]] },
  { title: "Client care", links: [["Shipping", "/shop"], ["Returns", "/shop"], ["Size guide", "/shop"], ["Contact", "/shop"]] },
  { title: "House", links: [["Our story", "/"], ["Atelier", "/"], ["Careers", "/"], ["Press", "/"]] },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-background">
      <div className="overflow-hidden border-b border-hairline py-8">
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <span key={k} className="display flex shrink-0 text-[13vw] leading-none">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className="px-8">
                  Noctvrne ·
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 py-20 md:grid-cols-4 md:px-10">
        <div>
          <p className="display text-2xl">Noctvrne</p>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Luxury streetwear made in limited chapters. Milan · Tokyo · New York.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="eyebrow mb-5">{col.title}</p>
            <ul className="space-y-3 text-sm">
              {col.links.map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="link-underline text-muted-foreground hover:text-foreground">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 border-t border-hairline px-5 py-8 text-[11px] uppercase tracking-[0.22em] text-muted-foreground md:flex-row md:items-center md:justify-between md:px-10">
        <p>© {new Date().getFullYear()} Noctvrne Atelier</p>
        <p>Privacy · Terms · Cookies</p>
      </div>
    </footer>
  );
}
