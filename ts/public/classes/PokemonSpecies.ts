import Loader from "./Loader.js";

export default class PokemonSpecies {
	public static list: PokemonSpecies[] = [];
	private image: HTMLImageElement | null = null;
	constructor(public name: string, public typeComb: PokemonTypeComb, public imageUrl: string, public baseStats: PokemonStats) { }

	async loadImage(loader: Loader) {
		this.image = await loader.image(this.imageUrl);
		return this.image;
	}
}
export interface PokemonStats {
	HP: number;
	Atk: number;
	Def: number;
	SpA: number;
	SpD: number;
	Spe: number;
}
export type PokemonTypeComb = [PokemonType] | [PokemonType, PokemonType];
export enum PokemonType {
	NORMAL,
	FIGHTING,
	FIRE,
	WATER,
	GRASS,
	ELECTRIC,
	ICE,
	GROUND,
	FLYING,
	BUG,
	ROCK,
	POISON,
	PSYCHIC,
	STEEL,
	GHOST,
	DRAGON,
	FAIRY,
	DARK,
}