import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import * as bcrypt from 'bcrypt';
@Injectable()
export class SeedService {
  constructor(
    private readonly productService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.insertNewUsers();
    this.insertNewProducts(adminUser);
    return `Seed Executed`;
  }

  private async deleteTables() {
    await this.productService.deleteAllProducts();
    const query = this.userRepository.createQueryBuilder('user');

    await query.delete().where({}).execute();
  }
  private async insertNewUsers(): Promise<User> {
    const seedUsers = initialData.users;
    const users: User[] = [];

    seedUsers.forEach((user) => {
      //encriptar la contraseña
      (user.password = bcrypt.hashSync(user.password, 10)),
        users.push(this.userRepository.create(user));
    });

    await this.userRepository.save(users);
    return users[0];
  }
  private async insertNewProducts(user: User) {
    await this.productService.deleteAllProducts();
    const products = initialData.products;
    const insertPromises = [];

    products.forEach(async (product) => {
      insertPromises.push(this.productService.create(product, user));
    });

    await Promise.all(insertPromises);
    return true;
  }
}
