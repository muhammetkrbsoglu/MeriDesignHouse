import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { Category } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.prisma.category.create({
        data: createCategoryDto,
        include: {
          parent: true,
          children: true,
        },
      });
      return category;
    } catch (error) {
      throw new BadRequestException(`Failed to create category: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.prisma.category.findMany({
        include: {
          parent: true,
          children: true,
          _count: {
            select: {
              products: true,
            },
          },
        },
        orderBy: [
          { order: 'asc' },
          { name: 'asc' },
        ],
      });
    } catch (error) {
      throw new BadRequestException(`Failed to fetch categories: ${error.message}`);
    }
  }

  async findHierarchy() {
    try {
      const categories = await this.prisma.category.findMany({
        where: { parentId: null }, // Root categories only
        include: {
          children: {
            include: {
              children: {
                include: {
                  _count: {
                    select: {
                      products: true,
                    },
                  },
                },
              },
              _count: {
                select: {
                  products: true,
                },
              },
            },
          },
          _count: {
            select: {
              products: true,
            },
          },
        },
        orderBy: [
          { order: 'asc' },
          { name: 'asc' },
        ],
      });
      return categories;
    } catch (error) {
      throw new BadRequestException(`Failed to fetch category hierarchy: ${error.message}`);
    }
  }

  async findOne(id: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
        include: {
          parent: true,
          children: true,
          products: {
            take: 20, // Limit products in category view
          },
          _count: {
            select: {
              products: true,
            },
          },
        },
      });

      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      return category;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(`Failed to fetch category: ${error.message}`);
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.prisma.category.update({
        where: { id },
        data: updateCategoryDto,
        include: {
          parent: true,
          children: true,
        },
      });
      return category;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      throw new BadRequestException(`Failed to update category: ${error.message}`);
    }
  }

  async remove(id: string) {
    try {
      // Check if category has children
      const children = await this.prisma.category.findMany({
        where: { parentId: id },
      });

      if (children.length > 0) {
        throw new BadRequestException('Cannot delete category with subcategories');
      }

      // Check if category has products
      const products = await this.prisma.product.findMany({
        where: { categoryId: id },
        take: 1,
      });

      if (products.length > 0) {
        throw new BadRequestException('Cannot delete category with products');
      }

      await this.prisma.category.delete({
        where: { id },
      });
      return { message: 'Category deleted successfully' };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      if (error.code === 'P2025') {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      throw new BadRequestException(`Failed to delete category: ${error.message}`);
    }
  }

  async findBySlug(slug: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { slug },
        include: {
          parent: true,
          children: true,
          products: {
            take: 20,
          },
          _count: {
            select: {
              products: true,
            },
          },
        },
      });

      if (!category) {
        throw new NotFoundException(`Category with slug ${slug} not found`);
      }

      return category;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(`Failed to fetch category by slug: ${error.message}`);
    }
  }

  async getMainCategories() {
    try {
      return await this.prisma.category.findMany({
        where: { parentId: null },
        include: {
          children: {
            take: 5, // Limit subcategories shown
            include: {
              _count: {
                select: {
                  products: true,
                },
              },
            },
          },
          _count: {
            select: {
              products: true,
            },
          },
        },
        orderBy: [
          { order: 'asc' },
          { name: 'asc' },
        ],
        take: 8, // Limit main categories
      });
    } catch (error) {
      throw new BadRequestException(`Failed to fetch main categories: ${error.message}`);
    }
  }

  async getCategoryTree(): Promise<Category[]> {
    try {
      return await this.prisma.category.findMany({
        where: { 
          isActive: true,
          parentId: null // Only root categories
        },
        include: {
          children: {
            where: { isActive: true },
            include: {
              children: {
                where: { isActive: true }
              }
            },
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { order: 'asc' },
      });
    } catch (error) {
      throw new BadRequestException(`Failed to fetch category tree: ${error.message}`);
    }
  }
}
