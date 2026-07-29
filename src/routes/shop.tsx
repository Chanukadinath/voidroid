import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { products, type Product } from "@/data/products";
import { ProductCard } from "@/components/site/product-card";
import { SplitText, Reveal } from "@/components/site/motion-primitives";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Search = { category: "all" | "men" | "women" | "unisex" };

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    category: (["all", "men", "women", "unisex"].includes(String(s.category)) ? s.category : "all") as Search["category"],
  }),
  head: () => ({
    meta: [
      { title: "Shop Chapter IV — NOCTVRNE" },
      {
        name: "description",
        content: "Browse the full NOCTVRNE collection: heavyweight fleece, dry wool tailoring and numbered limited editions.",
      },
      { property: "og:title", content: "Shop Chapter IV — NOCTVRNE" },
      { property: "og:description", content: "The full NOCTVRNE collection in monochrome. Filter by size, colour and price." },
    ],
  }),
  component: Shop,
});

const SIZES = ["XS", "S", "M", "L", "XL", "28", "30", "32", "34", "36"];
const COLORS = ["Black", "Bone", "Charcoal", "Washed Black"];
const SORTS = [
  { id: "newest", label: "Newest" },
  { id: "popular", label: "Popular" },
  { id: "price-asc", label: "Price ↑" },
  { id: "price-desc", label: "Price ↓" },
] as const;

function Shop() {
  const { category } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [maxPrice, setMaxPrice] = useState(1500);
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("newest");
  const [visible, setVisible] = useState(6);

  const filtered = useMemo(() => {
    const list = products.filter(
      (p) =>
        (category === "all" || p.category === category || p.category === "unisex") &&
        p.price <= maxPrice &&
        (!size || p.sizes.includes(size)) &&
        (!color || p.colors.includes(color)),
    );
    const sorted: Product[] = [...list];
    sorted.sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "popular") return b.popularity - a.popularity;
      return b.createdAt.localeCompare(a.createdAt);
    });
    return sorted;
  }, [category, maxPrice, size, color, sort]);

  const shown = filtered.slice(0, visible);
  const hasMore = filtered.length > visible;

  return (
    <div className="pt-36 md:pt-44">
      <header className="mx-auto max-w-[1600px] px-5 md:px-10">
        <p className="eyebrow">{filtered.length} pieces</p>
        <h1 className="display mt-5 text-[clamp(2.8rem,9vw,9rem)]">
          <SplitText text="Collection" />
        </h1>
      </header>

      <div className="mx-auto mt-16 max-w-[1600px] gap-14 px-5 md:px-10 lg:grid lg:grid-cols-[240px_1fr]">
        <aside className="mb-14 space-y-10 lg:sticky lg:top-32 lg:mb-0 lg:h-fit">
          <Filter title="Category">
            <div className="flex flex-wrap gap-2">
              {(["all", "men", "women", "unisex"] as const).map((c) => (
                <Chip key={c} active={category === c} onClick={() => navigate({ search: { category: c } })}>
                  {c}
                </Chip>
              ))}
            </div>
          </Filter>

          <Filter title={`Price — up to $${maxPrice}`}>
            <input
              type="range"
              min={100}
              max={1500}
              step={20}
              value={maxPrice}
              aria-label="Maximum price"
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-foreground"
            />
          </Filter>

          <Filter title="Colour">
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <Chip key={c} active={color === c} onClick={() => setColor(color === c ? null : c)}>
                  {c}
                </Chip>
              ))}
            </div>
          </Filter>

          <Filter title="Size">
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <Chip key={s} active={size === s} onClick={() => setSize(size === s ? null : s)}>
                  {s}
                </Chip>
              ))}
            </div>
          </Filter>

          <Filter title="Sort by">
            <div className="flex flex-wrap gap-2">
              {SORTS.map((s) => (
                <Chip key={s.id} active={sort === s.id} onClick={() => setSort(s.id)}>
                  {s.label}
                </Chip>
              ))}
            </div>
          </Filter>
        </aside>

        <section className="pb-32">
          {filtered.length === 0 ? (
            <p className="py-24 text-center text-sm text-muted-foreground">No pieces match these filters.</p>
          ) : (
            <div className="columns-1 gap-6 sm:columns-2 xl:columns-3 [&>*]:mb-16 [&>*]:break-inside-avoid">
              {shown.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}

          {hasMore && (
            <Reveal className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              <>
                <Skeleton className="aspect-[3/4] w-full" />
                <Skeleton className="hidden aspect-[3/4] w-full sm:block" />
              </>
            </Reveal>
          )}

          {hasMore && (
            <div className="mt-14 text-center">
              <button
                type="button"
                onClick={() => setVisible((v) => v + 6)}
                className="rounded-full border border-hairline px-10 py-4 text-[11px] uppercase tracking-[0.28em] hover:bg-accent"
              >
                Load more
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Filter({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-hairline pt-5">
      <p className="eyebrow mb-4">{title}</p>
      {children}
    </div>
  );
}

function Chip({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.18em] transition-colors duration-300",
        active ? "border-foreground bg-surface text-surface-foreground" : "border-hairline hover:border-foreground",
      )}
    >
      {children}
    </button>
  );
}
