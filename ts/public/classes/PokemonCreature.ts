import { cloneObject } from '../Util.js';
import PokemonSpecies, { generateEmptyStats, PokemonStats } from './PokemonSpecies.js';
export default class PokemonCreature {
	public species: PokemonSpecies;
	public nickname: string;
	public stats: PokemonStats;
	public maxHP: number;
	public level = 20;
	public moves = [
		"thunderbolt",
		"electroball",
		"iron_tail",
		"quick_attack"
	]
	constructor(speciesName: string) {
		this.species = PokemonSpecies.list.get(speciesName) as PokemonSpecies;
		this.stats = generateEmptyStats();
		if (this.species?.stats) {
			this.stats = cloneObject(this.species.stats) as PokemonStats;
		}
		this.nickname = this.species?.displayName || "Pokemon";
		this.maxHP = this.stats.HP;
	}

	canBattle() {
		return this.stats.HP > 0;
	}
}