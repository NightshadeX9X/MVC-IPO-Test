import Player from "./Player.js";
import Vector from "./Vector.js";

export default class Spritesheet {
	coords = new Vector();
	constructor(public image: HTMLImageElement, public size: Vector, public player: Player, public spriteCount = new Vector(4)) {

	}

}