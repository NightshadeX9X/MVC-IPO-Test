import Input from "./classes/Input.js";
import Loader from "./classes/Loader.js";
import PokemonSpecies from "./classes/PokemonSpecies.js";
import RoamState from "./classes/states/RoamState.js";
import StateStack from "./classes/StateStack.js";
import { PokemonTypes } from './classes/PokemonSpecies.js';
import PokemonCreature from "./classes/PokemonCreature.js";
import PokemonMove from "./classes/PokemonMove.js";
const cnv = document.getElementById('screen');
const ctx = cnv.getContext('2d');
ctx.imageSmoothingEnabled = false;
export const FPS = 60;
const loader = new Loader();
const input = new Input();
const stateStack = new StateStack(loader);
const PIKACHU = new PokemonSpecies('pikachu', "Pikachu", [PokemonTypes.ELECTRIC]);
PIKACHU.stats.Atk = 30;
PIKACHU.stats.Def = 100;
PIKACHU.stats.HP = 20;
document.querySelector('button')?.click();
const THUNDERBOLT = new PokemonMove('thunderbolt', 'Thunderbolt', PokemonTypes.ELECTRIC, 90);
const QUICK_ATTACK = new PokemonMove('quick_attack', 'Quick Attack', PokemonTypes.NORMAL, 40);
const IRON_TAIL = new PokemonMove('iron_tail', 'Iron Tail', PokemonTypes.STEEL, 100);
const ELECTROBALL = new PokemonMove('electroball', 'Electroball', PokemonTypes.ELECTRIC, 80);
export const SPECIES = {
    PIKACHU
};
export const PARTY = [
    new PokemonCreature('pikachu')
];
PARTY[0].nickname = "Pikaboy";
export const WILD = new PokemonCreature('pikachu');
async function setup() {
    document.querySelector('button')?.click();
    input.start(document);
    const r = new RoamState(stateStack);
    stateStack.states.push(r);
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
window.onload = () => setup();
