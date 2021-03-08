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
					const row = this.row.split("").map((char, i) => {
						const filter = () => {
							const index = this.location[1] * TextBoxElement.maxLength + i;

							return this.toDrawChar(char, index);
						};
						if (!filter()) return;
						let red = false;
						let before = 0;
						while (!red) {
							const index = this.location[1] * TextBoxElement.maxLength + i - before;
							if (this.paragraph.charAt(index) === " " || this.paragraph.charAt(index) === "$") break;
							const previousChars = this.paragraph.slice(index - 2, index).split("");
							if (previousChars[0] === "%" && previousChars[1] === "%") {
								red = true;
							}
							before++;
						}
						if (red) return `<span class="red">${char}</span>`;
						return char;
					}).join("");
					console.log(row)
					this.element.updateRow(this.location[1], row)
				}
			}
		});


		this.evtHandler.addEventListener('remove', () => {
			this.element.remove();
			this.stateStack.game.input.evtHandler.removeEventListener(enterEvtListener);
		});
		console.log(this.paragraph)
	}

	update(input: Input) {
		this.tick(input);
	}

	charsPassed = 0;

	toTick = true;
	get totalParas() {
		return Math.floor(this.originalSentence.length / (TextBoxElement.maxLength * 3)) + 1
	}
	private toDrawChar(char: string, index: number) {

		if (char !== "[" && char !== "]" && char !== "%" &&
			this.paragraph.charAt(index - 1) !== "[" &&
			this.paragraph.charAt(index + 1) !== "]") {
			return true;
		}
		return false;
	}
	tick(input: Input) {
		if (!this.toTick) return;
		if (this.charsPassed >= this.originalSentence.length - 1) {
			this.toTick = false;
		}
		{
			let before = 0;
			let red = false;
			while (!red) {
				const index = this.location[1] * TextBoxElement.maxLength + this.location[2] - before;
				if (this.paragraph.charAt(index) === " " || this.paragraph.charAt(index) === "$") break;
				const previousChars = this.paragraph.slice(index - 2, index).split("");
				if (previousChars[0] === "%" && previousChars[1] === "%") {
					red = true;
				}
				before++;
			}

			if (red) {
				console.log("red")
				if (this.toDrawChar(this.char, this.location[1] * TextBoxElement.maxLength + this.location[2])) {
					this.element.updateRow(this.location[1], this.element.text[this.location[1]] + `<span class="red">${this.char}</span>`);

				}
			} else {
				if (this.toDrawChar(this.char, this.location[1] * TextBoxElement.maxLength + this.location[2])) {
					this.element.updateRow(this.location[1], this.element.text[this.location[1]] + this.char)
				}

			}
		}
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