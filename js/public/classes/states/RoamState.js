import GameMap from "../GameMap.js";
import Player from "../Player.js";
import State from "../State.js";
import Vector from "../Vector.js";
export default class RoamState extends State {
    constructor(stateStack) {
        super(stateStack);
        this.stateStack = stateStack;
        this.timeOfDay = TimeOfDay.NIGHT;
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
        this.player.render(this.player.camera);
        const entries = [...this.gameMap.layers, this.player];
        const sorted = entries.sort((a, b) => {
            let va = Array.isArray(a) ? a[1] : a;
            let vb = Array.isArray(b) ? b[1] : b;
            return va.zIndex - vb.zIndex;
        });
        for (const entry of sorted) {
            const entity = Array.isArray(entry) ? entry[1] : entry;
            entity.render(this.player.camera);
        }
        this.player.camera.render(ctx);
    }
}
var TimeOfDay;
(function (TimeOfDay) {
    TimeOfDay[TimeOfDay["NIGHT"] = 0] = "NIGHT";
    TimeOfDay[TimeOfDay["DAY"] = 1] = "DAY";
})(TimeOfDay || (TimeOfDay = {}));
