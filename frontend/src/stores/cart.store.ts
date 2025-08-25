import { create } from 'zustand';
import { CartItem, Cart, AddToCartData, UpdateCartItemData, CartState } from '../../../shared/types/cart';
import { CartService } from '../services/cart.service';

const GUEST_CART_KEY = 'guest_cart';

function isClient() {
  return typeof window !== 'undefined';
}

function readGuestCart(): Cart {
  if (!isClient()) return { items: [], total: 0, itemCount: 0 };
  try {
    const raw = window.localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return { items: [], total: 0, itemCount: 0 };
    const parsed = JSON.parse(raw) as Cart;
    if (!parsed || !Array.isArray(parsed.items)) return { items: [], total: 0, itemCount: 0 };
    return parsed;
  } catch {
    return { items: [], total: 0, itemCount: 0 };
  }
}

function writeGuestCart(cart: Cart) {
  if (!isClient()) return;
  window.localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
}

function computeCartTotals(items: CartItem[]) {
  const total = items.reduce((sum, item) => {
    const price = item.product.discountPrice || item.product.price;
    return sum + (price * item.quantity);
  }, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, itemCount };
}

export const useCartStore = create<CartState>()((set, get) => ({
  // Initial state
  items: [],
  total: 0,
  itemCount: 0,
  loading: false,
  error: null,

  // Actions
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  resetCart: () => set({ items: [], total: 0, itemCount: 0, error: null }),

  // Initialize store with guest cart data (call this when store is first used)
  initializeGuestCart: () => {
    if (isClient()) {
      const guestCart = readGuestCart();
      console.debug('[cart.store] initializeGuestCart', guestCart);
      set(guestCart);
    }
  },

  addItem: async (data: AddToCartData, token?: string) => {
    try {
      set({ loading: true, error: null });
      
      if (!token) {
        // Guest cart: localStorage'a yaz
        console.debug('[cart.store] addItem guest flow', data);
        const current = readGuestCart();
        const existingIndex = current.items.findIndex(i => i.productId === data.productId);
        if (existingIndex >= 0) {
          const updatedItems = [...current.items];
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: updatedItems[existingIndex].quantity + data.quantity,
            updatedAt: new Date() as any,
          };
          const { total, itemCount } = computeCartTotals(updatedItems);
          const nextCart: Cart = { items: updatedItems, total, itemCount };
          writeGuestCart(nextCart);
          console.debug('[cart.store] addItem guest updated existing item', nextCart);
          set(nextCart);
        } else {
          // Fetch product details so UI shows correct name/price in guest cart
          const product = await (await import('../services/product.service')).ProductService.getProduct(data.productId);
          const guestItem: CartItem = {
            id: `guest_${Date.now()}_${Math.random()}`,
            productId: data.productId,
            quantity: data.quantity,
            designData: data.designData,
            product: {
              id: product.id,
              name: product.name,
              description: product.description,
              price: product.price,
              discountPrice: product.discountPrice,
              discountPercentage: product.discountPercentage,
              images: product.images || [],
              category: product.category || { id: '', name: '', slug: '' },
              stockQuantity: product.stockQuantity,
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          } as any;
          const updatedItems = [...current.items, guestItem];
          const { total, itemCount } = computeCartTotals(updatedItems);
          const nextCart: Cart = { items: updatedItems, total, itemCount };
          writeGuestCart(nextCart);
          console.debug('[cart.store] addItem guest added new item', nextCart);
          set(nextCart);
        }
        return;
      }
      
      // Backend'e sepet öğesi ekle (service katmanı)
      const cartItem = await CartService.addToCart(token, data);
      
      // Local state'i güncelle
      set((state) => {
        const existingItemIndex = state.items.findIndex(
          item => item.productId === data.productId
        );

        if (existingItemIndex >= 0) {
          // Update existing item
          const updatedItems = [...state.items];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + data.quantity
          };
          
          const total = updatedItems.reduce((sum, item) => {
            const price = item.product.discountPrice || item.product.price;
            return sum + (price * item.quantity);
          }, 0);
          
          const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
          
          return {
            items: updatedItems,
            total,
            itemCount,
          };
        } else {
          // Add new item
          const updatedItems = [...state.items, cartItem];
          
          const total = updatedItems.reduce((sum, item) => {
            const price = item.product.discountPrice || item.product.price;
            return sum + (price * item.quantity);
          }, 0);
          
          const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
          
          return {
            items: updatedItems,
            total,
            itemCount,
          };
        }
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to add item to cart' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateItem: async (itemId: string, data: UpdateCartItemData, token?: string) => {
    try {
      set({ loading: true, error: null });
      
      if (!token) {
        // Guest cart update
        console.debug('[cart.store] updateItem guest flow', { itemId, data });
        const current = readGuestCart();
        const updatedItems = current.items.map(i => i.id === itemId ? { ...i, quantity: data.quantity, updatedAt: new Date() as any } : i);
        const { total, itemCount } = computeCartTotals(updatedItems);
        const nextCart: Cart = { items: updatedItems, total, itemCount };
        writeGuestCart(nextCart);
        console.debug('[cart.store] updateItem guest result', nextCart);
        set(nextCart);
        return;
      }
      
      // Backend'de sepet öğesini güncelle (service katmanı)
      const updatedCartItem = await CartService.updateCartItem(token, itemId, data);
      
      // Local state'i güncelle
      set((state) => {
        const updatedItems = state.items.map(item =>
          item.id === itemId ? { ...item, ...updatedCartItem, updatedAt: new Date() } : item
        );
        
        const total = updatedItems.reduce((sum, item) => {
          const price = item.product.discountPrice || item.product.price;
          return sum + (price * item.quantity);
        }, 0);
        
        const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        
        return {
          items: updatedItems,
          total,
          itemCount,
        };
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update cart item' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  removeItem: async (itemId: string, token?: string) => {
    try {
      set({ loading: true, error: null });
      
      if (!token) {
        // Guest cart remove
        console.debug('[cart.store] removeItem guest flow', { itemId });
        const current = readGuestCart();
        const updatedItems = current.items.filter(i => i.id !== itemId);
        const { total, itemCount } = computeCartTotals(updatedItems);
        const nextCart: Cart = { items: updatedItems, total, itemCount };
        writeGuestCart(nextCart);
        console.debug('[cart.store] removeItem guest result', nextCart);
        set(nextCart);
        return;
      }
      
      // Backend'den sepet öğesini sil (service katmanı)
      await CartService.removeFromCart(token, itemId);
      
      // Local state'i güncelle
      set((state) => {
        const updatedItems = state.items.filter(item => item.id !== itemId);
        
        const total = updatedItems.reduce((sum, item) => {
          const price = item.product.discountPrice || item.product.price;
          return sum + (price * item.quantity);
        }, 0);
        
        const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        
        return {
          items: updatedItems,
          total,
          itemCount,
        };
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to remove item from cart' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  clearCart: async (token?: string) => {
    try {
      set({ loading: true, error: null });
      
      if (!token) {
        // Guest cart clear
        console.debug('[cart.store] clearCart guest flow');
        writeGuestCart({ items: [], total: 0, itemCount: 0 });
        set({ items: [], total: 0, itemCount: 0 });
        return;
      }
      
      // Backend'de sepeti temizle (service katmanı)
      await CartService.clearCart(token);
      
      // Local state'i temizle
      set({
        items: [],
        total: 0,
        itemCount: 0,
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to clear cart' });
      console.error('Failed to clear cart:', error);
    } finally {
      set({ loading: false });
    }
  },

  loadCart: async (token?: string) => {
    try {
      set({ loading: true, error: null });
      
      if (!token) {
        // Misafir: localStorage'dan yükle
        console.debug('[cart.store] loadCart guest flow');
        const guestCart = readGuestCart();
        set(guestCart);
        return;
      }
      
      // Backend'den sepeti yükle (service katmanı)
      let cartResponse: Cart | CartItem[] | undefined;
      try {
        cartResponse = await CartService.getCart(token);
      } catch (err: any) {
        const message = err?.message || '';
        if (message.includes('401') || message.toLowerCase().includes('unauthorized')) {
          // Yetkisiz ise sepeti boşalt
          set({ items: [], total: 0, itemCount: 0 });
          return;
        }
        throw err;
      }
      
      // Debug: Backend'den gelen veriyi logla
      console.log('Backend cart response:', cartResponse);
      console.log('Response type:', typeof cartResponse);
      console.log('Is array:', Array.isArray(cartResponse));
      
      // Backend'den gelen response formatını kontrol et
      let cartItems: CartItem[];
      let total: number;
      let itemCount: number;
      
      if (Array.isArray(cartResponse)) {
        // Eski format: direkt array
        cartItems = cartResponse;
        total = cartItems.reduce((sum: number, item: CartItem) => {
          const price = item.product.discountPrice || item.product.price;
          return sum + (price * item.quantity);
        }, 0);
        itemCount = cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
      } else if (cartResponse && typeof cartResponse === 'object' && (cartResponse as any).items) {
        // Yeni format: { items, total, itemCount }
        const obj = cartResponse as unknown as Cart;
        cartItems = obj.items;
        total = obj.total || 0;
        itemCount = obj.itemCount || 0;
      } else {
        console.error('Invalid cart data received:', cartResponse);
        set({ error: 'Invalid cart data received from server' });
        return;
      }
      
      // Veri tipi kontrolü ekle
      if (!Array.isArray(cartItems)) {
        console.error('Invalid cart items data:', cartItems);
        set({ error: 'Invalid cart items data received from server' });
        return;
      }
      
      set({
        items: cartItems,
        total,
        itemCount,
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load cart' });
      console.error('Failed to load cart:', error);
    } finally {
      set({ loading: false });
    }
  },
  // Merge guest cart to user cart after sign-in
  mergeGuestCartToUser: async (token: string) => {
    const guest = readGuestCart();
    console.debug('[cart.store] mergeGuestCartToUser start', guest);
    if (!guest.items.length) return;
    for (const item of guest.items) {
      try {
        console.debug('[cart.store] merge POST /cart item', { productId: item.productId, quantity: item.quantity });
        await CartService.addToCart(token, { productId: item.productId, quantity: item.quantity, designData: item.designData });
        console.debug('[cart.store] merge success for', { productId: item.productId });
      } catch (e) {
        console.warn('Guest merge failed for item', item.productId, e);
        // continue with other items
      }
    }
    // Clean guest cart and refresh from server
    writeGuestCart({ items: [], total: 0, itemCount: 0 });
    console.debug('[cart.store] merge complete, guest cart cleared');
    // Refresh cart from server
    set({ items: [], total: 0, itemCount: 0 });
  },
}));

// Helper functions
export const getCartItemCount = () => useCartStore.getState().itemCount;
export const getCartTotal = () => useCartStore.getState().total;
export const getCartItems = () => useCartStore.getState().items;
export const isCartLoading = () => useCartStore.getState().loading;
export const getCartError = () => useCartStore.getState().error;
