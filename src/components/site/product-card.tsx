import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { money, type Product } from "@/data/products";
import { useShop } from "@/store/shop";
import { Magnetic, EASE } from "./motion-primitives";
import { toast } from "sonner";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [hover, setHover] = useState(false);
  const add = useShop((s) => s.add);
  const wished = useShop((s) => s.wishlist.includes(product.slug));
  const toggleWish = useShop((s) => s.toggleWish);

  return (
    <motion.article
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.9, delay: (index % 4) * 0.08, ease: EASE }}
      className="group relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="block overflow-hidden bg-muted"
        aria-label={product.name}
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          <motion.img
            src={product.image}
            alt={product.name}
            width={1200}
            height={1600}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            animate={{ scale: hover ? 1.08 : 1, opacity: hover ? 0 : 1 }}
            transition={{ duration: 0.9, ease: EASE }}
          />
          <motion.img
            src={product.hoverImage}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            animate={{ scale: hover ? 1.04 : 1.12, opacity: hover ? 1 : 0 }}
            transition={{ duration: 0.9, ease: EASE }}
          />
          {product.tags.includes("limited") && (
            <span className="eyebrow absolute left-4 top-4 bg-background/85 px-2 py-1 text-foreground backdrop-blur">
              Limited
            </span>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleWish(product.slug);
            }}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute right-3 top-3 grid size-10 place-items-center rounded-full glass transition-transform duration-500 hover:scale-110"
          >
            <Heart className={cn("size-4", wished && "fill-current")} />
          </button>

          <motion.div
            className="absolute inset-x-3 bottom-3 flex gap-2"
            initial={false}
            animate={{ opacity: hover ? 1 : 0, y: hover ? 0 : 16 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                add({
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  size: product.sizes[Math.floor(product.sizes.length / 2)],
                  color: product.colors[0],
                  image: product.image,
                  qty: 1,
                });
                toast("Added to bag", { description: product.name });
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-surface px-4 py-3 text-[11px] uppercase tracking-[0.2em] text-surface-foreground transition-opacity hover:opacity-85"
            >
              <ShoppingBag className="size-3.5" /> Add to bag
            </button>
            <span className="grid place-items-center rounded-full glass px-4 text-[11px] uppercase tracking-[0.2em]">
              Quick view
            </span>
          </motion.div>
        </div>
      </Link>

      <div className="flex items-baseline justify-between gap-4 pt-4">
        <div>
          <Link to="/product/$slug" params={{ slug: product.slug }} className="link-underline text-sm">
            {product.name}
          </Link>
          <p className="eyebrow mt-1">{product.collection}</p>
        </div>
        <span className="text-sm tabular-nums">{money(product.price)}</span>
      </div>
    </motion.article>
  );
}

export function MagneticButton({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Magnetic>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "rounded-full bg-surface px-9 py-4 text-[11px] uppercase tracking-[0.28em] text-surface-foreground transition-opacity duration-500 hover:opacity-85",
          className,
        )}
      >
        {children}
      </button>
    </Magnetic>
  );
}
