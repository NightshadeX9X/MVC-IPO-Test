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
    function fromVector(v) {
        let horizontal;
        let vertical;
        if (v.x < 0)
            horizontal = Direction.LEFT;
        else
            horizontal = Direction.RIGHT;
        if (v.y < 0)
            vertical = Direction.UP;
        else
            vertical = Direction.DOWN;
        const abs = v.map(Math.abs);
        if (abs.x > abs.y)
            return horizontal;
        else
            return vertical;
    }
    Direction.fromVector = fromVector;
    function routeTo(v) {
        let horizontal;
        let vertical;
        if (v.x < 0)
            horizontal = Direction.LEFT;
        else
            horizontal = Direction.RIGHT;
        if (v.y < 0)
            vertical = Direction.UP;
        else
            vertical = Direction.DOWN;
        const abs = v.map(Math.abs);
        if (abs.x > abs.y)
            return [horizontal, vertical, Direction.invert(horizontal), Direction.invert(vertical)];
        else
            return [vertical, horizontal, Direction.invert(vertical), Direction.invert(horizontal)];
    }
    Direction.routeTo = routeTo;
    function getRandom() {
        return random(0, 3);
    }
    Direction.getRandom = getRandom;
})(Direction || (Direction = {}));
export default Direction;
