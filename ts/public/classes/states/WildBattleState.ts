import Input from "../Input.js";
import Loader from "../Loader.js";
import State from "../State.js";
import StateStack from "../StateStack.js";

export default class WildBattleState extends State {
	private battleBg: HTMLImageElement | null = null;
	private toClearCanvas = true;
	constructor(public stateStack: StateStack, public battleBgName: string) {
		super(stateStack);
	}
	async preload(loader: Loader) {
		this.battleBg = await loader.loadImage(`/assets/images/battle_backgrounds/${this.battleBgName}.png`);
	}
	init(): void {

	}
	update(input: Input): void {

	}
	render(ctx: CanvasRenderingContext2D): void {
		if (this.toClearCanvas) {
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			this.toClearCanvas = false;
		}

		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
		if (!this.battleBg) return;
		const width = ctx.canvas.width;
		const height = (this.battleBg.height / this.battleBg.width) * width;
		const y = (ctx.canvas.height - height) / 2;
		ctx.drawImage(this.battleBg, 0, y, width, height);
	}

}