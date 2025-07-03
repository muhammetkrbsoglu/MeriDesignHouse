export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">Hikayemiz</h1>
            <p className="text-lg text-neutral-600">
              Yolculuğumuzun başından beri el yapımı hediyelerle güzel anılar yaratıyoruz.
            </p>
          </div>

          {/* Hero Image */}
          <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
            <img
              src="/images/crafting-hands.jpg"
              alt="El yapımı hediye yapan eller"
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>

          <div className="bg-white rounded-2xl shadow-md p-8 md:p-12 mb-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-neutral-700 leading-relaxed mb-6">
                Her parçanın bir hikaye anlattığı ve her yaratımın tutku ve özveriyle doğduğu el yapımı hediyeler dünyamıza hoş geldiniz. Özel anlarınızı gerçekten unutulmaz kılan benzersiz, kişiselleştirilmiş hediyeler yaratma konusunda uzmanız.
              </p>

              <p className="text-neutral-700 leading-relaxed mb-6">
                Yolculuğumuz basit bir inançla başladı: En anlamlı hediyeler, sevgi ve detaylara gösterilen özenle yapılan hediyelerdir. İster düğün, nişan, doğum günü veya herhangi bir özel kutlama olsun, değerli anlarınızın neşesini ve önemini yansıtan parçalar yaratmak için kalplerimizi ortaya koyuyoruz.
              </p>

              <p className="text-neutral-700 leading-relaxed">
                Koleksiyonumuzdaki her ürün, premium malzemeler ve nesilden nesile aktarılan geleneksel teknikler kullanılarak özenle el yapımıdır. Kalite, sürdürülebilirlik ve her parçayı benzersiz bir şekilde sizin yapan kişisel dokunuş konusundaki bağlılığımızla gurur duyuyoruz.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Misyonumuz</h3>
              <p className="text-neutral-600 text-sm">
                Hayatın en değerli anlarını kutlayan güzel, anlamlı hediyeler yaratmak.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Vizyonumuz</h3>
              <p className="text-neutral-600 text-sm">
                Tüm özel kutlamalarınız ve kilometre taşı anlarınız için güvenilen ortak olmak.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Değerlerimiz</h3>
              <p className="text-neutral-600 text-sm">
                Yarattığımız her parçada kaliteli işçilik, kişisel özen ve içten gelen ilgi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
