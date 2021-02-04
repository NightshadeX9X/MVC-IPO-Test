import { MoveCategory, TSONPokemonMove } from "../classes/PokemonMove.js";
import { PokemonTypes } from "../classes/PokemonSpecies.js";


const dark_pulse: TSONPokemonMove = {
	name: 'dark_pulse',
	displayName: 'Dark Pulse',
	type: PokemonTypes.DARK,
	damage: 80,
	category: MoveCategory.SPECIAL,
}

export default dark_pulse;
