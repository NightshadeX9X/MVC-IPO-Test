import PokemonSpecies, { generateEmptyStats } from './PokemonSpecies.js';
export default class PokemonCreature {
    constructor(speciesName) {
        this.species = PokemonSpecies.list.get(speciesName);
        this.stats = this.species?.stats || generateEmptyStats();
    }
}
