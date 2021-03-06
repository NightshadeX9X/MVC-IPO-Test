import Loader from "../core/Loader.js";
import Party from "../pokemon/Party.js";
import PokemonCreature from '../pokemon/PokemonCreature.js';

class WildBattle {
	constructor(public party: Party, public wild: PokemonCreature) {
		this.wild.isWild = true;
		this.party.pokemon.forEach(p => p.isWild = false);
	}

	async loadAllRequiredSpecies(loader: Loader) {
		await Promise.all(this.allCreatures.map(c => c.loadSpecies(loader)))
	}
	log() {
		function logCreature(c: PokemonCreature) {
			return c.speciesName;
		}
		console.log("PARTY:");
		console.log(`%c ${this.party.pokemon.map(c => logCreature(c)).join("\n")}`, "font-weight: bold; color: #0f0;");
		console.log("\n");

		console.log("WILD:");
		console.log(`%c ${logCreature(this.wild)}`, "font-weight: bold; color: #f00;");
		console.log("\n");
	}

	get allCreatures() {
		return [...this.party.pokemon, this.wild]
	}
}

export default WildBattle;