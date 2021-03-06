import Events from '../util/Events.js';
class TextBoxElement extends HTMLElement {
	evtHandler = new Events.Handler();
	static maxLength = 51;
	constructor(text) {
		super();
		this.text = text;

		this.attachShadow({ mode: 'open' });
		(() => {
			if (!this.shadowRoot) return;
			this.shadowRoot.innerHTML = `
			<link rel="stylesheet" href="/css/TextBox.css" />
			<div class="container">
				<h3 class="row"></h3>
				<h3 class="row"></h3>
				<h3 class="row"></h3>
				<div class="arrow-down"></div>
			</div>
			`
		})()
	}

	updateRow(n, content) {
		this.shadowRoot.querySelector('.container').querySelectorAll('.row')[n].innerHTML = content;
		this.text[n] = content;
	}
}

window.customElements.define('text-box', TextBoxElement)

export default TextBoxElement;
