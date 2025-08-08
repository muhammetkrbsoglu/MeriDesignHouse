import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  list(
    @Query('page') pageRaw?: string,
    @Query('limit') limitRaw?: string,
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('featured') featuredRaw?: string,
  ) {
    const page = Number.parseInt(pageRaw ?? '1', 10);
    const limit = Number.parseInt(limitRaw ?? '10', 10);
    const featured = typeof featuredRaw === 'string' ? featuredRaw === 'true' : undefined;
    return this.productService.list({
      page: Number.isNaN(page) ? 1 : page,
      limit: Number.isNaN(limit) ? 10 : limit,
      search,
      categoryId,
      featured,
    });
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  getById(@Param('id') id: string) {
    return this.productService.getById(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  create(@Body() body: any) {
    return this.productService.create(body);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() body: any) {
    return this.productService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}


