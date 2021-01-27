import Input from "../../Input.js";
import Loader from "../../Loader.js";
import State from "../../State.js";
import StateStack from "../../StateStack.js";
import WildBattleState from "../WildBattleState.js";
import MainMenuState from "./MainMenuState.js";
import PartyDisplayState from "./pokemon_view/PartyDisplayState.js";

export default class PokemonViewState extends State {
	constructor(public stateStack: StateStack, public wildBattleState: WildBattleState, public purpose = PokemonViewStatePurpose.PLAYER_CHOICE) {
		super(stateStack);
		this.evtSource.addEventListener('pop', () => {
			if (!(this.stateStack.fromTop() instanceof MainMenuState))
				this.stateStack.push(new MainMenuState(this.stateStack, this.wildBattleState))

			console.log(this.stateStack)
		});
	}
	public get notFaintedParty() {
		return this.wildBattleState.battle?.party.onlyUsable()
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

export enum PokemonViewStatePurpose {
	PLAYER_CHOICE,
	PARTY_HEAD_FAINTED
}