import Party from "./Party.js";
import StateStack from "./StateStack.js";
import Loader from './Loader.js';
import Input from "./Input.js";
import PokemonCreature from "./PokemonCreature.js";
import PokemonSpecies, { generateEmptyStats, JSONSpecies, PokemonType } from "./PokemonSpecies.js";
import { PokemonTypes } from './PokemonSpecies.js';

export default class Game {
	fps = 60;
	input = new Input()
	loader = new Loader()
	stateStack = new StateStack(this)
	party = new Party()
	constructor() {
		console.log("new code")
	}

	private async loadPartySpecies() {
		const speciesNames = ['pikachu', 'greninja'];
		await Promise.all(speciesNames.map(n => PokemonSpecies.load(this.loader, n)))
	}

	private initParty() {
		this.party.pokemon = [
			new PokemonCreature('greninja'),
			new PokemonCreature('pikachu')
		];
		this.party.pokemon[0].nickname = "Ninja"
		this.party.pokemon[1].nickname = "Mega Pichu Man"
		this.party.pokemon[1].level = 60;

		[this.party.pokemon[0], this.party.pokemon[1]] = [this.party.pokemon[1], this.party.pokemon[0]]

		this.party.pokemon.forEach(p => {

			p.refreshStats()
		})
	}

	async preload() {
		// Remove these next two lines in production
		await this.loadPartySpecies();
		this.initParty();
		await this.stateStack.preload();
	}
}