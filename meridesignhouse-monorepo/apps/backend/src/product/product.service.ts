import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  async list(params: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    featured?: boolean | undefined;
  }) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    if (params.categoryId) {
      where.categoryId = params.categoryId;
    }
    if (typeof params.featured === 'boolean') {
      where.featured = params.featured;
    }

    const [products, total] = await Promise.all([
      this.prismaService.product.findMany({
        where,
        include: {
          category: true,
          images: { orderBy: { order: 'asc' } },
          _count: { select: { orderRequests: true, favorites: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prismaService.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string) {
    const product = await this.prismaService.product.findUnique({
      where: { id },
      include: { category: true, images: { orderBy: { order: 'asc' } } },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async create(input: any) {
    const { additionalImages, categoryId, ...productData } = input;
    const result = await this.prismaService.$transaction(async (tx) => {
      const createData: any = { ...productData };
      if (categoryId) {
        createData.category = { connect: { id: categoryId } };
      }
      const product = await tx.product.create({ data: createData, include: { category: true } });
      if (additionalImages && additionalImages.length > 0) {
        await tx.productImage.createMany({
          data: additionalImages.map((img: any) => ({ productId: product.id, url: img.url, order: img.order })),
        });
      }
      return product;
    });
    return result;
  }

  async update(id: string, input: any) {
    const data = {
      title: input.title,
      description: input.description,
      image: input.image,
      price: input.price ?? null,
      oldPrice: input.oldPrice ?? null,
      discount: input.discount ?? null,
      featured: input.featured || false,
      isPopular: input.isPopular || false,
      categoryId: input.categoryId,
    };
    return this.prismaService.product.update({
      where: { id },
      data,
      include: { category: true, images: { orderBy: { order: 'asc' } } },
    });
  }

  async remove(id: string) {
    await this.prismaService.$transaction(async (tx) => {
      await tx.productImage.deleteMany({ where: { productId: id } });
      await tx.favorite.deleteMany({ where: { productId: id } });
      await tx.orderRequest.deleteMany({ where: { productId: id } });
      await tx.order.deleteMany({ where: { productId: id } });
      await tx.product.delete({ where: { id } });
    });
    return { message: 'Product deleted successfully' };
  }
}


