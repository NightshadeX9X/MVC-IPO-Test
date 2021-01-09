export default class Vector {
    constructor(x = 0, y = x) {
        this.x = x;
        this.y = y;
    }
    static from(n) {
        if (Array.isArray(n)) {
            return new Vector(n[0], n[1]);
        }
        else
            return new Vector(n.x, n.y);
    }
    add(o) {
        const v = o instanceof Vector ? o : new Vector(o);
        return new Vector(this.x + v.x, this.y + v.y);
    }
    subtract(o) {
        const v = o instanceof Vector ? o : new Vector(o);
        return new Vector(this.x - v.x, this.y - v.y);
    }
    multiply(o) {
        const v = o instanceof Vector ? o : new Vector(o);
        return new Vector(this.x * v.x, this.y * v.y);
    }
    divide(o) {
        const v = o instanceof Vector ? o : new Vector(o);
        const x = v.x === 0 ? 0 : this.x / v.x;
        const y = v.y === 0 ? 0 : this.y / v.y;
        return new Vector(x, y);
    }
    map(fn) {
        return new Vector(fn(this.x), fn(this.y));
    }
    equals(ov) {
        return this.x === ov.x && this.y === ov.y;
    }
}
