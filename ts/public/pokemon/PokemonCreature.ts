import Loader from "../core/Loader.js";
import { Gender } from "../util/enums.js";
import { chance, random } from "../util/functions.js";
import UIDGen from "../util/UIDGen.js";
import Pokemon from "./Pokemon.js";
import PokemonSpecies from "./PokemonSpecies.js";

class PokemonCreature {
	species: PokemonSpecies = null as any;
	gender: Gender = null as any;
	stats = Pokemon.Stats.empty();
	static idGen = new UIDGen();
	id = PokemonCreature.idGen.generate();
	isWild = false;
	constructor(public speciesName: string) {

	}

	private setRandomGender() {
		if (!this.species) return;
		const maleChance = chance(this.species.genderRatio[Gender.MALE]);
		if (maleChance) this.gender = Gender.MALE;
		else this.gender = Gender.FEMALE;
	}

	async loadSpecies(loader: Loader) {
		const species = new PokemonSpecies(this.speciesName);
		await species.load(loader);
		this.species = species;

		this.setRandomGender();
	}
}
PokemonCreature.idGen.prefix = "PKMN_CREATURE"
export default PokemonCreature;