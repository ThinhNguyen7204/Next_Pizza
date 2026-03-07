import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types';

// Unique key per product+size combo
const cartKey = (productId: string, sizeId: string) => `${productId}__${sizeId}`;

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, sizeId: string) => void;
  updateQuantity: (productId: string, sizeId: string, quantity: number) => void;
  toggleCart: () => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) =>
        set((state) => {
          const key = cartKey(item.productId, item.sizeId);
          const existing = state.items.find(
            (i) => cartKey(i.productId, i.sizeId) === key
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                cartKey(i.productId, i.sizeId) === key
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (productId, sizeId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => cartKey(i.productId, i.sizeId) !== cartKey(productId, sizeId)
          ),
        })),
      updateQuantity: (productId, sizeId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            cartKey(i.productId, i.sizeId) === cartKey(productId, sizeId)
              ? { ...i, quantity: Math.max(1, quantity) }
              : i
          ),
        })),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        const state = get();
        return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'pizza-cart',
      version: 2,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      migrate: (persisted: any) => {
        // Clear old cart items that don't have sizeId
        if (persisted && Array.isArray(persisted.items)) {
          persisted.items = persisted.items.filter(
            (i: CartItem) => i.sizeId && i.sizeLabel
          );
        }
        return persisted as CartStore;
      },
    }
  )
);
