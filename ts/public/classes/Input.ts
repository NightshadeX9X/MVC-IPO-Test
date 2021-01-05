export default class Input {
	keysPressed = new Map<string, boolean>();
	keysDown = new Map<string, boolean>();

	start(document: Document) {
		document.addEventListener('keydown', e => {
			this.keysDown.set(e.key, true);
		})

		document.addEventListener('keypress', e => {
			this.keysPressed.set(e.key, true)
		})

		document.addEventListener('keyup', e => {
			this.keysDown.set(e.key, false);
			this.keysPressed.set(e.key, false);
		})
	}

	keyIsDown(key: string) {
		return Boolean(this.keysDown.get(key))
	}
	keyIsPressed(key: string) {
		return Boolean(this.keysPressed.get(key))
	}
}