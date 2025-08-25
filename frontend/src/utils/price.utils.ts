/**
 * Fiyat hesaplama utility fonksiyonları
 * Tüm sayfalarda tutarlı fiyat gösterimi için kullanılır
 */

export interface PriceInfo {
  originalPrice: number;
  discountedPrice: number | null;
  discountPercentage: number | null;
  finalPrice: number;
  hasDiscount: boolean;
}

/**
 * Ürün fiyat bilgilerini hesaplar
 */
export function calculatePriceInfo(
  price: number,
  discountPrice?: number | null,
  discountPercentage?: number | null
): PriceInfo {
  let finalPrice = price;
  let calculatedDiscountPrice = null;
  let calculatedDiscountPercentage = null;

  // Eğer discountPrice varsa, onu kullan
  if (discountPrice && discountPrice > 0 && discountPrice < price) {
    finalPrice = discountPrice;
    calculatedDiscountPrice = discountPrice;
    calculatedDiscountPercentage = ((price - discountPrice) / price) * 100;
  }
  // Eğer sadece discountPercentage varsa, onu hesapla
  else if (discountPercentage && discountPercentage > 0) {
    calculatedDiscountPercentage = discountPercentage;
    calculatedDiscountPrice = price - (price * discountPercentage) / 100;
    finalPrice = calculatedDiscountPrice;
  }

  return {
    originalPrice: price,
    discountedPrice: calculatedDiscountPrice,
    discountPercentage: calculatedDiscountPercentage,
    finalPrice,
    hasDiscount: finalPrice < price,
  };
}

/**
 * Fiyatı Türk Lirası formatında formatlar
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(price);
}

/**
 * Sepet öğesi için toplam fiyat hesaplar
 */
export function calculateItemTotal(
  price: number,
  discountPrice: number | null,
  quantity: number
): number {
  const finalPrice = discountPrice && discountPrice > 0 ? discountPrice : price;
  return finalPrice * quantity;
}

/**
 * Sepet toplamı hesaplar
 */
export function calculateCartTotal(items: Array<{ price: number; discountPrice?: number | null; quantity: number }>): number {
  return items.reduce((total, item) => {
    return total + calculateItemTotal(item.price, item.discountPrice || null, item.quantity);
  }, 0);
}
