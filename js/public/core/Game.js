import RoamState from "../states/RoamState.js";
import Input from "./Input.js";
import Loader from "./Loader.js";
import StateStack from "./StateStack.js";
export default class Game {
    constructor() {
        this.fps = 60;
        this.loader = new Loader();
        this.input = new Input();
        this.cnv = document.getElementById('screen');
        this.ctx = this.cnv.getContext('2d');
        this.stateStack = new StateStack(this, this);
    }
    async preload() {
        await this.stateStack.push(new RoamState(this.stateStack));
        this.input.start(document);
    }
    update() {
        this.stateStack.update(this.input);
    }
    render() {
        this.stateStack.render(this.ctx);
    }
}
