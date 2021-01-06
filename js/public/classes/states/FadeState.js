import State from "./State.js";
export class FadeState extends State {
    constructor(stateStack, r = 255, g = r, b = r) {
        super(stateStack);
        this.stateStack = stateStack;
        this.r = r;
        this.g = g;
        this.b = b;
        this.alpha = 0;
        this.ascending = true;
        this.shouldEnd = false;
        this.ended = false;
        this.alphaIncrement = 0.01;
        this.updateFunc = () => { return; };
    }
    async preload(loader) {
    }
    update() {
        if (!this.ended && this.alpha <= 1 && this.ascending) {
            this.alpha += this.alphaIncrement;
            if (this.alpha >= 1) {
                this.ascending = false;
                this.alpha = 1;
            }
        }
        this.updateFunc();
    }
    end() {
        // return Promise.resolve(0)
        // this.shouldEnd = true;
        return new Promise((res, rej) => {
            this.updateFunc = () => {
                this.alpha -= this.alphaIncrement;
                if (this.alpha <= 0) {
                    this.stateStack.pop();
                    res(0);
                }
            };
        });
    }
    render(renderer) {
        renderer.ctx.save();
        renderer.ctx.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.alpha})`;
        renderer.ctx.fillRect(0, 0, 640, 400);
        renderer.ctx.restore();
    }
}
