import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return this.prismaService.category.findMany({
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
      orderBy: [{ parentId: 'asc' }, { name: 'asc' }],
    });
  }

  private generateSlug(name: string, providedSlug?: string) {
    const slug = providedSlug
      ? providedSlug
      : name
          .toLowerCase()
          .replace(/ğ/g, 'g')
          .replace(/ü/g, 'u')
          .replace(/ş/g, 's')
          .replace(/ı/g, 'i')
          .replace(/ö/g, 'o')
          .replace(/ç/g, 'c')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
    return slug;
  }

  async create(input: { name: string; slug?: string; description?: string | null; parentId?: string | null }) {
    const finalSlug = this.generateSlug(input.name, input.slug);

    const existing = await this.prismaService.category.findUnique({ where: { slug: finalSlug } });
    if (existing) {
      throw new BadRequestException('Bu slug zaten kullanılıyor');
    }

    if (input.parentId) {
      const parent = await this.prismaService.category.findUnique({ where: { id: input.parentId } });
      if (!parent) {
        throw new BadRequestException('Ana kategori bulunamadı');
      }
    }

    return this.prismaService.category.create({
      data: {
        name: input.name,
        slug: finalSlug,
        description: input.description ?? null,
        parentId: input.parentId ?? null,
      },
      include: {
        parent: true,
        children: true,
        _count: { select: { products: true, children: true } },
      },
    });
  }

  async update(id: string, input: { name?: string; slug?: string }) {
    try {
      return await this.prismaService.category.update({
        where: { id },
        data: { name: input.name, slug: input.slug },
        include: { _count: { select: { products: true } } },
      });
    } catch (e) {
      throw new NotFoundException('Kategori bulunamadı');
    }
  }

  async remove(id: string) {
    await this.prismaService.category.delete({ where: { id } });
    return { success: true };
  }

  async stats() {
    const [totalCategories, totalProducts, categoriesWithCount] = await Promise.all([
      this.prismaService.category.count(),
      this.prismaService.product.count(),
      this.prismaService.category.findMany({
        include: { _count: { select: { products: true } } },
        orderBy: { products: { _count: 'desc' } },
        take: 1,
      }),
    ]);

    return {
      total: totalCategories,
      totalProducts,
      mostPopular: categoriesWithCount.length > 0 ? categoriesWithCount[0].name : null,
    };
  }

  async navbarTree() {
    const allCategories = await this.prismaService.category.findMany({
      include: {
        _count: { select: { products: true } },
        children: {
          include: {
            _count: { select: { products: true } },
            children: {
              include: {
                _count: { select: { products: true } },
                children: {
                  include: {
                    _count: { select: { products: true } },
                    children: {
                      include: { _count: { select: { products: true } }, children: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    const transform = (category: any) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      parentId: category.parentId,
      productCount: category._count?.products || 0,
      count: category._count?.products || 0,
      children: category.children ? category.children.map(transform) : [],
    });

    return allCategories.filter((c) => c.parentId === null).map(transform);
  }
}


