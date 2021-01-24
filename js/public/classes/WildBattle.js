import { random } from '../Util.js';
import PokemonCreature from './PokemonCreature.js';
export default class WildBattle {
    constructor(party, table) {
        this.party = party;
        this.table = table;
        const sortedEncounterAsc = table.encounters.sort((a, b) => a.chits - b.chits);
        const totalChits = table.encounters.reduce((acc, curr) => acc + curr.chits, 0);
        const randomNumber = random(1, totalChits);
        const onlyGreater = sortedEncounterAsc.filter(e => e.chits >= randomNumber);
        const selected = onlyGreater[0];
        const randomLevel = random(selected.levelRange[0], selected.levelRange[1]);
        this.wild = new PokemonCreature(selected.species);
        this.wild.level = randomLevel;
    }
}
