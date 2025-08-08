import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Public } from '../auth/public.decorator';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  findAll() {
    return this.categoryService.findAll();
  }

  @Get('navbar')
  @Public()
  async navbar() {
    const categories = await this.categoryService.navbarTree();
    return {
      success: true,
      categories,
      totalCategories: categories.length,
    };
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles('admin')
  stats() {
    return this.categoryService.stats();
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  create(
    @Body()
    body: { name: string; slug?: string; description?: string | null; parentId?: string | null },
  ) {
    return this.categoryService.create(body);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() body: { name?: string; slug?: string }) {
    return this.categoryService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}


