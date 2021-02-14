import PlayerWalkingState from "../states/PlayerWalkingState.js";
import Direction from "../util/Direction.js";
import Spritesheet from "../util/Spritesheet.js";
import Vector from "../util/Vector.js";
export default class Player {
    constructor(roamState) {
        this.roamState = roamState;
        this.image = null;
        this.spritesheet = null;
        this.pos = new Vector();
        this.direction = Direction.DOWN;
        this.zIndex = 1;
    }
    async preload(loader) {
        this.image = await loader.loadImage(`/assets/images/people/player.png`);
        this.spritesheet = new Spritesheet(this.image, new Vector(16, 32), new Vector(4));
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
            ctx.save();
            ctx.translate(this.pos.x * this.roamState.tileSize, this.pos.y * this.roamState.tileSize);
            this.spritesheet.render(ctx);
            ctx.restore();
        }
    }
}