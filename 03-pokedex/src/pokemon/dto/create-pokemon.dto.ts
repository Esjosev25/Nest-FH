import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  IsPositive,
  MinLength,
} from 'class-validator';

export class CreatePokemonDto {
  @IsInt()
  @Min(1)
  @IsPositive()
  no: number;
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  name: string;
}
