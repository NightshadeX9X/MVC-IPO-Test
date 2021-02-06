import State from "../../State.js";
import Vector from "../../Vector.js";
import MainMenuState from "./MainMenuState.js";
export default class IntroState extends State {
    constructor(stateStack, wildBattleState) {
        super(stateStack);
        this.stateStack = stateStack;
        this.wildBattleState = wildBattleState;
        this.partyHeadPos = new Vector(-110, 150);
        this.pokemonHeight = 100;
        this.wildImage = null;
        this.partyHeadImage = null;
        this.framesSinceImagesStoppedMoving = 0;
    }
    async preload(loader) {
        const promises = [
            loader.loadImage(`/assets/images/pokemon/${this.wildBattleState.partyHead?.species?.name}.png`),
            loader.loadImage(`/assets/images/pokemon/${this.wildBattleState.battle?.wild.species?.name}.png`),
        ];
        [this.partyHeadImage, this.wildImage] = await Promise.all(promises);
        this.wildBattleState.wildImage = this.wildImage;
        this.wildBattleState.partyHeadImage = this.partyHeadImage;
    }
    init() {
    }
    update(input) {
        if (this.partyHeadPos.x < 50) {
            this.partyHeadPos.x++;
        }
        else {
            this.framesSinceImagesStoppedMoving++;
        }
        if (this.framesSinceImagesStoppedMoving >= 20) {
            this.wildBattleState.partyHeadPos = this.partyHeadPos;
            this.wildBattleState.pokemonHeight = this.pokemonHeight;
            // this.stateStack.pop();
            // this.stateStack.push(new MainMenuState(this.stateStack, this.wildBattleState));
            (async () => {
                this.stateStack.pop();
                this.stateStack.push(new MainMenuState(this.stateStack, this.wildBattleState));
            })();
        }
    }
    render(ctx) {
        if (this.partyHeadImage) {
            ctx.drawImage(this.partyHeadImage, this.partyHeadPos.x, this.partyHeadPos.y, 100, 100);
        }
        if (this.wildImage) {
            ctx.drawImage(this.wildImage, ctx.canvas.width - this.partyHeadPos.x - 64, ctx.canvas.height - this.partyHeadPos.y - 64, 70, 70);
        }
    }
}
