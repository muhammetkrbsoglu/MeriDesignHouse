import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../../../shared/types/product';

interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  createdAt: Date;
}

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addItem: (product: Product) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  loadWishlist: () => Promise<void>;
}

const LOCAL_WISHLIST_KEY = 'meridesignhouse_local_wishlist';

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      loading: false,
      error: null,

      // Actions
      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: string | null) => set({ error }),

      addItem: async (product: Product) => {
        try {
          set({ loading: true, error: null });
          
          set((state) => {
            // Check if product is already in wishlist
            if (state.items.some(item => item.productId === product.id)) {
              return state; // Already exists
            }

            const newItem: WishlistItem = {
              id: `wishlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              productId: product.id,
              product,
              createdAt: new Date(),
            };

            return {
              items: [...state.items, newItem],
            };
          });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to add item to wishlist' });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      removeItem: async (productId: string) => {
        try {
          set({ loading: true, error: null });
          
          set((state) => ({
            items: state.items.filter(item => item.productId !== productId),
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to remove item from wishlist' });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      clearWishlist: async () => {
        try {
          set({ loading: true, error: null });
          
          set({
            items: [],
          });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to clear wishlist' });
          console.error('Failed to clear wishlist:', error);
        } finally {
          set({ loading: false });
        }
      },

      isInWishlist: (productId: string) => {
        return get().items.some(item => item.productId === productId);
      },

      loadWishlist: async () => {
        try {
          set({ loading: true, error: null });
          
          // Wishlist is loaded from local storage automatically by Zustand persist
          // This method is kept for future backend integration
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to load wishlist' });
          console.error('Failed to load wishlist:', error);
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: LOCAL_WISHLIST_KEY,
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);

// Helper functions
export const getWishlistItems = () => useWishlistStore.getState().items;
export const isWishlistLoading = () => useWishlistStore.getState().loading;
export const getWishlistError = () => useWishlistStore.getState().error;
export const isProductInWishlist = (productId: string) => useWishlistStore.getState().isInWishlist(productId);
