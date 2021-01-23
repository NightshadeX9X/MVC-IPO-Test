import State from "../../State.js";
export default class FightMenuState extends State {
    constructor(stateStack, wildBattleState) {
        super(stateStack);
        this.stateStack = stateStack;
        this.wildBattleState = wildBattleState;
        this.menuEl = document.createElement('div');
        this.selected = -1;
        this.sinceLastAttackChange = -10;
    }
    async preload(loader) {
    }
    init() {
        this.menuEl.id = "fight-menu";
        this.menuEl.innerHTML = `
		<div class="attack-box">
			<h2>Thunderbolt</h2>
		</div>
		<div class="attack-box">
			<h2>Iron Tail</h2>
		</div>
		<div class="attack-box">
			<h2>Quick Attack</h2>
		</div>
		<div class="attack-box">
			<h2>Electroball</h2>
		</div>
		`;
        const children = Array.from(this.menuEl.children);
        children.forEach((child, i) => {
            child.addEventListener('mouseover', () => {
                this.selected = i;
            });
            child.addEventListener('click', () => {
                this.chooseAttack();
            });
        });
        document.body.appendChild(this.menuEl);
        this.onPop = () => {
            this.menuEl.classList.add("hidden");
        };
    }
    chooseAttack() {
        if (this.selected === -1)
            return;
        console.log(`Chose attack number ${this.selected + 1}`);
        this.stateStack.pop();
    }
    update(input) {
        const children = Array.from(this.menuEl.children);
        children.forEach((child, i) => {
            if (i === this.selected)
                child.classList.add('selected');
            else
                child.classList.remove('selected');
        });
        if (this.sinceLastAttackChange >= 10) {
            if (input.directionKeyStates.DOWN) {
                let newVal = this.selected + 1;
                if (newVal >= 4)
                    newVal = 0;
                this.selected = newVal;
                this.sinceLastAttackChange = 0;
            }
            else if (input.directionKeyStates.UP) {
                let newVal = this.selected - 1;
                if (newVal < -1)
                    newVal = 0;
                if (this.selected === 0)
                    newVal = 3;
                this.selected = newVal;
                this.sinceLastAttackChange = 0;
            }
        }
        if (input.keyIsDown(' ')) {
            this.chooseAttack();
        }
        this.sinceLastAttackChange++;
    }
    render(ctx) {
        this.wildBattleState.drawPokemon(ctx);
    }
}
