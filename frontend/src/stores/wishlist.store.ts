import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, WishlistItem } from '../../../shared/types';
import { WishlistService } from '../services/wishlist.service';

interface LocalWishlistItem {
  id: string;
  productId: string;
  product: Product;
  createdAt: Date;
}

interface WishlistState {
  items: LocalWishlistItem[];
  loading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addItem: (product: Product, token?: string) => Promise<void>;
  removeItem: (productId: string, token?: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  loadWishlist: (token?: string) => Promise<void>;
  syncWithBackend: (token: string) => Promise<void>;
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

      addItem: async (product: Product, token?: string) => {
        try {
          set({ loading: true, error: null });
          
          if (token) {
            // Backend sync
            const backendItem = await WishlistService.addToWishlist(token, product.id);
            const newItem: LocalWishlistItem = {
              id: backendItem.id,
              productId: backendItem.productId,
              product: backendItem.product,
              createdAt: new Date(backendItem.createdAt),
            };
            
            set((state) => ({
              items: [...state.items, newItem],
            }));
          } else {
            // Local only
            set((state) => {
              if (state.items.some(item => item.productId === product.id)) {
                return state; // Already exists
              }

              const newItem: LocalWishlistItem = {
                id: `wishlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                productId: product.id,
                product,
                createdAt: new Date(),
              };

              return {
                items: [...state.items, newItem],
              };
            });
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to add item to wishlist' });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      removeItem: async (productId: string, token?: string) => {
        try {
          set({ loading: true, error: null });
          
          if (token) {
            // Backend sync
            await WishlistService.removeFromWishlist(token, productId);
          }
          
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

      loadWishlist: async (token?: string) => {
        try {
          set({ loading: true, error: null });
          
          if (token) {
            // Load from backend
            const backendWishlist = await WishlistService.getWishlist(token);
            const items: LocalWishlistItem[] = backendWishlist.items.map(item => ({
              id: item.id,
              productId: item.productId,
              product: item.product,
              createdAt: new Date(item.createdAt),
            }));
            set({ items });
          } else {
            // Load from localStorage (already handled by Zustand persist)
            // Just set loading to false
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to load wishlist' });
          console.error('Failed to load wishlist:', error);
        } finally {
          set({ loading: false });
        }
      },

      syncWithBackend: async (token: string) => {
        try {
          set({ loading: true, error: null });
          
          // Load from backend and replace local items
          const backendWishlist = await WishlistService.getWishlist(token);
          const items: LocalWishlistItem[] = backendWishlist.items.map(item => ({
            id: item.id,
            productId: item.productId,
            product: item.product,
            createdAt: new Date(item.createdAt),
          }));
          set({ items });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to sync wishlist with backend' });
          console.error('Failed to sync wishlist with backend:', error);
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
