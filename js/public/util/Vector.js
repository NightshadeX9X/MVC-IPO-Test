var Vector = /** @class */ (function () {
    function Vector(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = x; }
        this.x = x;
        this.y = y;
    }
    Vector.prototype.getVectorFromArgs = function (a, b) {
        var vector = typeof b === "number"
            ? (new Vector(a, b))
            : (typeof a === "number" ? new Vector(a) : a);
        return vector;
    };
    Vector.prototype.sum = function (a, b) {
        var vector = this.getVectorFromArgs(a, b);
        return new Vector(this.x + vector.x, this.y + vector.y);
    };
    Vector.prototype.diff = function (a, b) {
        var vector = this.getVectorFromArgs(a, b);
        return new Vector(this.x - vector.x, this.y - vector.y);
    };
    Vector.prototype.prod = function (a, b) {
        var vector = this.getVectorFromArgs(a, b);
        return new Vector(this.x * vector.x, this.y * vector.y);
    };
    Vector.prototype.quo = function (a, b) {
        var vector = this.getVectorFromArgs(a, b);
        var x = vector.x || 1;
        var y = vector.y || 1;
        return new Vector(this.x / x, this.y / y);
    };
    Vector.prototype.add = function (a, b) {
        var vector = this.getVectorFromArgs(a, b);
        var res = this.sum(vector);
        this.x = res.x;
        this.y = res.y;
    };
    Vector.prototype.sub = function (a, b) {
        var vector = this.getVectorFromArgs(a, b);
        var res = this.diff(vector);
        this.x = res.x;
        this.y = res.y;
    };
    Vector.prototype.mult = function (a, b) {
        var vector = this.getVectorFromArgs(a, b);
        var res = this.prod(vector);
        this.x = res.x;
        this.y = res.y;
    };
    Vector.prototype.div = function (a, b) {
        var vector = this.getVectorFromArgs(a, b);
        var res = this.quo(vector);
        this.x = res.x;
        this.y = res.y;
    };
    Vector.prototype.equals = function (a, b) {
        var vector = this.getVectorFromArgs(a, b);
        return this.x === vector.x && this.y === vector.y;
    };
    Vector.prototype.lessThan = function (a, b) {
        var vector = this.getVectorFromArgs(a, b);
        return this.x < vector.x && this.y < vector.y;
    };
    Vector.prototype.lessThanOrEqualTo = function (a, b) {
        var vector = this.getVectorFromArgs(a, b);
        return this.x <= vector.x && this.y <= vector.y;
    };
    Vector.prototype.greaterThan = function (a, b) {
        var vector = this.getVectorFromArgs(a, b);
        return this.x > vector.x && this.y > vector.y;
    };
    Vector.prototype.greaterThanOrEqualTo = function (a, b) {
        var vector = this.getVectorFromArgs(a, b);
        return this.x >= vector.x && this.y >= vector.y;
    };
    Vector.prototype.distFrom = function (a, b) {
        var vector = this.getVectorFromArgs(a, b);
        var xDiffSq = Math.pow((this.x - vector.x), 2);
        var yDiffSq = Math.pow((this.y - vector.y), 2);
        var dist = Math.sqrt(xDiffSq + yDiffSq);
        return dist;
    };
    Vector.from = function (n) {
        return new Vector(n.x, n.y);
    };
    Vector.fromString = function (string) {
        var _a = string.split("x").map(Number), x = _a[0], y = _a[1];
        return new Vector(x, y);
    };
    Vector.prototype.rangeTo = function (a, b) {
        var vector = this.getVectorFromArgs(a, b);
        var inRange = [];
        for (var x = this.x; x < vector.x; x++) {
            for (var y = this.y; y < vector.y; y++) {
                inRange.push(new Vector(x, y));
            }
        }
        return inRange;
    };
    Vector.prototype.map = function (fn) {
        var vec = new Vector(fn(this.x), fn(this.y));
        return vec;
    };
    Vector.prototype.set = function (a, b) {
        var vector = this.getVectorFromArgs(a, b);
        this.x = vector.x;
        this.y = vector.y;
    };
    Vector.prototype.toString = function () {
        return this.x + "x" + this.y;
    };
    Vector.fromStringRange = function (strRange) {
        var arr = strRange.split("-").map(function (str) { return Vector.fromString(str); });
        return arr;
    };
    return Vector;
}());
export default Vector;
