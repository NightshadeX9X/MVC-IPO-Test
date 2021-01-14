import Vector from "./classes/Vector.js";
export var Direction;
(function (Direction) {
    Direction[Direction["LEFT"] = 0] = "LEFT";
    Direction[Direction["UP"] = 1] = "UP";
    Direction[Direction["RIGHT"] = 2] = "RIGHT";
    Direction[Direction["DOWN"] = 3] = "DOWN";
})(Direction || (Direction = {}));
export function directionToVector(d) {
    if (d === Direction.LEFT)
        return new Vector(-1, 0);
    if (d === Direction.UP)
        return new Vector(0, -1);
    if (d === Direction.RIGHT)
        return new Vector(1, 0);
    if (d === Direction.DOWN)
        return new Vector(0, 1);
    return new Vector();
}
