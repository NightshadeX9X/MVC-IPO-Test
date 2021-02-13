import State from "../core/State.js";
import GameMap from "../roam_state/GameMap.js";
import Player from "../roam_state/Player.js";
export default class RoamState extends State {
    constructor() {
        super(...arguments);
        this.player = new Player(this);
        this.gameMap = new GameMap(this, 'route5');
    }
    async preload(loader) {
        await Promise.all([
            this.player.preload(loader),
            this.gameMap.preload(loader),
        ]);
    }
    update(input) {
        this.player.update(input);
    }
    render(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        const entities = this.getEntities();
        const sortedEntities = entities.sort((a, b) => a.zIndex - b.zIndex);
        sortedEntities.forEach(entity => {
            entity.render(ctx);
        });
    }
    getEntities() {
        return [
            this.player,
            ...this.gameMap.layers
        ];
    }
}
