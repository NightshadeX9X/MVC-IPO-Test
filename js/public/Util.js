import Vector from "./classes/Vector.js";
export var Direction;
(function (Direction) {
    Direction[Direction["LEFT"] = 0] = "LEFT";
    Direction[Direction["UP"] = 1] = "UP";
    Direction[Direction["RIGHT"] = 2] = "RIGHT";
    Direction[Direction["DOWN"] = 3] = "DOWN";
})(Direction || (Direction = {}));
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
export function directionToVector(d) {
    if (d === Direction.LEFT)
        return new Vector(-1, 0);
    if (d === Direction.UP)
        return new Vector(0, -1);
    if (d === Direction.RIGHT)
        return new Vector(1, 0);
    if (d === Direction.DOWN)
        return new Vector(0, 1);
    else
        return new Vector(0, 0);
}
export function random(min = 0, max = 1, whole = true) {
    if (whole)
        return Math.floor(Math.random() * (max - min + 1) + min);
    else
        return Math.random() * (max - min) + min;
}
export function chance(x = 1, outOfY = 100) {
    const gen = random(x, outOfY, true);
    return gen <= x;
}
