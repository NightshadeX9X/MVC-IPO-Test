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
	private moving = false;
	private selectionStepPos = new Vector();

	private readonly selectorData = [
		{
			pos: new Vector(0, 28),
			size: new Vector(70, 25)
		},
		{
			pos: new Vector(75, 18),
			size: new Vector(22, 75)
		},
		{
			pos: new Vector(13, 14),
			size: new Vector(34, 1)
		},
		{
			pos: new Vector(31, 83),
			size: new Vector(6, 62)
		}
	]
	constructor(public stateStack: StateStack, public wildBattleState: WildBattleState) {
		super(stateStack);
	}
	get selector() {
		return this.selectorData[this.selected]
	}
	private toDrawSelector = { pos: Vector.from(this.selector.pos), size: Vector.from(this.selector.size) };
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
		const oldSelected = this.selected;

		if ((input.directionKeyStates.LEFT || input.directionKeyStates.RIGHT) && this.selectorChangedLast > 11 && !this.moving) {
			if (oldSelected === 0) this.selected = 1;
			else if (oldSelected === 1) this.selected = 0;


			this.selectionStepPos = this.selector.pos.diff(this.toDrawSelector.pos).quo(5).mapReturn(Math.round);
			this.selectorChangedLast = 0;

		}
		let toChangePos = !this.toDrawSelector.pos.equals(this.selector.pos);
		if (toChangePos) {

			this.toDrawSelector.pos.add(this.selectionStepPos)
		}
	}
	private drawMenu(ctx: CanvasRenderingContext2D) {
		if (this.menuImg) {
			ctx.drawImage(this.menuImg, this.menuPos.x, this.menuPos.y, this.menuSize.x, this.menuSize.y)
		}
	}
	private drawSelector(ctx: CanvasRenderingContext2D) {
		if (!this.toDrawSelector) return;
		ctx.save();
		const pos = this.menuPos.sum(this.toDrawSelector.pos);
		// console.log(pos.x, pos.x, selector.size.x, selector.size.y);
		ctx.strokeStyle = "#00f";
		ctx.lineWidth = 2;
		ctx.strokeRect(pos.x, pos.y, this.toDrawSelector.size.x, this.toDrawSelector.size.y);
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