import PokemonSpecies, { generateEmptyStats, PokemonStats } from './PokemonSpecies.js';
export default class PokemonCreature {
	public species: PokemonSpecies | undefined;
	public stats: PokemonStats;
	constructor(speciesName: string) {
		this.species = PokemonSpecies.list.get(speciesName);
		this.stats = this.species?.stats || generateEmptyStats();
	}
}