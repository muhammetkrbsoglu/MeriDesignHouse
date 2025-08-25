export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  designData?: Record<string, any>;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    discountPercentage?: number;
    images: string[];
    category: {
      id: string;
      name: string;
      slug: string;
    };
    stockQuantity: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface AddToCartData {
  productId: string;
  quantity: number;
  designData?: Record<string, any>;
}

export interface UpdateCartItemData {
  quantity: number;
  designData?: Record<string, any>;
}

export interface CartState {
  // State
  items: CartItem[];
  total: number;
  itemCount: number;
  loading: boolean;
  error: string | null;
  
  // Actions
  addItem: (data: AddToCartData, token?: string) => Promise<void>;
  updateItem: (itemId: string, data: UpdateCartItemData, token?: string) => Promise<void>;
  removeItem: (itemId: string, token?: string) => Promise<void>;
  clearCart: (token?: string) => Promise<void>;
  loadCart: (token?: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetCart: () => void;
  initializeGuestCart: () => void;
  mergeGuestCartToUser: (token: string) => Promise<void>;
}
