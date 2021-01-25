import typeEffectiveness, { calcTypeEffectiveness } from '../PokemonTypeEffectiveness.js';
import { random } from '../Util.js';
import PokemonCreature from './PokemonCreature.js';
import { PokemonTypes } from './PokemonSpecies.js';
export default class PokemonMove {
	public priority = 0;
	public static list = new Map<string, PokemonMove>();
	constructor(public name: string, public displayName: string, public type: PokemonTypes, public damage: number) {
		PokemonMove.list.set(name, this);
	}

	getDamageDoneTo(attacker: PokemonCreature, defender: PokemonCreature) {
		let amount = (this.damage + attacker.stats.Atk - defender.stats.Def);
		let randomMultipler = random(85, 100, false) / 100;
		let typeEff = calcTypeEffectiveness(this.type, defender.species.types)
		if (typeEff === 0) return 0;
		let STAB = attacker.species.types.includes(this.type) ? 1.5 : 1;
		amount *= randomMultipler
		amount *= attacker.level;
		amount /= (defender.level || 1);
		amount *= typeEff;
		amount *= STAB;

		let ceil = Math.ceil(amount)
		let toReturn = ceil > 1 ? ceil : 1;
		return toReturn;
	}
}