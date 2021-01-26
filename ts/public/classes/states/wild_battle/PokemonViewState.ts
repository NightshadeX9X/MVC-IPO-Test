import Input from "../../Input.js";
import Loader from "../../Loader.js";
import State from "../../State.js";
import StateStack from "../../StateStack.js";
import WildBattleState from "../WildBattleState.js";
import MainMenuState from "./MainMenuState.js";
import PartyDisplayState from "./pokemon_view/PartyDisplayState.js";

export default class PokemonViewState extends State {
	constructor(public stateStack: StateStack, public wildBattleState: WildBattleState) {
		super(stateStack);
		this.onPop = () => {
			this.stateStack.push(new MainMenuState(this.stateStack, this.wildBattleState))
		}
	}
	public get notFaintedParty() {
		return this.wildBattleState.battle?.party.filter(p => p.canBattle())
	}

	async preload(loader: Loader) {
		await this.substates.push(new PartyDisplayState(this.substates, this));
	}
	init(): void {
	}
	update(input: Input): void {

		this.substates.update(input);
	}
	render(ctx: CanvasRenderingContext2D): void {
		this.substates.render(ctx);

	}

}