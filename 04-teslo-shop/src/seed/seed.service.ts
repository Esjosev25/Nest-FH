import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(private readonly productService: ProductsService) {}
  async runSeed() {
    this.insertNewProducts();
    return `This action returns all seed`;
  }

  private async insertNewProducts() {
    await this.productService.deleteAllProducts();
    const products = initialData.products;
    const insertPromises = [];

    products.forEach(async (product) => {
      insertPromises.push(this.productService.create(product));
    });

    await Promise.all(insertPromises);
    return true;
  }
}
