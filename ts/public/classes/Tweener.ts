export default class Tweener {
	public current: number;
	private timesTicked = 0;
	public ended = false;
	public loop = false;
	public roundAtEnd = true;
	public mapFn: (n: number) => number = Math.round;
	constructor(public start: number, public end: number, public totalTimesToTick: number) {
		this.current = this.start;
	}

	private get tickValue() {
		return (this.end - this.start) / this.totalTimesToTick;
	}

	tick() {
		if (this.ended) return;
		let val = this.tickValue + this.current;
		if (this.timesTicked >= this.totalTimesToTick) val = this.mapFn(val)
		this.current = val;
		if (this.timesTicked >= this.totalTimesToTick) {
			if (this.loop) {
				this.timesTicked = 0;
				this.current = this.start
			} else {
				this.ended = true;
			}
		}
		this.timesTicked++;

	}
}