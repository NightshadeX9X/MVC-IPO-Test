import { Direction } from "../../Util.js";
import State from "../State.js";
export default class PlayerMovingState extends State {
    constructor(stateStack, direction, player) {
        super(stateStack);
        this.direction = direction;
        this.player = player;
        console.log("move player " + Direction[direction]);
    }
    async preload(loader) {
    }
    init() {
    }
    update(controller) {
    }
    render(ctx) {
    }
}
