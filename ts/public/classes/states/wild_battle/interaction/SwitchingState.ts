import Input from "../../../Input.js";
import Loader from "../../../Loader.js";
import State from "../../../State.js";
import StateStack from "../../../StateStack.js";
import InteractionState, { TrainerDecisionSwitch } from "../InteractionState.js";

export default class SwitchingState extends State {
	private switched = false;
	constructor(public stateStack: StateStack, public interactionState: InteractionState, public decision: TrainerDecisionSwitch) {
		super(stateStack);
		this.evtSource.addEventListener('pop', () => {
			if (this.switched)
				this.interactionState.sortedDecisions.shift();
			this.interactionState.performNextDecision();
		})

	}

	async preload(loader: Loader) {
		const into = this.decision.into;
		const party = this.interactionState.wildBattleState.battle?.party;
		if (!this.interactionState.wildBattleState.battle?.party || !party || !into.canBattle()) {

			this.stateStack.pop();
			return;

		};
		this.interactionState.wildBattleState.battle.party.head = into;
		this.switched = true;
		this.stateStack.pop();
		this.interactionState.wildBattleState.partyHeadImage = await loader.loadImage(`/assets/images/pokemon/${this.decision.into.species?.name}.png`);
	}
	init(): void {

	}
	update(input: Input): void {

	}
	render(ctx: CanvasRenderingContext2D): void {

	}

}