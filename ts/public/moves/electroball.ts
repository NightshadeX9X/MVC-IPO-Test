import { MoveCategory, TSONPokemonMove } from "../classes/PokemonMove.js";
import { PokemonTypes } from "../classes/PokemonSpecies.js";


const electroball: TSONPokemonMove = {
	name: 'electroball',
	displayName: 'Electroball',
	type: PokemonTypes.ELECTRIC,
	damage: 55,
	category: MoveCategory.SPECIAL,

}

export default electroball;
