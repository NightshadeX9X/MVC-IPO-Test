import DelayState from "../states/DelayState.js";
import Direction from "../util/Direction.js";
import Vector from "../util/Vector.js";
export default class MWalker {
    constructor() {
        this.pos = null;
        this.spritesheet = null;
        this.roamState = null;
        this.evtHandler = null;
        this.direction = null;
        this.zIndex = null;
        this.canWalkThroughWalls = false;
        this.canWalkThroughMapEdges = false;
    }
    static construct(imageUrl) {
        this.canWalkThroughWalls = false;
        this.canWalkThroughMapEdges = false;
    }
    async loadImageAndSpritesheet() {
    }
    async takeStep(direction) {
        const vector = Direction.toVector(direction);
        const createDelay = async () => {
            const delay = new DelayState(this.roamState.stateStack, 1);
            this.roamState.stateStack.push(delay);
            await delay.pop();
        };
        if (this.spritesheet) {
            this.spritesheet.pos.x++;
            if (this.spritesheet.pos.x >= 4)
                this.spritesheet.pos.x = 0;
        }
        for (let i = 0; i < 4; i++) {
            this.roamState.player.pos.add(vector.quo(16));
            await createDelay();
        }
    }
    getCurrentMapLayer() {
        return this.roamState.gameMap.layers.find(layer => layer.zIndex === (this.zIndex - 1));
    }
    getPosAhead(direction = this.direction) {
        return this.pos.sum(Direction.toVector(direction));
    }
    async walk(direction = this.direction) {
        const oldPos = Vector.from(this.pos);
        const posAhead = this.getPosAhead(direction);
        this.direction = direction;
        if (!this.canWalkThroughMapEdges) {
            if (posAhead.x < 0 || posAhead.x >= this.roamState.gameMap.size.x ||
                posAhead.y < 0 || posAhead.y >= this.roamState.gameMap.size.y)
                return;
        }
        const currentMapLayer = this.getCurrentMapLayer();
        if (currentMapLayer) {
            const wallActive = (data) => {
                if (typeof data === "boolean")
                    return data;
                const parts = data.split("").map(s => s.toUpperCase());
                if (direction === Direction.UP && parts.includes("U"))
                    return true;
                if (direction === Direction.DOWN && parts.includes("D"))
                    return true;
                if (direction === Direction.LEFT && parts.includes("L"))
                    return true;
                if (direction === Direction.RIGHT && parts.includes("R"))
                    return true;
                return false;
            };
            if (wallActive(currentMapLayer.wallAt(posAhead)) && !this.canWalkThroughWalls) {
                return;
            }
        }
        for (let i = 0; i < 4; i++) {
            await this.takeStep(direction);
        }
        this.pos.set(oldPos.sum(Direction.toVector(direction)));
        this.evtHandler.dispatchEvent('walking done');
    }
}
