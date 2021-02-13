import Game from "./core/Game.js";
async function preload(game) {
    await game.preload();
}
function update(game) {
    game.update();
}
function render(game) {
    game.render();
    window.requestAnimationFrame(() => {
        render(game);
    });
}
async function init(game) {
    await preload(game);
    setInterval(() => {
        update(game);
    }, 1000 / game.fps);
    render(game);
}
window.addEventListener('load', () => {
    const game = new Game();
    init(game);
});
