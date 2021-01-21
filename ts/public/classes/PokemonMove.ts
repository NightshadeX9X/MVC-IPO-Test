import PokemonCreature from './PokemonCreature.js';
import { PokemonType } from './PokemonSpecies.js';
export default class PokemonMove {
	constructor(public type: PokemonType, public damage: number) {

	}

	getDamageDoneTo(attacker: PokemonCreature, defender: PokemonCreature) {
		return this.damage + attacker.stats.Atk - defender.stats.Def;
	}
}