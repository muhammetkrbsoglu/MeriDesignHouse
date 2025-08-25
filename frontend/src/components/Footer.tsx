import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">MeriDesignHouse</h3>
            <p className="text-gray-300 mb-4 max-w-md">
              Özel tasarım ev dekorasyon ürünleri ile evinizi güzelleştirin. 
              Kalite ve tasarımın buluştuğu yer.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                📷
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                📘
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">WhatsApp</span>
                💬
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Hızlı Erişim</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white transition-colors">
                  Ürünler
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-300 hover:text-white transition-colors">
                  Kategoriler
                </Link>
              </li>
              <li>
                <Link href="/design-studio" className="text-gray-300 hover:text-white transition-colors">
                  Tasarım Atölyesi
                </Link>
              </li>
              <li>
                <Link href="/orders/track" className="text-gray-300 hover:text-white transition-colors">
                  📦 Sipariş Takip
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  Hakkımızda
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">İletişim</h4>
            <ul className="space-y-2 text-gray-300">
              <li>📧 info@meridesignhouse.com</li>
              <li>📱 +90 555 123 45 67</li>
              <li>📍 İstanbul, Türkiye</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 MeriDesignHouse. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
