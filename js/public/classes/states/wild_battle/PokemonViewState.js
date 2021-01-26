import State from "../../State.js";
import MainMenuState from "./MainMenuState.js";
import PartyDisplayState from "./pokemon_view/PartyDisplayState.js";
export default class PokemonViewState extends State {
    constructor(stateStack, wildBattleState) {
        super(stateStack);
        this.stateStack = stateStack;
        this.wildBattleState = wildBattleState;
        this.onPop = () => {
            this.stateStack.push(new MainMenuState(this.stateStack, this.wildBattleState));
        };
    }
    get notFaintedParty() {
        return this.wildBattleState.battle?.party.filter(p => p.canBattle());
    }
    async preload(loader) {
        await this.substates.push(new PartyDisplayState(this.substates, this));
    }
    init() {
    }
    update(input) {
        this.substates.update(input);
    }
    render(ctx) {
        this.substates.render(ctx);
    }
}
