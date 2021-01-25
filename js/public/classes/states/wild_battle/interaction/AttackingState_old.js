import { calcTypeEffectiveness } from "../../../../PokemonTypeEffectiveness.js";
import PokemonMove from "../../../PokemonMove.js";
import State from "../../../State.js";
import TextBoxState from "../../TextBoxState.js";
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
    }
    update(input) {
        this.frames++;
        // if (this.frames % 2 !== 1) return;
        if (this.damageToBeDone === undefined)
            return;
        if (this.damageDone < this.damageToBeDone) {
            if (!this.interactionState.wildBattleState.battle?.wild.canBattle()) {
                const tbt = this.displayText(`The wild ${this.interactionState.wildBattleState.battle?.wild.nickname} fainted!`);
                tbt.onPop = () => {
                    if (!this.interactionState.wildBattleState.battle?.wild.canBattle())
                        this.interactionState.wildBattleState.stateStack.pop();
                };
            }
            if (!this.interactionState.wildBattleState.partyHead?.canBattle()) {
                const tbt = this.displayText(`${this.interactionState.wildBattleState.partyHead?.nickname} fainted!`);
                tbt.onPop = () => {
                    if (!this.interactionState.wildBattleState.partyHead?.canBattle())
                        this.interactionState.wildBattleState.stateStack.pop();
                };
            }
            if (this.decision.target) {
                this.decision.target.stats.HP--;
            }
            this.damageDone++;
        }
        else {
            if (!this.attackChosen || !this.decision.target)
                return;
            if (this.damageToBeDone !== 0) {
                const tbs = this.displayText(`${this.decision.user.nickname} did ${this.damageToBeDone} damage to ${this.decision.target.nickname}.`);
                tbs.onPop = () => {
                    this.stateStack.pop();
                };
                const te = calcTypeEffectiveness(this.attackChosen.type, this.decision.target.species.types);
                if (te === 0.5)
                    this.displayText("It's not very effective...");
                if (te === 2)
                    this.displayText("It's super effective!");
            }
            else {
                const tbt = this.displayText(`It doesn't affect ${this.decision.target.nickname}...`);
                tbt.onPop = () => {
                    this.stateStack.pop();
                };
            }
        }
        if (this.frames === 1)
            this.displayText(`${this.decision.user.nickname} used ${this.attackChosen?.displayName}!`);
    }
    render(ctx) {
    }
    displayText(text) {
        let tbs = new TextBoxState(this.interactionState.wildBattleState.stateStack, text);
        this.interactionState.wildBattleState.stateStack.push(tbs);
        return tbs;
    }
}
