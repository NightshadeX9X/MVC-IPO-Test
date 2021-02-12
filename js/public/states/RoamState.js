import State from "../core/State.js";
export default class RoamState extends State {
    async preload(loader) {
        await this.subStateStack.preload(loader);
    }
    update(input) {
        this.subStateStack.update(input);
    }
    render(ctx) {
        this.subStateStack.render(ctx);
    }
}
