export default class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(n) {
        let v = n instanceof Vector ? n : { x: n, y: n };
        return new Vector(this.x + v.x, this.y + v.y);
    }
    subtract(n) {
        let v = n instanceof Vector ? n : { x: n, y: n };
        return new Vector(this.x - v.x, this.y - v.y);
    }
    multiply(n) {
        let v = n instanceof Vector ? n : { x: n, y: n };
        return new Vector(this.x * v.x, this.y * v.y);
    }
    divide(n) {
        let v = n instanceof Vector ? n : { x: n, y: n };
        let x = v.x === 0 ? 0 : this.x / v.x;
        let y = v.y === 0 ? 0 : this.y / v.y;
        return new Vector(x, y);
    }
}
