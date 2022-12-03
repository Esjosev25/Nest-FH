import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isUUID } from 'class-validator';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private pokemonModel: Model<Pokemon>,
  ) {}
  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);

      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    return this.pokemonModel.find();
  }

  async findOne(term: string) {
    let pokemon: Pokemon;
    if (!isNaN(+term)) pokemon = await this.pokemonModel.findOne({ no: term });

    if (isValidObjectId(term) && !pokemon) {
      pokemon = await this.pokemonModel.findById(term);
    }

    if (!pokemon) pokemon = await this.pokemonModel.findOne({ name: term });

    if (!pokemon)
      throw new NotFoundException(
        `Pokemon with id, name or no "${term}" not found`,
      );
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    try {
      await pokemon.updateOne(updatePokemonDto, { new: true });
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({ id });

    if (deletedCount === 0)
      throw new BadRequestException(`Pokemon with id "${id}" not found`);

    return;
  }
  async deleteAll() {
    //! Elimina todos los registros.
    await this.pokemonModel.deleteMany({});
  }
  private handleExceptions(error: any) {
    if (error.code === 11000)
      throw new BadRequestException(
        `Pokemon in db ${JSON.stringify(error.keyValue)} already exists`,
      );

    console.log(error);
    throw new InternalServerErrorException(
      `Can't create Pokemon - Check server logs`,
    );
  }
}
