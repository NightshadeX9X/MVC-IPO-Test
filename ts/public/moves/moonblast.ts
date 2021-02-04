import { MoveCategory, TSONPokemonMove } from "../classes/PokemonMove.js";
import { PokemonTypes } from "../classes/PokemonSpecies.js";


const moonblast: TSONPokemonMove = {
	name: 'moonblast',
	displayName: 'Moonblast',
	type: PokemonTypes.FAIRY,
	damage: 95,
	category: MoveCategory.SPECIAL,
}

export default moonblast;
