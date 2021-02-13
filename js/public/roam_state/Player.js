import PlayerWalkingState from "../states/PlayerWalkingState.js";
import Direction from "../util/Direction.js";
import Vector from "../util/Vector.js";
export default class Player {
    constructor(roamState) {
        this.roamState = roamState;
        this.image = null;
        this.pos = new Vector();
        this.zIndex = 1;
    }
    async preload(loader) {
        this.image = await loader.loadImage(`/assets/images/people/player.png`);
    }
    update(input) {
        for (let key in input.directionKeyStates) {
            const d = key;
            if (!input.directionKeyStates[d] || this.roamState !== this.roamState.stateStack.fromTop())
                continue;
            this.roamState.stateStack.push(new PlayerWalkingState(this.roamState.stateStack, this.roamState, Direction[d]));
        }
    }
    render(ctx) {
        if (this.image)
            ctx.drawImage(this.image, 0, 0, 16, 32, this.pos.x * 16, this.pos.y * 16, 16, 32);
    }
}
