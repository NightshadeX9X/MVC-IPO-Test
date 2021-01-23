import { cloneObject } from '../Util.js';
import PokemonSpecies, { generateEmptyStats } from './PokemonSpecies.js';
export default class PokemonCreature {
    constructor(speciesName) {
        this.species = PokemonSpecies.list.get(speciesName);
        this.stats = generateEmptyStats();
        if (this.species?.stats) {
            this.stats = cloneObject(this.species.stats);
        }
        this.maxHP = this.stats.HP;
    }
}
