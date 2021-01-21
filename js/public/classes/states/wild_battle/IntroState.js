import State from "../../State.js";
import Vector from "../../Vector.js";
import MainMenuState from "./MainMenuState.js";
export default class IntroState extends State {
    constructor(stateStack, wildBattleState) {
        super(stateStack);
        this.stateStack = stateStack;
        this.wildBattleState = wildBattleState;
        this.partyHeadPos = new Vector(-90, 150);
        this.pokemonHeight = 100;
        this.wildImage = null;
        this.partyHeadImage = null;
        this.framesSinceImagesStoppedMoving = 0;
    }
    async preload(loader) {
        const promises = [
            loader.loadImage(`/assets/images/pokemon/${this.wildBattleState.battle.wild.species?.name}.png`),
            loader.loadImage(`/assets/images/pokemon/${this.wildBattleState.partyHead?.species?.name}.png`)
        ];
        [this.wildImage, this.partyHeadImage] = await Promise.all(promises);
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
            this.stateStack.pop();
            this.stateStack.push(new MainMenuState(this.stateStack, this.wildBattleState));
        }
    }
    render(ctx) {
        if (this.partyHeadImage) {
            const pokemonWidth = (this.partyHeadImage.width / this.partyHeadImage.height) * this.pokemonHeight;
            ctx.drawImage(this.partyHeadImage, this.partyHeadPos.x, this.partyHeadPos.y, pokemonWidth, this.pokemonHeight);
        }
        if (this.wildImage) {
            const pokemonWidth = (this.wildImage.width / this.wildImage.height) * this.pokemonHeight;
            ctx.drawImage(this.wildImage, ctx.canvas.width - this.partyHeadPos.x - this.wildImage.width, ctx.canvas.height - this.partyHeadPos.y - this.wildImage.height, pokemonWidth * 0.7, this.pokemonHeight * 0.7);
        }
    }
}
