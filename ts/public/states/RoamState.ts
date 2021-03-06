import WildBattle from "../battle/WildBattle.js";
import Input from "../core/Input.js";
import Loader from "../core/Loader.js";
import State from "../core/State.js";
import StateStack from "../core/StateStack.js";
import PokemonCreature from "../pokemon/PokemonCreature.js";
import Camera from "../roam_state/Camera.js";
import GameMap from "../roam_state/GameMap.js";
import GameObject from "../roam_state/GameObject.js";
import Player from "../roam_state/Player.js";
import Walker from "../roam_state/Walker.js";
import { Parents } from "../util/functions.js";
import { ArgsType, Class } from "../util/types.js";
import Vector from "../util/Vector.js";
import TextBoxState from "./TextBoxState.js";
import WildBattleState from "./WildBattleState.js";

interface RoamState extends State { }
@Parents(State)
class RoamState {
	tileSize = 16;
	player = new Player(this);
	backgroundProcesses = new StateStack(this.stateStack.game, this);
	gameMap = new GameMap(this, 'route5');
	camera = new Camera(this, new Vector(480, 320));
	gameObjects: GameObject[] = [];
	constructor(public stateStack: StateStack) {
		State.call(this, stateStack);
		this.backgroundProcesses.insert = async (state, index) => {
			state.blocking = false;
			state.toUpdate = true;
			await StateStack.prototype.insert.call(this.backgroundProcesses, state, index);
		};
		this.stateStack.game.input.evtHandler.addEventListener('keypress', async (e: KeyboardEvent) => {
			if (this === this.stateStack.fromTop())
				if (e.key === "t") {
					// const battle = new WildBattle(this.stateStack.game.party, new PokemonCreature("pikachu"))
					// await this.stateStack.push(new WildBattleState(this.stateStack, battle));
				}
		})
	}

	private async loadGameObjects(loader: Loader) {
		this.gameObjects = [];
		const fetched = await Promise.all(this.gameMap.json.gameObjects.map(s => loader.loadJSDefault<Class<GameObject, [RoamState]>>(`/js/roam_state/game_objects/definitions/${s}.js`)));
		const gameObjectClasses = fetched.map(m => m.default);
		gameObjectClasses.forEach(ctor => {
			this.gameObjects.push(new ctor(this));
		});
	}

	async preload(loader: Loader) {
		await Promise.all([
			this.player.preload(loader),
			this.gameMap.preload(loader),
		]);
		await this.loadGameObjects(loader);
		await Promise.all(this.gameObjects.map(go => go.preload(loader)))
	}

	update(input: Input) {
		this.player.update(input);
		this.gameObjects.forEach(go => go.update(input));
		this.camera.update();

		this.subStateStack.update(input);
		this.backgroundProcesses.update(input);
	}

	async addBackgroundProcess(s: State) {
		s.toUpdate = true;
		s.blocking = false;
		await this.backgroundProcesses.push(s);
	}

	private get nodesToRender() {
		return [this.player, ...this.gameMap.layers, ...this.gameObjects] as RoamState.Node[];
	}
	private static getNodePriority(node: RoamState.Node) {
		if (node instanceof GameMap.Layer) return 0;
		return 1;
	}
	private static nodeSorter(a: RoamState.Node, b: RoamState.Node): number {
		if (a.zIndex !== b.zIndex) {
			return a.zIndex - b.zIndex;
		}
		const priorities = [a, b].map(n => RoamState.getNodePriority(n)) as [number, number];
		if (priorities[0] !== priorities[1]) {
			return priorities[0] - priorities[1];
		}
		const positions = [a, b].map(n => (n as any).pos || new Vector) as [Vector, Vector];
		return positions[0].y - positions[1].y;
	}

	renderNodes(ctx: CanvasRenderingContext2D) {
		this.nodesToRender.sort((a, b) => RoamState.nodeSorter(a, b)).forEach(node => {
			node.render(ctx);
		});
	}

	render(ctx: CanvasRenderingContext2D) {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
		this.renderNodes(ctx);


		this.backgroundProcesses.render(ctx);
		this.subStateStack.render(ctx);

		this.camera.render(ctx);

	}
}


namespace RoamState {
	export interface BackgroundProcess extends State {
		toUpdate: true,
		blocking: false
	}
	let a: BackgroundProcess = null as any;
	export type Node = Player | GameMap.Layer | GameObject;
}


export default RoamState;