import { IsString, IsNumber, IsOptional, Min, IsObject } from 'class-validator';

export class AddToCartDto {
  @IsString()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsObject()
  designData?: Record<string, any>;
}
