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
export function generate2DArray(rows, columns, defaultVal, ranges) {
    const arr = [];
    for (let y = 0; y < rows; y++) {
        arr[y] = [];
        for (let x = 0; x < columns; x++) {
            arr[y][x] = defaultVal;
        }
    }
    ranges.forEach(range => {
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < columns; x++) {
                if (x >= range.pos1.x && x <= range.pos2.x && y >= range.pos1.y && y <= range.pos2.y)
                    arr[y][x] = range.value;
            }
        }
    });
    return arr;
}
