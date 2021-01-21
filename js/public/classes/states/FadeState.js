import State from "../State.js";
export default class FadeState extends State {
    constructor() {
        super(...arguments);
        this.alpha = 0;
        this.part = FadeStatePart.ASCENDING;
        this.amount = 0.03;
    }
    async preload(loader) {
    }
    init() {
    }
    update(input) {
        if (this.part === FadeStatePart.ASCENDING) {
            this.alpha += this.amount;
            if (this.alpha >= 1)
                this.part = FadeStatePart.DESCENDING;
        }
        else if (this.part === FadeStatePart.DESCENDING) {
            this.alpha -= this.amount;
            if (this.alpha <= 0)
                this.part = FadeStatePart.ENDED;
        }
        else if (this.part === FadeStatePart.ENDED) {
            this.stateStack.pop();
        }
    }
    render(ctx) {
        ctx.save();
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.restore();
    }
}
var FadeStatePart;
(function (FadeStatePart) {
    FadeStatePart[FadeStatePart["ASCENDING"] = 0] = "ASCENDING";
    FadeStatePart[FadeStatePart["DESCENDING"] = 1] = "DESCENDING";
    FadeStatePart[FadeStatePart["WAITING"] = 2] = "WAITING";
    FadeStatePart[FadeStatePart["ENDED"] = 3] = "ENDED";
})(FadeStatePart || (FadeStatePart = {}));
