import GameMap from "../GameMap.js";
import Player from "../Player.js";
import State from "../State.js";
import Vector from "../Vector.js";
export default class RoamState extends State {
    constructor() {
        super(...arguments);
        this.gameMap = new GameMap('the_square', this);
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
        this.gameMap.init();
        this.player.init();
    }
    update(input) {
        this.player.update(input);
    }
    render(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.player.camera.clear();
        this.gameMap.render(ctx);
        this.player.render(ctx);
        this.player.camera.render(ctx);
    }
}
