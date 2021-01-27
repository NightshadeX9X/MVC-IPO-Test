import Party from "./Party.js";
import StateStack from "./StateStack.js";
import Loader from './Loader.js';
import Input from "./Input.js";
import PokemonCreature from "./PokemonCreature.js";

export default class Game {
	fps = 60;
	input = new Input()
	loader = new Loader()
	stateStack = new StateStack(this)
	party = new Party()
	constructor() {
		this.party.pokemon = [
			new PokemonCreature('greninja'),
			new PokemonCreature('pikachu')
		];
		this.party.pokemon[0].nickname = "Ninja"
		this.party.pokemon[0].moves = [
			"dark_pulse",
			"u_turn",
			"quick_attack",
			"psychic"
		];
		this.party.pokemon[1].nickname = "Mega Pichu Man"
		this.party.pokemon[1].moves = [
			"dark_pulse",
			"u_turn",
			"iron_tail",
			"thunderbolt"
		]
		this.party.pokemon[1].level = 80;
	}
}