import State from "../core/State.js";
import StateStack from "../core/StateStack.js";
import Camera from "../roam_state/Camera.js";
import GameMap from "../roam_state/GameMap.js";
import Player from "../roam_state/Player.js";
import { Mixin, New } from "../util/functions.js";
import Vector from "../util/Vector.js";
class RoamState {
    constructor(...args) {
        return New(RoamState, ...args);
    }
    static construct(stateStack) {
        State.construct.call(this, stateStack);
        this.tileSize = 16;
        this.player = new Player(this);
        this.backgroundProcesses = new StateStack(this.stateStack.game, this);
        this.backgroundProcesses.insert = async (state, index) => {
            state.blocking = false;
            state.toUpdate = true;
            await StateStack.prototype.insert.call(this.backgroundProcesses, state, index);
        };
        this.gameMap = new GameMap(this, 'route5');
        this.camera = new Camera(this, new Vector(300, 200));
        this.gameObjects = [];
        return this;
    }
    async loadGameObjects(loader) {
        this.gameObjects = [];
        const fetched = await Promise.all(this.gameMap.json.gameObjects.map(s => loader.loadJSDefault(`/js/roam_state/game_objects/definitions/${s}.js`)));
        const gameObjectClasses = fetched.map(m => m.default);
        gameObjectClasses.forEach(ctor => {
            this.gameObjects.push(new ctor(this));
        });
    }
    async preload(loader) {
        await Promise.all([
            this.player.preload(loader),
            this.gameMap.preload(loader),
        ]);
        await this.loadGameObjects(loader);
        await Promise.all(this.gameObjects.map(go => go.preload(loader)));
    }
    update(input) {
        this.player.update(input);
        this.gameObjects.forEach(go => go.update(input));
        this.camera.update();
        this.subStateStack.update(input);
        this.backgroundProcesses.update(input);
    }
    async addBackgroundProcess(s) {
        s.toUpdate = true;
        s.blocking = false;
        await this.backgroundProcesses.push(s);
    }
    get nodesToRender() {
        return [this.player, ...this.gameMap.layers, ...this.gameObjects];
    }
    static getNodePriority(node) {
        if (node instanceof GameMap.Layer)
            return 0;
        return 1;
    }
    static nodeSorter(a, b) {
        if (a.zIndex !== b.zIndex) {
            return a.zIndex - b.zIndex;
        }
        const priorities = [a, b].map(n => RoamState.getNodePriority(n));
        if (priorities[0] !== priorities[1]) {
            return priorities[0] - priorities[1];
        }
        const positions = [a, b].map(n => n.pos || new Vector);
        return positions[0].y - positions[1].y;
    }
    renderNodes(ctx) {
        this.nodesToRender.sort((a, b) => RoamState.nodeSorter(a, b)).forEach(node => {
            node.render(ctx);
        });
    }
    render(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.renderNodes(ctx);
        this.backgroundProcesses.render(ctx);
        this.subStateStack.render(ctx);
        this.camera.render(ctx);
    }
}
(function (RoamState) {
    let a = null;
})(RoamState || (RoamState = {}));
Mixin.apply(RoamState, [State]);
export default RoamState;
