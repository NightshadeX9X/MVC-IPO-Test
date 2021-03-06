import { getRandomCreatureMove } from "../../../Util.js";
import Input from "../../Input.js";
import Loader from "../../Loader.js";
import PokemonMove from "../../PokemonMove.js";
import State from "../../State.js";
import StateStack from "../../StateStack.js";
import TextBoxState from "../TextBoxState.js";
import WildBattleState from "../WildBattleState.js";
import InteractionState from "./InteractionState.js";
import MainMenuState from "./MainMenuState.js";

export default class FightMenuState extends State {
	private menuEl = document.createElement('div');
	private selected = -1;
	private sinceLastAttackChange = -10;
	private frames = 0;
	constructor(public stateStack: StateStack, public wildBattleState: WildBattleState) {
		super(stateStack);
	}
	async preload(loader: Loader) {

	}
	private get attackBoxes() {
		return Array.from(this.menuEl.getElementsByClassName('attack-box')) as HTMLDivElement[]
	}
	private get returnButton() {
		return this.menuEl.getElementsByClassName('return')[0] as HTMLDivElement;
	}
	private return() {
		this.stateStack.pop();
		this.stateStack.push(new MainMenuState(this.stateStack, this.wildBattleState));
	}
	init(): void {
		this.menuEl.id = "fight-menu";
		this.menuEl.style.width = "110px"
		this.menuEl.innerHTML = `
			<div class="return">&larr;</div>
		`
		let partyHead = this.wildBattleState.partyHead;
		if (partyHead) {
			partyHead.moves.forEach(moveName => {
				const move = PokemonMove.list.get(moveName);
				if (move) {
					this.menuEl.innerHTML += `
					<div class="attack-box">
						<h2>${move.displayName}</h2>
					</div>
					`
				}
			})
		}

		this.returnButton.addEventListener('click', () => {
			this.return();
		})

		const attackBoxes = this.attackBoxes;
		attackBoxes.forEach((atkBox, i) => {
			atkBox.addEventListener('mouseover', () => {
				this.selected = i;
			})

			atkBox.addEventListener('click', () => {
				if (this.sinceLastAttackChange >= 10)
					this.chooseAttack();
			});
			const h2 = atkBox.firstElementChild as HTMLHeadingElement;
			if (h2) {
				h2.style.fontSize = "13px"
				if (h2.innerHTML.length > 16) {
					const diff = h2.innerHTML.length - 16;
					const fontSize = Number(h2.style.fontSize.slice(0, -2));
					let str = `${fontSize - (diff / 1.5)}px`;
					console.log(str)
					h2.style.fontSize = str;
				}

			}
		})

		document.body.appendChild(this.menuEl);


		this.evtSource.addEventListener('pop', () => {
			this.menuEl.classList.add("hidden")
		});
	}
	private chooseAttack() {
		if (this.selected === -1 || !this.wildBattleState.partyHead || !this.wildBattleState.battle) return;
		console.log(`Chose attack number ${this.selected + 1}`);
		this.stateStack.pop();
		this.stateStack.push(new InteractionState(this.stateStack, this.wildBattleState, {
			type: 'attack',
			attack: this.wildBattleState.partyHead.moves[this.selected],
			user: this.wildBattleState.partyHead,
			target: this.wildBattleState.battle?.wild || null,
			team: 'trainer'
		}));
	}
	update(input: Input): void {

		this.attackBoxes.forEach((atkBox, i) => {
			if (i === this.selected) atkBox.classList.add('selected')
			else atkBox.classList.remove('selected')
		});

		if (this.sinceLastAttackChange >= 10) {



			if (input.directionKeyStates.DOWN) {
				let newVal = this.selected + 1;
				if (newVal >= 4) newVal = 0;
				this.selected = newVal;
				this.sinceLastAttackChange = 0;
			} else if (input.directionKeyStates.UP) {
				let newVal = this.selected - 1;
				if (newVal < -1) newVal = 0;
				if (this.selected === 0) newVal = 3;
				this.selected = newVal;
				this.sinceLastAttackChange = 0;
			}

			if (input.interactionKey) {
				this.chooseAttack();
			}
		}

		if (this.frames > 20 && input.escapeKey) {
			this.return();
		}

		this.sinceLastAttackChange++;
		this.frames++;
	}
	render(ctx: CanvasRenderingContext2D): void {
		this.wildBattleState.drawBattleGraphics(ctx)
	}

}
