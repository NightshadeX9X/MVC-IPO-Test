import { TSONPokemonMove } from "../classes/PokemonMove.js";
import { PokemonTypes } from "../classes/PokemonSpecies.js";


const quickAttack: TSONPokemonMove = {
	name: 'quick_attack',
	displayName: 'Quick Attack',
	type: PokemonTypes.NORMAL,
	damage: 40,
	priority: 1
}

export default quickAttack;
