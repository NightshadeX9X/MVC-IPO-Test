import State from "../State.js";
export default class WildBattleState extends State {
    constructor(stateStack, battleBgName) {
        super(stateStack);
        this.stateStack = stateStack;
        this.battleBgName = battleBgName;
        this.battleBg = null;
        this.toClearCanvas = true;
    }
    async preload(loader) {
        this.battleBg = await loader.loadImage(`/assets/images/battle_backgrounds/${this.battleBgName}.png`);
    }
    init() {
    }
    update(input) {
    }
    render(ctx) {
        if (this.toClearCanvas) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            this.toClearCanvas = false;
        }
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        if (!this.battleBg)
            return;
        const width = ctx.canvas.width;
        const height = (this.battleBg.height / this.battleBg.width) * width;
        const y = (ctx.canvas.height - height) / 2;
        ctx.drawImage(this.battleBg, 0, y, width, height);
    }
}
