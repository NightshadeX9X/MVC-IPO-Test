import { Preloadable, Renderable } from "../core/Attributes.js";
import Loader from "../core/Loader.js";
import BlankState from "../states/BlankState.js";
import DelayState from "../states/DelayState.js";
import RoamState from "../states/RoamState.js";
import Direction from "../util/Direction.js";
import Events from "../util/Events.js";
import { Mixin, New } from "../util/functions.js";
import { ArgsType } from "../util/types.js";
import Vector from "../util/Vector.js";

class Walker {
	pos: Vector = null as any;
	walkingToward: Vector = null as any;
	imageUrl: string = null as any;
	image: HTMLImageElement = null as any;
	roamState: RoamState = null as any;
	walking: boolean = null as any;
	direction: Direction = null as any;
	spriteCoords: Vector = null as any;

	constructor(...args: ArgsType<typeof Walker["construct"]>) {
		return New(Walker, ...args);
	}
	static construct(this: Walker, roamState: RoamState, pos: Vector, imageUrl: string) {
		Preloadable.construct.call(this);
		Renderable.construct.call(this);

		this.pos = pos;
		this.walkingToward = Vector.from(this.pos);
		this.imageUrl = imageUrl;
		this.roamState = roamState;
		this.walking = false;
		this.spriteCoords = new Vector();

		return this;
	}

	async preload(loader: Loader) {
		this.image = await loader.loadImage(`/assets/images/characters/${this.imageUrl}.png`)
	}

	render(ctx: CanvasRenderingContext2D) {
		if (!this.image) return;
		ctx.drawImage(this.image, this.spriteCoords.x * this.roamState.tileSize, this.spriteCoords.y * this.roamState.tileSize * 2, this.roamState.tileSize, this.roamState.tileSize * 2,
			this.pos.x * this.roamState.tileSize, (this.pos.y - 1) * this.roamState.tileSize, this.roamState.tileSize, this.roamState.tileSize * 2)
	}

	private async takeStep(dir: Direction, bgp: RoamState.BackgroundProcess) {
		const increment = () => {
			this.pos.add(Direction.toVector(dir).quo(16));
		}
		this.spriteCoords.x++;
		this.spriteCoords.x %= 4;
		for (let i = 0; i < 4; i++) {
			increment();
			const ds = new DelayState(bgp.subStateStack, 1)
			await bgp.subStateStack.push(ds);
			await ds.waitForRemoval();
		}
	}
	async walk(this: Walker & { evtHandler: Events.Handler }, dir = this.direction) {
		if (this.walking) return;
		this.walking = true;
		this.setDirection(dir);
		this.walkingToward = this.pos.sum(Direction.toVector(dir));
		const originalPos = Vector.from(this.pos)

		const bgp = new BlankState(this.roamState.backgroundProcesses) as RoamState.BackgroundProcess;
		await this.roamState.addBackgroundProcess(bgp);
		for (let i = 0; i < 4; i++) {
			await this.takeStep(dir, bgp);
		}

		this.evtHandler.dispatchEvent('walk', originalPos, this.walkingToward, this.direction);

		this.pos.set(this.walkingToward)
		this.walking = false;

		bgp.remove();
	}

	setDirection(direction: Direction) {
		this.direction = direction;
		if (direction === Direction.DOWN)
			this.spriteCoords.y = 0;
		if (direction === Direction.LEFT)
			this.spriteCoords.y = 1;
		if (direction === Direction.RIGHT)
			this.spriteCoords.y = 2;
		if (direction === Direction.UP)
			this.spriteCoords.y = 3;
	}

}
Mixin.apply(Walker, [Preloadable, Renderable])
interface Walker extends Preloadable, Renderable { }

export default Walker;