'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '../../shared/types/product';
import { ProductService } from '../services/product.service';
import ProductCard from '../components/ProductCard';
import EventQuiz from '../components/EventQuiz';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const products = await ProductService.getFeaturedProducts(4);
      setFeaturedProducts(products);
    } catch (error) {
      console.error('Error loading featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gradient-pink via-gradient-purple to-gradient-blue py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            MeriDesignHouse
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Özel tasarım ev dekorasyon ürünleri ile evinizi güzelleştirin
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="btn-primary text-lg px-8 py-4">
              Ürünleri Keşfet
            </Link>
            <Link href="/design-studio" className="btn-secondary text-lg px-8 py-4">
              Tasarım Atölyesi
            </Link>
            <Link href="/orders/track" className="bg-white text-gray-900 hover:bg-gray-100 font-semibold text-lg px-8 py-4 rounded-lg transition-colors border-2 border-white">
              📦 Sipariş Takip
            </Link>
          </div>
        </div>
      </div>

      {/* Event Quiz Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EventQuiz />
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Öne Çıkan Ürünler</h2>
            <p className="text-gray-600">En popüler ve yeni ürünlerimizi keşfedin</p>
          </div>

          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Ürünler yükleniyor...</p>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <p>Henüz öne çıkan ürün bulunmuyor.</p>
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/products" className="btn-primary">
              Tüm Ürünleri Gör
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Neden MeriDesignHouse?</h2>
            <p className="text-gray-600">Kalite ve tasarımın buluştuğu yer</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Özel Tasarım</h3>
              <p className="text-gray-600">Her ürün özenle tasarlanmış ve el işçiliği ile üretilmiştir</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌟</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Kalite Garantisi</h3>
              <p className="text-gray-600">En kaliteli malzemeler ve uzun ömürlü kullanım</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Hızlı Teslimat</h3>
              <p className="text-gray-600">Türkiye geneli hızlı ve güvenli teslimat</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
