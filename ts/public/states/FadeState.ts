import Input from "../core/Input.js";
import State from "../core/State.js";
import StateStack from "../core/StateStack.js";
import BlankState from "./BlankState.js";

class FadeState extends State {
	private section = FadeState.Section.ASCENDING;
	private alpha = 0;
	constructor(public stateStack: StateStack, public color = "white", public speed = 4) {
		super(stateStack);
	}
	public resume() {
		if (this.section === FadeState.Section.WAITING) this.section = FadeState.Section.DESCENDING;
	}
	update(input: Input) {
		if (this.section === FadeState.Section.ASCENDING) {
			this.alpha += this.speed;
			if (this.alpha >= 255) {
				this.switch(FadeState.Section.WAITING);
			}
		} else if (this.section === FadeState.Section.DESCENDING) {
			this.alpha -= this.speed;
			if (this.alpha <= 0) {
				this.switch(FadeState.Section.ENDED);
			}
		} else if (this.section === FadeState.Section.ENDED) {
			this.stateStack.pop();
		}
	}
	private switch(section: FadeState.Section) {
		this.section = section;
		this.evtHandler.dispatchEvent('state switch', this.section);
	}

	render(ctx: CanvasRenderingContext2D) {
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.globalAlpha = this.alpha / 255;
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.restore();
	}

	async reach(section: FadeState.Section) {
		return new Promise<void>((res, rej) => {
			this.evtHandler.addEventListener('state switch', (to: FadeState.Section) => {
				if (to === section) res();
			})
		})
	}
}

namespace FadeState {
	export enum Section {
		ASCENDING,
		WAITING,
		DESCENDING,
		ENDED
	}
}

export default FadeState;