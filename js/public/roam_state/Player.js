import PlayerWalkingState from "../states/PlayerWalkingState.js";
import Direction from "../util/Direction.js";
import Events from "../util/Events.js";
import { applyMixins } from "../util/functions.js";
import Vector from "../util/Vector.js";
import GameObject from "./GameObject.js";
import MWalker from "./MWalker.js";
class Player {
    constructor(roamState) {
        this.roamState = roamState;
        this.image = null;
        this.spritesheet = null;
        this.pos = new Vector(1);
        this.size = new Vector(1);
        this.direction = Direction.DOWN;
        this.zIndex = 1;
        this.evtHandler = new Events.Handler();
        this.interactionCooldown = 0;
        this.walkingEnabled = true;
        MWalker.construct.call(this, "player");
        this.pos = new Vector(7, 24);
        this.direction = Direction.DOWN;
        this.zIndex = 1;
        this.evtHandler = new Events.Handler();
        this.roamState = roamState;
    }
    async preload(loader) {
        MWalker.prototype.preload.call(this, loader);
        console.log(this.image);
        this.roamState.stateStack.game.input.evtHandler.addEventListener('keypress', (key) => {
            if (!this.roamState.stateStack.game.cheatMode)
                return;
            if (key === "u") {
                this.zIndex++;
                console.log(this.zIndex);
            }
            if (key === "y") {
                this.zIndex--;
                console.log(this.zIndex);
            }
        });
    }
    get coveredSquares() {
        return [this.pos];
    }
    update(input) {
        if (input.interactionKey && this.interactionCooldown <= 0) {
            (() => {
                const go = this.roamState.gameObjects.toArray().filter(go => go.zIndex === this.zIndex).find((go) => go.coveredSquares.find(v => v.equals(this.getPosAhead())));
                if (!go)
                    return;
                go.evtHandler.dispatchEvent('activation', GameObject.ActivationMethod.INTERACTION);
                this.interactionCooldown = 21;
            })();
        }
        for (let key in input.directionKeyStates) {
            const d = key;
            if (!input.directionKeyStates[d] || !this.walkingEnabled)
                continue;
            this.setDirection(Direction[d]);
            this.roamState.stateStack.push(new PlayerWalkingState(this.roamState.stateStack, this.roamState, Direction[d]));
        }
        this.interactionCooldown--;
    }
}
applyMixins(Player, [MWalker]);
export default Player;
