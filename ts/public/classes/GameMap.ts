import { Entity } from "../Util.js";
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
		map: GameMap,
		pos: Vector
	}
}
interface TileDataEmpty {
	type: 'empty'
}
type TileData = TileDataWall | TileDataPortal | TileDataEmpty | TileDataGrass;

/**
GameMaps will have an imgUrl, width, height, tileData, and interactable. An interactable is an interface that a player can interact with, like a note on a table.

Interactables will have activation points, from where they can be activated. An activation point includes an pos Vector and directions that the player must face to activate the Interactables. Interactables will also have the text that will be displayed upon interaction.
*/
export default class GameMap implements Entity {
	img: HTMLImageElement | undefined = undefined;
	tileDataMapped: TileData[][] = [];
	constructor(public roamState: RoamState, public name: string, public imgUrl: string, public sizeInTiles: Vector, public tileSizeInPx: number, public tileData: string[][], public tileDataMappings: { [k: string]: TileData } = { "0": { type: 'empty' }, "1": { type: "wall" }, "2": { type: "grass" } }) {

		this.tileDataMapped = tileData.map(row => row.map(val => tileDataMappings[val]));

	}

	async preload(): Promise<HTMLImageElement | void> {
		return new Promise((res) => {
			const image = new Image();
			image.addEventListener('load', e => {
				this.img = image;
				res(image);
			})
			image.src = this.imgUrl;
		})
	}

	update() {

	}

	render(renderer: Renderer) {
		if (!this.img) return;
		const cameraSize = this.roamState.player.cameraSize;
		const cameraPos = this.roamState.player.pos.multiply(16);
		// console.log(cameraSize, cameraPos)
		renderer.ctx.drawImage(this.img, cameraPos.x - cameraSize.x / 2, cameraPos.y - cameraSize.y / 2, cameraSize.x, cameraSize.y, 0, 0, cameraSize.x, cameraSize.y);
	}
}