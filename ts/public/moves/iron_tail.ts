import { MoveCategory, TSONPokemonMove } from "../classes/PokemonMove.js";
import { PokemonTypes } from "../classes/PokemonSpecies.js";


const iron_tail: TSONPokemonMove = {
	name: 'iron_tail',
	displayName: 'Iron Tail',
	type: PokemonTypes.STEEL,
	damage: 100,
	category: MoveCategory.PHYSICAL,

}

export default iron_tail;
