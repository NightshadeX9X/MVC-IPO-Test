import { MoveCategory, TSONPokemonMove } from "../classes/PokemonMove.js";
import { PokemonTypes } from "../classes/PokemonSpecies.js";


const ice_beam: TSONPokemonMove = {
	name: 'ice_beam',
	displayName: 'Ice Beam',
	type: PokemonTypes.ICE,
	damage: 90,
	category: MoveCategory.SPECIAL,
}

export default ice_beam;
