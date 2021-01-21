import Input from "./classes/Input.js";
import Loader from "./classes/Loader.js";
import PokemonSpecies from "./classes/PokemonSpecies.js";
import RoamState from "./classes/states/RoamState.js";
import StateStack from "./classes/StateStack.js";
import Vector from "./classes/Vector.js";
import { PokemonType } from './classes/PokemonSpecies.js';
import PokemonCreature from "./classes/PokemonCreature.js";
import PokemonMove from "./classes/PokemonMove.js";

const cnv = document.getElementById('screen') as HTMLCanvasElement;
const ctx = cnv.getContext('2d') as CanvasRenderingContext2D;
ctx.imageSmoothingEnabled = false;
export const FPS = 60;
const loader = new Loader();
const input = new Input();
const stateStack = new StateStack(loader);
const PIKACHU = new PokemonSpecies('pikachu', [PokemonType.ELECTRIC]);
PIKACHU.stats.Atk = 30;
PIKACHU.stats.Def = 20;

document.querySelector('button')?.click();

const THUNDER_BOLT = new PokemonMove(PokemonType.ELECTRIC, 90);
export const SPECIES = {
	PIKACHU
}

export const PARTY = [
	new PokemonCreature('pikachu')
]
export const WILD = new PokemonCreature('pikachu')

async function setup() {
	input.start(document)
	const r = new RoamState(stateStack);
	stateStack.states.push(r)
	await preload();
	init();
	setInterval(update, 1000 / FPS);
	render();
}
async function preload() {
	await stateStack.preload();
}
function init() {
	stateStack.init();
}
function update() {
	stateStack.update(input);

}
function render() {
	stateStack.render(ctx);

	requestAnimationFrame(render);
}
window.onload = () => setup()