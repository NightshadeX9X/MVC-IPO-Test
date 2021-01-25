import { calcTypeEffectiveness } from "../../../../PokemonTypeEffectiveness.js";
import { delay } from "../../../../Util.js";
import Input from "../../../Input.js";
import Loader from "../../../Loader.js";
import PokemonMove from "../../../PokemonMove.js";
import State from "../../../State.js";
import StateStack from "../../../StateStack.js";
import TextBoxState from "../../TextBoxState.js";
import FightMenuState from "../FightMenuState.js";
import InteractionState, { TrainerDecisionAttack } from "../InteractionState.js";
import MainMenuState from "../MainMenuState.js";
import { TypeRelation } from '../../../../PokemonTypeEffectiveness.js';

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
		let amount = this.attackChosen.getDamageDoneTo(this.decision.user, this.decision.target);
		// if (amount > this.decision.target.stats.HP) return this.decision.target.stats.HP;
		return amount;
	}
	private damageDone = 0;

	init(): void {
		this.displayText(`${this.decision.user.nickname} used ${this.attackChosen?.displayName}!`)
	}
	update(input: Input): void {
		this.frames++
		if (!this.attackChosen || this.damageToBeDone === undefined) return;

		if (this.damageDone < this.damageToBeDone && this.decision.target?.canBattle()) {
			this.do1Damage();
		} else {
			this.onDamageDealt();
		}
	}
	private async onDamageDealt() {
		if (!this.attackChosen || !this.decision.target || this.damageToBeDone === undefined) return
		const te = calcTypeEffectiveness(this.attackChosen.type, this.decision.target.species.types)
		const damage = this.damageToBeDone > this.originalDefenderHp ? this.originalDefenderHp : this.damageToBeDone;
		let teText = new TextBoxState(this.interactionState.wildBattleState.stateStack, "It's super effective!")
		const damageText = new TextBoxState(this.interactionState.wildBattleState.stateStack, `${this.decision.target.nickname} lost ${damage} HP!`)
		if (te === TypeRelation.RESISTS) {
			teText.setText("It's not very effective...");
		}
		else if (te === TypeRelation.IMMUNE_TO) {
			teText.setText(`It doesn't affect ${this.decision.target.nickname}...`);
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
		if (this.decision.target) {
			this.damageDone++;
			this.decision.target.stats.HP--;
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