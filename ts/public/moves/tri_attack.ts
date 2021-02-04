import { MoveCategory, TSONPokemonMove } from "../classes/PokemonMove.js";
import { PokemonTypes } from "../classes/PokemonSpecies.js";


const tri_attack: TSONPokemonMove = {
	name: 'tri_attack',
	displayName: 'Tri Attack',
	type: PokemonTypes.NORMAL,
	damage: 80,
	category: MoveCategory.SPECIAL,
}

export default tri_attack;
