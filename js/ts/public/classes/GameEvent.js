import { Direction } from "../Util.js";
import Vector from "./Vector.js";
export default class GameEvent {
    constructor(type, roamState, data = {}) {
        this.type = type;
        this.roamState = roamState;
        this.disabled = false;
        this.ID = GameEvent.getNewID();
        this.evtManager = new EventTarget();
        this.data = GameEvent.defaultData;
        this.variables = new Map();
        this.once = false;
        this.setData(data);
        this.evtManager.addEventListener('interact', () => {
            if (this.type === GameEventType.NPC && this.data.spritesheet && this.roamState) {
                switch (this.roamState.player.direction) {
                    case Direction.UP:
                        this.data.spritesheet.coords.y = 0;
                        break;
                    case Direction.RIGHT:
                        this.data.spritesheet.coords.y = 1;
                        break;
                    case Direction.LEFT:
                        this.data.spritesheet.coords.y = 2;
                        break;
                    case Direction.DOWN:
                        this.data.spritesheet.coords.y = 3;
                        break;
                }
            }
        });
    }
    static *IDGenerator() {
        let id = 0;
        while (true) {
            yield `EVENT${id++}`;
        }
    }
    isAheadOfPlayer() {
        if (!this.roamState)
            return false;
        return !!this.getCoveredTiles().find(v => v.equals(this.roamState?.player.tileAhead || new Vector));
    }
    static getNewID() {
        return this.IDs.next().value;
    }
    get zIndex() {
        if (!this.roamState)
            return 1;
        if (this.roamState.player.pos.y > this.data.pos.y)
            return this.roamState.player.zIndex - 0.01;
        else if (this.roamState.player.pos.y < this.data.pos.y)
            return this.roamState.player.zIndex + 0.01;
        return this.roamState.player.zIndex;
    }
    getCoveredTiles() {
        return this.data.pos.rangeTo(this.data.pos.sum(this.data.size));
    }
    ;
    setData(data = {}) {
        this.data = {
            ...GameEvent.defaultData,
            ...data,
        };
    }
    render(camera) {
        if (!this.once) {
            console.log(this.data, this.roamState);
            this.once = true;
        }
        if (!this.data.spritesheet?.image || !this.roamState || !this.data.isRendered)
            return;
        const coords = camera.convertCoords(this.data.pos.sum(this.data.renderOffset).prod(this.roamState.tileSize));
        this.data.spritesheet.render(camera.ctx, coords);
    }
    static get defaultData() {
        return {
            spritesheet: null,
            passable: false,
            pos: new Vector,
            size: new Vector(1),
            renderOffset: new Vector,
            renderSize: new Vector(1),
            isRendered: true,
            trigger: GameEventTrigger.INTERACTION_KEY,
            isParallelProcess: false
        };
    }
}
GameEvent.interactEvt = new Event('interact');
GameEvent.IDs = GameEvent.IDGenerator();
export var GameEventTrigger;
(function (GameEventTrigger) {
    GameEventTrigger[GameEventTrigger["PLAYER_TOUCH"] = 0] = "PLAYER_TOUCH";
    GameEventTrigger[GameEventTrigger["INTERACTION_KEY"] = 1] = "INTERACTION_KEY";
    GameEventTrigger[GameEventTrigger["MAP_ENTER"] = 2] = "MAP_ENTER";
    GameEventTrigger[GameEventTrigger["EVENT_TOUCH"] = 3] = "EVENT_TOUCH";
})(GameEventTrigger || (GameEventTrigger = {}));
export var GameEventType;
(function (GameEventType) {
    GameEventType[GameEventType["NPC"] = 0] = "NPC";
    GameEventType[GameEventType["REGULAR"] = 1] = "REGULAR";
})(GameEventType || (GameEventType = {}));
