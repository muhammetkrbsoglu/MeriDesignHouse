export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  discountPercentage?: number;
  stockQuantity: number;
  images: string[];
  categoryId: string;
  isFeatured: boolean;
  isActive: boolean;
  tags: string[];
  dimensions?: string;
  weight?: string;
  material?: string;
  careInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  imageUrl?: string;
  description?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFilter {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  search?: string;
  sortBy?: 'price' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ProductResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
