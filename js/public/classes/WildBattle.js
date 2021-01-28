import { randomArrayMember } from '../Util.js';
import PokemonCreature from './PokemonCreature.js';
import PokemonMove from './PokemonMove.js';
import PokemonSpecies from './PokemonSpecies.js';
export default class WildBattle {
    constructor(party, table) {
        // const randomLevel = random(selected.levelRange[0], selected.levelRange[1]);
        this.party = party;
        this.table = table;
        this.wild = null;
    }
    get selected() {
        const bucket = [];
        this.table.encounters.forEach(e => {
            for (let i = 0; i < e.chits; i++) {
                bucket.push(e);
            }
        });
        const selected = randomArrayMember(bucket);
        return selected;
    }
    get allMoves() {
        let set = new Set([
            ...this.wild.moves
        ]);
        this.party.pokemon.forEach(p => {
            p.moves.forEach(m => {
                set.add(m);
            });
        });
        return Array.from(set);
    }
    async preload(loader) {
        await PokemonSpecies.load(loader, this.selected.species);
        await Promise.all(this.allMoves.map(m => PokemonMove.load(loader, m)));
        this.wild = new PokemonCreature(this.selected.species);
    }
}
