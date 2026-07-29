import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Heart, Minus, Plus, Truck } from "lucide-react";
import { getProduct, money, products, type Product } from "@/data/products";
import { useShop } from "@/store/shop";
import { ProductCard } from "@/components/site/product-card";
import { Magnetic, Reveal, SplitText, EASE } from "@/components/site/motion-primitives";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Piece unavailable — NOCTVRNE" }, { name: "robots", content: "noindex" }] };
    }
    const { product } = loaderData;
    return {
      meta: [
        { title: `${product.name} — NOCTVRNE` },
        { name: "description", content: product.description.slice(0, 155) },
        { property: "og:title", content: `${product.name} — NOCTVRNE` },
        { property: "og:description", content: product.description.slice(0, 155) },
      ],
    };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center">
      <div className="text-center">
        <p className="display text-4xl">Piece not found</p>
        <Link to="/shop" className="link-underline mt-6 inline-block text-[11px] uppercase tracking-[0.25em]">
          Back to collection
        </Link>
      </div>
    </div>
  ),
});

function ProductPage() {
  const { product } = Route.useLoaderData() as { product: Product };
  const [active, setActive] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState(false);
  const add = useShop((s) => s.add);
  const wished = useShop((s) => s.wishlist.includes(product.slug));
  const toggleWish = useShop((s) => s.toggleWish);

  useEffect(() => {
    setActive(0);
    setSize(null);
    setQty(1);
    setColor(product.colors[0]);
    const seen: string[] = JSON.parse(localStorage.getItem("noctvrne-seen") ?? "[]");
    localStorage.setItem(
      "noctvrne-seen",
      JSON.stringify([product.slug, ...seen.filter((s) => s !== product.slug)].slice(0, 4)),
    );
  }, [product]);

  const related = products.filter((p) => p.id !== product.id).slice(0, 4);

  const addToBag = () => {
    if (!size) {
      toast("Select a size first");
      return;
    }
    add({ slug: product.slug, name: product.name, price: product.price, size, color, image: product.image, qty });
    toast("Added to bag", { description: `${product.name} · ${size}` });
  };

  return (
    <div className="pt-28 md:pt-32">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 md:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
        {/* Gallery */}
        <div className="space-y-3">
          <div
            className={cn("overflow-hidden bg-muted", zoom && "cursor-zoom-out")}
            onClick={() => setZoom((z) => !z)}
          >
            <motion.img
              key={active}
              src={product.gallery[active]}
              alt={product.name}
              width={1200}
              height={1600}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: zoom ? 1.6 : 1 }}
              transition={{ duration: 0.9, ease: EASE }}
              className="aspect-[3/4] w-full cursor-zoom-in object-cover"
            />
          </div>
          <div className="flex gap-3">
            {product.gallery.map((g, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`View image ${i + 1}`}
                className={cn("w-20 overflow-hidden border transition-colors", active === i ? "border-foreground" : "border-transparent opacity-60")}
              >
                <img src={g} alt="" loading="lazy" className="aspect-[3/4] w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="lg:sticky lg:top-32 lg:h-fit lg:pb-20">
          <p className="eyebrow">{product.collection}</p>
          <h1 className="display mt-4 text-[clamp(2.2rem,4.5vw,4rem)]">
            <SplitText text={product.name} />
          </h1>
          <p className="mt-5 text-lg tabular-nums">{money(product.price)}</p>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="mt-10 space-y-8">
            <div>
              <p className="eyebrow mb-3">Colour — {color}</p>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.18em]",
                      color === c ? "border-foreground" : "border-hairline",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="eyebrow">Size</p>
                <Dialog>
                  <DialogTrigger className="eyebrow link-underline">Size guide</DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="display text-2xl">Size guide</DialogTitle>
                    </DialogHeader>
                    <table className="w-full text-left text-sm">
                      <thead className="eyebrow">
                        <tr>
                          <th className="py-2">Size</th>
                          <th>Chest</th>
                          <th>Length</th>
                        </tr>
                      </thead>
                      <tbody className="text-muted-foreground">
                        {[
                          ["XS", "104 cm", "68 cm"],
                          ["S", "110 cm", "70 cm"],
                          ["M", "116 cm", "72 cm"],
                          ["L", "122 cm", "74 cm"],
                          ["XL", "128 cm", "76 cm"],
                        ].map((r) => (
                          <tr key={r[0]} className="border-t border-hairline">
                            <td className="py-2">{r[0]}</td>
                            <td>{r[1]}</td>
                            <td>{r[2]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={cn(
                      "min-w-14 rounded-full border px-4 py-3 text-[10px] uppercase tracking-[0.18em] transition-colors",
                      size === s ? "border-foreground bg-surface text-surface-foreground" : "border-hairline hover:border-foreground",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 rounded-full border border-hairline px-5 py-3">
                <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  <Minus className="size-3.5" />
                </button>
                <span className="w-5 text-center text-sm tabular-nums">{qty}</span>
                <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)}>
                  <Plus className="size-3.5" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => toggleWish(product.slug)}
                aria-label="Add to wishlist"
                className="grid size-12 place-items-center rounded-full border border-hairline transition-transform duration-500 hover:scale-105"
              >
                <Heart className={cn("size-4", wished && "fill-current")} />
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              <Magnetic>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={addToBag}
                  className="rounded-full bg-surface px-12 py-5 text-[11px] uppercase tracking-[0.28em] text-surface-foreground"
                >
                  Add to bag
                </motion.button>
              </Magnetic>
              <Link
                to="/checkout"
                onClick={addToBag}
                className="rounded-full border border-hairline px-12 py-5 text-[11px] uppercase tracking-[0.28em] hover:bg-accent"
              >
                Buy now
              </Link>
            </div>

            <p className="flex items-center gap-3 text-xs text-muted-foreground">
              <Truck className="size-4" /> Complimentary express shipping over $500 · 30-day returns
            </p>

            <Accordion type="single" collapsible className="border-t border-hairline">
              <AccordionItem value="fabric">
                <AccordionTrigger className="text-xs uppercase tracking-[0.22em]">Fabric & care</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {product.fabric}. Wash cold, dry flat, do not tumble. Press on low with a cloth.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="ship">
                <AccordionTrigger className="text-xs uppercase tracking-[0.22em]">Shipping & returns</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  Dispatched within 48 hours from Milan. Express worldwide, duties prepaid. Returns accepted within 30
                  days of delivery, unworn with tags intact.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="reviews">
                <AccordionTrigger className="text-xs uppercase tracking-[0.22em]">Reviews (24)</AccordionTrigger>
                <AccordionContent className="space-y-5 text-sm text-muted-foreground">
                  <p>“Weighty, sculptural, and the colour hasn't shifted after a year.” — Client, Berlin</p>
                  <p>“Sizing runs generous by design. I took my usual and love the volume.” — Client, Seoul</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
        <Reveal>
          <h2 className="display mb-14 border-b border-hairline pb-6 text-[clamp(1.8rem,4vw,3.5rem)]">
            You may also like
          </h2>
        </Reveal>
        <div className="grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
