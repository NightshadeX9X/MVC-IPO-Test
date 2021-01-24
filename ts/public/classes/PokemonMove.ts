import typeEffectiveness, { calcTypeEffectiveness } from '../PokemonTypeEffectiveness.js';
import { random } from '../Util.js';
import PokemonCreature from './PokemonCreature.js';
import { PokemonTypes } from './PokemonSpecies.js';
export default class PokemonMove {
	public priority = 0;
	public static list = new Map<string, PokemonMove>();
	constructor(public name: string, public displayName: string, public type: PokemonTypes, public damage: number) {
		if (this.name === "thunderbolt") this.priority = 2;
		PokemonMove.list.set(name, this);
	}

	getDamageDoneTo(attacker: PokemonCreature, defender: PokemonCreature) {
		let multiplier = random(85, 100, false) / 100;
		let typeEff = calcTypeEffectiveness(this.type, defender.species.types)
		let amount = Math.ceil((this.damage + attacker.stats.Atk - defender.stats.Def) * multiplier * attacker.level / defender.level * typeEff);
		return amount > 1 ? amount : 1;
	}
}