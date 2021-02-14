import PlayerWalkingState from "../states/PlayerWalkingState.js";
import Direction from "../util/Direction.js";
import Events from "../util/Events.js";
import { applyMixins } from "../util/functions.js";
import Spritesheet from "../util/Spritesheet.js";
import Vector from "../util/Vector.js";
import MWalker from "./Walker.js";
class Player {
    constructor(roamState) {
        this.roamState = roamState;
        this.image = null;
        this.spritesheet = null;
        this.pos = new Vector(1);
        this.size = new Vector(1);
        this.drawSize = new Vector(1, 2);
        this.direction = Direction.DOWN;
        this.zIndex = 1;
        this.evtHandler = new Events.Handler();
        MWalker.construct.call(this);
    }
    async preload(loader) {
        this.image = await loader.loadImage(`/assets/images/people/player.png`);
        this.spritesheet = new Spritesheet(this.image, this.drawSize.prod(this.roamState.tileSize), new Vector(4));
    }
    update(input) {
        for (let key in input.directionKeyStates) {
            const d = key;
            if (!input.directionKeyStates[d] || this.roamState !== this.roamState.stateStack.fromTop())
                continue;
            this.setDirection(Direction[d]);
            this.roamState.stateStack.push(new PlayerWalkingState(this.roamState.stateStack, this.roamState, Direction[d]));
        }
    }
    setDirection(d) {
        this.direction = d;
        this.updateSpritesheetY();
    }
    updateSpritesheetY() {
        if (!this.spritesheet)
            return;
        if (this.direction === Direction.DOWN)
            this.spritesheet.pos.y = 0;
        if (this.direction === Direction.LEFT)
            this.spritesheet.pos.y = 1;
        if (this.direction === Direction.RIGHT)
            this.spritesheet.pos.y = 2;
        if (this.direction === Direction.UP)
            this.spritesheet.pos.y = 3;
    }
    render(ctx) {
        if (this.image && this.spritesheet) {
            this.roamState.camera.ctx.save();
            const coords = this.roamState.camera.convertCoords(this.pos.diff(0, 1).prod(this.roamState.tileSize));
            // this.roamState.camera.ctx.translate(this.roamState.camera.size.x / 2, this.roamState.camera.size.y / 2 - this.drawSize.y * this.roamState.tileSize / 2);
            this.roamState.camera.ctx.translate(coords.x, coords.y);
            this.spritesheet.render(this.roamState.camera.ctx);
            this.roamState.camera.ctx.restore();
        }
    }
}
applyMixins(Player, [MWalker]);
export default Player;
