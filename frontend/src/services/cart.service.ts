import { CartItem, Cart, AddToCartData, UpdateCartItemData } from '../../../shared/types/cart';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class CartService {
  private static async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}/api${endpoint}`;
    const response = await fetch(url, {
      ...options,
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      let bodyText: string | undefined;
      try {
        bodyText = await response.text();
      } catch {}
      console.warn('[CartService] Request failed', {
        url,
        status: response.status,
        statusText: response.statusText,
        body: bodyText,
      });
      let parsed: any = undefined;
      try { parsed = bodyText ? JSON.parse(bodyText) : undefined; } catch {}
      throw new Error((parsed && parsed.message) || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Authenticated user cart operations only
  static async addToCart(token: string, data: AddToCartData): Promise<CartItem> {
    return this.makeRequest<CartItem>('/cart', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  static async getCart(token: string): Promise<Cart> {
    return this.makeRequest<Cart>('/cart', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  static async updateCartItem(token: string, itemId: string, data: UpdateCartItemData): Promise<CartItem> {
    return this.makeRequest<CartItem>(`/cart/${itemId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  static async removeFromCart(token: string, itemId: string): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>(`/cart/${itemId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  static async clearCart(token: string): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>('/cart', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  static async getCartItemCount(token: string): Promise<number> {
    return this.makeRequest<number>('/cart/count', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
