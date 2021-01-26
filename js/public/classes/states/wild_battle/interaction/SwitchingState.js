import State from "../../../State.js";
export default class SwitchingState extends State {
    constructor(stateStack, interactionState, decision) {
        super(stateStack);
        this.stateStack = stateStack;
        this.interactionState = interactionState;
        this.decision = decision;
        this.switched = false;
        this.onPop = () => {
            if (this.switched)
                this.interactionState.sortedDecisions.shift();
            this.interactionState.performNextDecision();
        };
    }
    async preload(loader) {
        const into = this.decision.into;
        const party = this.interactionState.wildBattleState.battle?.party;
        if (!this.interactionState.wildBattleState.battle?.party || !party || !into.canBattle()) {
            this.stateStack.pop();
            return;
        }
        ;
        const index = party.indexOf(this.decision.into);
        party.splice(index, 1);
        this.interactionState.wildBattleState.battle.party = [this.decision.into, ...party];
        this.switched = true;
        this.stateStack.pop();
        this.interactionState.wildBattleState.partyHeadImage = await loader.loadImage(`/assets/images/pokemon/${this.decision.into.species?.name}.png`);
    }
    init() {
    }
    update(input) {
    }
    render(ctx) {
    }
}
