namespace EncounterTable {
	export interface Raw {
		id: string;
		encounters: {
			species: string;
			levelRange: [number, number],
			chits: number;
		}[]
	}

	export interface Pure extends Raw {

	}

	export function purify(raw: Raw) {
		return raw as Pure;
	}
}

export default EncounterTable;