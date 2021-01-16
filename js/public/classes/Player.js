import { Direction } from "../Util.js";
import Spritesheet from "./Spritesheet.js";
import PlayerMovingState from "./states/PlayerMovingState.js";
import Vector from "./Vector.js";
export default class Player {
    constructor(roamState) {
        this.roamState = roamState;
        this.pos = new Vector(10, 5);
        this.drawSize = new Vector(1, 2);
        this.drawOffset = new Vector(0, -1);
        this.image = null;
        this.spritesheet = null;
        this.toUpdate = true;
        this.toRender = true;
        this.toPreload = true;
    }
    async preload(loader) {
        this.image = await loader.loadImage(`/assets/images/people/player.png`);
        this.spritesheet = new Spritesheet(this.image, this.drawSize, this);
    }
    init() {
        if (!this.spritesheet)
            return;
    }
    update(input) {
        if (!this.spritesheet)
            return;
        const dirStrs = ["down", "left", "up", "right"];
        dirStrs.forEach(dirStr => {
            if (this.roamState.stateStack.fromTop() === this.roamState && input.directionKeyStates[dirStr.toUpperCase()] === true) {
                this.roamState.stateStack.push(new PlayerMovingState(this.roamState.stateStack, this.roamState, Direction[dirStr.toUpperCase()]));
            }
        });
    }
    render(ctx) {
        if (!this.image || !this.spritesheet)
            return;
        const pos = this.pos.sum(this.drawOffset).prod(this.roamState.tileSize).diff(0, 1);
        const size = this.drawSize.prod(this.roamState.tileSize);
        const spriteCoords = this.spritesheet.coords.prod(this.roamState.tileSize).prod(this.drawSize);
        ctx.drawImage(this.image, spriteCoords.x, spriteCoords.y, size.x, size.y, pos.x, pos.y, size.x, size.y);
    }
}
