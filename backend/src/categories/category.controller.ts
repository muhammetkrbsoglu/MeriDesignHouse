import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { ClerkGuard } from '../auth/clerk.guard';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(ClerkGuard)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get('public')
  findAllPublic() {
    return this.categoryService.findAll();
  }

  @Get('hierarchy')
  findHierarchy() {
    return this.categoryService.findHierarchy();
  }

  @Get('tree')
  getCategoryTree() {
    return this.categoryService.getCategoryTree();
  }

  @Get('main')
  getMainCategories() {
    return this.categoryService.getMainCategories();
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.categoryService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(ClerkGuard)
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(ClerkGuard)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
