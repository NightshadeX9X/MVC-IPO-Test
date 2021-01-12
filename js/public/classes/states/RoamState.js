import State from "../State.js";
export default class RoamState extends State {
    constructor() {
        super(...arguments);
        this.x = 30;
        this.y = 50;
    }
    async preload(loader) {
    }
    init() {
        this.y = Math.random() * 400;
    }
    update(input) {
        this.x++;
    }
    render(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillRect(this.x, this.y, 20, 20);
    }
}
