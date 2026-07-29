import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { ArrowUpRight, Star } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import menImg from "@/assets/men.jpg";
import womenImg from "@/assets/women.jpg";
import storyImg from "@/assets/story.jpg";
import campaignImg from "@/assets/campaign.jpg";
import { products, money } from "@/data/products";
import { ProductCard } from "@/components/site/product-card";
import { Magnetic, ParallaxImage, Reveal, SplitText, EASE } from "@/components/site/motion-primitives";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NOCTVRNE — Luxury Streetwear, Chapter IV" },
      {
        name: "description",
        content:
          "Cinematic luxury streetwear from the NOCTVRNE atelier. Heavyweight fleece, dry wool tailoring and numbered limited editions in monochrome.",
      },
      { property: "og:title", content: "NOCTVRNE — Luxury Streetwear, Chapter IV" },
      {
        property: "og:description",
        content: "Limited-chapter luxury streetwear in monochrome. Shop Chapter IV.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <NewCollection />
      <FeaturedProducts />
      <GenderSplit />
      <BestSellers />
      <LimitedEdition />
      <BrandStory />
      <CampaignFilm />
      <InstagramGallery />
      <Reviews />
      <Newsletter />
    </>
  );
}

/* 1. HERO */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-[100svh] overflow-hidden bg-black">
      <motion.img
        src={heroImg}
        alt="Model wearing the Monolith hooded sweat in a concrete hall"
        width={1920}
        height={1280}
        fetchPriority="high"
        style={{ scale, y }}
        className="absolute inset-0 h-full w-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/80" />

      <motion.div style={{ opacity: fade }} className="relative flex h-full flex-col justify-end px-5 pb-24 md:px-10 md:pb-20">
        <p className="eyebrow mb-6 text-white/70">Chapter IV — Winter 2026</p>
        <h1 className="display max-w-[16ch] text-[clamp(3.2rem,11vw,11rem)] text-white">
          <SplitText text="Silence" delay={0.15} />
          <br />
          <SplitText text="in motion" delay={0.35} />
        </h1>
        <div className="mt-10 flex flex-wrap items-end justify-between gap-8">
          <p className="max-w-sm text-sm leading-relaxed text-white/70">
            Ninety pieces per silhouette. Cut in dry Italian wool and 620gsm fleece, finished by hand in Milan.
          </p>
          <Magnetic>
            <Link
              to="/shop"
              className="group inline-flex items-center gap-3 rounded-full bg-white px-10 py-5 text-[11px] uppercase tracking-[0.3em] text-black transition-opacity duration-500 hover:opacity-85"
            >
              Shop collection
              <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </Magnetic>
        </div>
      </motion.div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <div className="mx-auto h-14 w-px overflow-hidden bg-white/25">
          <span className="scroll-hint block h-full w-px bg-white" />
        </div>
        <span className="eyebrow mt-3 block text-white/60">Scroll</span>
      </div>
    </section>
  );
}

/* 2. NEW COLLECTION */
function NewCollection() {
  return (
    <section className="bg-background py-28 md:py-40">
      <div className="overflow-hidden border-y border-hairline py-6">
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <span key={k} className="flex shrink-0 text-[11px] uppercase tracking-[0.4em] text-muted-foreground">
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className="px-8">
                  New arrivals · Chapter IV · Numbered editions ·
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-5 pt-24 md:px-10">
        <div className="grid gap-14 md:grid-cols-2 md:items-end">
          <h2 className="display text-[clamp(2.6rem,7vw,7rem)]">
            <SplitText text="The new" />
            <br />
            <SplitText text="collection" delay={0.1} />
          </h2>
          <Reveal className="md:pb-4" delay={0.2}>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Chapter IV studies weight — how a garment falls when nothing is left to remove. Six silhouettes,
              released once, never restocked.
            </p>
            <Link to="/shop" className="link-underline mt-8 inline-block text-[11px] uppercase tracking-[0.28em]">
              View all pieces
            </Link>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-4 md:grid-cols-3 md:gap-6">
          <ParallaxImage
            src={menImg}
            alt="Editorial portrait in heavyweight tee"
            className="aspect-[3/4] md:aspect-[3/4.4]"
            width={1200}
            height={1600}
          />
          <ParallaxImage
            src={campaignImg}
            alt="Group campaign still in a concrete structure"
            className="aspect-[3/4] md:aspect-[3/4.4] md:translate-y-12"
            width={1920}
            height={1088}
            strength={120}
          />
          <ParallaxImage
            src={womenImg}
            alt="Model walking in a long wool coat"
            className="aspect-[3/4] md:aspect-[3/4.4]"
            width={1200}
            height={1600}
          />
        </div>
      </div>
    </section>
  );
}

/* 3. FEATURED PRODUCTS */
function FeaturedProducts() {
  const featured = products.filter((p) => p.tags.includes("featured"));
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
      <div className="mb-16 flex items-end justify-between gap-8 border-b border-hairline pb-8">
        <h2 className="display text-[clamp(2rem,5vw,4.5rem)]">Featured</h2>
        <p className="eyebrow">04 pieces</p>
      </div>
      <div className="grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}

/* 4 + 5. MEN / WOMEN */
function GenderSplit() {
  const panels = [
    { label: "Men", img: menImg, copy: "Structured volume, softened.", w: 1200, h: 1600 },
    { label: "Women", img: womenImg, copy: "Tailoring drawn in one line.", w: 1200, h: 1600 },
  ];
  return (
    <section className="grid md:grid-cols-2">
      {panels.map((p) => (
        <Link
          key={p.label}
          to="/shop"
          className="group relative h-[80svh] overflow-hidden md:h-[110svh]"
          aria-label={`${p.label}'s collection`}
        >
          <ParallaxImage
            src={p.img}
            alt={`${p.label}'s collection`}
            className="absolute inset-0 h-full w-full"
            imgClassName="transition-[filter] duration-1000 group-hover:brightness-110"
            width={p.w}
            height={p.h}
            strength={100}
          />
          <div className="absolute inset-0 bg-black/35 transition-colors duration-1000 group-hover:bg-black/20" />
          <div className="absolute inset-x-0 bottom-0 p-8 md:p-14">
            <h2 className="display text-[clamp(3rem,9vw,8rem)] text-white">
              <SplitText text={p.label} />
            </h2>
            <p className="mt-4 max-w-xs text-sm text-white/70">{p.copy}</p>
            <span className="eyebrow mt-8 inline-flex items-center gap-2 text-white">
              Explore <ArrowUpRight className="size-3.5" />
            </span>
          </div>
        </Link>
      ))}
    </section>
  );
}

/* 6. BEST SELLERS */
function BestSellers() {
  const best = products.filter((p) => p.tags.includes("best"));
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
      <div className="mb-16 flex items-end justify-between gap-8 border-b border-hairline pb-8">
        <h2 className="display text-[clamp(2rem,5vw,4.5rem)]">Best sellers</h2>
        <Link to="/shop" className="link-underline text-[11px] uppercase tracking-[0.28em]">
          All
        </Link>
      </div>
      <div className="grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
        {best.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}

/* 7. LIMITED EDITION — sticky */
function LimitedEdition() {
  const limited = products.filter((p) => p.tags.includes("limited"));
  return (
    <section className="bg-surface text-surface-foreground">
      <div className="mx-auto grid max-w-[1600px] gap-16 px-5 py-28 md:grid-cols-[0.9fr_1.1fr] md:px-10 md:py-40">
        <div className="md:sticky md:top-32 md:h-fit">
          <p className="eyebrow text-surface-foreground/60">Numbered · 90 pieces</p>
          <h2 className="display mt-6 text-[clamp(2.6rem,6vw,6rem)]">
            <SplitText text="Limited" />
            <br />
            <SplitText text="edition" delay={0.1} />
          </h2>
          <p className="mt-8 max-w-sm text-sm leading-relaxed text-surface-foreground/60">
            Each limited piece is registered, numbered on the interior placket and shipped in an archival case.
            Once the run closes, the pattern is retired.
          </p>
        </div>
        <div className="space-y-6">
          {limited.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <Link
                to="/product/$slug"
                params={{ slug: p.slug }}
                className="group grid grid-cols-[120px_1fr_auto] items-center gap-6 border-b border-surface-foreground/15 pb-6"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                  />
                </div>
                <div>
                  <h3 className="display text-2xl md:text-4xl">{p.name}</h3>
                  <p className="mt-2 text-xs uppercase tracking-[0.25em] text-surface-foreground/50">{p.fabric}</p>
                </div>
                <span className="text-sm tabular-nums">{money(p.price)}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 8. BRAND STORY */
function BrandStory() {
  return (
    <section className="mx-auto grid max-w-[1600px] items-center gap-16 px-5 py-28 md:grid-cols-2 md:px-10 md:py-40">
      <ParallaxImage
        src={storyImg}
        alt="Hands cutting fabric in the atelier"
        className="aspect-[4/5]"
        width={1600}
        height={1200}
      />
      <div>
        <p className="eyebrow">The house</p>
        <h2 className="display mt-6 text-[clamp(2.2rem,5vw,5rem)]">
          <SplitText text="Made slowly," />
          <br />
          <SplitText text="worn forever" delay={0.12} />
        </h2>
        <Reveal delay={0.2}>
          <p className="mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
            NOCTVRNE began in a two-room atelier with a single pattern table. We still cut there. Every chapter is
            drawn, sampled and finished within four hundred metres of that room — a deliberate limit that keeps the
            work honest.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-8 border-t border-hairline pt-8">
            {[
              ["12", "Years"],
              ["90", "Pieces per run"],
              ["3", "Ateliers"],
            ].map(([n, l]) => (
              <div key={l}>
                <p className="display text-4xl">{n}</p>
                <p className="eyebrow mt-2">{l}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* 9. VIDEO CAMPAIGN */
function CampaignFilm() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const width = useTransform(scrollYProgress, [0, 0.5], ["78%", "100%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.25, 1]);

  return (
    <section ref={ref} className="flex h-[130svh] items-center justify-center overflow-hidden bg-background">
      <motion.div style={{ width }} className="relative aspect-[16/9] overflow-hidden">
        <motion.img
          src={campaignImg}
          alt="Campaign film still — Chapter IV"
          width={1920}
          height={1088}
          loading="lazy"
          style={{ scale }}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 grid place-items-center bg-black/35">
          <div className="text-center">
            <p className="eyebrow text-white/70">Campaign film</p>
            <h2 className="display mt-4 text-[clamp(2rem,6vw,6rem)] text-white">Chapter IV</h2>
            <Magnetic>
              <button
                type="button"
                onClick={() => toast("Film coming soon", { description: "Chapter IV premieres in September." })}
                className="mt-8 rounded-full border border-white/40 px-10 py-4 text-[11px] uppercase tracking-[0.3em] text-white backdrop-blur transition-colors duration-500 hover:bg-white hover:text-black"
              >
                Play film
              </button>
            </Magnetic>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* 10. INSTAGRAM */
function InstagramGallery() {
  const shots = [menImg, womenImg, campaignImg, storyImg, menImg, womenImg];
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-24 md:px-10">
      <div className="mb-10 flex items-end justify-between border-b border-hairline pb-6">
        <h2 className="display text-[clamp(1.8rem,4vw,3.5rem)]">@noctvrne</h2>
        <span className="eyebrow">Follow</span>
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
        {shots.map((s, i) => (
          <Reveal key={i} delay={i * 0.05} y={24}>
            <div className="aspect-square overflow-hidden">
              <img
                src={s}
                alt="Community photograph"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out hover:scale-110"
              />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* 11. REVIEWS */
const REVIEWS = [
  { name: "M. Okonjo", city: "London", text: "The hood has the weight of outerwear. Nothing else in my wardrobe hangs like it." },
  { name: "A. Beaulieu", city: "Paris", text: "Numbered, boxed, and delivered in three days. The finishing is genuinely couture-level." },
  { name: "R. Tanaka", city: "Tokyo", text: "Monochrome done with restraint. Two years in and the black hasn't shifted a shade." },
];

function Reviews() {
  return (
    <section className="border-y border-hairline bg-background py-28 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <p className="eyebrow mb-14">Client notes</p>
        <div className="grid gap-12 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.1}>
              <div className="flex h-full flex-col justify-between border-t border-hairline pt-8">
                <div>
                  <div className="mb-6 flex gap-1" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className="size-3 fill-current" />
                    ))}
                  </div>
                  <p className="text-lg leading-relaxed">{r.text}</p>
                </div>
                <p className="eyebrow mt-10">
                  {r.name} — {r.city}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 12. NEWSLETTER */
function Newsletter() {
  const [email, setEmail] = useState("");
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-28 text-center md:px-10 md:py-40">
      <h2 className="display mx-auto max-w-[14ch] text-[clamp(2.4rem,8vw,8rem)]">
        <SplitText text="Join the list" />
      </h2>
      <p className="mx-auto mt-8 max-w-md text-sm text-muted-foreground">
        Chapter releases open to the list first. No noise — four letters a year.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!email) return;
          toast("You're on the list", { description: email });
          setEmail("");
        }}
        className="mx-auto mt-12 flex max-w-md items-center gap-0 border-b border-foreground"
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className="flex-1 bg-transparent py-4 text-sm outline-none placeholder:text-muted-foreground"
        />
        <motion.button
          whileHover={{ x: 4 }}
          transition={{ duration: 0.4, ease: EASE }}
          type="submit"
          className="p-4 text-[11px] uppercase tracking-[0.28em]"
        >
          Subscribe
        </motion.button>
      </form>
    </section>
  );
}
