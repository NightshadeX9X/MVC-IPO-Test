import Events from "../util/Events.js";

export default class InputModalElement extends HTMLElement {
	evtHandler = new Events.Handler();
	regex;
	valueIsValid = false;
	value = "";
	constructor() {
		super();

	}

	checkIfInputValid(value = "") {
		const input = this.shadowRoot?.querySelector('input');

		this.value = value;
		this.valueIsValid = this.regex.test(this.value);

		if (this.valueIsValid) {
			input.setAttribute('data-valid', 'data-valid');
		} else {
			input.removeAttribute('data-valid');
		}
	}

	connectedCallback() {
		this.initShadowRoot();
		this.regex = new RegExp(this.getAttribute('regex') || "", this.getAttribute('regex-flags') || "");


		this.checkIfInputValid();
		const input = this.shadowRoot?.querySelector('input');
		input?.focus();

		this.initEvents();
	}

	initShadowRoot() {
		this.attachShadow({ mode: 'open' });
		if (!this.shadowRoot) return;

		const styleEl = document.createElement('link');
		styleEl.setAttribute('rel', 'stylesheet');
		styleEl.setAttribute('href', "/css/InputModal.css");
		this.shadowRoot.appendChild(styleEl);

		this.shadowRoot.innerHTML += `
		<div class="container">
			<h2 id="question">${this.innerHTML}</h2>
			<input type="text" id="input" maxlength="14" spellCheck="false">
			<div class="buttons">
				<button class="btn btn-clear">Clear</button>
				<button class="btn btn-confirm">Confirm</button>
			</div>
		</div>
		
		`
	}

	get container() {
		return (this.shadowRoot?.querySelector('.container'))
	}
	get width() {
		return Number(this.container.style.width.slice(0, -2));
	}
	set width(width) {
		this.container.style.width = `${width}px`;
	}

	initEvents() {
		if (!this.shadowRoot) return;

		const btnClear = this.shadowRoot.querySelector('.btn-clear');
		const btnConfirm = this.shadowRoot.querySelector('.btn-confirm');
		const input = this.shadowRoot.querySelector('input');

		if (btnClear) {
			btnClear.addEventListener('click', e => {
				this.evtHandler.dispatchEvent('clear');
			});

			this.evtHandler.addEventListener('clear', () => {
				if (input) {
					input.value = "";
					input.focus();
					this.checkIfInputValid();
				}
			})
		}
		if (btnConfirm) {
			btnConfirm.addEventListener('click', e => {
				if (!this.shadowRoot) return;
				const value = input?.value || "";
				this.evtHandler.dispatchEvent('confirm', value);
			})
		}
		if (input) {
			input.addEventListener('input', e => {
				this.evtHandler.dispatchEvent('change', input.value);
			});

			this.evtHandler.addEventListener('change', (value) => {
				this.checkIfInputValid(value);
			})
		}
	}
}

window.customElements.define('input-modal', InputModalElement)