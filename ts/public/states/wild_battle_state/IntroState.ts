import Input from "../../core/Input.js";
import State from "../../core/State.js";
import StateStack from "../../core/StateStack.js";
import InputModalElement from "../../UI/InputModal.js";
import { Parents } from "../../util/functions.js";
import WildBattleState from "../WildBattleState.js";
import TextBoxElement from '../../UI/TextBox.js';

interface IntroState extends State { }

@Parents(State)
class IntroState {
	private partyHeadDistFromTarget: number;
	private wildDistFromTarget: number;
	private pokemonIntroSpeed = 2.15;
	constructor(stateStack: StateStack) {
		State.call(this, stateStack);

		this.partyHeadDistFromTarget = this.wildBattleState.partyHeadTargetPos.x - this.wildBattleState.partyHeadPos.x
		this.wildDistFromTarget = this.wildBattleState.wildPos.x - this.wildBattleState.wildTargetPos.x

	}

	get wildBattleState() {
		return this.stateStack.parent as WildBattleState;
	}

	update(input: Input) {
		if (this.wildBattleState.partyHeadPos.x < this.wildBattleState.partyHeadTargetPos.x) {
			this.wildBattleState.partyHeadPos.add(this.partyHeadDistFromTarget * this.pokemonIntroSpeed / 360, 0);
		}
		if (this.wildBattleState.wildPos.x > this.wildBattleState.wildTargetPos.x) {
			this.wildBattleState.wildPos.sub(this.wildDistFromTarget * this.pokemonIntroSpeed / 360, 0);
		}
		if (this.wildBattleState.partyHeadPos.x >= this.wildBattleState.partyHeadTargetPos.x &&
			this.wildBattleState.wildPos.x <= this.wildBattleState.wildTargetPos.x) {
			// this.remove();

		}
	}
}

export default IntroState;