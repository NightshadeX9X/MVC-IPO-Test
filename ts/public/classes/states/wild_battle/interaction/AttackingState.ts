import { calcTypeEffectiveness } from "../../../../PokemonTypeEffectiveness.js";
import { delay } from "../../../../Util.js";
import Input from "../../../Input.js";
import Loader from "../../../Loader.js";
import PokemonMove from "../../../PokemonMove.js";
import State from "../../../State.js";
import StateStack from "../../../StateStack.js";
import TextBoxState from "../../TextBoxState.js";
import FightMenuState from "../FightMenuState.js";
import InteractionState, { TrainerDecisionAttack, WildDecision } from "../InteractionState.js";
import MainMenuState from "../MainMenuState.js";
import { TypeRelation } from '../../../../PokemonTypeEffectiveness.js';

export default class AttackingState extends State {
	private frames = 0;
	constructor(public stateStack: StateStack, public interactionState: InteractionState, public decision: TrainerDecisionAttack | WildDecision) {
		super(stateStack);
		this.evtSource.addEventListener('pop', () => {
			this.interactionState.sortedDecisions.shift();
			this.interactionState.performNextDecision();
		});
	}
	private get target() {
		return this.decision.target === 'partyhead' ? this.interactionState.wildBattleState.partyHead : this.decision.target
	}
	private originalDefenderHp = this.target?.stats.HP || 0;

	async preload(loader: Loader) {

	}
	private get attackChosen() {
		const moveName = this.decision.attack;
		const move = PokemonMove.list.get(moveName);
		return move;
	}
	private get damageToBeDone() {
		if (!this.attackChosen || !this.target) return undefined;
		let amount = this.attackChosen.getDamageDoneTo(this.decision.user, this.target);
		// if (amount > this.decision.target.stats.HP) return this.decision.target.stats.HP;
		return amount;
	}
	private damageDone = 0;

	init(): void {
		if (!this.decision.user.canBattle()) {
			this.stateStack.pop();
			return;
		}
		this.displayText(`${this.decision.user.nickname} used ${this.attackChosen?.displayName}!`)
	}
	update(input: Input): void {
		this.frames++
		if (!this.attackChosen || this.damageToBeDone === undefined) return;

		if (this.damageDone < this.damageToBeDone && this.target?.canBattle()) {
			this.do1Damage();
		} else {
			this.onDamageDealt();
		}
	}
	private async onDamageDealt() {
		if (!this.attackChosen || !this.target || this.damageToBeDone === undefined) return
		const te = calcTypeEffectiveness(this.attackChosen.type, this.target.species.types)
		const damage = this.damageToBeDone > this.originalDefenderHp ? this.originalDefenderHp : this.damageToBeDone;
		let teText = new TextBoxState(this.interactionState.wildBattleState.stateStack, "It's super effective!")
		const damageText = new TextBoxState(this.interactionState.wildBattleState.stateStack, `${this.target.nickname} lost ${damage} HP!`)
		if (te === TypeRelation.RESISTS) {
			teText.setText("It's not very effective...");
		}
		else if (te === TypeRelation.IMMUNE_TO) {
			teText.setText(`It doesn't affect ${this.target.nickname}...`);
		}

		if (te !== TypeRelation.NEUTRAL) {

			this.interactionState.wildBattleState.stateStack.push(teText);
			await teText.pop();
		}

		if (te !== TypeRelation.IMMUNE_TO) {

			this.interactionState.wildBattleState.stateStack.push(damageText);
			await damageText.pop();
		}

		this.stateStack.pop();
	}
	private do1Damage() {
		if (this.target) {
			this.damageDone++;
			this.target.stats.HP--;
		}
	}
	render(ctx: CanvasRenderingContext2D): void {
	}

	private displayText(text: string) {
		let tbs = new TextBoxState(this.interactionState.wildBattleState.stateStack, text);
		this.interactionState.wildBattleState.stateStack.push(tbs)
		return tbs;
	}

}