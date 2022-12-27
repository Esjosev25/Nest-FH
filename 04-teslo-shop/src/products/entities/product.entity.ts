import { ProductImage } from './product-image.entity';
import { User } from '../../auth/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: '5ab30815-a4d8-41e1-b769-365fa4118c02',
    description: 'Product ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Tshirt Teslo',
    description: 'Product Title',
    uniqueItems: true,
  })
  @Column({
    type: 'text',
    unique: true,
  })
  title: string;

  @ApiProperty({
    example: 199.0,
    description: 'Product Price',
    default: 0,
  })
  @Column({
    type: 'float',
    default: 0,
  })
  price: number;

  @ApiProperty({
    example: 'Ex sint duis commodo eiusmod commodo est exercitation magna.',
    description: 'Product description',
    default: null,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @ApiProperty({
    example: 'tshirt_teslo',
    description: 'Product SLUG - SEO',
    uniqueItems: true,
  })
  @Column({
    type: 'text',
    unique: true,
  })
  slug: string;

  @ApiProperty({
    example: 5000,
    description: 'Product Stock',
    default: 0,
  })
  @Column({
    type: 'int',
    default: 0,
  })
  stock: number;

  @ApiProperty({
    example: ['M', 'XL', 'S'],
    description: 'Product Sizes',
  })
  @Column({
    type: 'text',
    array: true,
  })
  sizes: string[];

  @ApiProperty({
    example: 'women',
    description: 'Product Gender',
  })
  @Column({
    type: 'text',
  })
  gender: string;

  @ApiProperty({
    example: ['shirt', 'teslo'],
    description: 'Product Tags',
    default: [],
  })
  @Column({
    type: 'text',
    array: true,
    default: [],
  })
  tags: string[];

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @ManyToOne(() => User, (user) => user.product, {
    //carga automaticamente la relacion cuando se haga un get
    eager: true,
  })
  user: User;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.normalizeSlug(this.slug);
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.normalizeSlug(this.slug);
  }

  normalizeSlug(slug: string) {
    return slug.toLowerCase().replaceAll("'", '').replaceAll(' ', '_');
  }
}
