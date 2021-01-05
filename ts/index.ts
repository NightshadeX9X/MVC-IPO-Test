import Renderer from './classes/Renderer.js';
import StateStack from './classes/StateStack.js';
const cnv = document.getElementById('screen') as HTMLCanvasElement;
const ctx = cnv.getContext('2d') as CanvasRenderingContext2D;
const fps = 10;

const renderer = new Renderer(cnv);
const stateStack = new StateStack();
async function preload() {
	await stateStack.preload();
}
async function setup() {
	await preload();

	setInterval(() => {
		update();
	}, 1000 / fps);

	render();
}
function update() {
	stateStack.update();
}
function render() {
	stateStack.render(renderer);

	requestAnimationFrame(render);
}
window.onload = async () => {
	await setup()
}


