import { calcTypeEffectiveness } from "../../../../PokemonTypeEffectiveness.js";
import { delay } from "../../../../Util.js";
import Input from "../../../Input.js";
import Loader from "../../../Loader.js";
import PokemonMove from "../../../PokemonMove.js";
import State from "../../../State.js";
import StateStack from "../../../StateStack.js";
import InteractionState, { TrainerDecisionAttack } from "../InteractionState.js";
import MainMenuState from "../MainMenuState.js";

export default class AttackingState extends State {
	private frames = 0;
	constructor(public stateStack: StateStack, public interactionState: InteractionState, public decision: TrainerDecisionAttack) {
		super(stateStack);
		this.onPop = () => {
			this.interactionState.sortedDecisions.shift();
			this.interactionState.performNextDecision();
		}
	}
	private originalDefenderHp = this.decision.target?.stats.HP || 0;

	async preload(loader: Loader) {

	}
	private get attackChosen() {
		const moveName = this.decision.attack;
		const move = PokemonMove.list.get(moveName);
		return move;
	}
	private get damageToBeDone() {
		if (!this.attackChosen || !this.decision.target) return undefined;
		return this.attackChosen.getDamageDoneTo(this.decision.user, this.decision.target);
	}
	private damageDone = 0;

	init(): void {
		if (this.damageToBeDone === undefined || !this.attackChosen || !this.decision.target) return;
		const te = calcTypeEffectiveness(this.attackChosen.type, this.decision.target.species.types);
		if (te === 0.5) console.log("It's not very effective.")
		if (te === 2) console.log("It's super effective!")
		if (te === 0) {
			console.log(`It doesn't affect ${this.decision.target.nickname}...`)
			return;
		}
		console.log(`${this.decision.user.nickname} did ${this.damageToBeDone} damage to ${this.decision.target.nickname}`)
	}
	update(input: Input): void {
		this.frames++;
		if (this.frames % 10 !== 1) return;
		if (this.damageToBeDone === undefined) return;
		if (this.damageDone < this.damageToBeDone) {
			if (this.interactionState.wildBattleState.shouldEnd) {

				this.interactionState.wildBattleState.stateStack.pop();
			}
			if (this.decision.target) {
				this.decision.target.stats.HP--;

			}
			this.damageDone++;
		} else {
			this.stateStack.pop();
		}
	}
	render(ctx: CanvasRenderingContext2D): void {
	}

}