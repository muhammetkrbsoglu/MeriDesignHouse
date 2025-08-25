import { IsNumber, IsOptional, Min, IsObject } from 'class-validator';

export class UpdateCartItemDto {
  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsObject()
  designData?: Record<string, any>;
}
