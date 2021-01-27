import { chance, getRandomCreatureMove, randomArrayMember } from "../../../Util.js";
import Input from "../../Input.js";
import Loader from "../../Loader.js";
import PokemonCreature from "../../PokemonCreature.js";
import PokemonMove from "../../PokemonMove.js";
import State from "../../State.js";
import StateStack from "../../StateStack.js";
import FadeState from "../FadeState.js";
import TextBoxState from "../TextBoxState.js";
import WildBattleState from "../WildBattleState.js";
import AttackingState from './interaction/AttackingState.js';
import SwitchingState from "./interaction/SwitchingState.js";
import MainMenuState from "./MainMenuState.js";
import PokemonViewState, { PokemonViewStatePurpose } from "./PokemonViewState.js";

export default class InteractionState extends State {
	public sortedDecisions: Decision[] = [];
	private end = false;
	constructor(public stateStack: StateStack, public wildBattleState: WildBattleState, public trainerDecision: TrainerDecision, public wildDecision?: WildDecision) {
		super(stateStack)
		if (!this.wildDecision && this.wildBattleState.battle && this.wildBattleState.partyHead) {
			this.wildDecision =
			{
				type: 'attack',
				attack: getRandomCreatureMove(this.wildBattleState.battle.wild),
				user: this.wildBattleState.battle.wild,
				target: 'partyhead',
				team: 'wild'
			}

		}
		const decisions = [this.wildDecision, this.trainerDecision];
		// @ts-ignore
		this.sortDecisions(decisions);
		console.log(this.sortedDecisions)

	}

	private sortDecisions(decisions: Decision[]) {
		// @ts-ignore
		this.sortedDecisions = decisions.sort((a, b) => {
			if (!a || !b) return 0;
			if (InteractionState.getPriority(b) !== InteractionState.getPriority(a)) {
				return InteractionState.getPriority(b) - InteractionState.getPriority(a)
			}
			if (b.user.stats.Spe !== a.user.stats.Spe)
				return b.user.stats.Spe - a.user.stats.Spe
			else return randomArrayMember([-1, 1]);
		})
	}

	public static getPriority(decision: Decision) {

		if (decision.type === "attack") {
			const attack = PokemonMove.list.get(decision.attack);
			if (attack) {
				return attack.priority;
			}
		} else if (decision.type === "run") {
			return 8;
		} else if (decision.type === "switch") {
			return 7;
		}
		return 0;
	}

	async preload(loader: Loader) {
		await this.performNextDecision();

	}
	private async checkBattleShouldEnd() {
		if (!this.wildBattleState.battle.party.usable()) {
			let tbs = new TextBoxState(this.wildBattleState.stateStack, "You have no more Pokémon that can battle.")
			tbs.evtSource.addEventListener('pop', () => {
				this.wildBattleState.stateStack.pop();
			});
			this.end = true;
			await this.wildBattleState.stateStack.push(tbs)
		}
		if (!this.wildBattleState.battle.wild.canBattle()) {
			let tbs = new TextBoxState(this.wildBattleState.stateStack, "The wild Pokémon fainted!")
			tbs.evtSource.addEventListener('pop', () => {
				this.wildBattleState.stateStack.pop();
			});
			this.end = true;
			await this.wildBattleState.stateStack.push(tbs)
		}
	}
	private handlePartyHeadFaint() {
		if (!this.wildBattleState.battle.party.head.canBattle()) {
			this.stateStack.pop();
			this.stateStack.push(new PokemonViewState(this.stateStack, this.wildBattleState, PokemonViewStatePurpose.PARTY_HEAD_FAINTED));
			return true;
		}
		return false;
	}
	public async performNextDecision() {
		await this.checkBattleShouldEnd();
		if (this.end) {
			return;
		}
		if (this.sortedDecisions.length === 0) {
			if (this.handlePartyHeadFaint())
				return;
		}
		const decision = this.sortedDecisions[0];
		if (!decision) {
			this.stateStack.pop();
			this.stateStack.push(new MainMenuState(this.stateStack, this.wildBattleState));
			return;
		}
		console.log(this.sortedDecisions)
		if (decision.type === 'run') {
			const canRunAway = chance(50);
			if (canRunAway) {
				const tbs = new TextBoxState(this.wildBattleState.stateStack, "You ran away safely!");
				tbs.evtSource.addEventListener('pop', () => {
					this.wildBattleState.stateStack.pop();
				});
				this.wildBattleState.stateStack.push(tbs);
			} else {
				const tbs = new TextBoxState(this.wildBattleState.stateStack, "You couldn't run away!");
				tbs.evtSource.addEventListener('pop', () => {
					this.sortedDecisions.shift();
					this.performNextDecision();
				});

				this.wildBattleState.stateStack.push(tbs);


			}
		} else if (decision.type === "attack") {
			await this.substates.push(new AttackingState(this.substates, this, decision));
		} else if (decision.type === "switch") {
			await this.substates.push(new SwitchingState(this.substates, this, decision));

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
	target: PokemonCreature | null,
	team: 'trainer'
}

export interface TrainerDecisionRun {
	type: 'run',
	user: PokemonCreature;
	team: 'trainer'
}

export interface TrainerDecisionSwitch {
	type: 'switch',
	user: PokemonCreature
	into: PokemonCreature;
	team: 'trainer'
}

export type TrainerDecision = TrainerDecisionAttack | TrainerDecisionRun | TrainerDecisionSwitch;

export interface WildDecision {
	type: 'attack'
	attack: string;
	user: PokemonCreature,
	target: PokemonCreature | null | 'partyhead'
	team: 'wild'
}

type Decision = WildDecision | TrainerDecision;