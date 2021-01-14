import GameMap from "../GameMap.js";
import Player from "../Player.js";
import State from "../State.js";
import Vector from "../Vector.js";
export default class RoamState extends State {
    constructor() {
        super(...arguments);
        this.gameMap = new GameMap('player_bedroom', this);
        this.player = new Player(this);
        this.tileSize = new Vector(16);
    }
    async preload(loader) {
        await Promise.all([
            this.gameMap.preload(loader),
            this.player.preload(loader)
        ]);
    }
    init() {
    }
    update(input) {
    }
    render(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.gameMap.render(ctx);
        this.player.render(ctx);
    }
}
