import { cloneObject, IDGenerator } from '../Util.js';
import PokemonSpecies, { generateEmptyStats } from './PokemonSpecies.js';
export default class PokemonCreature {
    constructor(speciesName) {
        this.id = PokemonCreature.idGen.next().value;
        this.level = 20;
        this.moves = [
            "thunderbolt",
            "electroball",
            "iron_tail",
            "quick_attack"
        ];
        this.species = PokemonSpecies.list.get(speciesName);
        this.stats = generateEmptyStats();
        if (this.species?.stats) {
            this.stats = cloneObject(this.species.stats);
        }
        this.nickname = this.species?.displayName || "Pokemon";
        this.maxHP = this.stats.HP;
    }
    canBattle() {
        return this.stats.HP > 0;
    }
    heal() {
        this.stats.HP = this.maxHP;
    }
}
PokemonCreature.idGen = IDGenerator();
