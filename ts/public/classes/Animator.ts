import Spritesheet from "./Spritesheet.js";
import Vector from "./Vector.js";

export default class Animator {
	private animations = new Map<string, {
		iteration: number;
		initialCoord: Vector
		coordTweakList: Vector[];
		active: boolean
	}>();
	constructor(public spritesheet: Spritesheet) { }

	register(name: string, initialCoord: Vector, coordTweakList: Vector[]) {
		this.animations.set(name, { coordTweakList, iteration: 0, initialCoord, active: false });
	}

	play(name: string) {
		const animation = this.animations.get(name);
		if (!animation) return;
		if (!animation.active) {
			this.spritesheet.coords = animation.initialCoord;
			animation.active = true;
		};
		const vec = animation.coordTweakList[animation.iteration % animation.coordTweakList.length];
		this.spritesheet.coords.add(vec)
		this.spritesheet.coords.x %= this.spritesheet.spriteCount.x;
		this.spritesheet.coords.y %= this.spritesheet.spriteCount.y;
		animation.iteration++;
	}

	end(name: string) {
		const animation = this.animations.get(name);
		if (!animation) return;
		animation.active = false;
	}
}