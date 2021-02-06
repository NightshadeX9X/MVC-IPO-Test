import Vector from "../../../Vector.js";
import { GameEventType, GameEventTrigger } from "../GameEvent.js";
export default {
    type: GameEventType.REGULAR,
    data: {
        isRendered: false,
        pos: new Vector(3, 19),
        passable: true,
        size: new Vector(2, 2),
        trigger: GameEventTrigger.PLAYER_TOUCH
    },
    async onInteract() {
        if (!this.roamState)
            return;
        if (this.roamState.player.pos.y === 19)
            this.roamState.player.zIndex = 2;
        else if (this.roamState.player.pos.y === 20)
            this.roamState.player.zIndex = 1;
    }
};
