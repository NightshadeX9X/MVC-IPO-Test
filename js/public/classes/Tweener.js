export default class Tweener {
    constructor(start, end, totalTimesToTick) {
        this.start = start;
        this.end = end;
        this.totalTimesToTick = totalTimesToTick;
        this.timesTicked = 0;
        this.ended = false;
        this.loop = false;
        this.roundAtEnd = true;
        this.mapFn = Math.round;
        this.current = this.start;
    }
    get tickValue() {
        return (this.end - this.start) / this.totalTimesToTick;
    }
    tick() {
        if (this.ended)
            return;
        let val = this.tickValue + this.current;
        if (this.timesTicked >= this.totalTimesToTick)
            val = this.mapFn(val);
        this.current = val;
        if (this.timesTicked >= this.totalTimesToTick) {
            if (this.loop) {
                this.timesTicked = 0;
                this.current = this.start;
            }
            else {
                this.ended = true;
            }
        }
        this.timesTicked++;
    }
}
