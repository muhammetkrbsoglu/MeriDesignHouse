// Price formatting utility
export function formatPrice(price) {
  if (!price || isNaN(price)) return "₺0,00"

  const numPrice = Number.parseFloat(price)
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numPrice)
}

// Calculate discount percentage
export function calculateDiscountPercentage(originalPrice, discountedPrice) {
  if (!originalPrice || !discountedPrice || originalPrice <= discountedPrice) {
    return 0
  }

  const discount = ((originalPrice - discountedPrice) / originalPrice) * 100
  return Math.round(discount)
}

// Get order unit price with fallback logic
export function getOrderUnitPrice(order) {
  // Try unitPrice first (stored in schema)
  if (order.unitPrice && order.unitPrice > 0) {
    return order.unitPrice
  }

  // Try product price as fallback
  if (order.product?.price && order.product.price > 0) {
    return Number.parseFloat(order.product.price)
  }

  // Calculate from subtotal if available
  if (order.subtotal && order.quantity && order.quantity > 0) {
    return order.subtotal / order.quantity
  }

  // Calculate from total price if available
  if (order.totalPrice && order.quantity && order.quantity > 0) {
    const deliveryFee = order.deliveryFee || 0
    const subtotal = order.totalPrice - deliveryFee
    return subtotal / order.quantity
  }

  return 0
}

// Calculate savings amount
export function calculateSavings(originalPrice, discountedPrice) {
  if (!originalPrice || !discountedPrice || originalPrice <= discountedPrice) {
    return 0
  }

  return originalPrice - discountedPrice
}

// Check if product has discount
export function hasDiscount(product) {
  return product.discountedPrice && product.discountedPrice > 0 && product.discountedPrice < product.price
}

// Get effective price (discounted or regular)
export function getEffectivePrice(product) {
  if (hasDiscount(product)) {
    return Number.parseFloat(product.discountedPrice)
  }
  return Number.parseFloat(product.price)
}
