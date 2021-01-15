import Entity from "../Entity.js";
import Input from "./Input.js";
import Loader, { JSON } from "./Loader.js";
import RoamState from "./states/RoamState.js";
import Vector from "./Vector.js";
import { generate2DArray } from '../Util.js';

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
		ctx.drawImage(this.image, 0, 0);
		/* this.collisionData?.forEach((cd, y) => {
			cd.forEach((val, x) => {
				if (val?.type === "wall") {
					ctx.fillRect(x * 16, y * 16, 16, 16)
				}
			})
		}); */
	}

	get collisionDataStr() {
		if (!this.json) return null;

		const strData = generate2DArray(
			this.json.sizeInTiles.y, this.json.sizeInTiles.x,
			this.json.tileDataGenerator.defaultString,
			this.json.tileDataGenerator.overrides.map(x => ({ pos1: x.start, pos2: x.end, value: x.value }))
		);
		return strData;
	}

	get collisionData() {
		const collisionDataStr = this.collisionDataStr;
		if (!collisionDataStr) return null;

		return collisionDataStr.map(row => {
			return row.map(str => {
				if (!this.json) return null;
				for (let i in this.json.tileDataGenerator.overrideMappings) {
					if (i === str) {
						return this.json.tileDataGenerator.overrideMappings[i]
					}
				}
				return null;
			})
		})
	}
}

export type TileType = "wall" | "empty"

export namespace JSONGameMap {
	type VecAsString = `${number}x${number}`;
	type VecRangeAsString = `${VecAsString}-${VecAsString}`;
	export interface Raw {
		name: string,
		sizeInTiles: VecAsString,
		tileDataGenerator: {
			defaultString: string,
			overrides: [
				{
					range: VecRangeAsString,
					value: string
				}
			],
			overrideMappings: {
				[k: string]: {
					type: TileType
				}
			}
		}
	}
	export interface Pure {
		name: string,
		sizeInTiles: Vector,
		tileDataGenerator: {
			defaultString: string,
			overrides: [
				{
					start: Vector,
					end: Vector,
					value: string
				}
			],
			overrideMappings: {
				[k: string]: {
					type: TileType
				}
			}
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
		return {
			start: pos1,
			end: pos2
		}
	}

	export function purify(raw: Raw): Pure {
		let pure = { ...raw } as any;
		pure.sizeInTiles = strToVec(pure.sizeInTiles)
		pure.tileDataGenerator.overrides = pure.tileDataGenerator.overrides.map((o: any) => {
			const { start, end } = strRangeToVec(o.range);
			return {
				value: o.value,
				start,
				end
			}
		});
		return pure as Pure;
	}
}