import Input from "../../Input.js";
import Loader from "../../Loader.js";
import State from "../../State.js";
import StateStack from "../../StateStack.js";
import Vector from "../../Vector.js";
import WildBattleState from "../WildBattleState.js";
import MainMenuState from "./MainMenuState.js";

export default class IntroState extends State {
	private partyHeadPos = new Vector(-110, 150);
	private pokemonHeight = 100;
	private wildImage: HTMLImageElement | null = null;
	private partyHeadImage: HTMLImageElement | null = null;
	private framesSinceImagesStoppedMoving = 0;
	constructor(public stateStack: StateStack, public wildBattleState: WildBattleState) {
		super(stateStack);
	}
	async preload(loader: Loader) {
		const promises = [
			loader.loadImage(`/assets/images/pokemon/${this.wildBattleState.partyHead?.species?.name}.png`),
			loader.loadImage(`/assets/images/pokemon/${this.wildBattleState.battle?.wild.species?.name}.png`),
		] as
			[Promise<HTMLImageElement>, Promise<HTMLImageElement>];
		[this.partyHeadImage, this.wildImage] = await Promise.all(promises);
		this.wildBattleState.wildImage = this.wildImage;
		this.wildBattleState.partyHeadImage = this.partyHeadImage;
	}
	init(): void {

	}
	update(input: Input): void {
		if (this.partyHeadPos.x < 50) {
			this.partyHeadPos.x++;
		} else {
			this.framesSinceImagesStoppedMoving++;
		}

		if (this.framesSinceImagesStoppedMoving >= 20) {
			this.wildBattleState.partyHeadPos = this.partyHeadPos;
			this.wildBattleState.pokemonHeight = this.pokemonHeight;
			this.stateStack.pop();
			this.stateStack.push(new MainMenuState(this.stateStack, this.wildBattleState));
		}
	}
	render(ctx: CanvasRenderingContext2D): void {
		if (this.partyHeadImage) {
			ctx.drawImage(this.partyHeadImage, this.partyHeadPos.x, this.partyHeadPos.y, 100, 100)
		}
		if (this.wildImage) {
			ctx.drawImage(this.wildImage, ctx.canvas.width - this.partyHeadPos.x - 64, ctx.canvas.height - this.partyHeadPos.y - 64, 70, 70)
		}
	}

}