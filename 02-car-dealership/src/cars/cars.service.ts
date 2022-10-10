import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Car } from './interfaces/car.interface';
import { v4 as uuid } from 'uuid';
import { CreateCarDto, UpdateCarDto } from './dto';


@Injectable()
export class CarsService {
  private cars: Car[] = [
    {
      id: uuid(),
      brand: 'Toyota',
      model: 'Corolla',
    },
    {
      id: uuid(),
      brand: 'Honda',
      model: 'Civic',
    },
    {
      id: uuid(),
      brand: 'Jeep',
      model: 'Cherokee',
    },
  ];

  public findAll() {
    return this.cars;
  }
  public findOneById(id: string) {
    const car = this.cars.find((car) => car.id === id);
    if (!car) throw new NotFoundException(`Car with id ${id} Not Found`);
    return car;
  }

  public createCar(createCarDto: CreateCarDto) {
    const car: Car = {
      id: uuid(),
      ...createCarDto,
    };

    this.cars.push(car);

    return car;
  }


  public update( id: string, updateCarDto: UpdateCarDto){
    let carDB = this.findOneById(id);
    if( updateCarDto.id && updateCarDto.id !== id)
      throw new BadRequestException('Car id inside body is not valid');
    this.cars = this.cars.map( car => {
      if (car.id == id) {
        carDB = {
          ...carDB,
          ...updateCarDto,
          id
        }
        return carDB;
      }
      return car;
    })
    return carDB;
  }

  public delete(id: string) {
    const carDB = this.findOneById(id);
    this.cars = this.cars.filter(car => car.id !== id)
  }
}
