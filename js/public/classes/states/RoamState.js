import { GameMap } from "../GameMap.js";
import Player from "../Player.js";
import State from "../State.js";
export default class RoamState extends State {
    constructor(stateStack) {
        super(stateStack);
        this.tileSize = 16;
        this.player = new Player(this);
        this.gameMap = new GameMap(this, '/json/maps/the_square.json');
    }
    async preload(loader) {
        await this.gameMap.preload(loader);
    }
    init() {
    }
    update(controller) {
        this.player.update(controller);
    }
    render(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        /* this.gameMap.render(ctx)
        ctx.font = "30px monospace";
        ctx.fillText("hello", 30, 50) */
        this.gameMap.render(ctx);
        this.player.render(ctx);
        this.player.camera.render(ctx);
    }
}
