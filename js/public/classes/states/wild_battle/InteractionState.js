import { chance, randomArrayMember } from "../../../Util.js";
import PokemonMove from "../../PokemonMove.js";
import State from "../../State.js";
import TextBoxState from "../TextBoxState.js";
import AttackingState from './interaction/AttackingState.js';
import MainMenuState from "./MainMenuState.js";
export default class InteractionState extends State {
    constructor(stateStack, wildBattleState, trainerDecision, wildDecision) {
        super(stateStack);
        this.stateStack = stateStack;
        this.wildBattleState = wildBattleState;
        this.trainerDecision = trainerDecision;
        this.wildDecision = wildDecision;
        this.sortedDecisions = [];
        this.end = false;
        console.log(this.trainerDecision);
        const decisions = [wildDecision, trainerDecision];
        // @ts-ignore
        this.sortDecisions(decisions);
    }
    sortDecisions(decisions) {
        // @ts-ignore
        this.sortedDecisions = decisions.sort((a, b) => {
            if (!a || !b)
                return 0;
            if (InteractionState.getPriority(b) !== InteractionState.getPriority(a)) {
                return InteractionState.getPriority(b) - InteractionState.getPriority(a);
            }
            if (b.user.stats.Spe !== a.user.stats.Spe)
                return b.user.stats.Spe - a.user.stats.Spe;
            else
                return randomArrayMember([-1, 1]);
            return 0;
        });
    }
    static getPriority(decision) {
        if (decision.type === "attack") {
            const attack = PokemonMove.list.get(decision.attack);
            if (attack) {
                return attack.priority;
            }
        }
        else if (decision.type === "run") {
            return 7;
        }
        return 0;
    }
    async preload(loader) {
        await this.performNextDecision();
    }
    endBattleIfNecessary() {
        if (!this.wildBattleState.battle?.party.some(p => p.canBattle())) {
            let tbs = new TextBoxState(this.wildBattleState.stateStack, "You have no more Pokémon that can battle.");
            tbs.onPop = () => {
                this.wildBattleState.stateStack.pop();
            };
            this.wildBattleState.stateStack.push(tbs);
            this.end = true;
        }
        if (!this.wildBattleState.battle?.wild.canBattle()) {
            console.log("wild faint");
            let tbs = new TextBoxState(this.wildBattleState.stateStack, "The wild Pokémon fainted!");
            tbs.onPop = () => {
                this.wildBattleState.stateStack.pop();
            };
            this.wildBattleState.stateStack.push(tbs);
            this.end = true;
        }
    }
    async performNextDecision() {
        this.endBattleIfNecessary();
        if (this.end) {
            return;
        }
        const decision = this.sortedDecisions[0];
        if (!decision) {
            this.stateStack.pop();
            this.stateStack.push(new MainMenuState(this.stateStack, this.wildBattleState));
            return;
        }
        console.log(this.sortedDecisions);
        if (decision.type === 'run') {
            const canRunAway = chance(50);
            if (canRunAway) {
                const tbs = new TextBoxState(this.wildBattleState.stateStack, "You ran away safely!");
                tbs.onPop = () => {
                    this.wildBattleState.stateStack.pop();
                };
                this.wildBattleState.stateStack.push(tbs);
            }
            else {
                const tbs = new TextBoxState(this.wildBattleState.stateStack, "You couldn't run away!");
                tbs.onPop = () => {
                    this.sortedDecisions.shift();
                    this.performNextDecision();
                };
                this.wildBattleState.stateStack.push(tbs);
            }
        }
        else if (decision.type === "attack") {
            await this.substates.push(new AttackingState(this.substates, this, decision));
        }
    }
    init() {
    }
    update(input) {
        this.substates.update(input);
    }
    render(ctx) {
        this.wildBattleState.drawBattleGraphics(ctx);
        this.substates.render(ctx);
    }
}
