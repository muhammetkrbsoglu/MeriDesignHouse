"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  imageSrc: string;
  imageAlt: string;
};

export type ProductCardProps = {
  product: Product;
  className?: string;
};

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <div
      className={cn(
        "group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-medium hover:scale-[1.02] hover:shadow-md",
        className
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-lg">
        <Image
          src={product.imageSrc}
          alt={product.imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
      </div>
      <div className="mt-3 space-y-1">
        <div className="text-sm text-gray-500">{product.category}</div>
        <div className="text-base font-semibold text-gray-900">{product.name}</div>
        <div className="text-sm font-medium text-gray-900">{new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(product.price)}</div>
      </div>
    </div>
  );
}

export default ProductCard;



