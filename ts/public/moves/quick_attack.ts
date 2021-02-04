import { MoveCategory, TSONPokemonMove } from "../classes/PokemonMove.js";
import { PokemonTypes } from "../classes/PokemonSpecies.js";


const quick_attack: TSONPokemonMove = {
	name: 'quick_attack',
	displayName: 'Quick Attack',
	type: PokemonTypes.NORMAL,
	damage: 40,
	priority: 1,
	category: MoveCategory.PHYSICAL,

}

export default quick_attack;
