import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Heart, Menu, Moon, Search, ShoppingBag, Sun, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { cartCount, useShop } from "@/store/shop";
import { EASE } from "./motion-primitives";

const MEGA = [
  {
    label: "Men",
    to: "/shop",
    search: { category: "men" as const },
    groups: [
      { title: "Ready to wear", items: ["Outerwear", "Knitwear", "Trousers", "Tees"] },
      { title: "Chapter IV", items: ["Monolith", "Column", "Shadow"] },
    ],
  },
  {
    label: "Women",
    to: "/shop",
    search: { category: "women" as const },
    groups: [
      { title: "Ready to wear", items: ["Coats", "Knitwear", "Tailoring", "Tees"] },
      { title: "Limited", items: ["Nocturne", "Cathedral"] },
    ],
  },
  {
    label: "Collections",
    to: "/shop",
    search: { category: "all" as const },
    groups: [
      { title: "Archive", items: ["Chapter IV", "Core", "Limited Edition"] },
      { title: "Editorial", items: ["Campaign film", "Atelier notes"] },
    ],
  },
];

export function SiteNav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [dark, setDark] = useState(true);
  const { scrollY } = useScroll();
  const count = useShop((s) => cartCount(s.lines));
  const wishCount = useShop((s) => s.wishlist.length);
  const setCartOpen = useShop((s) => s.setCartOpen);

  useMotionValueEvent(scrollY, "change", (v) => setSolid(v > 40));

  useEffect(() => {
    const stored = localStorage.getItem("noctvrne-theme");
    const isDark = stored ? stored === "dark" : true;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("noctvrne-theme", next ? "dark" : "light");
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,padding] duration-700",
        solid ? "glass hairline-b py-3" : "border-b border-transparent py-6",
      )}
      onMouseLeave={() => setOpen(null)}
    >
      <nav className="mx-auto grid max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center gap-6 px-5 md:px-10">
        <ul className="hidden items-center gap-8 text-[11px] uppercase tracking-[0.24em] lg:flex">
          {MEGA.map((m) => (
            <li key={m.label} onMouseEnter={() => setOpen(m.label)}>
              <Link to={m.to} search={m.search} className="link-underline py-2">
                {m.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="lg:hidden"
          aria-label="Open menu"
          onClick={() => setMobile(true)}
        >
          <Menu className="size-5" />
        </button>

        <Link to="/" className="display col-start-2 text-center text-xl md:text-2xl" aria-label="NOCTVRNE home">
          Noctvrne
        </Link>

        <div className="col-start-3 flex items-center justify-end gap-4 md:gap-5">
          <button type="button" aria-label="Search" className="hidden transition-opacity hover:opacity-60 sm:block">
            <Search className="size-[18px]" />
          </button>
          <Link to="/account" aria-label="Wishlist" className="relative hidden transition-opacity hover:opacity-60 sm:block">
            <Heart className="size-[18px]" />
            {wishCount > 0 && <Badge n={wishCount} />}
          </Link>
          <button type="button" aria-label="Toggle theme" onClick={toggleTheme} className="transition-opacity hover:opacity-60">
            {dark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
          </button>
          <Link to="/account" aria-label="Account" className="hidden transition-opacity hover:opacity-60 sm:block">
            <User className="size-[18px]" />
          </Link>
          <button
            type="button"
            aria-label="Open bag"
            onClick={() => setCartOpen(true)}
            className="relative transition-opacity hover:opacity-60"
          >
            <ShoppingBag className="size-[18px]" />
            {count > 0 && <Badge n={count} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            key={open}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="hidden overflow-hidden lg:block"
          >
            <div className="glass mt-3 hairline-b">
              <div className="mx-auto grid max-w-[1600px] grid-cols-4 gap-10 px-10 py-12">
                {MEGA.find((m) => m.label === open)?.groups.map((g) => (
                  <div key={g.title}>
                    <p className="eyebrow mb-5">{g.title}</p>
                    <ul className="space-y-3">
                      {g.items.map((i) => (
                        <li key={i}>
                          <Link to="/shop" className="link-underline text-lg">
                            {i}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="col-span-2">
                  <p className="eyebrow mb-5">Featured</p>
                  <p className="display text-4xl">Chapter IV</p>
                  <p className="mt-4 max-w-sm text-sm text-muted-foreground">
                    Winter tailoring in dry wool and heavyweight fleece. Ninety pieces per style, numbered.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background lg:hidden"
          >
            <div className="flex items-center justify-between px-5 py-6">
              <span className="display text-xl">Noctvrne</span>
              <button type="button" aria-label="Close menu" onClick={() => setMobile(false)}>
                <X className="size-5" />
              </button>
            </div>
            <ul className="px-5 pt-8">
              {[...MEGA.map((m) => ({ label: m.label, to: "/shop" })), { label: "Account", to: "/account" }].map(
                (item, i) => (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 * i, duration: 0.6, ease: EASE }}
                    className="border-b border-hairline py-5"
                  >
                    <Link to={item.to} onClick={() => setMobile(false)} className="display text-4xl">
                      {item.label}
                    </Link>
                  </motion.li>
                ),
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Badge({ n }: { n: number }) {
  return (
    <span className="absolute -right-2 -top-2 grid size-4 place-items-center rounded-full bg-surface text-[9px] tabular-nums text-surface-foreground">
      {n}
    </span>
  );
}
