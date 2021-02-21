import RoamState from "../states/RoamState.js";
import { Mixin, New } from "../util/functions.js";
import { Preloadable, Renderable, Updatable } from "./Attributes.js";
import Input from "./Input.js";
import Loader from "./Loader.js";
import StateStack from "./StateStack.js";
class Game {
    constructor() {
        this.stateStack = New(StateStack, this, this);
        this.cnv = document.getElementById('screen');
        this.ctx = this.cnv.getContext('2d');
        this.input = New(Input);
        this.loader = New(Loader);
        this.fps = 60;
        return New(Game);
    }
    static construct() {
        Renderable.construct.call(this);
        Updatable.construct.call(this);
        Preloadable.construct.call(this);
        this.stateStack = new StateStack(this, this);
        this.cnv = document.getElementById('screen');
        this.ctx = this.cnv.getContext('2d');
        this.input = New(Input);
        this.loader = New(Loader);
        this.fps = 60;
        return this;
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
Mixin.apply(Game, [Renderable, Updatable, Preloadable]);
export default Game;
