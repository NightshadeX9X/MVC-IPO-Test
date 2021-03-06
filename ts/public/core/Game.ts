import Party from "../pokemon/Party.js";
import PokemonCreature from "../pokemon/PokemonCreature.js";
import RoamState from "../states/RoamState.js";
import { Parents } from "../util/functions.js";
import UIDGen from "../util/UIDGen.js";
import { Preloadable, Renderable, Updatable } from "./Attributes.js";
import Input from "./Input.js";
import Loader from "./Loader.js";
import StateStack from "./StateStack.js";

interface Game extends Renderable, Updatable, Preloadable { }
@Parents(Preloadable, Updatable, Renderable)
class Game {
	stateStack: StateStack;
	cnv = document.getElementById('screen') as HTMLCanvasElement;
	ctx = this.cnv.getContext('2d') as CanvasRenderingContext2D;
	input = new Input();
	loader = new Loader();
	fps = 60;
	stateIDGen = new UIDGen();
	party = new Party();

	constructor() {
		Preloadable.call(this)
		Updatable.call(this)
		Renderable.call(this)
		this.stateStack = new StateStack(this, this);
		this.stateIDGen.prefix = "STATE";
		this.party.pokemon.push(new PokemonCreature('pikachu'))
	}

	async preload() {
		this.input.start(document);
		await this.stateStack.push(new RoamState(this.stateStack));
	}

	update() {
		this.stateStack.update(this.input);
	}

	render() {
		this.stateStack.render(this.ctx);
	}
}

export default Game;