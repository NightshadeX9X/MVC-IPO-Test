export default class PokemonSpecies {
	public stats = generateEmptyStats();
	public static list = new Map<string, PokemonSpecies>();
	constructor(public name: string, public types: [PokemonType, PokemonType?]) {
		PokemonSpecies.list.set(name, this);
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

export enum PokemonType {
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

export enum PokemonStat {
	HP,
	Atk,
	Def,
	SpA,
	SpD,
	Spe
}

export type PokemonStats = Record<keyof typeof PokemonStat, number>;