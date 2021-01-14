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
		let xp1 = [
			new Vector(1, 0)
		];
		this.spritesheet.animator.register('down', new Vector(), xp1);
		this.spritesheet.animator.register('left', new Vector(0, 1), xp1);
		this.spritesheet.animator.register('right', new Vector(0, 2), xp1);
		this.spritesheet.animator.register('up', new Vector(0, 3), xp1);
	}
	update(input: Input): void {
		if (!this.spritesheet) return;
		const dirStrs = ["down", "left", "up", "right"];

		dirStrs.forEach(dirStr => {
			if ((input.directionKeyStates as any)[dirStr.toUpperCase()]) {
				this.spritesheet?.animator.play(dirStr.toLowerCase());
			} else {
				this.spritesheet?.animator.end(dirStr.toLowerCase());

			}
		})
	}
	render(ctx: CanvasRenderingContext2D): void {
		if (!this.image) return;
		const pos = this.pos.sum(this.drawOffset).prod(this.roamState.tileSize);
		this.spritesheet?.render(ctx, pos);
	}
}