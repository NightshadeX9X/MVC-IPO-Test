import { cloneObject, IDGenerator, random } from '../Util.js';
import PokemonSpecies, { generateEmptyStats, PokemonStats, PokemonStat } from './PokemonSpecies.js';
export default class PokemonCreature {
	public static idGen = IDGenerator();
	public id = PokemonCreature.idGen.next().value as number;
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
	];
	public EVs = generateEmptyStats();
	public IVs: PokemonStats = {
		HP: random(0, 31),
		Atk: random(0, 31),
		Def: random(0, 31),
		SpA: random(0, 31),
		SpD: random(0, 31),
		Spe: random(0, 31),
	};
	constructor(speciesName: string) {
		this.species = PokemonSpecies.list.get(speciesName) as PokemonSpecies;
		this.stats = this.calcStats();
		this.nickname = this.species?.displayName || "Pokemon";
		this.maxHP = Number(this.stats.HP);
	}

	calcStats() {
		const stats = generateEmptyStats();
		const nonHpStats = ["Atk", "Def", "SpA", "SpD", "Spe"] as (keyof typeof PokemonStat)[]
		const level = this.level;
		const floor = Math.floor;
		nonHpStats.forEach((statName) => {
			const base = this.species.stats[statName];
			const IV = this.IVs[statName];
			const EV = this.EVs[statName];
			stats[statName] = floor(
				floor(floor(2 * base + IV + floor(EV / 4)) * level / 100)
				+ 5
			)
		});
		console.log(level)
		const HPBase = this.species.stats.HP;
		const HPIV = this.IVs.HP;
		const HPEV = this.EVs.HP;
		stats.HP = floor((floor(
			2 * HPBase + HPIV + HPEV / 4
		) * level / 100) + level + 10);

		return stats;
	}

	canBattle() {
		return this.stats.HP > 0;
	}

	heal() {
		this.stats.HP = this.maxHP;
	}
}