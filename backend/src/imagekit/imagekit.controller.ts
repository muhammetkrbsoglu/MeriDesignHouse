import { 
  Controller, 
  Post, 
  Delete, 
  Get, 
  Param, 
  UseInterceptors, 
  UploadedFile, 
  UseGuards,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageKitService } from './imagekit.service';
import { ClerkGuard } from '../auth/clerk.guard';

@Controller('imagekit')
export class ImageKitController {
  constructor(private readonly imageKitService: ImageKitService) {}

  @Post('upload')
  @UseGuards(ClerkGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder: string = 'products',
  ) {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    const imageUrl = await this.imageKitService.uploadImage(file, folder);
    return { 
      success: true, 
      imageUrl, 
      message: 'Image uploaded successfully' 
    };
  }

  @Delete(':fileId')
  @UseGuards(ClerkGuard)
  async deleteImage(@Param('fileId') fileId: string) {
    const result = await this.imageKitService.deleteImage(fileId);
    return { 
      success: result, 
      message: 'Image deleted successfully' 
    };
  }

  @Get('list')
  @UseGuards(ClerkGuard)
  async listImages(@Query('folder') folder?: string) {
    const images = await this.imageKitService.listImages(folder);
    return { 
      success: true, 
      images, 
      count: images.length 
    };
  }

  @Get('url/:fileId')
  async getImageUrl(@Param('fileId') fileId: string) {
    const imageUrl = await this.imageKitService.getImageUrl(fileId);
    return { 
      success: true, 
      imageUrl 
    };
  }

  @Get('transform/:fileId')
  async getTransformedImageUrl(
    @Param('fileId') fileId: string,
    @Query('transformation') transformation?: string,
  ) {
    const imageUrl = this.imageKitService.generateImageUrl(fileId, transformation);
    return { 
      success: true, 
      imageUrl 
    };
  }
}
