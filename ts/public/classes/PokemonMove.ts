import typeEffectiveness, { calcTypeEffectiveness } from '../PokemonTypeEffectiveness.js';
import { random } from '../Util.js';
import Loader from './Loader.js';
import PokemonCreature from './PokemonCreature.js';
import { PokemonTypes } from './PokemonSpecies.js';

export interface TSONPokemonMove {
	name: string;
	displayName: string;
	type: PokemonTypes;
	damage: number;
	priority?: number
}
export default class PokemonMove implements PokemonMove {
	public priority = 0;
	public static list = new Map<string, PokemonMove>();
	public static async load(loader: Loader, name: string) {
		const imp = await loader.loadJS<{ default: TSONPokemonMove }>(`/js/moves/${name}.js`);
		const moveData = imp.default;
		const move = new PokemonMove(moveData.name, moveData.displayName, moveData.type, moveData.damage);
		move.priority = Number(moveData.priority);
	}
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