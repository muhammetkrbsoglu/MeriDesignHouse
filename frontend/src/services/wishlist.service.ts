import { WishlistItem } from '../../../shared/types/wishlist';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class WishlistService {
  private static async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      ...options,
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Get user's wishlist
  static async getWishlist(token: string): Promise<{ items: WishlistItem[]; itemCount: number }> {
    return this.makeRequest<{ items: WishlistItem[]; itemCount: number }>('/wishlist', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Add product to wishlist
  static async addToWishlist(token: string, productId: string): Promise<WishlistItem> {
    return this.makeRequest<WishlistItem>('/wishlist', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    });
  }

  // Remove product from wishlist
  static async removeFromWishlist(token: string, productId: string): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>(`/wishlist/${productId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
