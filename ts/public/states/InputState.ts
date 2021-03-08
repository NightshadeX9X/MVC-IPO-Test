import State from "../core/State.js";
import StateStack from "../core/StateStack.js";
import InputModalElement from "../UI/InputModal.js";
import { Parents } from "../util/functions.js";

interface InputState extends State { }

@Parents(State)
class InputState {
	element = new InputModalElement();
	answer = null as string | null;
	constructor(public stateStack: StateStack, public question: string, public regex: RegExp) {
		State.call(this, stateStack)
	}
	async preload() {
		this.stateStack.game.input.preventDefault = false;
		this.createModal();
	}
	private createModal() {
		this.element.innerHTML = this.question;
		this.element.setAttribute('regex', this.regex.source);
		this.element.setAttribute('regex-flags', this.regex.flags);
		console.log(this.element)
		document.body.appendChild(this.element);

		this.element.evtHandler.addEventListener('confirm', (value: string) => {
			if (this.element.valueIsValid) {
				console.log(value)
				this.answer = value;
				this.remove()
			}
		});
		this.evtHandler.addEventListener('remove', () => {
			this.stateStack.game.input.preventDefault = true;
			this.element.remove();
		})
	}
}

export default InputState;