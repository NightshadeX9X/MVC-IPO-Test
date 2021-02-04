import { calcTypeEffectiveness } from "../../../../PokemonTypeEffectiveness.js";
import { MoveAnimations } from "../../../../Util.js";
import PokemonMove from "../../../PokemonMove.js";
import State from "../../../State.js";
import TextBoxState from "../../TextBoxState.js";
import { TypeRelation } from '../../../../PokemonTypeEffectiveness.js';
import AnimationState from "../../AnimationState.js";
import DelayState from "../../DelayState.js";
export default class AttackingState extends State {
    constructor(stateStack, interactionState, decision) {
        super(stateStack);
        this.stateStack = stateStack;
        this.interactionState = interactionState;
        this.decision = decision;
        this.frames = 0;
        this.originalDefenderHp = this.target?.stats.HP || 0;
        this.damageDone = 0;
        this.animating = false;
        this.readyToDecHP = false;
        this.evtSource.addEventListener('pop', () => {
            this.interactionState.sortedDecisions.shift();
            this.interactionState.performNextDecision();
        });
    }
    get target() {
        return this.decision.target === 'partyhead' ? this.interactionState.wildBattleState.partyHead : this.decision.target;
    }
    async preload(loader) {
    }
    get attackChosen() {
        const moveName = this.decision.attack;
        const move = PokemonMove.list.get(moveName);
        return move;
    }
    get damageToBeDone() {
        if (!this.attackChosen || !this.target)
            return undefined;
        let amount = this.attackChosen.getDamageDoneTo(this.decision.user, this.target);
        // if (amount > this.decision.target.stats.HP) return this.decision.target.stats.HP;
        return amount;
    }
    init() {
        if (!this.decision.user.canBattle()) {
            this.stateStack.pop();
            return;
        }
        this.displayText(`${this.decision.user.nickname} used ${this.attackChosen?.displayName}!`);
    }
    update(input) {
        (async () => {
            if (this.animating || !this.attackChosen)
                return;
            this.animating = true;
            const animation = MoveAnimations.get(this.attackChosen);
            const as = await AnimationState.getFromJSON(this.stateStack.loader, `moves/${animation}`, this.stateStack);
            for (let i = 0; i < 3; i++) {
                this.interactionState.wildBattleState.partyHeadPos.y -= 10;
                await this.stateStack.push(new DelayState(this.stateStack, 3));
                await this.stateStack.fromTop().pop();
                this.interactionState.wildBattleState.partyHeadPos.y += 10;
                await this.stateStack.push(new DelayState(this.stateStack, 3));
                await this.stateStack.fromTop().pop();
            }
            as.ctxAdjustments = (ctx) => {
                ctx.globalAlpha = 0.9;
                ctx.translate(13, 10);
                if (this.decision.user === this.interactionState.wildBattleState.battle.wild) {
                    ctx.translate(ctx.canvas.width / 6 - 30, 0);
                    ctx.rotate(Math.PI * -0.03);
                    ctx.scale(-1, 1);
                    //Using translate to move the image back to it's original origin
                }
                else
                    ctx.rotate(Math.PI * -0.03);
            };
            await this.stateStack.push(as);
            await as.pop();
            this.readyToDecHP = true;
        })();
        if (!this.readyToDecHP)
            return;
        this.frames++;
        if (!this.attackChosen || this.damageToBeDone === undefined)
            return;
        if (this.damageDone < this.damageToBeDone && this.target?.canBattle()) {
            this.do1Damage();
        }
        else {
            this.onDamageDealt();
        }
    }
    async onDamageDealt() {
        if (!this.attackChosen || !this.target || this.damageToBeDone === undefined)
            return;
        const te = calcTypeEffectiveness(this.attackChosen.type, this.target.species.types);
        const damage = this.damageToBeDone > this.originalDefenderHp ? this.originalDefenderHp : this.damageToBeDone;
        let teText = new TextBoxState(this.interactionState.wildBattleState.stateStack, "It's super effective!");
        const damageText = new TextBoxState(this.interactionState.wildBattleState.stateStack, `${this.target.nickname} lost ${damage} HP!`);
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
    do1Damage() {
        if (this.target) {
            this.damageDone++;
            this.target.stats.HP--;
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
