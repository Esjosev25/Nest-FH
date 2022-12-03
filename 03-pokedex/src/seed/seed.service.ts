import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from '../pokemon/pokemon.service';
import { CreatePokemonDto } from '../pokemon/dto/create-pokemon.dto';
import { AxiosAdapter } from '../common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private pokemonModel: Model<Pokemon>,
    private pokemonService: PokemonService,
    private http: AxiosAdapter,
  ) {}
  url: string = 'https://pokeapi.co/api/v2/pokemon?limit=650';
  async executeSeed() {
    await this.pokemonService.deleteAll();
    const data = await this.http.get<PokeResponse>(this.url);
    const pokemonToInsert: CreatePokemonDto[] = [];
    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];
      const pokemon: CreatePokemonDto = {
        no,
        name,
      };
      pokemonToInsert.push(pokemon);
    });

    await this.pokemonModel.insertMany(pokemonToInsert);
    return 'seed executed';
  }
  async executeSeedPromises() {
    await this.pokemonService.deleteAll();
    const data = await this.http.get<PokeResponse>(this.url);
    const insertPromisesArray = [];
    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];
      console.log(no, name);
      const pokemon: CreatePokemonDto = {
        no,
        name,
      };
      insertPromisesArray.push(this.pokemonService.create(pokemon));
    });

    await Promise.all(insertPromisesArray);
    return 'seed executed';
  }
}
