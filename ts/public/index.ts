import Game from './core/Game.js';
import { New } from './util/functions.js';
console.log("hello")

const game = New(Game);

async function preload() {
	await game.preload();
}

async function update() {
	game.update();
}

async function render() {
	game.render();
	window.requestAnimationFrame(() => render());
}

async function setup() {
	await preload();
	setInterval(() => {
		update()
	}, 1000 / game.fps);
	render();
}

window.onload = () => {
	setup();
}
