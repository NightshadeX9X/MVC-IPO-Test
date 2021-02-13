import Game from "./core/Game.js";


async function preload(game: Game) {
	await game.preload();
}

function update(game: Game) {
	game.update();
}

function render(game: Game) {
	game.render();
	window.requestAnimationFrame(() => {
		render(game);
	});
}

async function init(game: Game) {
	await preload(game);
	setInterval(() => {
		update(game);
	}, 1000 / game.fps);
	render(game)
}

window.addEventListener('load', () => {
	const game = new Game();

	init(game);
});