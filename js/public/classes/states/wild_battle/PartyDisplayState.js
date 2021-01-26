import State from "../../State.js";
export default class PartyDisplayState extends State {
    constructor(stateStack, wildBattleState) {
        super(stateStack);
        this.stateStack = stateStack;
        this.wildBattleState = wildBattleState;
        this.displayEl = document.createElement('div');
        this.cards = [];
        this.lastChanged = 0;
        this.onPop = () => {
            this.displayEl.remove();
        };
    }
    get numberSelected() {
        return this.cards.findIndex(c => c.classList.contains('selected'));
    }
    get currentCard() {
        return this.cards[this.numberSelected];
    }
    async preload(loader) {
    }
    init() {
        this.displayEl.id = "party-display";
        this.displayEl.innerHTML = `
		<div class="close">&times;</div>
		<h2 class="title">Pokémon</h2>
		<div class="grid">
			<div class="card selected">
				<h3>Pikachu</h3>
				<h4>Level 28</h4>
				<div class="hint-view">
					<p>View!</p>
				</div>
			</div>
			<div class="card fainted">
				<h3>Pikachu</h3>
				<h4>Level 28</h4>
				<div class="hint-view">
					<p>View!</p>
				</div>
			</div>
			<div class="card">
				<h3>Pikachu</h3>
				<h4>Level 28</h4>
				<div class="hint-view">
					<p>View!</p>
				</div>
			</div>
			<div class="card">
				<h3>Pikachu</h3>
				<h4>Level 28</h4>
				<div class="hint-view">
					<p>View!</p>
				</div>
			</div>
			<div class="card">
				<h3>Pikachu</h3>
				<h4>Level 28</h4>
				<div class="hint-view">
					<p>View!</p>
				</div>
			</div>
			<div class="card">
				<h3>Pikachu</h3>
				<h4>Level 28</h4>
				<div class="hint-view">
					<p>View!</p>
				</div>
			</div>

		</div>
		`;
        const closeBtn = this.displayEl.getElementsByClassName('close')[0];
        this.cards = Array.from(this.displayEl.querySelectorAll('.card'));
        this.cards = this.cards.filter(c => !c.classList.contains('fainted'));
        closeBtn.addEventListener('click', () => {
            this.stateStack.pop();
        });
        this.cards.forEach(card => {
            if (!card.classList.contains('fainted'))
                card.addEventListener('mouseover', () => {
                    this.makeCurrentSelection(this.cards.indexOf(card));
                });
        });
        document.body.appendChild(this.displayEl);
    }
    makeCurrentSelection(_number) {
        let number = _number;
        if (number === -1)
            number = this.cards.length - 1;
        if (number >= this.cards.length) {
            number = 0;
        }
        const card = this.cards[number];
        if (!card)
            return;
        this.cards.forEach(card => card.classList.remove('selected'));
        card.classList.add('selected');
    }
    update(input) {
        if (this.lastChanged > 10) {
            if (input.directionKeyStates.RIGHT) {
                this.makeCurrentSelection(this.numberSelected + 1);
            }
            else if (input.directionKeyStates.LEFT) {
                this.makeCurrentSelection(this.numberSelected - 1);
            }
            this.lastChanged = 0;
        }
        this.lastChanged++;
    }
    render(ctx) {
    }
}
