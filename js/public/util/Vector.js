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
    sum(a, b) {
        const vector = this.getVectorFromArgs(a, b);
        return new Vector(this.x + vector.x, this.y + vector.y);
    }
    diff(a, b) {
        const vector = this.getVectorFromArgs(a, b);
        return new Vector(this.x - vector.x, this.y - vector.y);
    }
    prod(a, b) {
        const vector = this.getVectorFromArgs(a, b);
        return new Vector(this.x * vector.x, this.y * vector.y);
    }
    quo(a, b) {
        const vector = this.getVectorFromArgs(a, b);
        let x = vector.x || 1;
        let y = vector.y || 1;
        return new Vector(this.x / x, this.y / y);
    }
    equals(a, b) {
        const vector = this.getVectorFromArgs(a, b);
        return this.x === vector.x && this.y === vector.y;
    }
    lessThan(a, b) {
        const vector = this.getVectorFromArgs(a, b);
        return this.x < vector.x && this.y < vector.y;
    }
    lessThanOrEqualTo(a, b) {
        const vector = this.getVectorFromArgs(a, b);
        return this.x <= vector.x && this.y <= vector.y;
    }
    greaterThan(a, b) {
        const vector = this.getVectorFromArgs(a, b);
        return this.x > vector.x && this.y > vector.y;
    }
    greaterThanOrEqualTo(a, b) {
        const vector = this.getVectorFromArgs(a, b);
        return this.x >= vector.x && this.y >= vector.y;
    }
    distFrom(a, b) {
        const vector = this.getVectorFromArgs(a, b);
        const xDiffSq = (this.x - vector.x) ** 2;
        const yDiffSq = (this.y - vector.y) ** 2;
        const dist = Math.sqrt(xDiffSq + yDiffSq);
        return dist;
    }
    static from(n) {
        return new Vector(n.x, n.y);
    }
}
`${number}x${number}`;
{
    const [x, y] = string.split("x").map(Number);
    return new Vector(x, y);
}
rangeTo(a, number);
Vector[];
rangeTo(a, number, b, number);
Vector[];
rangeTo(a, Vector);
Vector[];
rangeTo(a, number | Vector, b ?  : number);
{
    const vector = this.getVectorFromArgs(a, b);
    let inRange = [];
    for (let x = this.x; x < vector.x; x++) {
        for (let y = this.y; y < vector.y; y++) {
            inRange.push(new Vector(x, y));
        }
    }
    return inRange;
}
toString();
{
    return `${this.x}x${this.y}`;
}
