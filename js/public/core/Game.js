import { create } from "../util/functions.js";
import StateStack from "./StateStack.js";
class Game {
    constructor() {
        this.stateStack = null;
        this.cnv = null;
        this.ctx = null;
    }
    static construct() {
        this.stateStack = create(StateStack, this, this);
        this.cnv = document.getElementById('screen');
        this.ctx = this.cnv.getContext('2d');
        return this;
    }
}
export default Game;
