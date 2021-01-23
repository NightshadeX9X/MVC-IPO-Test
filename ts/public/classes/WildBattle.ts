import PokemonCreature from './PokemonCreature.js';
export default class WildBattle {
	constructor(public party: PokemonCreature[], public wild: PokemonCreature) {
		this.wild.stats.HP = this.wild.maxHP;
	}
}