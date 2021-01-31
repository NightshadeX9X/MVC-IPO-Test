import Camera from "../Camera.js";
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
		popFramesBefore: number
	}
	constructor(public stateStack: StateStack, public imageUrl: string, data: Partial<AnimationState["data"]>) {
		super(stateStack);
		this.data = {
			singleImageSize: new Vector(16),
			amountOfImages: 1,
			drawPos: new Vector,
			interval: 0,
			popFramesBefore: 0,
			...data
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
	render(ctx: CanvasRenderingContext2D): void {
		if (!this.spritesheet) return;
		this.spritesheet.render(ctx, this.data.drawPos);
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
}