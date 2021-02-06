import PokemonCreature from "./classes/PokemonCreature.js";
import PokemonMove, { MoveCategory } from "./classes/PokemonMove.js";
import { PokemonTypes } from "./classes/PokemonSpecies.js";
import Vector from "./classes/Vector.js";

export enum Direction {
	LEFT,
	UP,
	RIGHT,
	DOWN
}
export function directionToVector(d: Direction) {
	if (d === Direction.LEFT) return new Vector(-1, 0);
	if (d === Direction.UP) return new Vector(0, -1);
	if (d === Direction.RIGHT) return new Vector(1, 0);
	if (d === Direction.DOWN) return new Vector(0, 1);
	return new Vector()
}

export function generate2DArray<T>(rows: number, columns: number, defaultVal: T, ranges: { pos1: Vector, pos2: Vector, value: T }[]): T[][] {
	const arr: T[][] = [];

	for (let y = 0; y < rows; y++) {
		arr[y] = [];

		for (let x = 0; x < columns; x++) {
			arr[y][x] = defaultVal;
		}
	}

	ranges.forEach(range => {
		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < columns; x++) {
				if (x >= range.pos1.x && x <= range.pos2.x && y >= range.pos1.y && y <= range.pos2.y)
					arr[y][x] = range.value;

			}
		}
	})


	return arr;

}
/**
 * 
 * @param min 
 * @param max 
 * @param whole True by default.
 */
export function random(min = 0, max = 1, whole = true) {
	if (whole) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	} else return Math.random() * (max - min) + min;
}

export function randomArrayMember<T>(arr: T[]) {
	const index = random(0, arr.length - 1);
	return arr[index];
}

export function chance(x: number, outOfY = 100) {
	const rand = random(0, outOfY);
	if (rand <= x) {
		return true
	}
	return false;
}

export function cloneObject<T extends Record<string, any>>(obj: T): T {
	let clone: Partial<T> = {};

	for (let i in obj) {
		if (typeof obj[i] === "object") {
			clone[i] = cloneObject(obj[i]);
		} else {
			clone[i] = obj[i];
		}
	}

	return clone as T;
}

export function round(_n: number, toXDecimalPlaces: number) {
	let n = _n
	n *= 10 ** toXDecimalPlaces;
	n = Math.round(n);
	n /= 10 ** toXDecimalPlaces;

	return n;
}

export function getRandomCreatureMove(creature: PokemonCreature) {
	// return 'quick_attack'
	return randomArrayMember(creature.moves);
}

export function delay(ms: number) {
	return new Promise((res, rej) => {
		setTimeout(() => {
			res(ms)
		}, ms);
	})
}

export function generateHPBarColor(_hp: number) {
	// hp should be between 0.00 and 1.00
	let hp = round(_hp, 2);
	let red = 0, green = 0;

	if (hp < 0.5) {
		red = 255;
		green = hp * 510;
	} else if (hp > 0.5) {
		green = 255;
		red = 255 - ((hp - 0.5) * 510);
	} else {
		red = 255;
		green = 255;
	}
	return [red, green]
}

export function* IDGenerator() {
	let i = 0;
	while (true) {
		yield i++;
	}
}

export function upperCaseStart(string: string) {
	let chars = string.split("")
	return [chars[0].toUpperCase(), ...(chars.slice(1).map(c => c.toLowerCase()))].join("")
}

export function typesToString(types: [PokemonTypes, PokemonTypes?]) {
	return types.filter(t => t).map(t => PokemonTypes[t as PokemonTypes]).map(s => upperCaseStart(s)).join("/")
}

export function filterUnwantedFromObj<T extends Record<keyof any, any>>(o: T, filterOut: any[] = [null, undefined]) {
	const o2: Partial<T> = {};
	for (const key of Object.getOwnPropertyNames(o)) {
		if (filterOut.includes(o[key])) continue;
		o2[key as keyof typeof o2] = o[key];
	}
	return o2;
}

export namespace MoveAnimations {
	export function get(move: PokemonMove) {
		const special = ['tri_attack'].filter(s => s === move.name)[0]
		if (special) return special;

		if (move.type === PokemonTypes.ICE) return 'ice_beam';
		if (move.type === PokemonTypes.GHOST && move.category === MoveCategory.PHYSICAL) return 'shadow_sneak';
		if (move.type === PokemonTypes.GHOST && move.category === MoveCategory.SPECIAL) return 'shadow_ball';
		if (move.type === PokemonTypes.FAIRY) return 'moonblast';
		if (move.type === PokemonTypes.NORMAL) return 'quick_attack';
		if (move.type === PokemonTypes.GRASS) return 'leech_seed';
		if (move.type === PokemonTypes.FIRE) return 'overheat';
		if (move.type === PokemonTypes.DARK) return 'dark_pulse';
		if (move.type === PokemonTypes.STEEL) return 'metal_fang';

		return 'color_ray'
	}
}

export function stringToDirections(string: string) {
	const directions: Direction[] = [];
	const letters = string.split("");
	if (letters.find(l => l.toUpperCase() === "L")) directions.push(Direction.LEFT);
	if (letters.find(l => l.toUpperCase() === "R")) directions.push(Direction.RIGHT);
	if (letters.find(l => l.toUpperCase() === "U")) directions.push(Direction.UP);
	if (letters.find(l => l.toUpperCase() === "D")) directions.push(Direction.DOWN);
	return directions;
}