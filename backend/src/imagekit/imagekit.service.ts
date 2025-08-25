import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ImageKit from 'imagekit';

@Injectable()
export class ImageKitService {
  private imagekit: ImageKit;

  constructor(private configService: ConfigService) {
    this.imagekit = new ImageKit({
      publicKey: this.configService.get<string>('IMAGEKIT_PUBLIC_KEY'),
      privateKey: this.configService.get<string>('IMAGEKIT_PRIVATE_KEY'),
      urlEndpoint: this.configService.get<string>('IMAGEKIT_URL_ENDPOINT'),
    });
  }

  async uploadImage(file: Express.Multer.File, folder: string = 'products'): Promise<string> {
    try {
      const uploadResponse = await this.imagekit.upload({
        file: file.buffer,
        fileName: `${Date.now()}-${file.originalname}`,
        folder: folder,
        useUniqueFileName: true,
        tags: ['meridesignhouse'],
        responseFields: ['url', 'fileId', 'name'],
      });

      return uploadResponse.url;
    } catch (error) {
      throw new BadRequestException(`Failed to upload image: ${error.message}`);
    }
  }

  async deleteImage(fileId: string): Promise<boolean> {
    try {
      await this.imagekit.deleteFile(fileId);
      return true;
    } catch (error) {
      throw new BadRequestException(`Failed to delete image: ${error.message}`);
    }
    }

  async getImageUrl(fileId: string): Promise<string> {
    try {
      const fileDetails = await this.imagekit.getFileDetails(fileId);
      return fileDetails.url;
    } catch (error) {
      throw new BadRequestException(`Failed to get image URL: ${error.message}`);
    }
  }

  async listImages(folder?: string): Promise<any[]> {
    try {
      const response = await this.imagekit.listFiles({
        path: folder,
        limit: 100,
      });
      return response;
    } catch (error) {
      throw new BadRequestException(`Failed to list images: ${error.message}`);
    }
  }

  generateImageUrl(fileId: string, transformation?: string): string {
    const baseUrl = this.configService.get<string>('IMAGEKIT_URL_ENDPOINT');
    const transformationParam = transformation ? `tr:${transformation}` : '';
    return `${baseUrl}/${fileId}${transformationParam ? `?${transformationParam}` : ''}`;
  }
}
