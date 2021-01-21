import Input from "../../Input.js";
import Loader from "../../Loader.js";
import State from "../../State.js";
import StateStack from "../../StateStack.js";
import Vector from "../../Vector.js";
import WildBattleState from "../WildBattleState.js";

export default class MainMenuState extends State {
	public menuPos = new Vector(370, 170);
	public menuSize = new Vector(100, 130);
	public menuImg: HTMLImageElement | null = null;
	public selected = 0;
	private selectorChangedLast = 0;

	private readonly selectorData = [
		{
			pos: new Vector(0, 28),
			size: new Vector(70, 25)
		},
		{
			pos: new Vector(75, 18),
			size: new Vector(22, 75)
		}
	]
	constructor(public stateStack: StateStack, public wildBattleState: WildBattleState) {
		super(stateStack);
	}
	async preload(loader: Loader) {
		const promises = [
			loader.loadImage(`/assets/images/UI/BattleMenu.png`)
		] as
			[Promise<HTMLImageElement>]
		[this.menuImg] = await Promise.all(promises);
	}
	init(): void {
	}
	update(input: Input): void {
		this.selectorChangedLast++;

		if ((input.directionKeyStates.LEFT || input.directionKeyStates.RIGHT) && this.selectorChangedLast > 11) {
			if (this.selected === 0) this.selected = 1;
			else if (this.selected === 1) this.selected = 0;


			console.log(this.selected);
			this.selectorChangedLast = 0;
		}
	}
	private drawMenu(ctx: CanvasRenderingContext2D) {
		if (this.menuImg) {
			ctx.drawImage(this.menuImg, this.menuPos.x, this.menuPos.y, this.menuSize.x, this.menuSize.y)
		}
	}
	private drawSelector(ctx: CanvasRenderingContext2D) {
		const selector = this.selectorData[this.selected];
		if (!selector) return;
		ctx.save();
		const pos = this.menuPos/* .sum(selector.pos) */;
		// console.log(pos.x, pos.x, selector.size.x, selector.size.y)
		ctx.fillRect(370, 370, 70, 25);
		ctx.restore();
	}
	render(ctx: CanvasRenderingContext2D): void {

		if (this.wildBattleState.partyHeadImage) {
			const pokemonWidth = (this.wildBattleState.partyHeadImage.width / this.wildBattleState.partyHeadImage.height) * this.wildBattleState.pokemonHeight;
			ctx.drawImage(this.wildBattleState.partyHeadImage, this.wildBattleState.partyHeadPos.x, this.wildBattleState.partyHeadPos.y, pokemonWidth, this.wildBattleState.pokemonHeight)
		}
		if (this.wildBattleState.wildImage) {
			const pokemonWidth = (this.wildBattleState.wildImage.width / this.wildBattleState.wildImage.height) * this.wildBattleState.pokemonHeight;
			ctx.drawImage(this.wildBattleState.wildImage, ctx.canvas.width - this.wildBattleState.partyHeadPos.x - this.wildBattleState.wildImage.width, ctx.canvas.height - this.wildBattleState.partyHeadPos.y - this.wildBattleState.wildImage.height, pokemonWidth * 0.7, this.wildBattleState.pokemonHeight * 0.7)
		}


		this.drawMenu(ctx);
		this.drawSelector(ctx);


	}

}