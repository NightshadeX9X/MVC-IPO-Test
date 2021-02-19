import State from "../core/State.js";
import Camera from "../roam_state/Camera.js";
import GameMap from "../roam_state/GameMap.js";
import GameObject from "../roam_state/GameObject.js";
import Player from "../roam_state/Player.js";
import Dictionairy from "../util/Dictionairy.js";
export default class RoamState extends State {
    constructor() {
        super(...arguments);
        this.player = new Player(this);
        this.gameMap = new GameMap(this, 'route5');
        this.camera = new Camera(this);
        this.tileSize = 16;
        this.gameObjects = new Dictionairy();
    }
    async preload(loader) {
        await Promise.all([
            this.player.preload(loader),
            this.gameMap.preload(loader),
        ]);
        await this.loadGameObjects(loader);
        console.log(this.gameObjects);
    }
    async loadGameObjects(loader) {
        const toLoad = this.gameMap.json?.gameObjects;
        if (!toLoad || toLoad.length === 0)
            return;
        const promises = toLoad.map(name => {
            return loader.loadJS(`/js/roam_state/game_objects/${this.gameMap.name}/${name}.js`);
        });
        const results = (await Promise.all(promises)).map(r => r.default);
        for (const result of results) {
            this.gameObjects.set(result.name, new result(this));
        }
        await Promise.all(this.gameObjects.toArray().map(go => go.preload(loader)));
    }
    getEntityZIndexPriority(entity) {
        if (entity instanceof Player || entity instanceof GameObject)
            return 1;
        return 0;
    }
    update(input) {
        this.player.update(input);
        this.camera.update();
    }
    render(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        const entities = this.getEntities();
        const sortedEntities = entities.sort((a, b) => {
            if (a.zIndex !== b.zIndex)
                return a.zIndex - b.zIndex;
            if (a.pos.y !== b.pos.y)
                return a.pos.y - b.pos.y;
            return this.getEntityZIndexPriority(a) - this.getEntityZIndexPriority(b);
        });
        sortedEntities.forEach(entity => {
            entity.render(ctx);
        });
        /////////
        this.camera.render(ctx);
    }
    getEntities() {
        return [
            this.player,
            ...this.gameMap.layers,
            ...(this.gameObjects.toArray())
        ];
    }
}
