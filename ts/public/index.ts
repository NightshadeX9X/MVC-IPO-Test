import Input from "./classes/Input.js";
import Loader from "./classes/Loader.js";
import RoamState from "./classes/states/RoamState.js";
import StateStack from "./classes/StateStack.js";
import Vector from "./classes/Vector.js";

const cnv = document.getElementById('screen') as HTMLCanvasElement;
const ctx = cnv.getContext('2d') as CanvasRenderingContext2D;
export const FPS = 10;
const loader = new Loader();
const input = new Input();
const stateStack = new StateStack(loader);

async function setup() {
	const r = new RoamState(stateStack);
	stateStack.states.push(r)
	console.log(r)
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