import Entity from "../Entity.js";
import Input from "./Input.js";
import Loader, { JSON } from "./Loader.js";
import RoamState from "./states/RoamState.js";
import Vector from "./Vector.js";

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
	}
	update(input: Input): void {
	}
	render(ctx: CanvasRenderingContext2D): void {
		if (!this.image) return;
		ctx.drawImage(this.image, 0, 0);
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

	function strToVec(str: VecAsString) {
		const arr = str.split("x");
		const [x, y] = arr.map(n => Number(n));
		return new Vector(x, y)
	}
	function strRangeToVec(str: VecRangeAsString) {
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
		pure.tileDataGenerator.overrides.forEach((o: any) => {
			const { start, end } = strRangeToVec(o.range);
			return {
				...o,
				start,
				end
			}
		});
		return pure as Pure;
	}
}