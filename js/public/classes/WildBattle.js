import { random, randomArrayMember } from '../Util.js';
import PokemonCreature from './PokemonCreature.js';
export default class WildBattle {
    constructor(party, table) {
        this.party = party;
        this.table = table;
        const bucket = [];
        table.encounters.forEach(e => {
            for (let i = 0; i < e.chits; i++) {
                bucket.push(e);
            }
        });
        const selected = randomArrayMember(bucket);
        console.log(selected);
        const randomLevel = random(selected.levelRange[0], selected.levelRange[1]);
        this.wild = new PokemonCreature(selected.species);
        console.log(this.wild);
        this.wild.level = randomLevel;
    }
}
