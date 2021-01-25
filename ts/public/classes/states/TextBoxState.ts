import { createTextBox } from "../../UI.js";
import Input from "../Input.js";
import Loader from "../Loader.js";
import State from "../State.js";
import StateStack from "../StateStack.js";
import Vector from "../Vector.js";

export default class TextBoxState extends State {
	private image: HTMLImageElement | null = null;
	private rows: string[] = [];
	private paragraphs: string[][] = [];
	private currentParagraphIndex = 0;
	private sinceParagraphChange = 20;
	private revealing = {
		row: 0,
		character: 0,
		doneWithParagraph: false
	}
	constructor(stateStack: StateStack, public text: string) {
		super(stateStack);
		this.setText(text);
	}
	public setText(text: string) {
		this.text = text;
		this.rows = this.splitTextIntoRows(this.text);
		this.paragraphs = this.splitRowsIntoParagraphs(this.rows);
	}
	private get renderedParagraph() {
		const paragraph = Array.from(this.paragraphs[this.currentParagraphIndex] || []);
		/* return paragraph */
		if (!this.paragraphs[this.currentParagraphIndex]) return;

		let row = paragraph?.[this.revealing.row]?.slice(0, this.revealing.character);
		return [
			...paragraph.slice(0, this.revealing.row),
			row
		]
	}
	private splitTextIntoRows(text: string) {
		const words = this.text.split(" ");
		let currentIndex = 0;
		const rows: string[][] = [];

		for (const word of words) {
			let row = rows[currentIndex];
			if (!Array.isArray(rows[currentIndex])) {
				row = rows[currentIndex] = [];
			}
			if (row.join(" ").length + word.length + 1 > 58) {
				currentIndex++;
			}
			if (word === "\n") {
				currentIndex++;
				continue;
			}
			if (!Array.isArray(rows[currentIndex])) {
				row = rows[currentIndex] = [];
			}
			rows[currentIndex].push(word);
		}

		return rows.map(row => row.join(" "));
	}
	private splitRowsIntoParagraphs(rows: string[]) {
		// [paragraph number, row number]
		let index = [0, 0];
		const paragraphs: string[][] = [];
		this.rows.forEach((row, i) => {
			if (!Array.isArray(paragraphs[index[0]])) {
				paragraphs[index[0]] = [];
			}
			paragraphs[index[0]][index[1]] = row;

			index[1]++;
			if (index[1] >= 3) {
				index[0]++;
				index[1] = 0;
			}
		});
		return paragraphs;
	}


	async preload(loader: Loader) {
		const promises =
			[
				loader.loadImage(`/assets/images/UI/TextBox.png`)
			] as
			[
				Promise<HTMLImageElement>
			];

		[this.image] = await Promise.all(promises);
	}
	init(): void {

	}
	update(input: Input): void {
		const paragraph = this.paragraphs?.[this.currentParagraphIndex];
		let row = paragraph?.[this.revealing.row]
		if (!paragraph) return this.stateStack.pop();
		let onLastCharacter = (this.revealing.character >= row?.length)
		let onLastRow = (this.revealing.row === paragraph?.length - 1);
		if (!onLastCharacter) {
			this.revealing.character++;
		}
		if (onLastCharacter && !onLastRow) {
			this.revealing.row++;
			this.revealing.character = 0;
		}
		if ((input.keyIsDown(' ') || input.keyIsDown('Enter')) && this.sinceParagraphChange > 20) {
			if (!onLastCharacter) {
				this.revealing.character = row?.length - 1;
				this.sinceParagraphChange = 0;
			}
			if (onLastRow && onLastCharacter) {
				this.currentParagraphIndex++;
				this.revealing.row = 0;
				this.revealing.character = 0;
				this.sinceParagraphChange = 0;
			}



		}

		this.sinceParagraphChange++;
	}
	render(ctx: CanvasRenderingContext2D): void {
		if (!this.image) return;

		const textBox = createTextBox(this.image);
		const pos = new Vector(ctx.canvas.width).diff(textBox.width).quo(2);
		pos.y = ctx.canvas.height - textBox.height - 20;
		ctx.drawImage(textBox, pos.x, pos.y);

		ctx.save();
		ctx.fillStyle = "white";
		ctx.textBaseline = "top";
		ctx.textAlign = "left";
		ctx.font = "12px Courier Prime";
		const paragraph = this.renderedParagraph;
		if (paragraph) {
			paragraph.forEach((row, i) => {
				ctx.fillText(row, pos.x + 30, pos.y + 8 + 18 * i);
			})

		}
		ctx.restore();
	}

}