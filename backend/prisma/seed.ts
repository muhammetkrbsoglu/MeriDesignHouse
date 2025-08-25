import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create main categories
  const evDekorasyonu = await prisma.category.upsert({
    where: { slug: 'ev-dekorasyonu' },
    update: {},
    create: {
      name: 'Ev Dekorasyonu',
      slug: 'ev-dekorasyonu',
      description: 'Ev dekorasyon ürünleri',
      order: 1,
      isActive: true,
    },
  });

  const yastiklar = await prisma.category.upsert({
    where: { slug: 'yastiklar' },
    update: {},
    create: {
      name: 'Yastıklar',
      slug: 'yastıklar',
      description: 'Özel tasarım yastıklar',
      parentId: evDekorasyonu.id,
      order: 1,
      isActive: true,
    },
  });

  const masaOrtusu = await prisma.category.upsert({
    where: { slug: 'masa-ortusu' },
    update: {},
    create: {
      name: 'Masa Örtüleri',
      slug: 'masa-ortusu',
      description: 'Özel tasarım masa örtüleri',
      parentId: evDekorasyonu.id,
      order: 2,
      isActive: true,
    },
  });

  // Create products
  const yastik1 = await prisma.product.upsert({
    where: { id: 'yastik-1' },
    update: {},
    create: {
      id: 'yastik-1',
      name: 'Vintage Çiçek Yastık',
      description: 'El işlemesi vintage çiçek desenli yastık',
      price: 89.99,
      discountPrice: 80.99, // 10% indirim
      discountPercentage: 10,
      stockQuantity: 25,
      categoryId: yastiklar.id,
      isFeatured: true,
      isActive: true,
      tags: ['vintage', 'çiçek', 'el işlemesi'],
      dimensions: '45x45 cm',
      weight: '500g',
      material: 'Pamuk, Polyester',
      careInstructions: '30°C yıkama, ütüleme yasak',
    },
  });

  const yastik2 = await prisma.product.upsert({
    where: { id: 'yastik-2' },
    update: {},
    create: {
      id: 'yastik-2',
      name: 'Modern Geometrik Yastık',
      description: 'Minimalist geometrik desenli modern yastık',
      price: 75.50,
      discountPrice: 67.95, // 10% indirim
      discountPercentage: 10,
      stockQuantity: 30,
      categoryId: yastiklar.id,
      isFeatured: false,
      isActive: true,
      tags: ['modern', 'geometrik', 'minimalist'],
      dimensions: '40x40 cm',
      weight: '450g',
      material: 'Pamuk, Polyester',
      careInstructions: '30°C yıkama, ütüleme yasak',
    },
  });

  const masaOrtusu1 = await prisma.product.upsert({
    where: { id: 'masa-ortusu-1' },
    update: {},
    create: {
      id: 'masa-ortusu-1',
      name: 'Çiçekli Masa Örtüsü',
      description: 'El işlemesi çiçek desenli masa örtüsü',
      price: 120.00,
      discountPrice: 102.00, // 15% indirim
      discountPercentage: 15,
      stockQuantity: 15,
      categoryId: masaOrtusu.id,
      isFeatured: true,
      isActive: true,
      tags: ['çiçek', 'el işlemesi', 'masa örtüsü'],
      dimensions: '140x200 cm',
      weight: '800g',
      material: 'Pamuk',
      careInstructions: '30°C yıkama, ütüleme serbest',
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log('📊 Created:', {
    categories: 3,
    products: 3,
  });
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
