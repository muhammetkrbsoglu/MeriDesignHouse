import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, IsUrl, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AdditionalImageDto {
  @IsString()
  @IsUrl()
  url!: string;

  @IsNumber()
  order!: number;
}

export class CreateProductDto {
  @IsString()
  @MaxLength(200)
  title!: string;

  @IsString()
  @MaxLength(2000)
  description!: string;

  @IsString()
  @IsUrl()
  image!: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsNumber()
  price?: number | null;

  @IsOptional()
  @IsNumber()
  oldPrice?: number | null;

  @IsOptional()
  @IsNumber()
  discount?: number | null;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsBoolean()
  isPopular?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdditionalImageDto)
  additionalImages?: AdditionalImageDto[];
}


