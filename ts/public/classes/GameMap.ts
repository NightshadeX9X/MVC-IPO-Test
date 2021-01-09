import { Direction, Entity } from "../Util.js";
import Interactable from "./Interactable.js";
import Loader from "./Loader.js";
import Renderer from "./Renderer.js";
import RoamState from "./states/RoamState.js";
import Vector from "./Vector.js";

interface TileDataWall {
	type: 'wall';
}
interface TileDataGrass {
	type: 'grass';
}
interface TileDataPortal {
	type: 'portal',
	to: {
		mapName: string,
		pos: Vector
		direction?: Direction;
	},
	delay?: number;
}
interface TileDataEmpty {
	type: 'empty'
}
type TileData = TileDataWall | TileDataPortal | TileDataEmpty | TileDataGrass;


export interface JSONMap {
	name: string;
	imageUrl: string;
	sizeInTiles: {
		x: number;
		y: number;
	}
	tileSizeInPx: number;
	tileDataGeneratorArgs: {
		rows: number;
		columns: number;
		defaultString: string;
		overrides: {
			pos1: {
				x: number,
				y: number
			},
			pos2: {
				x: number,
				y: number
			},
			value: string;
		}[];
		additionalTileDataMappings: {
			[k: string]: TileData;
		}
	}
}

/**
GameMaps will have an imgUrl, width, height, tileData, and interactable. An interactable is an interface that a player can interact with, like a note on a table.

Interactables will have activation points, from where they can be activated. An activation point includes an pos Vector and directions that the player must face to activate the Interactables. Interactables will also have the text that will be displayed upon interaction.
*/
export default class GameMap implements Entity {
	public static defaultTileDataMappings: { [k: string]: TileData } = { "0": { type: 'empty' }, "1": { type: "wall" }, "2": { type: "grass" } }
	img: HTMLImageElement | undefined = undefined;
	interactables: Interactable[] = [new Interactable(this, new Vector(20), new Vector(2), '/assets/images/maps/test.png')];
	tileDataMapped: TileData[][] = [];
	tileDataMappings: { [k: string]: TileData };
	constructor(public roamState: RoamState, public name: string, public imgUrl: string, public sizeInTiles: Vector, public tileSizeInPx: number, public tileData: string[][], additionaltileDataMappings = {}) {
		this.tileDataMappings = { ...GameMap.defaultTileDataMappings, ...additionaltileDataMappings }

		this.tileDataMapped = tileData.map(row => row.map(val => this.tileDataMappings[val]));

	}

	get sizeInPixels() {
		return this.sizeInTiles.multiply(this.tileSizeInPx);
	}
	async preload(loader: Loader): Promise<HTMLImageElement | void> {
		const image = await loader.image(this.imgUrl);
		this.img = image;
		for (const i of this.interactables) {
			await i.preload(loader)
		}
	}

	update() {

	}

	render(renderer: Renderer) {
		if (!this.img) return;
		/* const cameraSize = this.roamState.player.cameraSize;
		const cameraPos = this.roamState.player.pos.multiply(16);
		const size = this.sizeInTiles.multiply(this.tileSizeInPx);
		// console.log(cameraSize, cameraPos)
		renderer.ctx.drawImage(this.img, 0, 0, size.x, size.y);
		// renderer.ctx.drawImage(this.img, cameraPos.x - cameraSize.x / 2, cameraPos.y - cameraSize.y / 2, cameraSize.x, cameraSize.y, 0, 0, cameraSize.x, cameraSize.y); */

		this.roamState.player.camera.render(renderer).image(this.img, new Vector(), this.sizeInPixels)

		// this.interactables.forEach(i => i.render(renderer))
	}
}