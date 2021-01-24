import Entity from "../Entity.js";
import Input from "./Input.js";
import Loader, { JSON } from "./Loader.js";
import RoamState from "./states/RoamState.js";
import Vector from "./Vector.js";
import { generate2DArray } from '../Util.js';
import EncounterTable from "../JSONConversions/EncounterTable.js";

export default class GameMap implements Entity {
	toUpdate: boolean | null = true;
	toRender: boolean | null = true;
	toPreload: boolean | null = true;
	json: JSONGameMap.Pure | null = null;
	image: HTMLImageElement | null = null;
	constructor(public name: string, public roamState: RoamState) {
	}
	async preload(loader: Loader) {
		await this.load(loader);
	}

	async load(loader: Loader) {
		const promises = [
			loader.loadJSON(`/json/maps/${this.name}.json`),
			loader.loadImage(`/assets/images/maps/${this.name}.png`)
		];

		const [raw, image]
			= await Promise.all(promises) as
			[JSONGameMap.Raw, HTMLImageElement];
		const pure = JSONGameMap.purify(raw);
		this.json = pure;
		this.image = image;
	}
	init(): void {
		// console.table(this.collisionDataStr)
		// console.log(this.json?.tileDataGenerator.overrides)
	}
	update(input: Input): void {
	}
	render(ctx: CanvasRenderingContext2D): void {
		if (!this.image) return;
		const pos = this.roamState.player.camera.convertCoords(new Vector());
		this.roamState.player.camera.ctx.drawImage(this.image, pos.x, pos.y);
		/* this.collisionData?.forEach((cd, y) => {
			cd.forEach((val, x) => {
				if (val?.type === "wall") {
					ctx.fillRect(x * 16, y * 16, 16, 16)
				}
			})
		}); */
	}

	get sizeInPx() {
		return (this.json?.sizeInTiles || new Vector).prod(this.roamState.tileSize)
	}


	get wallData() {
		if (!this.json) return null;
		if (!Array.isArray(this.json.walls)) return null;
		const arr: boolean[][] = [];
		this.json.walls.forEach(wall => {
			const [pos1, pos2] = wall.range;

			for (let y = pos1.y; y <= pos2.y; y++) {
				if (typeof arr[y] === "undefined") arr[y] = [];
				for (let x = pos1.x; x <= pos2.x; x++) {
					arr[y][x] = wall.value;
				}
			}
		});
		return arr;
	}

	get portalData() {
		if (!this.json) return null;
		if (!Array.isArray(this.json.portals)) return null;
		const arr: JSONGameMap.PurePortal["to"][][] = [];
		this.json.portals.forEach(portal => {
			const [pos1, pos2] = portal.range;

			for (let y = pos1.y; y <= pos2.y; y++) {
				if (typeof arr[y] === "undefined") arr[y] = [];
				for (let x = pos1.x; x <= pos2.x; x++) {
					arr[y][x] = portal.to;
				}
			}
		});
		return arr;
	}

	get grassData() {
		if (!this.json) return null;
		if (!Array.isArray(this.json.grass)) return null;
		const arr: JSONGameMap.Pure["grass"][] = [];
		this.json.grass.forEach(grass => {
			const [pos1, pos2] = grass.range;

			for (let y = pos1.y; y <= pos2.y; y++) {
				if (typeof arr[y] === "undefined") arr[y] = [];
				for (let x = pos1.x; x <= pos2.x; x++) {
					arr[y][x] = grass;
				}
			}
		});
		return arr;
	}
}

export type TileType = "wall" | "empty"

export namespace JSONGameMap {
	type VecAsString = `${number}x${number}`;
	type VecRangeAsString = `${VecAsString}-${VecAsString}`;
	type VecRange = [Vector, Vector];
	type CoordInMap = `${string} ${VecAsString}`
	export interface Raw {
		name: string,
		sizeInTiles: VecAsString,
		walls:
		{
			range: VecRangeAsString,
			value: boolean
		}[];
		portals:
		{
			range: VecRangeAsString,
			to: CoordInMap
		}[];
		grass:
		{
			range: VecRangeAsString,
			table: string;
		}[]
	}
	export interface Pure {
		name: string,
		sizeInTiles: Vector,
		walls:
		{
			range: VecRange,
			value: boolean
		}[];
		portals:
		PurePortal[];
		grass:
		{
			range: VecRange,
			table: string
		}[]
	}
	export interface PurePortal {
		range: VecRange,
		to: {
			map: string;
			pos: Vector
		}
	}

	export function strToVec(str: VecAsString) {
		const arr = str.split("x");
		const [x, y] = arr.map(n => Number(n));
		return new Vector(x, y)
	}
	export function strRangeToVec(str: VecRangeAsString) {
		const arr = str.split("-");
		const [pos1, pos2] = arr.map(p => strToVec(p as any))
		return [pos1, pos2] as [Vector, Vector];
	}
	export function getCoordInMap(str: CoordInMap) {
		const arr = str.split(" ");
		const map = arr[0];
		const pos = strToVec(arr[1] as any);
		return {
			map,
			pos
		}
	}

	export function purify(raw: Raw): Pure {
		let pure = { ...raw } as any;
		pure.sizeInTiles = strToVec(pure.sizeInTiles)
		pure.walls = pure.walls.map((wall: any) => {
			const [pos1, pos2] = strRangeToVec(wall.range);
			return {
				value: wall.value,
				range: [pos1, pos2]
			}
		})
		pure.portals = pure.portals.map((portal: any) => {
			const range = strRangeToVec(portal.range);
			const to = getCoordInMap(portal.to)

			return {
				range, to
			}
		});

		pure.grass = pure.grass.map((grass: any) => {
			const range = strRangeToVec(grass.range);
			return { range, table: grass.table }
		})
		return pure as Pure;
	}
}
