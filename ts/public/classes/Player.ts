import Entity from "../Entity.js";
import Input from "./Input.js";
import Loader from "./Loader.js";
import Spritesheet from "./Spritesheet.js";
import RoamState from "./states/RoamState.js";
import Vector from "./Vector.js";

export default class Player implements Entity {
	public pos = new Vector(10, 5);
	public drawSize = new Vector(1, 2);
	public drawOffset = new Vector(0, -1);
	public image: HTMLImageElement | null = null;
	public spritesheet: Spritesheet | null = null;
	toUpdate: boolean | null = true;
	toRender: boolean | null = true;
	toPreload: boolean | null = true;

	constructor(public roamState: RoamState) {

	}
	async preload(loader: Loader) {
		this.image = await loader.loadImage(`/assets/images/people/player.png`);
		this.spritesheet = new Spritesheet(this.image, this.drawSize, this);
	}
	init(): void {
		if (!this.spritesheet) return;
		this.spritesheet.animator.register('down', new Vector(), [
			new Vector(0, 1)
		]);
	}
	update(input: Input): void {
		if (this.spritesheet) {
			this.spritesheet.animator.play('down')
		}
	}
	render(ctx: CanvasRenderingContext2D): void {
		if (!this.image) return;
		const pos = this.pos.sum(this.drawOffset).prod(this.roamState.tileSize);
		this.spritesheet?.render(ctx, pos);
	}
}