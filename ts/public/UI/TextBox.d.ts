import Events from '../util/Events.js';
declare class TextBoxElement extends HTMLElement {
	evtHandler: Events.Handler;
	text: string[];
	static readonly maxLength: 51;
	constructor(text: string[]);
	updateRow(n: number, content: string): void;
}

export default TextBoxElement;