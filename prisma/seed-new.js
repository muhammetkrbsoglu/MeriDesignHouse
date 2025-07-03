const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seed...")

  // Upsert approach to avoid foreign key constraints
  console.log("� Using upsert to safely add data")

  // Create root categories with beautiful Turkish names and images
  const evlilikCategory = await prisma.category.upsert({
    where: { slug: "evlilige-dair-hediyelikler" },
    update: {
      name: "Evliliğe Dair Hediyelikler",
      description: "Düğün gününüz için özel el yapımı hediyelikler ve süslemeler",
      image: "/images/wedding-centerpieces.jpg",
      showInNavbar: true,
      order: 1,
    },
    create: {
      name: "Evliliğe Dair Hediyelikler",
      slug: "evlilige-dair-hediyelikler",
      description: "Düğün gününüz için özel el yapımı hediyelikler ve süslemeler",
      image: "/images/wedding-centerpieces.jpg",
      showInNavbar: true,
      order: 1,
    },
  })

  const dogumCategory = await prisma.category.upsert({
    where: { slug: "dogum-gunu" },
    update: {
      name: "Doğum Günü",
      description: "Doğum günü kutlamalarınız için renkli ve eğlenceli ürünler",
      image: "/images/birthday-banners.jpg",
      showInNavbar: true,
      order: 2,
    },
    create: {
      name: "Doğum Günü",
      slug: "dogum-gunu",
      description: "Doğum günü kutlamalarınız için renkli ve eğlenceli ürünler",
      image: "/images/birthday-banners.jpg",
      showInNavbar: true,
      order: 2,
    },
  })

  const yildonumuCategory = await prisma.category.upsert({
    where: { slug: "yildonumu" },
    update: {
      name: "Yıldönümü",
      description: "Yıldönümü kutlamalarınız için romantik ve özel hediyeler",
      image: "/images/anniversary-gifts.jpg",
      showInNavbar: true,
      order: 3,
    },
    create: {
      name: "Yıldönümü",
      slug: "yildonumu",
      description: "Yıldönümü kutlamalarınız için romantik ve özel hediyeler",
      image: "/images/anniversary-gifts.jpg",
      showInNavbar: true,
      order: 3,
    },
  })

  const nisanCategory = await prisma.category.upsert({
    where: { slug: "nisan" },
    update: {
      name: "Nişan",
      description: "Nişan törenleriniz için şık ve zarif dekorasyon ürünleri",
      image: "/images/engagement-decorations.jpg",
      showInNavbar: true,
      order: 4,
    },
    create: {
      name: "Nişan",
      slug: "nisan",
      description: "Nişan törenleriniz için şık ve zarif dekorasyon ürünleri",
      image: "/images/engagement-decorations.jpg",
      showInNavbar: true,
      order: 4,
    },
  })

  console.log("✅ Created root categories")

  // Create subcategories for Evliliğe Dair Hediyelikler
  const sozNisanCategory = await prisma.category.create({
    data: {
      name: "Söz-Nişan Hediyelikleri",
      slug: "soz-nisan-hediyelikleri",
      description: "Söz ve nişan törenleriniz için özel tasarım ürünler",
      image: "/images/engagement-ring-box.jpg",
      parentId: evlilikCategory.id,
      order: 1,
    },
  })

  const dugundeSunulacakCategory = await prisma.category.create({
    data: {
      name: "Düğünde Sunulacak Hediyelikler",
      slug: "dugunde-sunulacak-hediyelikler",
      description: "Düğün misafirlerinize sunabileceğiniz şık hediyeler",
      image: "/images/wedding-favors.jpg",
      parentId: evlilikCategory.id,
      order: 2,
    },
  })

  const masaSusleriCategory = await prisma.category.create({
    data: {
      name: "Masa Süsleri",
      slug: "masa-susleri",
      description: "Düğün masalarınız için zarif süsleme ürünleri",
      image: "/images/wedding-centerpieces.jpg",
      parentId: evlilikCategory.id,
      order: 3,
    },
  })

  console.log("✅ Created evlilik subcategories")

  // Create 3rd level categories for Söz-Nişan
  const anahtarlikCategory = await prisma.category.create({
    data: {
      name: "Hediyelik Anahtarlık",
      slug: "hediyelik-anahtarlik",
      description: "Kişiye özel tasarım anahtarlıklar",
      image: "/images/crafting-hands.jpg",
      parentId: sozNisanCategory.id,
      order: 1,
    },
  })

  const bubbleMumCategory = await prisma.category.create({
    data: {
      name: "Bubble Mum",
      slug: "bubble-mum",
      description: "Özel tasarım bubble şeklinde mumlar",
      image: "/images/crafting-hands.jpg",
      parentId: sozNisanCategory.id,
      order: 2,
    },
  })

  const kolonyaCategory = await prisma.category.create({
    data: {
      name: "Hediyelik Kolonya",
      slug: "hediyelik-kolonya",
      description: "Özel ambalajlı doğal kolonyalar",
      image: "/images/crafting-hands.jpg",
      parentId: sozNisanCategory.id,
      order: 3,
    },
  })

  const lotusMumCategory = await prisma.category.create({
    data: {
      name: "Lotus Mum",
      slug: "lotus-mum",
      description: "Lotus çiçeği şeklinde dekoratif mumlar",
      image: "/images/crafting-hands.jpg",
      parentId: sozNisanCategory.id,
      order: 4,
    },
  })

  console.log("✅ Created 3rd level categories")

  // Create subcategories for Doğum Günü
  const dogumHediyelikleriCategory = await prisma.category.create({
    data: {
      name: "Doğum Günü Hediyelikleri",
      slug: "dogum-gunu-hediyelikleri",
      description: "Doğum günü kutlamaları için özel hediyeler",
      image: "/images/birthday-cards.jpg",
      parentId: dogumCategory.id,
      order: 1,
    },
  })

  const davetiyelerCategory = await prisma.category.create({
    data: {
      name: "Davetiyeler",
      slug: "davetiyeler",
      description: "El yapımı özel tasarım davetiye kartları",
      image: "/images/birthday-banners.jpg",
      parentId: dogumCategory.id,
      order: 2,
    },
  })

  const masaSusleriDogumCategory = await prisma.category.create({
    data: {
      name: "Masa Süsleri",
      slug: "masa-susleri-dogum",
      description: "Doğum günü masaları için renkli süslemeler",
      image: "/images/crafting-hands.jpg",
      parentId: dogumCategory.id,
      order: 3,
    },
  })

  const dekorasyonlarCategory = await prisma.category.create({
    data: {
      name: "Dekorasyonlar",
      slug: "dekorasyonlar",
      description: "Parti ve etkinlik dekorasyonları",
      image: "/images/birthday-banners.jpg",
      parentId: dogumCategory.id,
      order: 4,
    },
  })

  console.log("✅ Created doğum günü subcategories")

  // Create subcategories for Nişan
  const afislerCategory = await prisma.category.create({
    data: {
      name: "Afişler",
      slug: "afisler",
      description: "Nişan töreni için özel tasarım afişler",
      image: "/images/engagement-decorations.jpg",
      parentId: nisanCategory.id,
      order: 1,
    },
  })

  const suslemelerCategory = await prisma.category.create({
    data: {
      name: "Süslemeler",
      slug: "suslemeler",
      description: "Nişan mekanı için zarif süsleme ürünleri",
      image: "/images/engagement-ring-box.jpg",
      parentId: nisanCategory.id,
      order: 2,
    },
  })

  console.log("✅ Created nişan subcategories")

  // Create subcategories for Yıldönümü  
  const partiHediyelikleriCategory = await prisma.category.create({
    data: {
      name: "Parti Hediyelikleri",
      slug: "parti-hediyelikleri",
      description: "Yıldönümü partileri için özel hediyeler",
      image: "/images/anniversary-gifts.jpg",
      parentId: yildonumuCategory.id,
      order: 1,
    },
  })

  console.log("✅ Created yıldönümü subcategories")

  // Create some sample products
  const products = [
    {
      title: "Zarif Düğün Hediyelikleri",
      description: "Düğün gününüzde misafirlerinize verebileceğiniz özel tasarım hediyelikler. Her bir hediye özenle hazırlanmış ve kişiselleştirilebilir.",
      price: 25.99,
      image: "/images/wedding-favors.jpg",
      categoryId: dugundeSunulacakCategory.id,
      isPopular: true,
    },
    {
      title: "Özel Tasarım Düğün Masa Süsleri",
      description: "Düğün masalarınızı süsleyecek zarif ve şık masa süsleri. Her masa için özel tasarım seçenekleri mevcuttur.",
      price: 45.99,
      image: "/images/wedding-centerpieces.jpg",
      categoryId: masaSusleriCategory.id,
      isPopular: true,
    },
    {
      title: "Nişan Yüzüğü Kutusu",
      description: "Evlilik teklifiniz için özel tasarım ahşap yüzük kutusu. İsim ve tarih kazıma hizmeti dahildir.",
      price: 35.99,
      image: "/images/engagement-ring-box.jpg",
      categoryId: sozNisanCategory.id,
      isPopular: true,
    },
    {
      title: "Kişiye Özel Anahtarlık",
      description: "Sevdikleriniz için özel tasarım anahtarlıklar. İsim, tarih veya özel mesaj kazıtabilirsiniz.",
      price: 15.99,
      image: "/images/crafting-hands.jpg",
      categoryId: anahtarlikCategory.id,
    },
    {
      title: "Doğal Bubble Mum",
      description: "El yapımı doğal mum. Özel bubble tasarımı ile mekanlarınıza sıcaklık katacak.",
      price: 22.99,
      image: "/images/crafting-hands.jpg",
      categoryId: bubbleMumCategory.id,
    },
    {
      title: "Hediyelik Kolonya Seti",
      description: "Özel ambalajlı doğal kolonyalar. Çeşitli koku seçenekleri ile sevdiklerinize hediye edebilirsiniz.",
      price: 18.99,
      image: "/images/crafting-hands.jpg",
      categoryId: kolonyaCategory.id,
    },
    {
      title: "Lotus Mum Dekorasyonu",
      description: "Lotus çiçeği şeklinde özel tasarım dekoratif mum. Meditasyon ve rahatlama için idealdir.",
      price: 28.99,
      image: "/images/crafting-hands.jpg",
      categoryId: lotusMumCategory.id,
    },
    {
      title: "Doğum Günü Hediye Paketi",
      description: "Doğum günü kutlamaları için özel hazırlanmış hediye paketi. Kişiselleştirme seçenekleri mevcuttur.",
      price: 32.99,
      image: "/images/birthday-cards.jpg",
      categoryId: dogumHediyelikleriCategory.id,
    },
    {
      title: "El Yapımı Davetiye Kartları",
      description: "Özel günleriniz için el yapımı davetiye kartları. Benzersiz tasarımlar ve kişiselleştirme seçenekleri.",
      price: 12.99,
      image: "/images/birthday-banners.jpg",
      categoryId: davetiyelerCategory.id,
    },
    {
      title: "Yıldönümü Özel Hediye",
      description: "Yıldönümünüzü unutulmaz kılacak özel tasarım hediyeler. Romantik ve anlamlı hediye seçenekleri.",
      price: 42.99,
      image: "/images/anniversary-gifts.jpg",
      categoryId: partiHediyelikleriCategory.id,
      isPopular: true,
    },
  ]

  for (const productData of products) {
    await prisma.product.create({
      data: productData,
    })
  }

  console.log("✅ Created sample products")

  console.log("🎉 Database seed completed successfully!")
  console.log("📊 Summary:")
  console.log("- 4 root categories")
  console.log("- 10+ subcategories") 
  console.log("- 4 third-level categories")
  console.log("- 10 sample products")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
