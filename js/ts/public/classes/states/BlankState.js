import State from "../State.js";
export default class BlankState extends State {
    constructor(stateStack) {
        super(stateStack);
        this.stateStack = stateStack;
    }
    async preload(loader) {
    }
    init() {
    }
    update(input) {
        this.substates.update(input);
    }
    render(ctx) {
        this.substates.render(ctx);
    }
}
