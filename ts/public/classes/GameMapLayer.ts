import Entity from "../Entity.js";
import Camera from "./Camera.js";
import GameMap from "./GameMap.js";
import Input from "./Input.js";
import Loader from "./Loader.js";
import Vector from "./Vector.js";

export default abstract class GameMapLayer<T = any> {
	public cnv = document.createElement('canvas');
	public ctx = this.cnv.getContext('2d') as CanvasRenderingContext2D;
	abstract zIndex: number;
	constructor(public gameMap: GameMap) {
		this.cnv.width = this.gameMap.sizeInPx.x;
		this.cnv.height = this.gameMap.sizeInPx.y;
	}
	abstract getData(): T[][];
	abstract preload(loader: Loader): Promise<void>;
	abstract init(): void;
	abstract update(input: Input): void;
	abstract render(camera: Camera): void;
}





