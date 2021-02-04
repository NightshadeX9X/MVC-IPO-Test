import { IDGenerator, random } from '../Util.js';
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
        this.EVs = generateEmptyStats();
        this.IVs = {
            HP: random(0, 31),
            Atk: random(0, 31),
            Def: random(0, 31),
            SpA: random(0, 31),
            SpD: random(0, 31),
            Spe: random(0, 31),
        };
        this.species = PokemonSpecies.list.get(speciesName);
        this.stats = this.calcStats();
        this.nickname = this.species?.displayName || "Pokemon";
        this.maxHP = Number(this.stats.HP);
    }
    calcStats() {
        const stats = generateEmptyStats();
        const nonHpStats = ["Atk", "Def", "SpA", "SpD", "Spe"];
        const level = this.level;
        const floor = Math.floor;
        nonHpStats.forEach((statName) => {
            const base = this.species.stats[statName];
            const IV = this.IVs[statName];
            const EV = this.EVs[statName];
            stats[statName] = floor(floor(floor(2 * base + IV + floor(EV / 4)) * level / 100)
                + 5);
        });
        console.log(level);
        const HPBase = this.species.stats.HP;
        const HPIV = this.IVs.HP;
        const HPEV = this.EVs.HP;
        stats.HP = floor((floor(2 * HPBase + HPIV + HPEV / 4) * level / 100) + level + 10);
        return stats;
    }
    canBattle() {
        return this.stats.HP > 0;
    }
    heal() {
        this.stats.HP = this.maxHP;
    }
    isFullyHealed() {
        return this.stats.HP === this.maxHP;
    }
    refreshStats() {
        this.stats = this.calcStats();
        this.maxHP = this.stats.HP;
    }
}
PokemonCreature.idGen = IDGenerator();
