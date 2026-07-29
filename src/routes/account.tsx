import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { products, money } from "@/data/products";
import { useShop } from "@/store/shop";
import { SplitText, EASE } from "@/components/site/motion-primitives";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Account — NOCTVRNE" },
      { name: "description", content: "Sign in to your NOCTVRNE account to track orders, saved pieces and addresses." },
      { property: "og:title", content: "Account — NOCTVRNE" },
      { property: "og:description", content: "Orders, wishlist, addresses and profile for NOCTVRNE clients." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Account,
});

const TABS = ["Orders", "Wishlist", "Addresses", "Profile"] as const;

function Account() {
  const [authed, setAuthed] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [tab, setTab] = useState<(typeof TABS)[number]>("Orders");
  const wishlist = useShop((s) => s.wishlist);
  const wished = products.filter((p) => wishlist.includes(p.slug));

  if (!authed) {
    return (
      <div className="mx-auto max-w-md px-5 pt-40 pb-32">
        <h1 className="display text-5xl">
          <SplitText text={mode === "login" ? "Sign in" : "Register"} />
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setAuthed(true);
            toast("Welcome back", { description: "Demo session — connect a backend for real accounts." });
          }}
          className="mt-12 space-y-6"
        >
          {mode === "register" && <Field label="Full name" name="name" />}
          <Field label="Email" name="email" type="email" />
          <Field label="Password" name="password" type="password" />
          <button
            type="submit"
            className="w-full rounded-full bg-surface py-4 text-[11px] uppercase tracking-[0.28em] text-surface-foreground"
          >
            {mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="link-underline mt-8 text-[11px] uppercase tracking-[0.24em] text-muted-foreground"
        >
          {mode === "login" ? "Create an account" : "I already have an account"}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1300px] px-5 pt-36 pb-32 md:px-10 md:pt-44">
      <h1 className="display text-[clamp(2.4rem,7vw,6rem)]">
        <SplitText text="Account" />
      </h1>

      <div className="mt-14 grid gap-14 lg:grid-cols-[200px_1fr]">
        <nav className="flex gap-3 overflow-x-auto lg:flex-col lg:gap-4">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "whitespace-nowrap text-left text-[11px] uppercase tracking-[0.24em] transition-colors",
                tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setAuthed(false)}
            className="whitespace-nowrap text-left text-[11px] uppercase tracking-[0.24em] text-muted-foreground lg:mt-8"
          >
            Sign out
          </button>
        </nav>

        <motion.div key={tab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
          {tab === "Orders" && (
            <ul className="divide-y divide-hairline border-y border-hairline">
              {[
                ["NX-10428", "Delivered", "$485"],
                ["NX-10391", "In transit", "$1,290"],
              ].map(([id, status, amount]) => (
                <li key={id} className="flex items-center justify-between py-6 text-sm">
                  <span>{id}</span>
                  <span className="eyebrow">{status}</span>
                  <span className="tabular-nums">{amount}</span>
                </li>
              ))}
            </ul>
          )}

          {tab === "Wishlist" &&
            (wished.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nothing saved yet.{" "}
                <Link to="/shop" className="link-underline text-foreground">
                  Browse the collection
                </Link>
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-3">
                {wished.map((p) => (
                  <Link key={p.id} to="/product/$slug" params={{ slug: p.slug }} className="group">
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-3 text-sm">{p.name}</p>
                    <p className="eyebrow mt-1">{money(p.price)}</p>
                  </Link>
                ))}
              </div>
            ))}

          {tab === "Addresses" && (
            <div className="grid gap-6 sm:grid-cols-2">
              {["Default — Home", "Studio"].map((t) => (
                <div key={t} className="border border-hairline p-6 text-sm">
                  <p className="eyebrow mb-3">{t}</p>
                  <p className="text-muted-foreground">14 Via Tortona, 20144 Milan, Italy</p>
                </div>
              ))}
            </div>
          )}

          {tab === "Profile" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast("Profile saved");
              }}
              className="max-w-md space-y-6"
            >
              <Field label="Full name" name="pname" />
              <Field label="Email" name="pemail" type="email" />
              <button
                type="submit"
                className="rounded-full bg-surface px-10 py-4 text-[11px] uppercase tracking-[0.28em] text-surface-foreground"
              >
                Save
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
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
        className="w-full border-b border-hairline bg-transparent py-3 text-sm outline-none transition-colors focus:border-foreground"
      />
    </div>
  );
}
