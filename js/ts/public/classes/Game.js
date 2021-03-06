import Party from "./Party.js";
import StateStack from "./StateStack.js";
import Loader from './Loader.js';
import Input from "./Input.js";
import PokemonCreature from "./PokemonCreature.js";
import PokemonSpecies from "./PokemonSpecies.js";
export default class Game {
    constructor() {
        this.fps = 60;
        this.input = new Input();
        this.loader = new Loader();
        this.stateStack = new StateStack(this);
        this.party = new Party();
    }
    async loadPartySpecies() {
        const speciesNames = ['pikachu', 'greninja'];
        await Promise.all(speciesNames.map(n => PokemonSpecies.load(this.loader, n)));
    }
    initParty() {
        this.party.pokemon = [
            new PokemonCreature('greninja'),
            new PokemonCreature('pikachu')
        ];
        this.party.pokemon[0].nickname = "Ninja";
        this.party.pokemon[0].moves = [
            "dark_pulse",
            "u_turn",
            "quick_attack",
            "psychic"
        ];
        this.party.pokemon[1].nickname = "Mega Pichu Man";
        this.party.pokemon[1].moves = [
            "dark_pulse",
            "u_turn",
            "iron_tail",
            "thunderbolt"
        ];
        this.party.pokemon[1].level = 60;
    }
    async preload() {
        await this.loadPartySpecies();
        await this.stateStack.preload();
    }
}
