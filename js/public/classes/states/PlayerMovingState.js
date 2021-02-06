import { Direction, directionToVector, stringToDirections } from "../../Util.js";
import GameEvent, { GameEventTrigger } from "../roam_state/game_events/GameEvent.js";
import State from "../State.js";
import Vector from "../Vector.js";
export default class PlayerMovingState extends State {
    constructor(stateStack, roamState, direction) {
        super(stateStack);
        this.stateStack = stateStack;
        this.roamState = roamState;
        this.direction = direction;
        this.frames = 0;
        this.playerOriginalPos = new Vector();
    }
    async preload(loader) {
    }
    init() {
        this.roamState.toUpdate = true;
        this.playerOriginalPos = Vector.from(this.roamState.player.pos);
        if (this.roamState.player.spritesheet) {
            if (this.roamState.player.direction === Direction.DOWN)
                this.roamState.player.spritesheet.coords.y = 0;
            else if (this.roamState.player.direction === Direction.LEFT)
                this.roamState.player.spritesheet.coords.y = 1;
            else if (this.roamState.player.direction === Direction.RIGHT)
                this.roamState.player.spritesheet.coords.y = 2;
            else if (this.roamState.player.direction === Direction.UP)
                this.roamState.player.spritesheet.coords.y = 3;
        }
        const destination = this.targetCoords;
        if (this.roamState.gameMap.json) {
            if (destination.x < 0 ||
                destination.y < 0 ||
                destination.x >= this.roamState.gameMap.size.x ||
                destination.y >= this.roamState.gameMap.size.y ||
                this.roamState.player.onMapLayer?.partsAt(destination.x, destination.y).find(p => p.type === "wall" && (typeof p.value === "string" ? stringToDirections(p.value).includes(this.roamState.player.direction) : p.value)) ||
                this.roamState.gameEvents.some(g => !g.data.passable && g.getCoveredTiles().some(v => v.equals(destination)))) {
                this.stateStack.pop();
            }
        }
    }
    get vec() {
        return directionToVector(this.direction).quo(this.roamState.tileSize);
    }
    get targetCoords() {
        return this.playerOriginalPos.sum(directionToVector(this.direction));
    }
    update(input) {
        const spritesheet = this.roamState.player.spritesheet;
        if (this.frames < 16) {
            if (spritesheet && this.frames % 4 === 0) {
                spritesheet.coords.x = (spritesheet.coords.x + 1) % (spritesheet.spriteCount.x * spritesheet.size.x);
            }
            this.roamState.player.spritesheet?.coords;
            this.roamState.player.pos.add(this.vec);
        }
        else {
            (async () => {
                this.roamState.player.pos = this.targetCoords;
                this.roamState.toUpdate = null;
                this.stateStack.pop();
                // TRIGGER ON PLAYER TOUCH EVENTS
                const toTrigger = this.roamState.gameEvents.filter(e => e.data.trigger === GameEventTrigger.PLAYER_TOUCH && !!e.getCoveredTiles().find(v => v.equals(this.targetCoords)));
                toTrigger.forEach(ge => {
                    ge.evtManager.dispatchEvent(GameEvent.interactEvt);
                });
            })();
        }
        this.frames++;
    }
    render(ctx) {
    }
}
