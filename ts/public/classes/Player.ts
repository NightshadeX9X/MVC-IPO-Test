import Entity from "../Entity.js";
import Input from "./Input.js";
import Loader from "./Loader.js";
import RoamState from "./states/RoamState.js";
import Vector from "./Vector.js";

export default class Player implements Entity {
	public pos = new Vector(10, 5);
	public drawSize = new Vector(1, 2);
	public drawOffset = new Vector(0, -1);
	public image: HTMLImageElement | null = null;
	toUpdate: boolean | null = true;
	toRender: boolean | null = true;
	toPreload: boolean | null = true;

	constructor(public roamState: RoamState) {

	}
	async preload(loader: Loader) {
		this.image = await loader.loadImage(`/assets/images/people/player.png`);
	}
	init(): void {

	}
	update(input: Input): void {

	}
	render(ctx: CanvasRenderingContext2D): void {
		if (!this.image) return;
		const pos = this.pos.sum(this.drawOffset).prod(this.roamState.tileSize);
		const size = this.drawSize.prod(this.roamState.tileSize);
		ctx.drawImage(this.image, 0, 0, 16, 32, pos.x, pos.y, size.x, size.y)
	}
}