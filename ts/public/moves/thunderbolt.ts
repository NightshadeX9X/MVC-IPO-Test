import { TSONPokemonMove } from "../classes/PokemonMove.js";
import { PokemonTypes } from "../classes/PokemonSpecies.js";


const thunderbolt: TSONPokemonMove = {
	name: 'thunderbolt',
	displayName: 'Thunderbolt',
	type: PokemonTypes.ELECTRIC,
	damage: 90
}

export default thunderbolt;
