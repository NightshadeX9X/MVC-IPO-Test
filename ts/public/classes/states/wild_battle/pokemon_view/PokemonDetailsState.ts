import { upperCaseStart } from "../../../../Util.js";
import Input from "../../../Input.js";
import Loader from "../../../Loader.js";
import State from "../../../State.js";
import StateStack from "../../../StateStack.js";
import SwitchingState from "../interaction/SwitchingState.js";
import InteractionState from "../InteractionState.js";
import PokemonViewState from "../PokemonViewState.js";
import PartyDisplayState from "./PartyDisplayState.js";

export default class PokemonDetailsState extends State {
	private el = document.createElement('div');
	constructor(public stateStack: StateStack, public pokemonViewState: PokemonViewState, private index: number) {
		super(stateStack);
		this.onPop = () => {
			this.el.remove();
		}
	}
	private pokemonToShow = this.pokemonViewState.notFaintedParty?.[this.index]

	async preload(loader: Loader) {

	}
	init(): void {
		this.el.id = "pokemon-details";
		if (!this.pokemonToShow) return;
		this.el.innerHTML = `
		<div class="return">&larr;</div>
		<h1>Pokemon Details</h1>
		<div class="fields">
			<div class="field">
				<label for="species">Species:</label>
				<p class="species">${this.pokemonToShow.species.displayName}</p>
				<img class="species-image" src="/assets/images/pokemon/greninja.png" width="30" height="30"></img>
			</div>
			<div class="field">
				<label for="type">Type:</label>
				<p class="type">Water/Dark</p>
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

		const returnBtn = this.el.querySelector('.return') as HTMLDivElement;
		returnBtn.addEventListener('click', () => {
			this.stateStack.pop();
			this.stateStack.push(new PartyDisplayState(this.stateStack, this.pokemonViewState))
		})

		const switchBtn = this.el.querySelector('button');
		switchBtn?.addEventListener('click', () => {
			if (!this.pokemonToShow || !this.pokemonViewState.wildBattleState.partyHead) return;
			const wbst = this.pokemonViewState.stateStack;
			this.pokemonViewState.stateStack.pop();
			const interactionState = new InteractionState(wbst, this.pokemonViewState.wildBattleState, {
				type: 'switch',
				into: this.pokemonToShow,
				user: this.pokemonViewState.wildBattleState.partyHead
			});

			wbst.push(interactionState);

		})


		document.body.appendChild(this.el);
	}
	update(input: Input): void {

	}
	render(ctx: CanvasRenderingContext2D): void {

	}

}