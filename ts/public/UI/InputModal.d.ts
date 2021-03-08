import Events from "../util/Events.js";

declare export default class InputModalElement extends HTMLElement {
	evtHandler: Events.Handler;
	valueIsValid: boolean;
	value: string;
	constructor(): InputModalElement;

	private checkIfInputValid(value?: string): void;

	connectedCallback(): void;

	width: number;

	private initEvents(): void;
}