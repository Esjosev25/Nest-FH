export const pokemonIds = [1,20,30]
interface Pokemon {
id:number,
name: string,
age?: number;
}

export const bulbasaur: Pokemon = {
  id: 1,
  name: "Bulbasaur",
};
pokemonIds.push(2);