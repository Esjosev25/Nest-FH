import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Tshit teslo new',
    description: 'Product title (unique)',
    nullable: false,
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({
    example: 199,
    description: 'Product Price',
    default: 0,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price: number;

  @ApiProperty({
    example: 'Deserunt consectetur occaecat ipsum sit voluptate pariatur.',
    description: 'Product Description',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @IsOptional()
  stock?: number;

  @ApiProperty()
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @ApiProperty()
  @IsIn(['men', 'women', 'kid', 'unis'])
  gender: string;

  @ApiProperty()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @IsArray()
  @IsOptional()
  tags: string[];

  @ApiProperty()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
