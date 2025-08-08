const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Önce mevcut verileri temizle (isteğe bağlı)
  // await prisma.product.deleteMany({})
  // await prisma.category.deleteMany({})

  // Ana kategoriler oluştur
  const weddingCategory = await prisma.category.upsert({
    where: { slug: "evlilige-dair-hediyelikler" },
    update: {
      name: "Evliliğe Dair Hediyelikler",
      description: "Düğün, nişan ve evlilik için özel el yapımı ürünler",
      image: "/images/wedding-favors.jpg"
    },
    create: {
      name: "Evliliğe Dair Hediyelikler",
      slug: "evlilige-dair-hediyelikler",
      description: "Düğün, nişan ve evlilik için özel el yapımı ürünler",
      image: "/images/wedding-favors.jpg"
    },
  })

  // Alt kategoriler oluştur
  const engagementCategory = await prisma.category.upsert({
    where: { slug: "soz-nisan-hediyelikleri" },
    update: {
      name: "Söz-Nişan Hediyelikleri",
      description: "Söz ve nişan törenleriniz için özel tasarımlar",
      image: "/images/engagement-decorations.jpg",
      parentId: weddingCategory.id
    },
    create: {
      name: "Söz-Nişan Hediyelikleri",
      slug: "soz-nisan-hediyelikleri",
      description: "Söz ve nişan törenleriniz için özel tasarımlar",
      image: "/images/engagement-decorations.jpg",
      parentId: weddingCategory.id,
    },
  })

  const weddingSubCategory = await prisma.category.upsert({
    where: { slug: "dugun-hediyelikleri" },
    update: {
      name: "Düğün Hediyelikleri",
      description: "Düğün günü için özel hediye çeşitleri",
      image: "/images/wedding-centerpieces.jpg",
      parentId: weddingCategory.id
    },
    create: {
      name: "Düğün Hediyelikleri",
      slug: "dugun-hediyelikleri",
      description: "Düğün günü için özel hediye çeşitleri",
      image: "/images/wedding-centerpieces.jpg",
      parentId: weddingCategory.id,
    },
  })

  // Daha derin alt kategoriler
  const keychainCategory = await prisma.category.upsert({
    where: { slug: "hediyelik-anahtarlik" },
    update: {
      name: "Hediyelik Anahtarlık",
      description: "Özel tasarım anahtarlıklar",
      image: "/images/crafting-hands.jpg",
      parentId: engagementCategory.id
    },
    create: {
      name: "Hediyelik Anahtarlık",
      slug: "hediyelik-anahtarlik",
      description: "Özel tasarım anahtarlıklar",
      image: "/images/crafting-hands.jpg",
      parentId: engagementCategory.id,
    },
  })

  const candleCategory = await prisma.category.upsert({
    where: { slug: "bubble-mum" },
    update: {
      name: "Bubble Mum",
      description: "Romantik atmosfer için özel mumlar",
      image: "/images/wedding-favors.jpg",
      parentId: engagementCategory.id
    },
    create: {
      name: "Bubble Mum",
      slug: "bubble-mum",
      description: "Romantik atmosfer için özel mumlar",
      image: "/images/wedding-favors.jpg",
      parentId: engagementCategory.id,
    },
  })

  const cologneCategory = await prisma.category.upsert({
    where: { slug: "hediyelik-kolonya" },
    update: {
      name: "Hediyelik Kolonya",
      description: "Özel ambalajlı hediye kolonyaları",
      image: "/images/engagement-ring-box.jpg",
      parentId: engagementCategory.id
    },
    create: {
      name: "Hediyelik Kolonya",
      slug: "hediyelik-kolonya",
      description: "Özel ambalajlı hediye kolonyaları",
      image: "/images/engagement-ring-box.jpg",
      parentId: engagementCategory.id,
    },
  })

  const lotusCategory = await prisma.category.upsert({
    where: { slug: "lotus-mum" },
    update: {
      name: "Lotus Mum",
      description: "Zarif lotus tasarımlı dekoratif mumlar",
      image: "/images/birthday-cards.jpg",
      parentId: engagementCategory.id
    },
    create: {
      name: "Lotus Mum",
      slug: "lotus-mum",
      description: "Zarif lotus tasarımlı dekoratif mumlar",
      image: "/images/birthday-cards.jpg",
      parentId: engagementCategory.id,
    },
  })

  // Doğum günü kategorisi
  const birthdayCategory = await prisma.category.upsert({
    where: { slug: "dogum-gunu" },
    update: {
      name: "Doğum Günü",
      description: "Doğum günü kutlamaları için özel ürünler",
      image: "/images/birthday-banners.jpg"
    },
    create: {
      name: "Doğum Günü",
      slug: "dogum-gunu",
      description: "Doğum günü kutlamaları için özel ürünler",
      image: "/images/birthday-banners.jpg"
    },
  })

  // Yıldönümü kategorisi
  const anniversaryCategory = await prisma.category.upsert({
    where: { slug: "yildonumu" },
    update: {
      name: "Yıldönümü",
      description: "Yıldönümü kutlamaları için romantik hediyeler",
      image: "/images/anniversary-gifts.jpg"
    },
    create: {
      name: "Yıldönümü",
      slug: "yildonumu",
      description: "Yıldönümü kutlamaları için romantik hediyeler",
      image: "/images/anniversary-gifts.jpg"
    },
  })

  // Örnek ürünler oluştur
  const products = [
    {
      title: "Zarif Düğün Hediyelikleri",
      description: "Düğün gününüz için özel el yapımı hediyeler. Her parça özenle seçilmiş malzemelerle üretilir ve isimleriniz ve düğün tarihinizle kişiselleştirilebilir.",
      image: "/images/wedding-favors.jpg",
      categoryId: weddingSubCategory.id,
      isPopular: true,
    },
    {
      title: "Özel Düğün Davetiyeleri",
      description: "El yazısı kaligrafi ve premium malzemelerle hazırlanmış düğün davetiyeleri. Her davetiye aşk hikayenizi ve düğün temanızı yansıtacak şekilde tasarlanır.",
      image: "/images/wedding-invitations.jpg",
      categoryId: weddingSubCategory.id,
    },
    {
      title: "Düğün Masa Süsleri",
      description: "Düğün resepsiyonunuzu unutulmaz kılacak el yapımı masa süsleri. Taze çiçekler, mumlar ve düğün renklerinize uygun dekoratif unsurlarla yaratılır.",
      image: "/images/wedding-centerpieces.jpg",
      isPopular: true,
      categoryId: weddingSubCategory.id,
    },
    {
      title: "Nişan Yüzük Kutusu",
      description: "Mükemmel evlilik teklifi için özel oymalı ahşap yüzük kutusu. Premium ahşaptan el işçiliği ile üretilir ve değerli yüzüğünüzü korumak için kadife iç kaplama.",
      image: "/images/engagement-ring-box.jpg",
      isPopular: true,
      categoryId: keychainCategory.id,
    },
    {
      title: "Nişan Partisi Süsleri",
      description: "Nişanınızı şık bir şekilde kutlamak için el yapımı süslemeler. İsimleriniz ve nişan tarihinizle kişiselleştirilmiş afişler, masa süsleri ve fotoğraf aksesuarları.",
      image: "/images/engagement-decorations.jpg",
      categoryId: engagementCategory.id,
    },
    {
      title: "Kişisel Doğum Günü Kartları",
      description: "Benzersiz tasarımlar ve kişisel mesajlarla özel el yapımı doğum günü kartları. Her kart doğum günlerini unutulmaz kılan özel dokunuşlarla hazırlanır.",
      image: "/images/birthday-cards.jpg",
      categoryId: birthdayCategory.id,
    },
    {
      title: "Doğum Günü Parti Afişleri",
      description: "Her doğum günü kutlamasını özel kılacak renkli el yapımı afişler. Çeşitli tema ve renklerde, doğum günü olan kişinin adı ve yaşıyla kişiselleştirilir.",
      image: "/images/birthday-banners.jpg",
      categoryId: birthdayCategory.id,
    },
    {
      title: "Özel Fotoğraf Albümleri",
      description: "Değerli anılarınızı muhafaza etmek için el işi fotoğraf albümleri. Yüksek kaliteli malzemelerle üretilir ve isimler, tarihler ve özel mesajlarla kişiselleştirilir.",
      image: "/images/photo-albums.jpg",
      categoryId: anniversaryCategory.id,
    },
    {
      title: "Yıldönümü Hediye Seti",
      description: "Aşkı ve özel anları kutlamak için özenle seçilmiş el yapımı hediyeler. Her set özel yolculuğunuzu anlatan kişiselleştirilmiş eşyalar içerir.",
      image: "/images/anniversary-gifts.jpg",
      categoryId: anniversaryCategory.id,
    },
    {
      title: "Özel Tasarım Anahtarlık",
      description: "Nişan ve düğün anıları için özel tasarım anahtarlıklar. İsimler, tarihler ve özel mesajlarla kişiselleştirilebilir.",
      image: "/images/crafting-hands.jpg",
      categoryId: keychainCategory.id,
    },
    {
      title: "Bubble Romantik Mumlar",
      description: "Romantik atmosfer yaratmak için özel tasarım bubble mumlar. Nişan ve düğün törenleriniz için ideal.",
      image: "/images/wedding-favors.jpg",
      categoryId: candleCategory.id,
    },
    {
      title: "Hediye Kutusu Kolonyalar",
      description: "Özel ambalajlı hediye kolonyaları. Premium şişelerde sunulan doğal esanslarla hazırlanmış kolonyalar.",
      image: "/images/engagement-ring-box.jpg",
      categoryId: cologneCategory.id,
    },
    {
      title: "Lotus Dekoratif Mumlar",
      description: "Zarif lotus tasarımlı dekoratif mumlar. Ev dekorasyonu ve özel anlar için mükemmel seçim.",
      image: "/images/birthday-cards.jpg",
      categoryId: lotusCategory.id,
    },
  ]

  // Ürünleri veritabanına ekle
  for (const product of products) {
    await prisma.product.upsert({
      where: {
        title: product.title
      },
      update: product,
      create: product,
    })
  }

  console.log("✅ Database seeded successfully!")
  console.log(`📦 Created categories:`)
  console.log(`   - ${weddingCategory.name} (${weddingCategory.id})`)
  console.log(`     - ${engagementCategory.name} (${engagementCategory.id})`)
  console.log(`       - ${keychainCategory.name} (${keychainCategory.id})`)
  console.log(`       - ${candleCategory.name} (${candleCategory.id})`)
  console.log(`       - ${cologneCategory.name} (${cologneCategory.id})`)
  console.log(`       - ${lotusCategory.name} (${lotusCategory.id})`)
  console.log(`     - ${weddingSubCategory.name} (${weddingSubCategory.id})`)
  console.log(`   - ${birthdayCategory.name} (${birthdayCategory.id})`)
  console.log(`   - ${anniversaryCategory.name} (${anniversaryCategory.id})`)
  console.log(`🎁 Created ${products.length} products`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

