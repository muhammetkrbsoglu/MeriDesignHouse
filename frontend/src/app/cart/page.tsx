'use client';

import { useCartStore } from '../../stores/cart.store';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { calculatePriceInfo, formatPrice } from '../../utils/price.utils';
import { useUser, useAuth } from '@clerk/nextjs';
import { useSyncCartWithAuth } from '../../hooks/useSyncCartWithAuth';

export default function CartPage() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { items, total, itemCount, loading, error, updateItem, removeItem, clearCart } = useCartStore();
  useSyncCartWithAuth();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  // Cart auth senkronizasyonu hook'a taşındı

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => new Set(prev).add(itemId));
    try {
      const token = await getToken();
      if (token) {
        await updateItem(itemId, { quantity: newQuantity }, token);
      } else {
        await updateItem(itemId, { quantity: newQuantity });
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      const token = await getToken();
      if (token) {
        await removeItem(itemId, token);
      } else {
        await removeItem(itemId);
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleClearCart = async () => {
    if (confirm('Sepeti temizlemek istediğinizden emin misiniz?')) {
      try {
        const token = await getToken();
        if (token) {
          await clearCart(token);
        } else {
          await clearCart();
        }
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Sepet yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>Hata: {error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">🛒</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Sepetiniz Boş</h1>
              <p className="text-gray-600 mb-6">Sepetinizde henüz ürün bulunmuyor.</p>
              <Link 
                href="/products" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Alışverişe Başla
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {!user && (
            <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-800">
              Giriş yapmadan da sipariş oluşturabilirsiniz; ancak giriş yaparsanız sipariş takibi ve iletişim çok daha kolay olur.
              <span className="ml-2 underline">
                <a href="/sign-in">Giriş yap</a>
              </span>
              {` `}
              veya
              {` `}
              <span className="ml-1 underline">
                <a href="/sign-up">Kayıt ol</a>
              </span>
            </div>
          )}
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Sepetim</h1>
            <p className="text-gray-600 mt-2">
              {itemCount} ürün • Toplam: ₺{total.toFixed(2)}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Sepet Ürünleri</h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {items.map((item) => {
                    const priceInfo = calculatePriceInfo(
                      item.product.price,
                      item.product.discountPrice,
                      item.product.discountPercentage
                    );
                    
                    return (
                      <div key={item.id} className="p-6 flex items-center space-x-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                            {item.product.images && item.product.images.length > 0 ? (
                              <Image
                                src={item.product.images[0]}
                                alt={item.product.name}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                📷
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-gray-500 truncate">
                            {item.product.description}
                          </p>
                          <div className="mt-2 flex items-center space-x-2">
                            <span className="text-lg font-semibold text-blue-600">
                              {formatPrice(priceInfo.finalPrice)}
                            </span>
                            {priceInfo.hasDiscount && (
                              <span className="text-sm text-gray-500 line-through">
                                {formatPrice(priceInfo.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={updatingItems.has(item.id) || item.quantity <= 1}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-medium">
                            {updatingItems.has(item.id) ? '...' : item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={updatingItems.has(item.id)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700 p-2"
                          title="Ürünü kaldır"
                        >
                          🗑️
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Clear Cart Button */}
                <div className="p-6 border-t border-gray-200">
                  <button
                    onClick={handleClearCart}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Sepeti Temizle
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Sipariş Özeti</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span>Ara Toplam</span>
                    <span>₺{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Kargo</span>
                    <span className="text-green-600">Ücretsiz</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Toplam</span>
                      <span>₺{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-3 inline-block text-center"
                >
                  Ödemeye Geç
                </Link>

                <Link
                  href="/products"
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors inline-block text-center"
                >
                  Alışverişe Devam Et
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
