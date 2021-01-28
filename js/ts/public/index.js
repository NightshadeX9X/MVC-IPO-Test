import RoamState from "./classes/states/RoamState.js";
import { PokemonTypes } from './classes/PokemonSpecies.js';
import PokemonMove from "./classes/PokemonMove.js";
import Game from "./classes/Game.js";
const cnv = document.getElementById('screen');
const ctx = cnv.getContext('2d');
ctx.imageSmoothingEnabled = false;
document.querySelector('button')?.click();
const THUNDERBOLT = new PokemonMove('thunderbolt', 'Thunderbolt', PokemonTypes.ELECTRIC, 90);
const QUICK_ATTACK = new PokemonMove('quick_attack', 'Quick Attack', PokemonTypes.NORMAL, 40);
const IRON_TAIL = new PokemonMove('iron_tail', 'Iron Tail', PokemonTypes.STEEL, 100);
const EARTHQUAKE = new PokemonMove('earthquake', 'Earthquake', PokemonTypes.GROUND, 100);
const ELECTROBALL = new PokemonMove('electroball', 'Electroball', PokemonTypes.ELECTRIC, 80);
const PSYCHIC = new PokemonMove('psychic', 'Psychic', PokemonTypes.PSYCHIC, 90);
const DARK_PULSE = new PokemonMove('dark_pulse', 'Dark Pulse', PokemonTypes.DARK, 80);
const U_TURN = new PokemonMove('u_turn', 'U-Turn', PokemonTypes.BUG, 70);
QUICK_ATTACK.priority = 1;
const game = new Game();
async function setup() {
    game.input.start(document);
    const r = new RoamState(game.stateStack);
    game.stateStack.states.push(r);
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
window.onload = () => setup();
