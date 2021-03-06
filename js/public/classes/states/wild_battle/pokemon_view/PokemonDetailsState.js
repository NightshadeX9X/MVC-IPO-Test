import { typesToString } from "../../../../Util.js";
import State from "../../../State.js";
import InteractionState from "../InteractionState.js";
import { PokemonViewStatePurpose } from "../PokemonViewState.js";
import PartyDisplayState from "./PartyDisplayState.js";
export default class PokemonDetailsState extends State {
    constructor(stateStack, pokemonViewState, index) {
        super(stateStack);
        this.stateStack = stateStack;
        this.pokemonViewState = pokemonViewState;
        this.index = index;
        this.el = document.createElement('div');
        this.frames = 0;
        this.pokemonToShow = this.pokemonViewState.notFaintedParty?.pokemon[this.index];
        this.evtSource.addEventListener('pop', async () => {
            this.el.remove();
            if (this.pokemonViewState.purpose !== PokemonViewStatePurpose.PARTY_HEAD_FAINTED)
                return;
            this.pokemonViewState.wildBattleState.partyHeadImage = await this.stateStack.loader.loadImage(`/assets/images/pokemon/${this.pokemonToShow.species?.name}.png`);
            this.pokemonViewState.wildBattleState.battle.party.head = this.pokemonToShow;
        });
    }
    return() {
        this.stateStack.pop();
        this.stateStack.push(new PartyDisplayState(this.stateStack, this.pokemonViewState));
    }
    async preload(loader) {
    }
    init() {
        this.el.id = "pokemon-details";
        if (!this.pokemonToShow)
            return;
        this.el.innerHTML = `
		<div class="return">&larr;</div>
		<h1>Pokemon Details</h1>
		<div class="fields">
			<div class="field">
				<label for="species">Species:</label>
				<p class="species">${this.pokemonToShow.species.displayName}</p>
				<img class="species-image" src="/assets/images/pokemon/${this.pokemonToShow.species.name}.png" width="30" height="30"></img>
			</div>
			<div class="field">
				<label for="type">Type:</label>
				<p class="type">${typesToString(this.pokemonToShow.species.types)}</p>
			</div>
			<div class="field">
				<label for="nickname">Nickname:</label>
				<p class="nickname">${this.pokemonToShow.nickname}</p>
			</div>
			<div class="field">
				<label for="level">Level:</label>
				<p class="level">${this.pokemonToShow.level}</p>
			</div>
		</div>
		<button class="switch">Switch!</button>
		`;
        const returnBtn = this.el.querySelector('.return');
        returnBtn.addEventListener('click', () => {
            if (this.frames > 20)
                this.return();
        });
        const switchBtn = this.el.querySelector('button');
        switchBtn?.addEventListener('click', () => {
            console.log(this.pokemonToShow);
            if (!this.pokemonToShow)
                return;
            const wbst = this.pokemonViewState.stateStack;
            console.log("ehehehehe");
            console.log(Array.from(this.pokemonViewState.stateStack.states));
            this.pokemonViewState.stateStack.pop();
            if (this.pokemonViewState.purpose === PokemonViewStatePurpose.PLAYER_CHOICE) {
                const interactionState = new InteractionState(wbst, this.pokemonViewState.wildBattleState, {
                    type: 'switch',
                    into: this.pokemonToShow,
                    user: this.pokemonViewState.wildBattleState.partyHead,
                    team: 'trainer'
                });
                wbst.push(interactionState);
            }
        });
        document.body.appendChild(this.el);
    }
    update(input) {
        if (this.frames > 20 && input.escapeKey)
            this.return();
        this.frames++;
    }
    render(ctx) {
    }
}
