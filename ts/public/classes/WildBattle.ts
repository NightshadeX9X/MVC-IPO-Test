import EncounterTable from '../JSONConversions/EncounterTable.js';
import { random, randomArrayMember } from '../Util.js';
import Party from './Party.js';
import PokemonCreature from './PokemonCreature.js';
export default class WildBattle {
	public wild: PokemonCreature;
	constructor(public party: Party, public table: EncounterTable.Pure) {

		const bucket: EncounterTable.Pure["encounters"] = [];
		table.encounters.forEach(e => {
			for (let i = 0; i < e.chits; i++) {
				bucket.push(e);
			}
		})
		const selected = randomArrayMember(bucket) as EncounterTable.Pure["encounters"][number];
		console.log(selected)
		const randomLevel = random(selected.levelRange[0], selected.levelRange[1]);

		this.wild = new PokemonCreature(selected.species);
		console.log(this.wild)

		this.wild.level = randomLevel;
	}
}