import { chance } from "../../../Util.js";
import PokemonMove from "../../PokemonMove.js";
import State from "../../State.js";
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
            if (a.type === "attack" && b.type === "attack") {
                return b.user.stats.Spe - a.user.stats.Spe;
            }
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
            return -8;
        }
        return 0;
    }
    async preload(loader) {
        await this.performNextDecision();
    }
    async performNextDecision() {
        const decision = this.sortedDecisions[0];
        if (!decision) {
            this.stateStack.pop();
            this.stateStack.push(new MainMenuState(this.stateStack, this.wildBattleState));
            return;
        }
        if (decision.type === 'run') {
            const canRunAway = chance(50);
            if (canRunAway) {
                console.log("You ran away safely!");
                this.wildBattleState.stateStack.pop();
            }
            else {
                console.log("You couldn't run away!");
                this.sortedDecisions.shift();
                this.performNextDecision();
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
