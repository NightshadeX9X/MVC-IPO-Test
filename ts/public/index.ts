import Input from "./classes/Input.js";
import Loader from "./classes/Loader.js";
import PokemonSpecies from "./classes/PokemonSpecies.js";
import RoamState from "./classes/states/RoamState.js";
import StateStack from "./classes/StateStack.js";
import Vector from "./classes/Vector.js";
import { PokemonTypes } from './classes/PokemonSpecies.js';
import PokemonCreature from "./classes/PokemonCreature.js";
import PokemonMove from "./classes/PokemonMove.js";

const cnv = document.getElementById('screen') as HTMLCanvasElement;
const ctx = cnv.getContext('2d') as CanvasRenderingContext2D;
ctx.imageSmoothingEnabled = false;
export const FPS = 60;
const loader = new Loader();
const input = new Input();
const stateStack = new StateStack(loader);
const PIKACHU = new PokemonSpecies('pikachu', "Pikachu", [PokemonTypes.ELECTRIC, PokemonTypes.GHOST]);
const GRENINJA = new PokemonSpecies('greninja', "Greninja", [PokemonTypes.WATER, PokemonTypes.GROUND]);
PIKACHU.stats.Atk = 20;
PIKACHU.stats.Def = 20;
PIKACHU.stats.HP = 200;

GRENINJA.stats.Atk = 50;
GRENINJA.stats.Def = 30;
GRENINJA.stats.HP = 100;

document.querySelector('button')?.click();

const THUNDERBOLT = new PokemonMove('thunderbolt', 'Thunderbolt', PokemonTypes.ELECTRIC, 90);
const QUICK_ATTACK = new PokemonMove('quick_attack', 'Quick Attack', PokemonTypes.NORMAL, 40);
const IRON_TAIL = new PokemonMove('iron_tail', 'Iron Tail', PokemonTypes.STEEL, 100);
const EARTHQUAKE = new PokemonMove('earthquake', 'Earthquake', PokemonTypes.GROUND, 100);
const ELECTROBALL = new PokemonMove('electroball', 'Electroball', PokemonTypes.ELECTRIC, 80);
const DARK_PULSE = new PokemonMove('dark_pulse', 'Dark Pulse', PokemonTypes.DARK, 80);
const U_TURN = new PokemonMove('u_turn', 'U-Turn', PokemonTypes.BUG, 70);
QUICK_ATTACK.priority = 1;
export const SPECIES = {
	PIKACHU,
	GRENINJA
}

export const PARTY = [
	new PokemonCreature('greninja')
];
PARTY[0].nickname = "Ninja"
PARTY[0].moves = [
	"dark_pulse",
	"u_turn",
	"quick_attack",
	"earthquake"
]
async function setup() {
	document.querySelector('button')?.click();
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