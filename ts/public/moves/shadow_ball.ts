import { MoveCategory, TSONPokemonMove } from "../classes/PokemonMove.js";
import { PokemonTypes } from "../classes/PokemonSpecies.js";


const shadow_ball: TSONPokemonMove = {
	name: 'shadow_ball',
	displayName: 'Shadow Ball',
	type: PokemonTypes.GHOST,
	damage: 80,
	category: MoveCategory.SPECIAL,
}

export default shadow_ball;
