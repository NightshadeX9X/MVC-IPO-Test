import { Direction } from "../Util.js";
import Camera from "./Camera.js";
import Spritesheet from "./Spritesheet.js";
import PlayerMovingState from "./states/PlayerMovingState.js";
import Vector from "./Vector.js";
export default class Player {
    constructor(roamState) {
        this.roamState = roamState;
        this.zIndex = 1;
        this.pos = new Vector(12, 12);
        this.drawSize = new Vector(1, 2);
        this.drawOffset = new Vector(0, -1);
        this.image = null;
        this.spritesheet = null;
        this.camera = new Camera(this, new Vector(480, 320).prod(0.8));
        this.toUpdate = true;
        this.toRender = true;
        this.toPreload = true;
    }
    async preload(loader) {
        this.image = await loader.loadImage(`/assets/images/people/player.png`);
        this.spritesheet = new Spritesheet(this.image, this.drawSize);
    }
    init() {
        if (!this.spritesheet)
            return;
        this.camera.init();
    }
    update(input) {
        this.camera.update();
        if (!this.spritesheet)
            return;
        const dirStrs = ["down", "left", "up", "right"];
        dirStrs.forEach(dirStr => {
            if (this.roamState.stateStack.fromTop() === this.roamState && input.directionKeyStates[dirStr.toUpperCase()] === true) {
                this.roamState.stateStack.push(new PlayerMovingState(this.roamState.stateStack, this.roamState, Direction[dirStr.toUpperCase()]));
            }
        });
    }
    render(camera) {
        if (!this.image || !this.spritesheet)
            return;
        const size = this.drawSize.prod(this.roamState.tileSize);
        const pos = camera.convertCoords(this.pos.sum(this.drawOffset) /* .diff(this.drawOffset) */.prod(this.roamState.tileSize));
        const spriteCoords = this.spritesheet.coords.prod(this.roamState.tileSize).prod(this.drawSize);
        camera.ctx.drawImage(this.image, spriteCoords.x, spriteCoords.y, size.x, size.y, pos.x, pos.y, size.x, size.y);
    }
}
