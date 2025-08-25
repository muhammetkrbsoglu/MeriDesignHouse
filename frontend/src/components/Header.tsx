'use client';

import { UserButton, SignInButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCartStore } from '../stores/cart.store';
import { useWishlistStore } from '../stores/wishlist.store';
import { useSyncCartWithAuth } from '../hooks/useSyncCartWithAuth';

export default function Header() {
  const { isSignedIn, user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { itemCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  useSyncCartWithAuth();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-gradient-pink to-gradient-purple rounded-lg"></div>
            <span className="text-xl font-bold text-primary-text">MeriDesignHouse</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-primary-text hover:text-primary-accent transition-colors">
              Ürünler
            </Link>
            <Link href="/categories" className="text-primary-text hover:text-primary-accent transition-colors">
              Kategoriler
            </Link>
            <Link href="/design-studio" className="text-primary-text hover:text-primary-accent transition-colors">
              Tasarım Atölyesi
            </Link>
            <Link href="/orders/track" className="text-primary-text hover:text-primary-accent transition-colors">
              📦 Sipariş Takip
            </Link>
            <Link href="/about" className="text-primary-text hover:text-primary-accent transition-colors">
              Hakkımızda
            </Link>
            <Link href="/contact" className="text-primary-text hover:text-primary-accent transition-colors">
              İletişim
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <>
                <Link href="/favorites" className="relative text-primary-text hover:text-primary-accent transition-colors">
                  ❤️ Favoriler
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistItems.length > 99 ? '99+' : wishlistItems.length}
                    </span>
                  )}
                </Link>
                <Link href="/cart" className="relative text-primary-text hover:text-primary-accent transition-colors">
                  🛒 Sepet
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  )}
                </Link>
                <Link href="/profile" className="text-primary-text hover:text-primary-accent transition-colors">
                  Profil
                </Link>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                />
              </>
            ) : (
              <>
                <Link href="/favorites" className="relative text-primary-text hover:text-primary-accent transition-colors">
                  ❤️ Favoriler
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistItems.length > 99 ? '99+' : wishlistItems.length}
                    </span>
                  )}
                </Link>
                <Link href="/cart" className="relative text-primary-text hover:text-primary-accent transition-colors">
                  🛒 Sepet
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  )}
                </Link>
                <SignInButton mode="modal">
                  <button className="btn-primary">
                    Giriş Yap
                  </button>
                </SignInButton>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link href="/products" className="text-primary-text hover:text-primary-accent transition-colors">
                Ürünler
              </Link>
              <Link href="/categories" className="text-primary-text hover:text-primary-accent transition-colors">
                Kategoriler
              </Link>
              <Link href="/design-studio" className="text-primary-text hover:text-primary-accent transition-colors">
                Tasarım Atölyesi
              </Link>
              <Link href="/orders/track" className="text-primary-text hover:text-primary-accent transition-colors">
                📦 Sipariş Takip
              </Link>
              <Link href="/about" className="text-primary-text hover:text-primary-accent transition-colors">
                Hakkımızda
              </Link>
              <Link href="/contact" className="text-primary-text hover:text-primary-accent transition-colors">
                İletişim
              </Link>
              <Link href="/favorites" className="relative text-primary-text hover:text-primary-accent transition-colors">
                ❤️ Favoriler
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistItems.length > 99 ? '99+' : wishlistItems.length}
                  </span>
                )}
              </Link>
              {isSignedIn && (
                <>
                  <Link href="/cart" className="relative text-primary-text hover:text-primary-accent transition-colors">
                    🛒 Sepet
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {itemCount > 99 ? '99+' : itemCount}
                      </span>
                    )}
                  </Link>
                  <Link href="/profile" className="text-primary-text hover:text-primary-accent transition-colors">
                    Profil
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
