import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST() {
  try {
    console.log("🚀 Çok seviyeli kategori sistemi kuruluyor...")

    // Ana kategoriler
    const mainCategories = [
      {
        name: "Kurumsal Hediyeler",
        slug: "kurumsal-hediyeler",
        description: "Kurumsal etkinlikler için özel hediyeler",
      },
      {
        name: "Evliliğe Dair Hediyelikler",
        slug: "evlilige-dair-hediyelikler",
        description: "Düğün ve evlilik için özel ürünler",
      },
      {
        name: "Doğum Günü Hediyelikleri",
        slug: "dogum-gunu-hediyelikleri",
        description: "Doğum günü kutlamaları için özel hediyeler",
      },
      {
        name: "Özel Günler",
        slug: "ozel-gunler",
        description: "Özel günler için hediyeler",
      },
    ]

    // Ana kategorileri oluştur
    const createdMainCategories = {}
    for (const category of mainCategories) {
      const existing = await prisma.category.findUnique({
        where: { slug: category.slug },
      })

      if (!existing) {
        const created = await prisma.category.create({
          data: category,
        })
        createdMainCategories[category.slug] = created
        console.log(`✅ Ana kategori oluşturuldu: ${category.name}`)
      } else {
        createdMainCategories[category.slug] = existing
        console.log(`📋 Mevcut ana kategori: ${category.name}`)
      }
    }

    // Alt kategoriler (Seviye 1)
    const subCategories = [
      // Kurumsal Hediyeler alt kategorileri
      {
        name: "Kadınlar Günü Hediyeleri",
        slug: "kadinlar-gunu-hediyeleri",
        parentSlug: "kurumsal-hediyeler",
        description: "8 Mart Kadınlar Günü için özel hediyeler",
      },
      {
        name: "Öğretmenler Günü Hediyeleri",
        slug: "ogretmenler-gunu-hediyeleri",
        parentSlug: "kurumsal-hediyeler",
        description: "24 Kasım Öğretmenler Günü hediyeleri",
      },
      {
        name: "Kurumsal Anneler Günü Hediyeleri",
        slug: "kurumsal-anneler-gunu-hediyeleri",
        parentSlug: "kurumsal-hediyeler",
        description: "Anneler Günü için kurumsal hediyeler",
      },
      {
        name: "Babalar Günü Hediyeleri",
        slug: "babalar-gunu-hediyeleri",
        parentSlug: "kurumsal-hediyeler",
        description: "Babalar Günü için özel hediyeler",
      },
      {
        name: "Hemşireler Günü Hediyesi",
        slug: "hemsireler-gunu-hediyesi",
        parentSlug: "kurumsal-hediyeler",
        description: "12 Mayıs Hemşireler Günü hediyeleri",
      },
      {
        name: "Yılbaşı Hediyeleri",
        slug: "yilbasi-hediyeleri",
        parentSlug: "kurumsal-hediyeler",
        description: "Yılbaşı kutlamaları için hediyeler",
      },
      {
        name: "Bayram Özel Hediyeler",
        slug: "bayram-ozel-hediyeler",
        parentSlug: "kurumsal-hediyeler",
        description: "Bayram kutlamaları için özel hediyeler",
      },

      // Evliliğe Dair Hediyelikler alt kategorileri
      {
        name: "Söz-Nişan Hediyelikleri",
        slug: "soz-nisan-hediyelikleri",
        parentSlug: "evlilige-dair-hediyelikler",
        description: "Söz ve nişan törenleri için hediyeler",
      },
      {
        name: "Düğün Hediyelikleri",
        slug: "dugun-hediyelikleri",
        parentSlug: "evlilige-dair-hediyelikler",
        description: "Düğün törenleri için özel hediyeler",
      },
      {
        name: "Kına Gecesi Hediyelikleri",
        slug: "kina-gecesi-hediyelikleri",
        parentSlug: "evlilige-dair-hediyelikler",
        description: "Kına gecesi için özel ürünler",
      },
    ]

    // Alt kategorileri oluştur
    const createdSubCategories = {}
    for (const subCategory of subCategories) {
      const parentCategory = createdMainCategories[subCategory.parentSlug]
      if (!parentCategory) {
        console.log(`❌ Parent kategori bulunamadı: ${subCategory.parentSlug}`)
        continue
      }

      const existing = await prisma.category.findUnique({
        where: { slug: subCategory.slug },
      })

      if (!existing) {
        const created = await prisma.category.create({
          data: {
            name: subCategory.name,
            slug: subCategory.slug,
            description: subCategory.description,
            parentId: parentCategory.id,
          },
        })
        createdSubCategories[subCategory.slug] = created
        console.log(`✅ Alt kategori oluşturuldu: ${subCategory.name}`)
      } else {
        createdSubCategories[subCategory.slug] = existing
        console.log(`📋 Mevcut alt kategori: ${subCategory.name}`)
      }
    }

    // Alt-Alt kategoriler (Seviye 2) - SK Organizasyon tarzı
    const subSubCategories = [
      // Kadınlar Günü alt kategorileri
      {
        name: "Tümüne Göz At",
        slug: "kadinlar-gunu-tumune-goz-at",
        parentSlug: "kadinlar-gunu-hediyeleri",
        description: "Tüm kadınlar günü hediyelerini görüntüle",
      },
      {
        name: "Hediyeik Anahtarlık",
        slug: "kadinlar-gunu-anahtarlik",
        parentSlug: "kadinlar-gunu-hediyeleri",
        description: "Kadınlar günü için özel anahtarlıklar",
      },
      {
        name: "Hediyeik Ayna",
        slug: "kadinlar-gunu-ayna",
        parentSlug: "kadinlar-gunu-hediyeleri",
        description: "Kadınlar günü için özel aynalar",
      },
      {
        name: "Hediyeik Çikolatalar",
        slug: "kadinlar-gunu-cikolatalar",
        parentSlug: "kadinlar-gunu-hediyeleri",
        description: "Kadınlar günü için özel çikolatalar",
      },
      {
        name: "Hediyeik Şans Bilekliği",
        slug: "kadinlar-gunu-sans-bilekligi",
        parentSlug: "kadinlar-gunu-hediyeleri",
        description: "Kadınlar günü için şans bileklikleri",
      },

      // Öğretmenler Günü alt kategorileri
      {
        name: "Tümüne Göz At",
        slug: "ogretmenler-gunu-tumune-goz-at",
        parentSlug: "ogretmenler-gunu-hediyeleri",
        description: "Tüm öğretmenler günü hediyelerini görüntüle",
      },
      {
        name: "Öğretmen Plaketleri",
        slug: "ogretmen-plaketleri",
        parentSlug: "ogretmenler-gunu-hediyeleri",
        description: "Öğretmenler için özel plaketler",
      },
      {
        name: "Öğretmen Kupa Bardakları",
        slug: "ogretmen-kupa-bardaklari",
        parentSlug: "ogretmenler-gunu-hediyeleri",
        description: "Öğretmenler için özel kupa bardaklar",
      },
      {
        name: "Öğretmen Çiçekleri",
        slug: "ogretmen-cicekleri",
        parentSlug: "ogretmenler-gunu-hediyeleri",
        description: "Öğretmenler için özel çiçek aranjmanları",
      },

      // Söz-Nişan alt kategorileri
      {
        name: "Tümüne Göz At",
        slug: "soz-nisan-tumune-goz-at",
        parentSlug: "soz-nisan-hediyelikleri",
        description: "Tüm söz-nişan hediyelerini görüntüle",
      },
      {
        name: "Nişan Yüzükleri Kutusu",
        slug: "nisan-yuzukleri-kutusu",
        parentSlug: "soz-nisan-hediyelikleri",
        description: "Nişan yüzükleri için özel kutular",
      },
      {
        name: "Söz Hediyelikleri",
        slug: "soz-hediyelikleri",
        parentSlug: "soz-nisan-hediyelikleri",
        description: "Söz töreni için özel hediyeler",
      },
      {
        name: "Nişan Çikolataları",
        slug: "nisan-cikolatalari",
        parentSlug: "soz-nisan-hediyelikleri",
        description: "Nişan töreni için özel çikolatalar",
      },
    ]

    // Alt-Alt kategorileri oluştur
    let createdSubSubCount = 0
    for (const subSubCategory of subSubCategories) {
      const parentCategory = createdSubCategories[subSubCategory.parentSlug]
      if (!parentCategory) {
        console.log(`❌ Parent alt kategori bulunamadı: ${subSubCategory.parentSlug}`)
        continue
      }

      const existing = await prisma.category.findUnique({
        where: { slug: subSubCategory.slug },
      })

      if (!existing) {
        await prisma.category.create({
          data: {
            name: subSubCategory.name,
            slug: subSubCategory.slug,
            description: subSubCategory.description,
            parentId: parentCategory.id,
          },
        })
        createdSubSubCount++
        console.log(`✅ Alt-Alt kategori oluşturuldu: ${subSubCategory.name}`)
      } else {
        console.log(`📋 Mevcut alt-alt kategori: ${subSubCategory.name}`)
      }
    }

    // Sonuçları döndür
    const totalCategories = await prisma.category.count()

    return NextResponse.json({
      success: true,
      message: "Çok seviyeli kategori sistemi başarıyla kuruldu!",
      stats: {
        mainCategories: Object.keys(createdMainCategories).length,
        subCategories: Object.keys(createdSubCategories).length,
        subSubCategories: createdSubSubCount,
        totalCategories: totalCategories,
      },
      categories: {
        main: Object.values(createdMainCategories).map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
        sub: Object.values(createdSubCategories).map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
      },
    })
  } catch (error) {
    console.error("❌ Kategori kurulum hatası:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Kategori sistemi kurulamadı",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

// GET endpoint'i de ekleyelim - mevcut kategori yapısını görmek için
export async function GET() {
  try {
    // Tüm kategorileri hiyerarşik olarak getir
    const categories = await prisma.category.findMany({
      include: {
        children: {
          include: {
            children: {
              include: {
                _count: {
                  select: { products: true },
                },
              },
            },
            _count: {
              select: { products: true },
            },
          },
        },
        _count: {
          select: { products: true },
        },
      },
      where: {
        parentId: null, // Sadece ana kategoriler
      },
      orderBy: {
        createdAt: "asc",
      },
    })

    return NextResponse.json({
      success: true,
      categories: categories,
      totalCount: await prisma.category.count(),
    })
  } catch (error) {
    console.error("❌ Kategori listeleme hatası:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Kategoriler listelenemedi",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

