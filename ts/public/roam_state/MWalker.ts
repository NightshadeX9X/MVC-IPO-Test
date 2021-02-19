import DelayState from "../states/DelayState.js";
import RoamState from "../states/RoamState.js";
import Direction from "../util/Direction.js";
import Spritesheet from "../util/Spritesheet.js";
import Vector from "../util/Vector.js";
import Events from '../util/Events.js';
import { Mixin } from "../util/functions.js";
import Loader from "../core/Loader.js";
import BlankState from "../states/BlankState.js";
import Player from "./Player.js";
import StateStack from "../core/StateStack.js";

export default class MWalker {
	public pos: Vector = null as any;
	public roamState: RoamState = null as any;
	public evtHandler: Events.Handler = null as any;
	public direction: Direction = null as any;
	public zIndex: number = null as any;

	public imageUrl: string = null as any;

	public canWalkThroughWalls: boolean = false;
	public canWalkThroughMapEdges: boolean = false;
	public image: HTMLImageElement | null = null;
	public spritesheet: Spritesheet | null = null;
	public drawSize = new Vector(1, 2);
	public destinationWalkPos = Vector.from(this.pos);

	public static construct(this: MWalker, imageUrl: string) {
		this.canWalkThroughWalls = false;
		this.canWalkThroughMapEdges = false;
		this.imageUrl = imageUrl;
		this.drawSize = new Vector(1, 2);
		this.image = null;
		this.spritesheet = null;
		this.zIndex = 1;
		this.destinationWalkPos = Vector.from(this.pos);
	}

	public async preload(loader: Loader) {
		await this.loadImageAndSpritesheet(loader);
	}

	private async loadImageAndSpritesheet(loader: Loader) {
		this.image = await loader.loadImage(`/assets/images/people/${this.imageUrl}.png`);
		this.spritesheet = new Spritesheet(this.image, this.drawSize.prod(this.roamState.tileSize), new Vector(4))
	}

	private async takeStep(direction: Direction, stateStack: StateStack) {
		const vector = Direction.toVector(direction)
		const createDelay = async () => {
			const delay = new DelayState(stateStack, 1);
			stateStack.push(delay);
			await delay.pop();
		}
		if (this.spritesheet) {

			this.spritesheet.pos.x++;
			if (this.spritesheet.pos.x >= 4) this.spritesheet.pos.x = 0;
		}

		for (let i = 0; i < 4; i++) {

			this.pos.add(vector.quo(16));
			await createDelay();
		}

	}
	public getCurrentMapLayer() {
		return this.roamState.gameMap.layers.find(layer => layer.zIndex === (this.zIndex - 1))
	}
	public getPosAhead(direction = this.direction) {
		return this.pos.sum(Direction.toVector(direction));
	}
	public async walk(direction = this.direction, topStateStack = this.roamState.stateStack) {
		this.setDirection(direction);
		this.destinationWalkPos = this.getPosAhead();
		if (!this.canWalk(this.getPosAhead())) return;

		const container = new BlankState(this.roamState.stateStack);
		container.link(this.roamState);

		await topStateStack.push(container);

		for (let i = 0; i < 4; i++) {
			await this.takeStep(this.direction, container.subStateStack)
		}

		topStateStack.pop();
	}

	private canWalk(posAhead: Vector) {
		const vec = posAhead.diff(this.pos);
		if (this instanceof Player) {
			if (this.roamState.stateStack.game.cheatMode)
				return true;
		}
		if (!this.canWalkThroughMapEdges) {

			if (
				posAhead.x < 0 || posAhead.x >= this.roamState.gameMap.size.x ||
				posAhead.y < 0 || posAhead.y >= this.roamState.gameMap.size.y
			)
				return false;
		}
		const currentMapLayer = this.getCurrentMapLayer();
		if (currentMapLayer) {
			const wallActive = (data: string | boolean) => {
				if (typeof data === "boolean") return data;
				const parts = data.split("").map(s => s.toUpperCase());
				if (this.direction === Direction.UP && parts.includes("U")) return true;
				if (this.direction === Direction.DOWN && parts.includes("D")) return true;
				if (this.direction === Direction.LEFT && parts.includes("L")) return true;
				if (this.direction === Direction.RIGHT && parts.includes("R")) return true;
				return false
			}
			if (wallActive(currentMapLayer.wallAt(posAhead)) && !this.canWalkThroughWalls) {
				return false;
			}
		}
		if (this.getCoveredSquares().find(v => v.equals(posAhead))) return false;

		{
			/* let increments: Vector[] = [];
			for (let i = 0; i <= 16; i++) {
				increments.push(this.pos.sum(vec.quo(16).prod(i)));
			} */
			// @ts-ignore
			const entities = [this.roamState.player, ...this.roamState.gameObjects].filter(e => e !== this).map(e => {
				if ((e as any).destinationWalkPos) return (e as any).destinationWalkPos as Vector;
				return e.pos;
			})
			if (entities.some(e => e.equals(this.destinationWalkPos))) return false;
		}
		return true;
	}

	private getCoveredSquares() {
		const squares: Vector[] = [];
		// @ts-ignore
		[this.roamState.player, ...this.roamState.gameObjects].filter(go => go !== this && go.zIndex === this.zIndex).forEach(go => {
			squares.push(...go.coveredSquares);
		});
		return squares;
	}

	public render(ctx: CanvasRenderingContext2D) {
		if (this.image && this.spritesheet) {
			this.roamState.camera.ctx.save();
			const coords = this.roamState.camera.convertCoords(this.pos.diff(0, 1).prod(this.roamState.tileSize));
			this.roamState.camera.ctx.translate(coords.x, coords.y);
			this.spritesheet.render(this.roamState.camera.ctx);
			this.roamState.camera.ctx.restore();
		}
	}

	protected setDirection(d: Direction) {
		this.direction = d;
		this.updateSpritesheetY();
	}
	private updateSpritesheetY() {
		if (!this.spritesheet) return;
		if (this.direction === Direction.DOWN) this.spritesheet.pos.y = 0;
		if (this.direction === Direction.LEFT) this.spritesheet.pos.y = 1;
		if (this.direction === Direction.RIGHT) this.spritesheet.pos.y = 2;
		if (this.direction === Direction.UP) this.spritesheet.pos.y = 3;

	}
}