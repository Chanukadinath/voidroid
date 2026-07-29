import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Check } from "lucide-react";
import { cartSubtotal, discountRate, useShop } from "@/store/shop";
import { money } from "@/data/products";
import { EASE, SplitText } from "@/components/site/motion-primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — NOCTVRNE" },
      { name: "description", content: "Complete your NOCTVRNE order: shipping, billing and payment in three steps." },
      { property: "og:title", content: "Checkout — NOCTVRNE" },
      { property: "og:description", content: "Secure three-step checkout for your NOCTVRNE order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Checkout,
});

const STEPS = ["Shipping", "Billing", "Payment"] as const;

function Checkout() {
  const { lines, coupon, clear } = useShop();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const subtotal = cartSubtotal(lines);
  const discount = subtotal * discountRate(coupon);
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 15;
  const total = subtotal - discount + shipping;

  if (done) {
    return (
      <div className="mx-auto grid min-h-screen max-w-xl place-items-center px-5 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE }}>
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-surface text-surface-foreground">
            <Check className="size-6" />
          </div>
          <h1 className="display mt-10 text-5xl">Order confirmed</h1>
          <p className="mt-5 text-sm text-muted-foreground">
            A confirmation is on its way. Your pieces leave the Milan atelier within 48 hours.
          </p>
          <Link
            to="/shop"
            className="mt-10 inline-block rounded-full bg-surface px-10 py-4 text-[11px] uppercase tracking-[0.28em] text-surface-foreground"
          >
            Continue shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1300px] px-5 pt-36 pb-32 md:px-10 md:pt-44">
      <h1 className="display text-[clamp(2.4rem,7vw,6rem)]">
        <SplitText text="Checkout" />
      </h1>

      <div className="mt-14 grid gap-16 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <ol className="mb-12 flex gap-8 border-b border-hairline pb-5">
            {STEPS.map((s, i) => (
              <li
                key={s}
                className={cn(
                  "text-[11px] uppercase tracking-[0.24em]",
                  i === step ? "text-foreground" : "text-muted-foreground",
                )}
              >
                0{i + 1} {s}
              </li>
            ))}
          </ol>

          <AnimatePresence mode="wait">
            <motion.form
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.5, ease: EASE }}
              onSubmit={(e) => {
                e.preventDefault();
                if (step < 2) setStep(step + 1);
                else {
                  clear();
                  setDone(true);
                }
              }}
              className="space-y-5"
            >
              {step === 0 && (
                <>
                  <Field label="Full name" name="name" />
                  <Field label="Email" name="email" type="email" />
                  <Field label="Address" name="address" />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="City" name="city" />
                    <Field label="Postal code" name="zip" />
                  </div>
                </>
              )}
              {step === 1 && (
                <>
                  <Field label="Billing name" name="bname" />
                  <Field label="Billing address" name="baddress" />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Country" name="country" />
                    <Field label="Phone" name="phone" />
                  </div>
                </>
              )}
              {step === 2 && (
                <>
                  <Field label="Card number" name="card" placeholder="4242 4242 4242 4242" />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Expiry" name="exp" placeholder="12 / 29" />
                    <Field label="CVC" name="cvc" placeholder="123" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Demo checkout — no payment is processed. Connect a payment provider to take live orders.
                  </p>
                </>
              )}

              <div className="flex items-center gap-4 pt-4">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="rounded-full border border-hairline px-8 py-4 text-[11px] uppercase tracking-[0.25em]"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  className="rounded-full bg-surface px-10 py-4 text-[11px] uppercase tracking-[0.28em] text-surface-foreground"
                >
                  {step === 2 ? "Place order" : "Continue"}
                </button>
              </div>
            </motion.form>
          </AnimatePresence>
        </div>

        <aside className="h-fit border-t border-hairline pt-8 lg:sticky lg:top-32">
          <p className="eyebrow mb-6">Order summary</p>
          <ul className="space-y-5">
            {lines.map((l) => (
              <li key={l.id} className="flex gap-4">
                <img src={l.image} alt={l.name} loading="lazy" className="h-24 w-18 w-[72px] object-cover" />
                <div className="flex flex-1 justify-between text-sm">
                  <div>
                    <p>{l.name}</p>
                    <p className="eyebrow mt-1">
                      {l.size} · ×{l.qty}
                    </p>
                  </div>
                  <span className="tabular-nums">{money(l.price * l.qty)}</span>
                </div>
              </li>
            ))}
            {lines.length === 0 && <li className="text-sm text-muted-foreground">Your bag is empty.</li>}
          </ul>
          <dl className="mt-8 space-y-2 border-t border-hairline pt-6 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd className="tabular-nums">{money(subtotal)}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between">
                <dt>Discount</dt>
                <dd className="tabular-nums">− {money(discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt>Shipping</dt>
              <dd>{shipping === 0 ? "Complimentary" : money(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-hairline pt-3 text-base text-foreground">
              <dt>Total</dt>
              <dd className="tabular-nums">{money(total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, name, type = "text", placeholder }: { label: string; name: string; type?: string; placeholder?: string }) {
  return (
    <div>
      <label htmlFor={name} className="eyebrow mb-2 block">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="w-full border-b border-hairline bg-transparent py-3 text-sm outline-none transition-colors focus:border-foreground"
      />
    </div>
  );
}
