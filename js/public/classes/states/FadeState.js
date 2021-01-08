import State from "./State.js";
export class FadeState extends State {
    constructor(stateStack, r = 255, g = r, b = r) {
        super(stateStack);
        this.stateStack = stateStack;
        this.r = r;
        this.g = g;
        this.b = b;
        this.alpha = 0;
        this.increment = 0.01;
        this.framesSinceStart = 0;
        this.checkToDescend = false;
        this.state = 'not started';
        this.onEnd = () => { };
        this.onWaiting = () => { };
        this.onWaitingExecuted = false;
    }
    async preload(loader) { }
    update() {
        console.log(this.state, this.framesSinceStart);
        if (this.state !== 'not started')
            this.framesSinceStart++;
        if (this.state === 'ascending') {
            if (this.alpha >= 1) {
                this.state = 'waiting';
            }
            if (this.state === "ascending" && this.alpha < 1)
                this.alpha += this.increment;
        }
        if (this.state === 'waiting') {
            this.alpha = 1;
            this.onWaiting();
            this.onWaitingExecuted = true;
        }
        ;
        if (this.state === 'descending') {
            if (this.alpha <= 0) {
                this.state = 'ended';
            }
            if (this.state === 'descending' && this.alpha > 0)
                this.alpha -= this.increment;
        }
        if (this.state === 'ended') {
            this.alpha = 0;
            this.stateStack.pop();
            this.onEnd();
        }
        if (this.checkToDescend && this.framesSinceStart > 30 && this.alpha >= 1) {
            this.state = 'descending';
        }
    }
    start() {
        if (this.state === 'not started')
            this.state = 'ascending';
    }
    end() {
        if (this.framesSinceStart < 30) {
            this.checkToDescend = true;
        }
        else
            this.state = 'descending';
    }
    render(renderer) {
        let color = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.alpha})`;
        // renderer.ctx.clearRect(0, 0, 640, 400);
        // console.log(color)
        renderer.ctx.save();
        renderer.ctx.fillStyle = color;
        renderer.ctx.fillRect(0, 0, 640, 400);
        renderer.ctx.restore();
    }
}
