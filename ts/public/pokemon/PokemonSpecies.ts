import Loader from "../core/Loader.js";
import { Gender } from "../util/enums.js";
import Pokemon from "./Pokemon.js";

class PokemonSpecies {
	static cache: Record<string, PokemonSpecies> = {};
	baseStats = Pokemon.Stats.empty();
	types: [Pokemon.Type, Pokemon.Type?] = null as any;
	displayName: string = null as any;
	genderRatio: [number, number] = null as any;
	json: PokemonSpecies.JSON = null as any;

	constructor(public name: string) {
		if (PokemonSpecies.cache[name]) return PokemonSpecies.cache[name];
		PokemonSpecies.cache[name] = this;
	}
	async load(loader: Loader) {
		const json = await loader.loadJSON(`/json/species/${this.name}.json`) as PokemonSpecies.JSON;
		this.json = json;

		this.types = this.json.types.filter(t => t).map(t => t && Pokemon.Type[t]) as [Pokemon.Type, Pokemon.Type?];
		this.baseStats = this.json.baseStats;
		this.displayName = this.json.displayName;
		this.genderRatio = this.json.genderRatio;
	}
}

namespace PokemonSpecies {
	export interface JSON {
		types: [Pokemon.Type.AsString, Pokemon.Type.AsString?];
		baseStats: Pokemon.Stats;
		displayName: string;
		genderRatio: [number, number];
	}
}


export default PokemonSpecies;