import State from "../core/State.js";
import Camera from "../roam_state/Camera.js";
import GameMap from "../roam_state/GameMap.js";
import Player from "../roam_state/Player.js";
export default class RoamState extends State {
    constructor() {
        super(...arguments);
        this.player = new Player(this);
        this.gameMap = new GameMap(this, 'route5');
        this.camera = new Camera(this);
        this.tileSize = 16;
    }
    async preload(loader) {
        await Promise.all([
            this.player.preload(loader),
            this.gameMap.preload(loader),
        ]);
    }
    getEntityZIndexPriority(entity) {
        if (entity instanceof Player)
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
            ...this.gameMap.layers
        ];
    }
}
