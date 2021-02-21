import { Updatable } from "../core/Attributes.js";
import { Mixin, New } from "../util/functions.js";
import Vector from "../util/Vector.js";
import Walker from "./Walker.js";
import Direction from "../util/Direction.js";
import Events from "../util/Events.js";
class Player {
    constructor(...args) {
        this.evtHandler = null;
        return New(Player, ...args);
    }
    static construct(roamState) {
        Walker.construct.call(this, roamState, new Vector(), 'player');
        Updatable.construct.call(this);
        this.evtHandler = new Events.Handler();
        console.log(this.evtHandler.addEventListener('walk', (from, to, dir) => {
            console.log("Player walked", { from: from.toString(), to: to.toString(), direction: Direction[dir] });
        }));
        return this;
    }
    update(input) {
        for (const key in input.directionKeyStates) {
            const dirStr = key;
            if (input.directionKeyStates[dirStr]) {
                this.walk(Direction[dirStr]);
                break;
            }
        }
    }
}
Mixin.apply(Player, [Walker, Updatable]);
export default Player;
