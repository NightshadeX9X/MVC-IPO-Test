import State from "../State.js";
import Vector from "../Vector.js";
export default class RoamState extends State {
    constructor() {
        super(...arguments);
        this.pos = new Vector(30, 40);
    }
    async preload(loader) {
    }
    init() {
    }
    update(input) {
        this.pos.add(1);
    }
    render(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillRect(this.pos.x, this.pos.y, 20, 20);
    }
}
