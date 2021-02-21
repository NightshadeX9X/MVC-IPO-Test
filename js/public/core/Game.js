import RoamState from "../states/RoamState.js";
import { Mixin, New } from "../util/functions.js";
import UIDGen from "../util/UIDGen.js";
import { Preloadable, Renderable, Updatable } from "./Attributes.js";
import Input from "./Input.js";
import Loader from "./Loader.js";
import StateStack from "./StateStack.js";
class Game {
    constructor() {
        this.stateStack = new StateStack(this, this);
        this.cnv = document.getElementById('screen');
        this.ctx = this.cnv.getContext('2d');
        this.input = new Input();
        this.loader = new Loader();
        this.fps = 60;
        this.stateIDGen = new UIDGen();
        return New(Game);
    }
    static construct() {
        Renderable.construct.call(this);
        Updatable.construct.call(this);
        Preloadable.construct.call(this);
        this.stateStack = new StateStack(this, this);
        this.cnv = document.getElementById('screen');
        this.ctx = this.cnv.getContext('2d');
        this.input = new Input();
        this.loader = new Loader();
        this.fps = 60;
        this.stateIDGen = new UIDGen();
        this.stateIDGen.prefix = "STATE";
        return this;
    }
    async preload() {
        this.input.start(document);
        await this.stateStack.push(new RoamState(this.stateStack));
    }
    update() {
        this.stateStack.update(this.input);
    }
    render() {
        this.stateStack.render(this.ctx);
    }
}
Mixin.apply(Game, [Renderable, Updatable, Preloadable]);
export default Game;
