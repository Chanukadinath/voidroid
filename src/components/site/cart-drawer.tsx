import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, X } from "lucide-react";
import { useState } from "react";
import { cartSubtotal, discountRate, useShop } from "@/store/shop";
import { money, products } from "@/data/products";
import { EASE } from "./motion-primitives";
import { toast } from "sonner";

export function CartDrawer() {
  const { cartOpen, setCartOpen, lines, setQty, remove, coupon, applyCoupon } = useShop();
  const [code, setCode] = useState("");
  const [country, setCountry] = useState("us");

  const subtotal = cartSubtotal(lines);
  const discount = subtotal * discountRate(coupon);
  const shipping = subtotal === 0 || subtotal > 500 ? 0 : country === "us" ? 15 : 35;
  const total = subtotal - discount + shipping;
  const recommended = products.filter((p) => !lines.some((l) => l.slug === p.slug)).slice(0, 2);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-[460px] flex-col bg-background"
            aria-label="Shopping bag"
          >
            <div className="flex items-center justify-between border-b border-hairline px-6 py-5">
              <p className="eyebrow">Your bag ({lines.length})</p>
              <button type="button" aria-label="Close bag" onClick={() => setCartOpen(false)}>
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              {lines.length === 0 ? (
                <div className="py-24 text-center">
                  <p className="display text-3xl">Empty</p>
                  <p className="mt-3 text-sm text-muted-foreground">Nothing selected yet.</p>
                  <Link
                    to="/shop"
                    onClick={() => setCartOpen(false)}
                    className="mt-8 inline-block rounded-full bg-surface px-8 py-3 text-[11px] uppercase tracking-[0.25em] text-surface-foreground"
                  >
                    Shop collection
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-hairline">
                  {lines.map((l) => (
                    <motion.li key={l.id} layout exit={{ opacity: 0, x: 40 }} className="flex gap-4 py-6">
                      <img src={l.image} alt={l.name} loading="lazy" className="h-32 w-24 object-cover" />
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex justify-between gap-3">
                            <p className="text-sm">{l.name}</p>
                            <button type="button" aria-label="Remove" onClick={() => remove(l.id)}>
                              <X className="size-4 opacity-50 hover:opacity-100" />
                            </button>
                          </div>
                          <p className="eyebrow mt-1">
                            {l.color} · {l.size}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 rounded-full border border-hairline px-3 py-1.5">
                            <button type="button" aria-label="Decrease" onClick={() => setQty(l.id, l.qty - 1)}>
                              <Minus className="size-3" />
                            </button>
                            <span className="w-4 text-center text-xs tabular-nums">{l.qty}</span>
                            <button type="button" aria-label="Increase" onClick={() => setQty(l.id, l.qty + 1)}>
                              <Plus className="size-3" />
                            </button>
                          </div>
                          <span className="text-sm tabular-nums">{money(l.price * l.qty)}</span>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}

              {lines.length > 0 && (
                <div className="border-t border-hairline py-6">
                  <p className="eyebrow mb-4">You may also like</p>
                  <div className="grid grid-cols-2 gap-4">
                    {recommended.map((p) => (
                      <Link
                        key={p.id}
                        to="/product/$slug"
                        params={{ slug: p.slug }}
                        onClick={() => setCartOpen(false)}
                        className="group"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          loading="lazy"
                          className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <p className="mt-2 text-xs">{p.name}</p>
                        <p className="eyebrow mt-1">{money(p.price)}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {lines.length > 0 && (
              <div className="space-y-4 border-t border-hairline px-6 py-6">
                <div className="flex gap-2">
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Coupon code"
                    aria-label="Coupon code"
                    className="flex-1 border border-hairline bg-transparent px-4 py-3 text-xs uppercase tracking-[0.2em] outline-none focus:border-foreground"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      applyCoupon(code)
                        ? toast("Coupon applied", { description: code.toUpperCase() })
                        : toast("Invalid coupon")
                    }
                    className="border border-hairline px-5 text-[11px] uppercase tracking-[0.2em] hover:bg-accent"
                  >
                    Apply
                  </button>
                </div>

                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  aria-label="Shipping destination"
                  className="w-full border border-hairline bg-transparent px-4 py-3 text-xs uppercase tracking-[0.2em] outline-none"
                >
                  <option value="us">United States</option>
                  <option value="eu">Europe</option>
                  <option value="row">Rest of world</option>
                </select>

                <dl className="space-y-2 text-sm">
                  <Row label="Subtotal" value={money(subtotal)} />
                  {discount > 0 && <Row label={`Discount (${coupon})`} value={`− ${money(discount)}`} />}
                  <Row label="Shipping" value={shipping === 0 ? "Complimentary" : money(shipping)} />
                  <div className="flex justify-between border-t border-hairline pt-3 text-base">
                    <dt>Total</dt>
                    <dd className="tabular-nums">{money(total)}</dd>
                  </div>
                </dl>

                <Link
                  to="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="block rounded-full bg-surface py-4 text-center text-[11px] uppercase tracking-[0.28em] text-surface-foreground transition-opacity hover:opacity-85"
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <dt>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}
