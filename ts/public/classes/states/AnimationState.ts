import { filterUnwantedFromObj } from "../../Util.js";
import Input from "../Input.js";
import Loader from "../Loader.js";
import Spritesheet from "../Spritesheet.js";
import State from "../State.js";
import StateStack from "../StateStack.js";
import Vector from "../Vector.js";
import RoamState from "./RoamState.js";

export default class AnimationState extends State {
	image: HTMLImageElement = null as any;
	data: {
		singleImageSize: Vector,
		amountOfImages: number,
		drawPos: Vector,
		interval: number,
		popFramesBefore: number,
		scale: number
	}
	constructor(public stateStack: StateStack, public imageUrl: string, data: Partial<AnimationState["data"]>) {
		super(stateStack);
		this.data = {
			singleImageSize: new Vector(16),
			amountOfImages: 1,
			drawPos: new Vector,
			interval: 0,
			popFramesBefore: 0,
			scale: 1,
			...filterUnwantedFromObj(data)
		}
	}

	spritesheet: Spritesheet = null as any
	frames = 0;

	async preload(loader: Loader) {
		this.image = await loader.loadImage(this.imageUrl);
		if (this.image)
			this.spritesheet = new Spritesheet(this.image, this.data.singleImageSize, new Vector(this.data.amountOfImages, 1));
	}
	init(): void {
		console.log(this)
	}
	update(input: Input): void {
		if (!this.spritesheet) return;
		if (this.frames >= this.data.interval) {

			this.spritesheet.coords.x++;
			this.frames = -1;
		}
		if (this.spritesheet.coords.x > this.data.amountOfImages - this.data.popFramesBefore) this.stateStack.pop();
		this.frames++;
	}
	ctxAdjustments(ctx: CanvasRenderingContext2D) {
	}
	render(ctx: CanvasRenderingContext2D): void {
		if (!this.spritesheet) return;
		ctx.save();
		ctx.scale(this.data.scale, this.data.scale);

		this.ctxAdjustments(ctx);
		this.spritesheet.render(ctx, this.data.drawPos);
		ctx.restore();
	}

	static exclamation(roamState: RoamState) {
		const coords = roamState.player.camera.convertCoords(roamState.player.pos.prod(roamState.tileSize)).diff(8, 50);
		const as = new AnimationState(roamState.stateStack, '/assets/images/animations/exclamation.png', {
			singleImageSize: new Vector(32),
			drawPos: coords,
			popFramesBefore: 1,
			amountOfImages: 27
		});
		roamState.stateStack.push(as)
		return as;
	}
	static async getFromJSON(loader: Loader, path: string, stateStack: StateStack) {
		const promises = [
			loader.loadJSON(`/json/animations/${path}.json`),
			// loader.loadImage(`/assets/images/animations/${path}.png`)
		]
		const [json, /* image */] = await Promise.all(promises) as [{
			name: string,
			url: string,
			singleImageSize: string,
			frames: number,
			drawPos: string,
			interval: number,
			popFramesBefore: number,
			scale: number,
		}, /* HTMLImageElement */];

		const as = new AnimationState(stateStack, `/assets/images/animations/${path}.png`, {
			singleImageSize: Vector.fromString(json.singleImageSize),
			drawPos: Vector.fromString(json.drawPos),
			amountOfImages: json.frames,
			interval: json.interval,
			popFramesBefore: json.popFramesBefore,
			scale: json.scale
		});

		return as;

	}
}