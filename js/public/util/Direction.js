import { random } from "./functions.js";
import Vector from "./Vector.js";
var Direction;
(function (Direction) {
    Direction[Direction["DOWN"] = 0] = "DOWN";
    Direction[Direction["LEFT"] = 1] = "LEFT";
    Direction[Direction["RIGHT"] = 2] = "RIGHT";
    Direction[Direction["UP"] = 3] = "UP";
})(Direction || (Direction = {}));
(function (Direction) {
    function invert(d) {
        if (d === Direction.DOWN)
            return Direction.UP;
        if (d === Direction.LEFT)
            return Direction.RIGHT;
        if (d === Direction.RIGHT)
            return Direction.LEFT;
        return Direction.DOWN;
    }
    Direction.invert = invert;
    function toVector(d) {
        if (d === Direction.DOWN)
            return new Vector(0, 1);
        if (d === Direction.LEFT)
            return new Vector(-1, 0);
        if (d === Direction.RIGHT)
            return new Vector(1, 0);
        return new Vector(0, -1);
    }
    Direction.toVector = toVector;
    function getRandom() {
        return random(0, 3);
    }
    Direction.getRandom = getRandom;
})(Direction || (Direction = {}));
export default Direction;
