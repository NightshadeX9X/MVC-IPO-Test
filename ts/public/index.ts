import Input from "./classes/Input.js";
import Loader from "./classes/Loader.js";
import PokemonSpecies from "./classes/PokemonSpecies.js";
import RoamState from "./classes/states/RoamState.js";
import StateStack from "./classes/StateStack.js";
import Vector from "./classes/Vector.js";
import { PokemonTypes } from './classes/PokemonSpecies.js';
import PokemonCreature from "./classes/PokemonCreature.js";
import PokemonMove from "./classes/PokemonMove.js";
import Party from "./classes/Party.js";
import Game from "./classes/Game.js";

const cnv = document.getElementById('screen') as HTMLCanvasElement;
const ctx = cnv.getContext('2d') as CanvasRenderingContext2D;
ctx.imageSmoothingEnabled = false;

document.querySelector('button')?.click();


const game = new Game();


async function setup() {
	game.input.start(document)
	const r = new RoamState(game.stateStack);
	game.stateStack.states.push(r)
	await preload();
	init();
	setInterval(update, 1000 / game.fps);
	render();
}
async function preload() {
	await game.preload();
}
function init() {
	game.stateStack.init();
}
function update() {
	game.stateStack.update(game.input);

}
function render() {
	game.stateStack.render(ctx);

	requestAnimationFrame(render);
}

window.onload = () => setup()