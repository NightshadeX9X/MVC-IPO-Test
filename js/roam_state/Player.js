import { Mixin, New } from "../public/util/functions.js";
import Vector from "../public/util/Vector.js";
import Walker from "./Walker.js";
class Player {
    constructor(...args) {
        return New(Player, ...args);
    }
    static construct(roamState) {
        Walker.construct.call(this, roamState, new Vector(), 'player');
        return this;
    }
}
Mixin.apply(Player, [Walker]);
export default Player;
