
import { delay, random, randomArrayMember } from "../../Util.js";
import GameEvent, { GameEventData, GameEventTrigger, GameEventType } from "../roam_state/game_events/GameEvent.js";
import Input from "../Input.js";
import Loader from "../Loader.js";
import GameMap from "../roam_state/GameMap.js";
import Player from "../roam_state/Player.js";
import Spritesheet from "../Spritesheet.js";
import State from "../State.js";
import StateStack from "../StateStack.js";
import Vector from "../Vector.js";
import DelayState from "./DelayState.js";
import FadeState from "./FadeState.js";
import TextBoxState from "./TextBoxState.js";
import GameMapLayer from "../roam_state/GameMapLayer.js";
export default class RoamState extends State {
	public timeOfDay = TimeOfDay.DAY;
	public gameMap = new GameMap('route5', this);
	public player = new Player(this);
	public tileSize = new Vector(16);
	public gameEvents: GameEvent[] = [

	];
	constructor(public stateStack: StateStack) {
		super(stateStack);

	}
	public async loadGameEvents(loader: Loader) {
		if (!this.gameMap.json?.gameEvents) return
		const gameEventsToLoad = this.gameMap.json.gameEvents.map(async (ge: string) => {
			return (await loader.loadJS<{ default: GameEventData }>(`/js/classes/roam_state/game_events/${this.gameMap.name}/${ge}.js`)).default;
		});
		const gameEventsLoaded = await Promise.all(gameEventsToLoad);
		console.log(gameEventsLoaded)

		for (const gameEventLoaded of gameEventsLoaded) {
			if (gameEventLoaded.imageURL) {
				const image = await loader.loadImage(gameEventLoaded.imageURL)
				const spritesheet = new Spritesheet(image, new Vector(16, 32), new Vector(4));
				const gameEvent = new GameEvent(gameEventLoaded.type, this, {
					spritesheet,
					pos: this.player.pos.sum(4, 1),
					renderOffset: new Vector(0, -1),
					renderSize: new Vector(2, 1),
					size: new Vector(1),
					...(gameEventLoaded.data || {})
				});
				gameEvent.roamState = this;
				gameEvent.evtManager.addEventListener('interact', async () => {
					await gameEventLoaded.onInteract.call(gameEvent);
				});
				this.gameEvents.push(gameEvent)
			} else {
				const gameEvent = new GameEvent(gameEventLoaded.type, this, {
					pos: new Vector,
					renderOffset: new Vector(0, -1),
					renderSize: new Vector(2, 1),
					size: new Vector(1),
					...(gameEventLoaded.data || {})
				});
				gameEvent.roamState = this;
				gameEvent.evtManager.addEventListener('interact', async () => {
					await gameEventLoaded.onInteract.call(gameEvent);
				});
				this.gameEvents.push(gameEvent)
			}
		}
	}
	async preload(loader: Loader) {
		await Promise.all(
			[
				this.gameMap.preload(loader),
				this.player.preload(loader)
			]);
		console.log(this.gameMap.json)
		await this.loadGameEvents(loader);


	}
	init(): void {
		this.gameMap.init();
		this.player.init();
	}
	sinceLastZIndexChange = 0;
	update(input: Input): void {
		if (this.sinceLastZIndexChange > 20) {
			if (input.keyIsDown('t')) {
				this.player.zIndex--;
				this.sinceLastZIndexChange = 0;
				console.log(this.player.onMapLayer);
			}
			if (input.keyIsDown('y')) {
				this.player.zIndex++;
				this.sinceLastZIndexChange = 0;
				console.log(this.player.onMapLayer);

			}

		}
		this.player.update(input);

		const evt = this.gameEvents
			.filter(g => g.data.trigger === GameEventTrigger.INTERACTION_KEY)
			.filter(g => g.isAheadOfPlayer())
		[0]

		if (evt && input.interactionKey)
			if (!evt.disabled) {

				evt.
					evtManager.dispatchEvent(GameEvent.interactEvt);
			}

		/* this.gameEvents.forEach(e => {
			e.cooldown++;
		}) */
		this.sinceLastZIndexChange++;
	}
	render(ctx: CanvasRenderingContext2D): void {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		this.player.camera.clear();


		const entries = [...this.gameMap.layers, ...this.gameEvents, this.player];
		const sorted = entries.sort((a, b) => {
			let va = Array.isArray(a) ? a[1] : a;
			let vb = Array.isArray(b) ? b[1] : b;
			if (va === vb) {
				if (a instanceof GameMapLayer) return -1;
				if (!(a instanceof GameMapLayer) && !(b instanceof GameMapLayer)) {
					function pos(x: GameEvent | Player) {
						if (x instanceof Player) return x.pos;
						return x.data.pos;
					}
					return pos(a).y - pos(b).y;
				}
				return 1;
			}
			return va.zIndex - vb.zIndex;
		})
		this.player.camera.ctx.save();
		for (const entry of sorted) {
			const entity = Array.isArray(entry) ? entry[1] : entry;
			entity.render(this.player.camera);

		}
		if (this.timeOfDay === TimeOfDay.NIGHT) {
			this.player.camera.ctx.globalAlpha = 0.3;
			this.player.camera.ctx.fillStyle = "#008";

			this.player.camera.ctx.fillRect(0, 0, this.player.camera.size.x, this.player.camera.size.y);
		}
		this.player.camera.ctx.restore();


		this.player.camera.render(ctx);


	}

}


enum TimeOfDay {
	NIGHT,
	DAY
}