import { calcTypeEffectiveness } from "../../../../PokemonTypeEffectiveness.js";
import PokemonMove from "../../../PokemonMove.js";
import State from "../../../State.js";
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
        return this.attackChosen.getDamageDoneTo(this.decision.user, this.decision.target);
    }
    init() {
        if (this.damageToBeDone === undefined || !this.attackChosen || !this.decision.target)
            return;
        const te = calcTypeEffectiveness(this.attackChosen.type, this.decision.target.species.types);
        if (te === 0.5)
            console.log("It's not very effective.");
        if (te === 2)
            console.log("It's super effective!");
        if (te === 0) {
            console.log(`It doesn't affect ${this.decision.target.nickname}...`);
            return;
        }
        console.log(`${this.decision.user.nickname} did ${this.damageToBeDone} damage to ${this.decision.target.nickname}`);
    }
    update(input) {
        this.frames++;
        if (this.frames % 10 !== 1)
            return;
        if (this.damageToBeDone === undefined)
            return;
        if (this.damageDone < this.damageToBeDone) {
            if (this.interactionState.wildBattleState.shouldEnd) {
                this.interactionState.wildBattleState.stateStack.pop();
            }
            if (this.decision.target) {
                this.decision.target.stats.HP--;
            }
            this.damageDone++;
        }
        else {
            this.stateStack.pop();
        }
    }
    render(ctx) {
    }
}
