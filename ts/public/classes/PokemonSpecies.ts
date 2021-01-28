import Loader from "./Loader.js";

export default class PokemonSpecies {
	public stats = generateEmptyStats();
	public static list = new Map<string, PokemonSpecies>();
	constructor(public name: string, public displayName: string, public types: [PokemonTypes, PokemonTypes?]) {
		PokemonSpecies.list.set(name, this);
	}
	public static async load(loader: Loader, name: string) {
		const json = await loader.loadJSON(`/json/species/${name}.json`) as JSONSpecies;
		const types = json.types.map(t => {
			if (t === undefined) return t;
			return PokemonTypes[t];
		})
		const species = new PokemonSpecies(json.name, json.displayName, types as PokemonSpecies["types"]);
		species.stats = json.stats;
	}

	async sprite() {

	}
}

export function generateEmptyStats() {
	let stats: PokemonStats = {
		HP: 0,
		Atk: 0,
		Def: 0,
		SpA: 0,
		SpD: 0,
		Spe: 0
	}

	return stats;
}

export enum PokemonTypes {
	NORMAL,
	FIGHTING,
	FIRE,
	WATER,
	GRASS,
	ELECTRIC,
	ICE,
	GROUND,
	ROCK,
	STEEL,
	FAIRY,
	DRAGON,
	DARK,
	GHOST,
	BUG,
	POISON,
	FLYING,
	PSYCHIC
}
export type PokemonType = keyof typeof PokemonTypes;

export enum PokemonStat {
	HP,
	Atk,
	Def,
	SpA,
	SpD,
	Spe
}

export type PokemonStats = Record<keyof typeof PokemonStat, number>;

export interface JSONSpecies {
	name: string;
	displayName: string;
	types: [PokemonType, PokemonType?];
	stats: PokemonStats
}