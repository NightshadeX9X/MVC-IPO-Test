import { chance, getRandomCreatureMove } from "../../../Util.js";
import Input from "../../Input.js";
import Loader from "../../Loader.js";
import State from "../../State.js";
import StateStack from "../../StateStack.js";
import Vector from "../../Vector.js";
import FadeState from "../FadeState.js";
import WildBattleState from "../WildBattleState.js";
import FightMenuState from "./FightMenuState.js";
import InteractionState from "./InteractionState.js";

export default class MainMenuState extends State {
	public menuPos = new Vector(370, 170);
	public menuSize = new Vector(100, 130);
	public menuImg: HTMLImageElement | null = null;
	public selected = 0;
	private selectorChangedLast = 0;
	private triedRunningLast = 0;
	private frames = 0;

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
			pos: new Vector(-3, 92),
			size: new Vector(76, 17)
		},
		{
			pos: new Vector(41, 111),
			size: new Vector(47, 19)
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
		this.frames++;
		this.triedRunningLast++;

		if (this.selectorChangedLast > 11) {
			if ((input.directionKeyStates.LEFT || input.directionKeyStates.RIGHT)) {

				if (this.selected === 0) this.selected = 1;
				else if (this.selected === 1) this.selected = 0;
				else if (this.selected === 2) this.selected = 3;
				else if (this.selected === 3) this.selected = 2;
				this.selectorChangedLast = 0;

			} else if ((input.directionKeyStates.UP || input.directionKeyStates.DOWN)) {

				if (this.selected === 0) this.selected = 2;
				else if (this.selected === 1) this.selected = 3;
				else if (this.selected === 2) this.selected = 0;
				else if (this.selected === 3) this.selected = 1;
				this.selectorChangedLast = 0;
			}


		}


		if (input.interactionKey && this.frames > 20) {
			if (this.selected === 0) {
				this.stateStack.pop();
				this.stateStack.push(new FightMenuState(this.stateStack, this.wildBattleState));

			} else if (this.selected === 3 && this.triedRunningLast > 10) {
				this.triedRunningLast = 0;
				if (!this.wildBattleState.partyHead || !this.wildBattleState.battle) return;
				this.stateStack.push(new InteractionState(this.stateStack, this.wildBattleState, {
					type: 'run',
					user: this.wildBattleState.partyHead
				}, {
					type: 'attack',
					attack: getRandomCreatureMove(this.wildBattleState.battle.wild),
					target: this.wildBattleState.partyHead,
					user: this.wildBattleState.battle.wild
				}))
			}
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
		const pos = this.menuPos.sum(selector.pos);
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#00f"
		ctx.strokeRect(pos.x, pos.y, selector.size.x, selector.size.y);
		ctx.restore();
	}
	render(ctx: CanvasRenderingContext2D): void {



		this.drawMenu(ctx);
		this.drawSelector(ctx);

		this.wildBattleState.drawBattleGraphics(ctx)
	}

}