import { MoveCategory, TSONPokemonMove } from "../classes/PokemonMove.js";
import { PokemonTypes } from "../classes/PokemonSpecies.js";


const shadow_sneak: TSONPokemonMove = {
	name: 'shadow_sneak',
	displayName: 'Shadow Sneak',
	type: PokemonTypes.GHOST,
	damage: 40,
	priority: 1,
	category: MoveCategory.PHYSICAL,

}

export default shadow_sneak;
