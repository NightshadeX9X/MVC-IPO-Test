import Entity from "../../Entity.js";
import { Direction, directionToVector } from "../../Util.js";
import Camera from "./Camera.js";
import Input from "../Input.js";
import Loader from "../Loader.js";
import Spritesheet from "../Spritesheet.js";
import PlayerMovingState from "../states/PlayerMovingState.js";
import RoamState from "../states/RoamState.js";
import Vector from "../Vector.js";

export default class Player {
	public zIndex = 1;
	public pos = new Vector(12, 12);
	public drawSize = new Vector(1, 2);
	public drawOffset = new Vector(0, -1);
	public image: HTMLImageElement | null = null;
	public spritesheet: Spritesheet | null = null;
	public camera = new Camera(this, new Vector(480, 320).prod(0.8));
	public direction = Direction.DOWN;
	toUpdate: boolean | null = true;
	toRender: boolean | null = true;
	toPreload: boolean | null = true;

	get onMapLayer() {
		return this.roamState.gameMap.layers.find(l => l.zIndex === (this.zIndex - 1))
	}

	constructor(public roamState: RoamState) {
	}
	async preload(loader: Loader) {
		this.image = await loader.loadImage(`/assets/images/people/player.png`);
		this.spritesheet = new Spritesheet(this.image, this.drawSize);
	}
	init(): void {
		if (!this.spritesheet) return;
		this.camera.init();
	}
	get tileAhead() {
		return this.pos.sum(directionToVector(this.direction))
	}
	update(input: Input): void {
		this.camera.update();
		if (!this.spritesheet) return;
		const dirStrs = ["down", "left", "up", "right"];
		dirStrs.forEach(dirStr => {
			if (this.roamState.stateStack.fromTop() === this.roamState && (input.directionKeyStates as any)[dirStr.toUpperCase()] === true) {
				this.direction = Direction[dirStr.toUpperCase() as keyof typeof Direction];
				this.roamState.stateStack.push(new PlayerMovingState(this.roamState.stateStack, this.roamState, Direction[dirStr.toUpperCase() as keyof typeof Direction]))
			}
		})
	}
	render(camera: Camera): void {
		if (!this.image || !this.spritesheet) return;
		const size = this.drawSize.prod(this.roamState.tileSize)
		const pos = camera.convertCoords(this.pos.sum(this.drawOffset)/* .diff(this.drawOffset) */.prod(this.roamState.tileSize));
		const spriteCoords = this.spritesheet.coords.prod(this.roamState.tileSize).prod(this.drawSize);
		camera.ctx.drawImage(this.image, spriteCoords.x, spriteCoords.y, size.x, size.y, pos.x, pos.y, size.x, size.y)
	}
}