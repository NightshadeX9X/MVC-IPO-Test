import Renderer from './classes/Renderer.js';
import StateStack from './classes/StateStack.js';
import Input from './classes/Input.js';
const cnv = document.getElementById('screen') as HTMLCanvasElement;
const ctx = cnv.getContext('2d') as CanvasRenderingContext2D;
export const fps = 30;

const renderer = new Renderer(cnv);
const input = new Input();
const stateStack = new StateStack();

async function preload() {
	await stateStack.preload();
}
async function setup() {
	await preload();

	input.start(document);
	let times = 0;
	setInterval(() => {
		update(input);
		times++;
	}, 1000 / fps);

	render();
}

function update(input: Input) {
	stateStack.update(input);
}
function render() {
	stateStack.render(renderer);

	requestAnimationFrame(render);
}
window.onload = async () => {
	await setup()
}


