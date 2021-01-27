import State from "../../State.js";
import MainMenuState from "./MainMenuState.js";
import PartyDisplayState from "./pokemon_view/PartyDisplayState.js";
export default class PokemonViewState extends State {
    constructor(stateStack, wildBattleState, purpose = PokemonViewStatePurpose.PLAYER_CHOICE) {
        super(stateStack);
        this.stateStack = stateStack;
        this.wildBattleState = wildBattleState;
        this.purpose = purpose;
        this.evtSource.addEventListener('pop', () => {
            if (!(this.stateStack.fromTop() instanceof MainMenuState))
                this.stateStack.push(new MainMenuState(this.stateStack, this.wildBattleState));
            console.log(this.stateStack);
        });
    }
    get notFaintedParty() {
        return this.wildBattleState.battle?.party.onlyUsable();
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
export var PokemonViewStatePurpose;
(function (PokemonViewStatePurpose) {
    PokemonViewStatePurpose[PokemonViewStatePurpose["PLAYER_CHOICE"] = 0] = "PLAYER_CHOICE";
    PokemonViewStatePurpose[PokemonViewStatePurpose["PARTY_HEAD_FAINTED"] = 1] = "PARTY_HEAD_FAINTED";
})(PokemonViewStatePurpose || (PokemonViewStatePurpose = {}));
