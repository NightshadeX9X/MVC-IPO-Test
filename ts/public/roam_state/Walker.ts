import { Preloadable, Renderable, Updatable } from "../core/Attributes.js";
import Loader from "../core/Loader.js";
import BlankState from "../states/BlankState.js";
import DelayState from "../states/DelayState.js";
import RoamState from "../states/RoamState.js";
import Direction from "../util/Direction.js";
import Events from "../util/Events.js";
import Spritesheet from "../util/Spritesheet.js";
import Vector from "../util/Vector.js";

interface Walker extends Preloadable, Renderable { }
class Walker {

	private readonly SIGNATURE = 'walker';
	walkingToward: Vector | null = null;
	direction = Direction.DOWN;
	walking = false;
	zIndex = 1;
	spritesheet: Spritesheet = null as any;
	image: HTMLImageElement = null as any;

	constructor(public roamState: RoamState, public pos: Vector, public imageUrl: string) {
		Preloadable.call(this);
		Renderable.call(this);
	}

	async preload(loader: Loader) {
		console.log(`${this.constructor.name} preload started`)
		this.image = await loader.loadImage(`/assets/images/characters/${this.imageUrl}.png`)
		this.spritesheet = new Spritesheet(this.image);
		console.log(`${this.constructor.name} preload ended`)
		console.log(this.spritesheet)

	}

	render(ctx: CanvasRenderingContext2D) {
		if (!this.image || !this.spritesheet) return;
		this.roamState.camera.ctx.save();
		const coords = this.roamState.camera.convertCoords(this.pos.diff(0, 1).prod(this.roamState.tileSize));
		this.roamState.camera.ctx.translate(coords.x, coords.y);
		this.spritesheet.render(this.roamState.camera.ctx);
		this.roamState.camera.ctx.restore();
	}

	private async takeStep(dir: Direction, bgp: RoamState.BackgroundProcess) {
		const increment = () => {
			this.pos.add(Direction.toVector(dir).quo(16));
		}
		this.spritesheet.coords.x++;
		this.spritesheet.coords.x %= 4;
		for (let i = 0; i < 4; i++) {
			increment();
			const ds = new DelayState(bgp.subStateStack, 1)
			await bgp.subStateStack.push(ds);
			await ds.waitForRemoval();
		}
	}
	canMove(dir: Direction) {
		if (this.walking) return false;
		const layer = this.walkingOnMapLayer();
		const ahead = this.getPosAhead(dir);
		const walkable = (value: boolean | string) => {
			if (typeof value === "boolean") return value;
			const parts = value.split("").map(s => s.toUpperCase());
			console.log(parts, Direction[this.direction][0])
			if (parts.includes(Direction[Direction.invert(this.direction)][0])) return true;
			return false;
		}
		if (layer) {
			if (layer.partAt(ahead, (p) => p.type === "wall" && walkable(p.value))) {
				return false;
			};
		}
		if (ahead.x < 0 || ahead.y < 0 || ahead.x >= this.roamState.gameMap.size.x || ahead.y >= this.roamState.gameMap.size.y) {
			return false;
		}


		if (this.roamState.gameObjects.filter(go => !go.canBeWalkedThrough).find(go => go.getCoveredSquares().find(v => v.equals(ahead)))) {
			return false;
		}

		const walkers = this.allButThis();
		if (walkers.find((w: Walker) => w.walkingToward?.equals(ahead) || w.pos.equals(ahead))) {
			return false;
		};
		return true;

	}
	getPosAhead(dir = this.direction) {
		return this.pos.sum(Direction.toVector(dir));
	}
	all(): Walker[] {
		return [this.roamState.player, ...this.roamState.gameObjects.filter(x => (x as any)?.SIGNATURE === 'walker')] as Walker[];
	}
	allButThis() {
		return this.all().filter(w => w !== this);
	}
	async walk(this: Walker & { evtHandler: Events.Handler }, dir = this.direction) {
		if (!this.walking)
			this.setDirection(dir);
		if (!this.canMove(dir)) return;
		this.walking = true;
		this.walkingToward = this.pos.sum(Direction.toVector(dir));
		const originalPos = Vector.from(this.pos)

		const bgp = new BlankState(this.roamState.backgroundProcesses) as RoamState.BackgroundProcess;
		await this.roamState.addBackgroundProcess(bgp);
		for (let i = 0; i < 4; i++) {
			await this.takeStep(dir, bgp);
		}


		this.pos.set(this.walkingToward)
		this.walking = false;
		this.evtHandler.dispatchEvent('walk', originalPos, this.walkingToward, this.direction);

		bgp.remove();
	}

	setDirection(direction: Direction) {
		this.direction = direction;
		// if (!this.spritesheet) return;
		if (direction === Direction.DOWN)
			this.spritesheet.coords.y = 0;
		if (direction === Direction.LEFT)
			this.spritesheet.coords.y = 1;
		if (direction === Direction.RIGHT)
			this.spritesheet.coords.y = 2;
		if (direction === Direction.UP)
			this.spritesheet.coords.y = 3;
	}

	async completeWalk(this: Walker & { evtHandler: Events.Handler }) {
		if (!this.walking) return;
		return new Promise<void>((res, rej) => {
			this.evtHandler.addEventListener('walk', () => {
				res();
			})
		})
	}

	walkingOnMapLayer() {
		return this.roamState?.gameMap.layers.find(layer => layer.zIndex === (this.zIndex - 1));
	}

}


export default Walker;