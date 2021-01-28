import EncounterTable from '../JSONConversions/EncounterTable.js';
import { random, randomArrayMember, upperCaseStart } from '../Util.js';
import Loader from './Loader.js';
import Party from './Party.js';
import PokemonCreature from './PokemonCreature.js';
import PokemonMove from './PokemonMove.js';
import PokemonSpecies from './PokemonSpecies.js';
export default class WildBattle {
	public wild: PokemonCreature = null as any;
	constructor(public party: Party, public table: EncounterTable.Pure) {


		// const randomLevel = random(selected.levelRange[0], selected.levelRange[1]);

	}

	private get selected() {
		const bucket: EncounterTable.Pure["encounters"] = [];
		this.table.encounters.forEach(e => {
			for (let i = 0; i < e.chits; i++) {
				bucket.push(e);
			}
		})
		const selected = randomArrayMember(bucket) as EncounterTable.Pure["encounters"][number];
		return selected;
	}

	private get allMoves() {
		let set = new Set<string>([
			...this.wild.moves
		]);
		this.party.pokemon.forEach(p => {
			p.moves.forEach(m => {
				set.add(m);
			})
		});
		return Array.from(set);
	}

	async preload(loader: Loader) {
		await PokemonSpecies.load(loader, this.selected.species);
		await Promise.all(this.allMoves.map(m => PokemonMove.load(loader, m)));
		this.wild = new PokemonCreature(this.selected.species);
	}
}