import { Product } from './product';

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  createdAt: Date;
}

export interface WishlistResponse {
  items: WishlistItem[];
  itemCount: number;
}
