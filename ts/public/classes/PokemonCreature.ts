import { cloneObject } from '../Util.js';
import PokemonSpecies, { generateEmptyStats, PokemonStats } from './PokemonSpecies.js';
export default class PokemonCreature {
	public species: PokemonSpecies | undefined;
	public stats: PokemonStats;
	public maxHP: number;
	constructor(speciesName: string) {
		this.species = PokemonSpecies.list.get(speciesName);
		this.stats = generateEmptyStats();
		if (this.species?.stats) {
			this.stats = cloneObject(this.species.stats) as PokemonStats;
		}
		this.maxHP = this.stats.HP;
	}
}