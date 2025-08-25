import { Product, ProductListResponse, ProductFilters } from '../../../shared/types/product';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class ProductService {
  private static async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  static async getProducts(filters: ProductFilters = {}): Promise<ProductListResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest<ProductListResponse>(endpoint);
  }

  static async getProduct(id: string): Promise<Product> {
    return this.makeRequest<Product>(`/products/${id}`);
  }

  static async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    return this.makeRequest<Product[]>(`/products/featured?limit=${limit}`);
  }

  static async getNewProducts(limit: number = 8): Promise<Product[]> {
    return this.makeRequest<Product[]>(`/products/new?limit=${limit}`);
  }

  static async getProductsByCategory(categoryId: string, filters: ProductFilters = {}): Promise<ProductListResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const endpoint = `/products/category/${categoryId}${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest<ProductListResponse>(endpoint);
  }

  static async searchProducts(query: string, filters: ProductFilters = {}): Promise<ProductListResponse> {
    return this.getProducts({
      ...filters,
      search: query,
    });
  }
}
