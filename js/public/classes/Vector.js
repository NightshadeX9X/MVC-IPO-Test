export default class Vector {
    constructor(x = 0, y = x) {
        this.x = x;
        this.y = y;
    }
    getVectorFromArgs(a, b) {
        const vector = typeof b === "number"
            ? (new Vector(a, b))
            : (typeof a === "number" ? new Vector(a) : a);
        return vector;
    }
    convertTo1if0() {
        const n = new Vector(this.x, this.y);
        if (n.x === 0)
            n.x = 1;
        if (n.y === 0)
            n.y = 1;
        return n;
    }
    sum(a, b) {
        const o = this.getVectorFromArgs(a, b);
        return new Vector(this.x + o.x, this.y + o.y);
    }
    diff(a, b) {
        const o = this.getVectorFromArgs(a, b);
        return new Vector(this.x - o.x, this.y - o.y);
    }
    prod(a, b) {
        const o = this.getVectorFromArgs(a, b);
        return new Vector(this.x * o.x, this.y * o.y);
    }
    quo(a, b) {
        const o = this.getVectorFromArgs(a, b).convertTo1if0();
        return new Vector(this.x / o.x, this.y / o.y);
    }
    add(a, b) {
        const res = this.sum(a, b);
        this.x = res.x;
        this.y = res.y;
    }
    sub(a, b) {
        const res = this.diff(a, b);
        this.x = res.x;
        this.y = res.y;
    }
    mult(a, b) {
        const res = this.prod(a, b);
        this.x = res.x;
        this.y = res.y;
    }
    div(a, b) {
        const res = this.quo(a, b);
        this.x = res.x;
        this.y = res.y;
    }
    map(fn) {
        this.x = fn(this.x);
        this.y = fn(this.y);
    }
    equals(a, b) {
        const o = this.getVectorFromArgs(a, b);
        return this.x === o.x && this.y === o.y;
    }
    lessThan(a, b) {
        const o = this.getVectorFromArgs(a, b);
        return this.x < o.x && this.y < o.y;
    }
    lessThanOrEqualTo(a, b) {
        const o = this.getVectorFromArgs(a, b);
        return this.x <= o.x && this.y <= o.y;
    }
    greaterThan(a, b) {
        const o = this.getVectorFromArgs(a, b);
        return this.x > o.x && this.y > o.y;
    }
    greaterThanOrEqualTo(a, b) {
        const o = this.getVectorFromArgs(a, b);
        return this.x >= o.x && this.y >= o.y;
    }
    static from(n) {
        return new Vector(n.x, n.y);
    }
    distFrom(a, b) {
        const o = this.getVectorFromArgs(a, b);
        const xDiffSq = (this.x - o.x) ^ 2;
        const yDiffSq = (this.y - o.y) ^ 2;
        const dist = Math.sqrt(xDiffSq + yDiffSq);
        return dist;
    }
}
