import Controller from "./classes/Controller.js";
import Loader from "./classes/Loader.js";
import RoamState from "./classes/states/RoamState.js";
import StateStack from "./classes/StateStack.js";

const cnv = document.getElementById('screen') as HTMLCanvasElement;
const ctx = cnv.getContext('2d') as CanvasRenderingContext2D;
export const FPS = 10;
const loader = new Loader();
const controller = new Controller(document);
const stateStack = new StateStack(loader);

stateStack.push(new RoamState(stateStack));

window.onload = () => {
	setup();
}

async function setup() {
	controller.start()
	await preload();

	setInterval(() => {
		update();
	}, 1000 / FPS);

	render();
}

async function preload() {
	await stateStack.preload();
}

function update() {
	stateStack.update(controller);
}

function render() {
	stateStack.render(ctx);

	requestAnimationFrame(render);
}

