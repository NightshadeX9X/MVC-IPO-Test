import DelayState from "../states/DelayState.js";
import Direction from "../util/Direction.js";
import Spritesheet from "../util/Spritesheet.js";
import Vector from "../util/Vector.js";
import BlankState from "../states/BlankState.js";
import Player from "./Player.js";
export default class MWalker {
    constructor() {
        this.pos = null;
        this.roamState = null;
        this.evtHandler = null;
        this.direction = null;
        this.zIndex = null;
        this.imageUrl = null;
        this.canWalkThroughWalls = false;
        this.canWalkThroughMapEdges = false;
        this.image = null;
        this.spritesheet = null;
        this.drawSize = new Vector(1, 2);
        this.destinationWalkPos = Vector.from(this.pos);
    }
    static construct(imageUrl) {
        this.canWalkThroughWalls = false;
        this.canWalkThroughMapEdges = false;
        this.imageUrl = imageUrl;
        this.drawSize = new Vector(1, 2);
        this.image = null;
        this.spritesheet = null;
        this.zIndex = 1;
        this.destinationWalkPos = Vector.from(this.pos);
    }
    async preload(loader) {
        await this.loadImageAndSpritesheet(loader);
    }
    async loadImageAndSpritesheet(loader) {
        this.image = await loader.loadImage(`/assets/images/people/${this.imageUrl}.png`);
        this.spritesheet = new Spritesheet(this.image, this.drawSize.prod(this.roamState.tileSize), new Vector(4));
    }
    async takeStep(direction, stateStack) {
        const vector = Direction.toVector(direction);
        const createDelay = async () => {
            const delay = new DelayState(stateStack, 1);
            stateStack.push(delay);
            await delay.pop();
        };
        if (this.spritesheet) {
            this.spritesheet.pos.x++;
            if (this.spritesheet.pos.x >= 4)
                this.spritesheet.pos.x = 0;
        }
        for (let i = 0; i < 4; i++) {
            this.pos.add(vector.quo(16));
            await createDelay();
        }
    }
    getCurrentMapLayer() {
        return this.roamState.gameMap.layers.find(layer => layer.zIndex === (this.zIndex - 1));
    }
    getPosAhead(direction = this.direction) {
        return this.pos.sum(Direction.toVector(direction));
    }
    async walk(direction = this.direction, topStateStack = this.roamState.stateStack) {
        this.setDirection(direction);
        this.destinationWalkPos = this.getPosAhead();
        if (!this.canWalk(this.getPosAhead()))
            return;
        const container = new BlankState(this.roamState.stateStack);
        container.link(this.roamState);
        await topStateStack.push(container);
        for (let i = 0; i < 4; i++) {
            await this.takeStep(this.direction, container.subStateStack);
        }
        topStateStack.pop();
    }
    canWalk(posAhead) {
        const vec = posAhead.diff(this.pos);
        if (this instanceof Player) {
            if (this.roamState.stateStack.game.cheatMode)
                return true;
        }
        if (!this.canWalkThroughMapEdges) {
            if (posAhead.x < 0 || posAhead.x >= this.roamState.gameMap.size.x ||
                posAhead.y < 0 || posAhead.y >= this.roamState.gameMap.size.y)
                return false;
        }
        const currentMapLayer = this.getCurrentMapLayer();
        if (currentMapLayer) {
            const wallActive = (data) => {
                if (typeof data === "boolean")
                    return data;
                const parts = data.split("").map(s => s.toUpperCase());
                if (this.direction === Direction.UP && parts.includes("U"))
                    return true;
                if (this.direction === Direction.DOWN && parts.includes("D"))
                    return true;
                if (this.direction === Direction.LEFT && parts.includes("L"))
                    return true;
                if (this.direction === Direction.RIGHT && parts.includes("R"))
                    return true;
                return false;
            };
            if (wallActive(currentMapLayer.wallAt(posAhead)) && !this.canWalkThroughWalls) {
                return false;
            }
        }
        if (this.getCoveredSquares().find(v => v.equals(posAhead)))
            return false;
        {
            /* let increments: Vector[] = [];
            for (let i = 0; i <= 16; i++) {
                increments.push(this.pos.sum(vec.quo(16).prod(i)));
            } */
            // @ts-ignore
            const entities = [this.roamState.player, ...this.roamState.gameObjects].filter(e => e !== this).map(e => {
                if (e.destinationWalkPos)
                    return e.destinationWalkPos;
                return e.pos;
            });
            if (entities.some(e => e.equals(this.destinationWalkPos)))
                return false;
        }
        return true;
    }
    getCoveredSquares() {
        const squares = [];
        // @ts-ignore
        [this.roamState.player, ...this.roamState.gameObjects].filter(go => go !== this && go.zIndex === this.zIndex).forEach(go => {
            squares.push(...go.coveredSquares);
        });
        return squares;
    }
    render(ctx) {
        if (this.image && this.spritesheet) {
            this.roamState.camera.ctx.save();
            const coords = this.roamState.camera.convertCoords(this.pos.diff(0, 1).prod(this.roamState.tileSize));
            this.roamState.camera.ctx.translate(coords.x, coords.y);
            this.spritesheet.render(this.roamState.camera.ctx);
            this.roamState.camera.ctx.restore();
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
}
