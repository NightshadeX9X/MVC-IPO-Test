import { chance } from "../../../Util.js";
import Input from "../../Input.js";
import Loader from "../../Loader.js";
import PokemonCreature from "../../PokemonCreature.js";
import PokemonMove from "../../PokemonMove.js";
import State from "../../State.js";
import StateStack from "../../StateStack.js";
import FadeState from "../FadeState.js";
import WildBattleState from "../WildBattleState.js";
import AttackingState from './interaction/AttackingState.js';
import MainMenuState from "./MainMenuState.js";

export default class InteractionState extends State {
	public sortedDecisions: Decision[] = [];
	constructor(public stateStack: StateStack, public wildBattleState: WildBattleState, public trainerDecision: TrainerDecision, public wildDecision?: WildDecision) {
		super(stateStack)
		console.log(this.trainerDecision);
		const decisions = [wildDecision, trainerDecision];
		// @ts-ignore
		this.sortDecisions(decisions);

	}

	private sortDecisions(decisions: Decision[]) {
		// @ts-ignore
		this.sortedDecisions = decisions.sort((a, b) => {
			if (!a || !b) return 0;
			if (InteractionState.getPriority(b) !== InteractionState.getPriority(a)) {
				return InteractionState.getPriority(b) - InteractionState.getPriority(a)
			}
			if (a.type === "attack" && b.type === "attack") {
				return b.user.stats.Spe - a.user.stats.Spe
			}
			return 0;
		})
	}

	public static getPriority(decision: Decision) {

		if (decision.type === "attack") {
			const attack = PokemonMove.list.get(decision.attack);
			if (attack) {
				return attack.priority;
			}
		} else if (decision.type === "run") {
			return -8;
		}
		return 0;
	}

	async preload(loader: Loader) {
		await this.performNextDecision();

	}
	public async performNextDecision() {
		const decision = this.sortedDecisions[0];
		if (!decision) {
			this.stateStack.pop();
			this.stateStack.push(new MainMenuState(this.stateStack, this.wildBattleState));
			return;
		}
		if (decision.type === 'run') {
			const canRunAway = chance(50);
			if (canRunAway) {
				console.log("You ran away safely!")
				this.wildBattleState.stateStack.pop();
			} else {
				console.log("You couldn't run away!")
				this.sortedDecisions.shift();
				this.performNextDecision();

			}
		} else if (decision.type === "attack") {
			await this.substates.push(new AttackingState(this.substates, this, decision));
		}
	}
	init(): void {
	}
	update(input: Input): void {
		this.substates.update(input);
	}
	render(ctx: CanvasRenderingContext2D): void {
		this.wildBattleState.drawBattleGraphics(ctx)

		this.substates.render(ctx);

	}

}

export interface TrainerDecisionAttack {
	type: 'attack'
	attack: string;
	user: PokemonCreature,
	target: PokemonCreature | null
}

export interface TrainerDecisionRun {
	type: 'run'
}

export type TrainerDecision = TrainerDecisionAttack | TrainerDecisionRun;

export interface WildDecision extends TrainerDecisionAttack {

}

type Decision = WildDecision | TrainerDecision;