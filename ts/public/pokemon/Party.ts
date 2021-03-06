import PokemonCreature from "./PokemonCreature.js";

class Party {
	pokemon: PokemonCreature[] = [];

	constructor() {

	}

	get head() {
		return this.pokemon[0];
	}
}

export default Party;