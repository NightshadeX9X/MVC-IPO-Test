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
		console.log(moveData)
	}
	constructor(public name: string, public displayName: string, public type: PokemonTypes, public damage: number, public category = MoveCategory.PHYSICAL) {
		PokemonMove.list.set(name, this);
	}

	getDamageDoneTo(attacker: PokemonCreature, defender: PokemonCreature) {
		if (this.category === MoveCategory.STATUS) return 0;
		const attackingStat = this.category === MoveCategory.PHYSICAL ? attacker.stats.Atk : attacker.stats.SpA;
		const defendingStat = this.category === MoveCategory.PHYSICAL ? defender.stats.Def : defender.stats.SpD;
		let damage = ((2 * attacker.level / 5 + 2) * this.damage * attackingStat / defendingStat / 50 + 2);
		let te = calcTypeEffectiveness(this.type, defender.species.types);
		let rand = random(85, 100) / 100;
		let multiplier = te * rand;
		return Math.floor(damage * multiplier);
	}
}

enum MoveCategory {
	PHYSICAL,
	SPECIAL,
	STATUS
}