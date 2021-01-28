import State from "../../../State.js";
export default class SwitchingState extends State {
    constructor(stateStack, interactionState, decision) {
        super(stateStack);
        this.stateStack = stateStack;
        this.interactionState = interactionState;
        this.decision = decision;
        this.switched = false;
        this.evtSource.addEventListener('pop', () => {
            if (this.switched)
                this.interactionState.sortedDecisions.shift();
            this.interactionState.performNextDecision();
        });
    }
    async preload(loader) {
        const into = this.decision.into;
        const party = this.interactionState.wildBattleState.battle?.party;
        if (!this.interactionState.wildBattleState.battle?.party || !party || !into.canBattle()) {
            this.stateStack.pop();
            return;
        }
        ;
        this.interactionState.wildBattleState.battle.party.head = into;
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
