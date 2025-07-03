import { MessageCircle, Instagram, Facebook } from "lucide-react"
import ContactFormClient from "@/components/ContactFormClient"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">İletişime Geçin</h1>
            <p className="text-lg text-neutral-600">
              Özel gününüz hakkında duymak ve mükemmel el yapımı hediyenizi yaratmanıza yardımcı olmak isteriz.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ContactFormClient />

            <div className="bg-white rounded-2xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-neutral-800 mb-6">İletişim Bilgileri</h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-800">E-posta</h3>
                    <p className="text-neutral-600">meridesignhouse@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-800">Telefon</h3>
                    <p className="text-neutral-600">0535 629 24 67</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-800">Yanıt Süresi</h3>
                    <p className="text-neutral-600">Genellikle 24 saat içinde yanıt veriyoruz</p>
                  </div>
                </div>

                {/* Social Media Links Section */}
                <div className="border-t border-neutral-200 pt-6 mt-8">
                  <h3 className="font-semibold text-neutral-800 mb-4">Bizimle Bağlantı Kurun</h3>
                  <div className="flex gap-4">
                    {/* WhatsApp */}
                    <a
                      href="https://wa.me/905356292467"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative w-12 h-12 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                      title="WhatsApp'ta bizimle iletişime geçin"
                    >
                      <MessageCircle className="w-6 h-6 text-green-600 group-hover:text-green-700" />
                      <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-neutral-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        WhatsApp
                      </span>
                    </a>

                    {/* Instagram */}
                    <a
                      href="https://instagram.com/meridesignhouse"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative w-12 h-12 bg-pink-100 hover:bg-pink-200 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                      title="Instagram'da bizi takip edin"
                    >
                      <Instagram className="w-6 h-6 text-pink-600 group-hover:text-pink-700" />
                      <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-neutral-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        Instagram
                      </span>
                    </a>

                    {/* Facebook */}
                    <a
                      href="https://facebook.com/meridesignhouse"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative w-12 h-12 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                      title="Facebook'ta bizi beğenin"
                    >
                      <Facebook className="w-6 h-6 text-blue-600 group-hover:text-blue-700" />
                      <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-neutral-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        Facebook
                      </span>
                    </a>
                  </div>
                  <p className="text-sm text-neutral-500 mt-3">
                    En son güncellemeler ve perde arkası içerikler için bizi takip edin!
                  </p>
                </div>

                <div className="bg-primary-50 rounded-lg p-4 mt-8">
                  <h3 className="font-semibold text-primary-800 mb-2">Özel Siparişler</h3>
                  <p className="text-primary-700 text-sm">
                    Özel parçalar yaratmayı seviyoruz! Fikirlerinizi paylaşın ve hayalinizi gerçeğe dönüştürmek için birlikte çalışalım.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
