import { calcTypeEffectiveness } from "../../../../PokemonTypeEffectiveness.js";
import PokemonMove from "../../../PokemonMove.js";
import State from "../../../State.js";
import TextBoxState from "../../TextBoxState.js";
import { TypeRelation } from '../../../../PokemonTypeEffectiveness.js';
export default class AttackingState extends State {
    constructor(stateStack, interactionState, decision) {
        super(stateStack);
        this.stateStack = stateStack;
        this.interactionState = interactionState;
        this.decision = decision;
        this.frames = 0;
        this.originalDefenderHp = this.decision.target?.stats.HP || 0;
        this.damageDone = 0;
        this.onPop = () => {
            this.interactionState.sortedDecisions.shift();
            this.interactionState.performNextDecision();
        };
    }
    async preload(loader) {
    }
    get attackChosen() {
        const moveName = this.decision.attack;
        const move = PokemonMove.list.get(moveName);
        return move;
    }
    get damageToBeDone() {
        if (!this.attackChosen || !this.decision.target)
            return undefined;
        let amount = this.attackChosen.getDamageDoneTo(this.decision.user, this.decision.target);
        // if (amount > this.decision.target.stats.HP) return this.decision.target.stats.HP;
        return amount;
    }
    init() {
        this.displayText(`${this.decision.user.nickname} used ${this.attackChosen?.displayName}!`);
    }
    update(input) {
        this.frames++;
        if (!this.attackChosen || this.damageToBeDone === undefined)
            return;
        if (this.damageDone < this.damageToBeDone && this.decision.target?.canBattle()) {
            this.do1Damage();
        }
        else {
            this.onDamageDealt();
        }
    }
    async onDamageDealt() {
        if (!this.attackChosen || !this.decision.target || this.damageToBeDone === undefined)
            return;
        const te = calcTypeEffectiveness(this.attackChosen.type, this.decision.target.species.types);
        const damage = this.damageToBeDone > this.originalDefenderHp ? this.originalDefenderHp : this.damageToBeDone;
        let teText = new TextBoxState(this.interactionState.wildBattleState.stateStack, "It's super effective!");
        const damageText = new TextBoxState(this.interactionState.wildBattleState.stateStack, `${this.decision.target.nickname} lost ${damage} HP!`);
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
    do1Damage() {
        if (this.decision.target) {
            this.damageDone++;
            this.decision.target.stats.HP--;
        }
    }
    render(ctx) {
    }
    displayText(text) {
        let tbs = new TextBoxState(this.interactionState.wildBattleState.stateStack, text);
        this.interactionState.wildBattleState.stateStack.push(tbs);
        return tbs;
    }
}
