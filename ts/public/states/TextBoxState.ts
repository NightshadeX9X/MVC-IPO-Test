import Input from "../core/Input.js";
import State from "../core/State.js";
import StateStack from "../core/StateStack.js";
import TextBoxElement from "../UI/TextBox.js";
import { Parents } from "../util/functions.js";

interface TextBoxState extends State { }

@Parents(State)
class TextBoxState {
	sentence = this.originalSentence;
	location: [number, number, number] = [0, 0, 0];
	element = new TextBoxElement(["", "", ""]);
	index = 0;
	constructor(public stateStack: StateStack, private readonly originalSentence: string) {
		State.call(this, stateStack);
		console.log(this.originalSentence.length)
		document.body.appendChild(this.element);

		const enterEvtListener = this.stateStack.game.input.evtHandler.addEventListener('keypress', (e: KeyboardEvent) => {
			if (e.key === " ") {
				if (this.charsPassed >= this.originalSentence.length - 1) {
					this.stateStack.pop();
				}
				else if (this.location[2] >= TextBoxElement.maxLength && this.location[1] >= 2) {
					if (this.location[2] >= this.totalParas) this.stateStack.pop();
					else {

						this.location[0]++;
						this.location[1] = 0;
						this.location[2] = 0;
						this.element.updateRow(0, "");
						this.element.updateRow(1, "");
						this.element.updateRow(2, "");
						this.toTick = true;
					}
				}
				else {
					this.location[2] = TextBoxElement.maxLength;
					this.element.updateRow(this.location[1], this.row)
				}
			}
		});


		this.evtHandler.addEventListener('remove', () => {
			this.element.remove();
			this.stateStack.game.input.evtHandler.removeEventListener(enterEvtListener);
		})
	}

	update(input: Input) {
		this.tick(input);
	}

	charsPassed = 0;

	toTick = true;
	get totalParas() {
		return Math.floor(this.originalSentence.length / (TextBoxElement.maxLength * 3)) + 1
	}
	tick(input: Input) {
		if (!this.toTick) return;
		if (this.charsPassed >= this.originalSentence.length - 1) {
			this.toTick = false;
		}
		this.element.updateRow(this.location[1], this.element.text[this.location[1]] + this.char)
		this.location[2]++;
		if (this.location[2] >= TextBoxElement.maxLength) {
			if (this.location[1] < 2) {

				this.location[1]++;
				this.location[2] = 0;
			} else {
				this.toTick = false;
				return;
			}
		}
		this.charsPassed++;
	}

	get paragraph() {
		const start = this.location[0] * TextBoxElement.maxLength * 3;
		const paragraph = this.originalSentence.slice(start, start + TextBoxElement.maxLength * 3);
		return paragraph;
	}

	get row() {
		const start = this.location[1] * TextBoxElement.maxLength;
		const row = this.paragraph.slice(start, start + TextBoxElement.maxLength)
		return row;
	}

	get char() {
		const char = this.row.charAt(this.location[2]);
		return char;
	}
}

export default TextBoxState;