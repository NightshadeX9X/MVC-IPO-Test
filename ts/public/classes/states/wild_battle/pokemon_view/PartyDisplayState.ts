import Input from "../../../Input.js";
import Loader from "../../../Loader.js";
import State from "../../../State.js";
import StateStack from "../../../StateStack.js";
import WildBattleState from "../../WildBattleState.js";
import MainMenuState from "../MainMenuState.js";
import PokemonViewState, { PokemonViewStatePurpose } from "../PokemonViewState.js";
import PokemonDetailsState from "./PokemonDetailsState.js";

export default class PartyDisplayState extends State {
	private displayEl = document.createElement('div');
	private cards: HTMLDivElement[] = [];
	private get notFaintedCards() {
		return this.cards.filter(c => !c.classList.contains("fainted"))
	}
	private lastChanged = 0;
	private frames = 0;
	constructor(public stateStack: StateStack, public pokemonViewState: PokemonViewState) {
		super(stateStack);
		this.evtSource.addEventListener('pop', () => {
			this.displayEl.remove();

		});
	}

	get numberSelected() {
		return this.notFaintedCards.findIndex(c => c.classList.contains('selected'))
	}

	get currentCard() {
		return this.notFaintedCards[this.numberSelected];
	}

	async preload(loader: Loader) {

	}
	init(): void {
		this.displayEl.id = "party-display";
		this.displayEl.innerHTML = `
		<div class="close">&times;</div>
		<h2 class="title">Pokémon</h2>
		<div class="grid">
			
		</div>
		`;

		this.pokemonViewState.wildBattleState.battle?.party.pokemon.forEach(p => {
			const grid = this.displayEl.querySelector('.grid');
			if (grid)
				grid.innerHTML +=
					`
			<div class="card selected">
				<h3>${p.nickname}</h3>
				<h4>Level ${p.level}</h4>
				<div class="hint-view">
					<p>View!</p>
				</div>
			</div>
			`
		})

		const closeBtn = this.displayEl.getElementsByClassName('close')[0] as HTMLDivElement;
		if (this.pokemonViewState.purpose === PokemonViewStatePurpose.PARTY_HEAD_FAINTED) {
			closeBtn.style.display = "none";
		}
		closeBtn.addEventListener('click', () => {
			if (this.frames > 20 && this.pokemonViewState.purpose === PokemonViewStatePurpose.PLAYER_CHOICE) {
				this.pokemonViewState.stateStack.pop();
			}
		});

		this.cards = Array.from(this.displayEl.querySelectorAll('.card')) as HTMLDivElement[];


		this.cards.forEach((card, i) => {
			const creature = this.pokemonViewState.wildBattleState.battle.party.pokemon[i];
			if (creature) {
				if (!creature.canBattle()) {
					card.classList.add("fainted");
				}
			}
		})

		this.notFaintedCards.forEach((card, i) => {
			if (card.classList.contains("fainted")) return;
			card.addEventListener('mouseover', () => {
				this.makeCurrentSelection(this.notFaintedCards.indexOf(card))
			})
			card.addEventListener('click', () => {
				this.select(i);
			})

		});

		this.cards.forEach(card => {
			if (card.classList.contains('fainted')) card.classList.remove('selected')
		})
		document.body.appendChild(this.displayEl);
	}
	private select(i: number) {
		this.stateStack.pop();
		this.stateStack.push(new PokemonDetailsState(this.stateStack, this.pokemonViewState, i));
	}
	private makeCurrentSelection(_number: number) {
		let number = _number;
		if (number === -1) number = this.notFaintedCards.length - 1;
		if (number >= this.notFaintedCards.length) {
			number = 0;
		}
		const card = this.notFaintedCards[number];
		if (!card) return;
		this.notFaintedCards.forEach(card => card.classList.remove('selected'))
		card.classList.add('selected');
	}
	update(input: Input): void {
		if (this.lastChanged > 10) {
			const oldSelection = this.numberSelected;
			if (input.directionKeyStates.RIGHT) {
				this.makeCurrentSelection(this.numberSelected + 1);
			} else if (input.directionKeyStates.LEFT) {
				this.makeCurrentSelection(this.numberSelected - 1);

			}
			if (oldSelection !== this.numberSelected) {

				this.lastChanged = 0;
			}

		}
		if (this.frames > 20 && input.interactionKey && this.numberSelected >= 0 && this.numberSelected < this.notFaintedCards.length) {
			this.select(this.numberSelected);
		}
		if (this.frames > 20 && this.pokemonViewState.purpose === PokemonViewStatePurpose.PLAYER_CHOICE && input.escapeKey) {
			this.pokemonViewState.stateStack.pop();
		}
		this.lastChanged++;
		this.frames++;
	}
	render(ctx: CanvasRenderingContext2D): void {
	}

}