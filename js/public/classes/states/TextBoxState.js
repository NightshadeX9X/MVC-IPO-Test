import { createTextBox } from "../../UI.js";
import State from "../State.js";
import Vector from "../Vector.js";
export default class TextBoxState extends State {
    constructor(stateStack, text) {
        super(stateStack);
        this.text = text;
        this.image = null;
        this.rows = [];
        this.paragraphs = [];
        this.currentParagraphIndex = 0;
        this.sinceParagraphChange = 20;
        this.revealing = {
            row: 0,
            character: 0,
            doneWithParagraph: false
        };
        this.setText(text);
    }
    setText(text) {
        this.text = text;
        this.rows = this.splitTextIntoRows(this.text);
        this.paragraphs = this.splitRowsIntoParagraphs(this.rows);
    }
    get renderedParagraph() {
        const paragraph = Array.from(this.paragraphs[this.currentParagraphIndex] || []);
        /* return paragraph */
        if (!this.paragraphs[this.currentParagraphIndex])
            return;
        let row = paragraph?.[this.revealing.row]?.slice(0, this.revealing.character);
        return [
            ...paragraph.slice(0, this.revealing.row),
            row
        ];
    }
    splitTextIntoRows(text) {
        const words = this.text.split(" ");
        let currentIndex = 0;
        const rows = [];
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
    splitRowsIntoParagraphs(rows) {
        // [paragraph number, row number]
        let index = [0, 0];
        const paragraphs = [];
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
    async preload(loader) {
        const promises = [
            loader.loadImage(`/assets/images/UI/TextBox.png`)
        ];
        [this.image] = await Promise.all(promises);
    }
    init() {
    }
    update(input) {
        const paragraph = this.paragraphs?.[this.currentParagraphIndex];
        let row = paragraph?.[this.revealing.row];
        if (!paragraph)
            return this.stateStack.pop();
        let onLastCharacter = (this.revealing.character >= row?.length);
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
    render(ctx) {
        if (!this.image)
            return;
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
            });
        }
        ctx.restore();
    }
}
