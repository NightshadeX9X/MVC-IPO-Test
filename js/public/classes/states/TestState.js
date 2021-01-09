import State from "../State.js";
export default class TestState extends State {
    constructor(stateStack) {
        super(stateStack);
    }
    async preload() {
    }
    init() {
    }
    update(controller) {
    }
    render(ctx) {
        ctx.font = "30px monospace";
        ctx.fillText("hello", 30, 50);
    }
}
