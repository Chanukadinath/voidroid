import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartLine = {
  id: string;
  slug: string;
  name: string;
  price: number;
  size: string;
  color: string;
  image: string;
  qty: number;
};

type ShopState = {
  lines: CartLine[];
  wishlist: string[];
  cartOpen: boolean;
  coupon: string | null;
  add: (line: Omit<CartLine, "id">) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  toggleWish: (slug: string) => void;
  setCartOpen: (open: boolean) => void;
  applyCoupon: (code: string) => boolean;
};

const COUPONS: Record<string, number> = { NOCTVRNE10: 0.1, ATELIER20: 0.2 };

export const useShop = create<ShopState>()(
  persist(
    (set, get) => ({
      lines: [],
      wishlist: [],
      cartOpen: false,
      coupon: null,
      add: (line) =>
        set((s) => {
          const id = `${line.slug}-${line.size}-${line.color}`;
          const existing = s.lines.find((l) => l.id === id);
          return {
            cartOpen: true,
            lines: existing
              ? s.lines.map((l) => (l.id === id ? { ...l, qty: l.qty + line.qty } : l))
              : [...s.lines, { ...line, id }],
          };
        }),
      remove: (id) => set((s) => ({ lines: s.lines.filter((l) => l.id !== id) })),
      setQty: (id, qty) =>
        set((s) => ({
          lines: s.lines.flatMap((l) => (l.id === id ? (qty <= 0 ? [] : [{ ...l, qty }]) : [l])),
        })),
      clear: () => set({ lines: [], coupon: null }),
      toggleWish: (slug) =>
        set((s) => ({
          wishlist: s.wishlist.includes(slug) ? s.wishlist.filter((w) => w !== slug) : [...s.wishlist, slug],
        })),
      setCartOpen: (cartOpen) => set({ cartOpen }),
      applyCoupon: (code) => {
        const key = code.trim().toUpperCase();
        if (!COUPONS[key]) return false;
        set({ coupon: key });
        return true;
      },
    }),
    { name: "noctvrne-shop", partialize: (s) => ({ lines: s.lines, wishlist: s.wishlist, coupon: s.coupon }) },
  ),
);

export const discountRate = (coupon: string | null) => (coupon ? (COUPONS[coupon] ?? 0) : 0);
export const cartCount = (lines: CartLine[]) => lines.reduce((n, l) => n + l.qty, 0);
export const cartSubtotal = (lines: CartLine[]) => lines.reduce((n, l) => n + l.qty * l.price, 0);
