import Entity from "../Entity.js";
import Input from "./Input.js";
import Loader, { JSON } from "./Loader.js";
import RoamState from "./states/RoamState.js";
import Vector, { StringVector, StringVectorRange } from "./Vector.js";

export type TileType = "wall" | "empty";

export interface RangedTileSettings<T> {
	range: StringVectorRange;
	value: T;

}
export type CoordInMap = `${string} ${StringVector}`
export interface JSONGameMap {
	name: string;
	sizeInTiles: StringVector;
	layers: {
		walls: RangedTileSettings<boolean>[];
		grass: RangedTileSettings<{ table: string }>[];
		portals: RangedTileSettings<{ to: CoordInMap }>[];
	}
}

export default class GameMap implements Entity {
	toUpdate: boolean | null = true;
	toRender: boolean | null = true;
	toPreload: boolean | null = true;
	json: JSONGameMap | null = null;
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
			[JSONGameMap, HTMLImageElement];
		this.json = raw;
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



}


