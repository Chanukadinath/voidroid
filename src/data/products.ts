import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";
import men from "@/assets/men.jpg";
import women from "@/assets/women.jpg";
import campaign from "@/assets/campaign.jpg";

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: "men" | "women" | "unisex";
  collection: string;
  colors: string[];
  sizes: string[];
  image: string;
  hoverImage: string;
  gallery: string[];
  tags: ("new" | "best" | "limited" | "featured")[];
  createdAt: string;
  popularity: number;
  description: string;
  fabric: string;
};

export const products: Product[] = [
  {
    id: "1",
    slug: "monolith-hooded-sweat",
    name: "Monolith Hooded Sweat",
    price: 340,
    category: "unisex",
    collection: "Chapter IV",
    colors: ["Black", "Bone"],
    sizes: ["XS", "S", "M", "L", "XL"],
    image: p1,
    hoverImage: men,
    gallery: [p1, men, campaign],
    tags: ["new", "featured", "best"],
    createdAt: "2026-07-01",
    popularity: 98,
    description:
      "A 620gsm loopback hood cut with a dropped shoulder and squared body. Garment dyed in small batches, then washed twice for a broken-in hand feel.",
    fabric: "100% long-staple organic cotton, 620gsm",
  },
  {
    id: "2",
    slug: "atelier-boxy-tee",
    name: "Atelier Boxy Tee",
    price: 145,
    category: "unisex",
    collection: "Core",
    colors: ["Bone", "Black"],
    sizes: ["XS", "S", "M", "L", "XL"],
    image: p2,
    hoverImage: men,
    gallery: [p2, men],
    tags: ["best", "featured"],
    createdAt: "2026-05-14",
    popularity: 92,
    description:
      "The house tee. Boxy through the body, weighted at 280gsm, with a ribbed collar that holds its shape past a hundred washes.",
    fabric: "100% supima cotton, 280gsm",
  },
  {
    id: "3",
    slug: "column-wide-trouser",
    name: "Column Wide Trouser",
    price: 420,
    category: "unisex",
    collection: "Chapter IV",
    colors: ["Black"],
    sizes: ["28", "30", "32", "34", "36"],
    image: p3,
    hoverImage: campaign,
    gallery: [p3, campaign],
    tags: ["new", "featured"],
    createdAt: "2026-07-10",
    popularity: 81,
    description:
      "A full-leg trouser drafted from a single pleat. Falls straight from the hip in dry Italian wool with an internal drawcord.",
    fabric: "Italian virgin wool, unlined",
  },
  {
    id: "4",
    slug: "nocturne-long-overcoat",
    name: "Nocturne Long Overcoat",
    price: 1290,
    category: "women",
    collection: "Limited",
    colors: ["Charcoal", "Black"],
    sizes: ["XS", "S", "M", "L"],
    image: p4,
    hoverImage: women,
    gallery: [p4, women],
    tags: ["limited", "featured"],
    createdAt: "2026-06-20",
    popularity: 88,
    description:
      "Floor-skimming double-face wool with hand-finished edges. Ninety pieces made, each numbered on the interior placket.",
    fabric: "Double-face wool cashmere blend",
  },
  {
    id: "5",
    slug: "shadow-denim-jacket",
    name: "Shadow Denim Jacket",
    price: 520,
    category: "men",
    collection: "Chapter IV",
    colors: ["Washed Black"],
    sizes: ["S", "M", "L", "XL"],
    image: p5,
    hoverImage: men,
    gallery: [p5, men],
    tags: ["new", "best"],
    createdAt: "2026-07-04",
    popularity: 76,
    description:
      "Selvedge denim overshirt, rinsed to a smoked black. Cut roomy enough to layer over knitwear without breaking the line.",
    fabric: "14oz Japanese selvedge denim",
  },
  {
    id: "6",
    slug: "cathedral-ribbed-knit",
    name: "Cathedral Ribbed Knit",
    price: 480,
    category: "women",
    collection: "Core",
    colors: ["Black", "Bone"],
    sizes: ["XS", "S", "M", "L"],
    image: p6,
    hoverImage: women,
    gallery: [p6, women],
    tags: ["best", "limited"],
    createdAt: "2026-04-02",
    popularity: 84,
    description:
      "Heavy-gauge rib knitted on vintage machines in Northern Italy. Dense, sculptural, and built to hold a silhouette.",
    fabric: "Merino wool, 7-gauge rib",
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
