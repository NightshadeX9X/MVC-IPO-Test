import GameMap from "../GameMap.js";
import State from "../State.js";
export default class RoamState extends State {
    constructor() {
        super(...arguments);
        this.gameMap = new GameMap('player_bedroom', this);
    }
    async preload(loader) {
        await this.gameMap.preload(loader);
    }
    init() {
    }
    update(input) {
    }
    render(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.gameMap.render(ctx);
    }
}
