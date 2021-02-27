import { Preloadable, Renderable } from "../core/Attributes.js";
import BlankState from "../states/BlankState.js";
import DelayState from "../states/DelayState.js";
import Direction from "../util/Direction.js";
import { Mixin, New } from "../util/functions.js";
import Spritesheet from "../util/Spritesheet.js";
import Vector from "../util/Vector.js";
class Walker {
    constructor(...args) {
        return New(Walker, ...args);
    }
    static construct(roamState, pos, imageUrl) {
        Preloadable.construct.call(this);
        Renderable.construct.call(this);
        this.pos = pos;
        this.walkingToward = null;
        this.imageUrl = imageUrl;
        this.roamState = roamState;
        this.direction = Direction.DOWN;
        this.walking = false;
        this.zIndex = 1;
        this.SIGNATURE = 'walker';
        return this;
    }
    async preload(loader) {
        this.image = await loader.loadImage(`/assets/images/characters/${this.imageUrl}.png`);
        this.spritesheet = new Spritesheet(this.image);
    }
    render(ctx) {
        if (!this.image || !this.spritesheet)
            return;
        this.roamState.camera.ctx.save();
        const coords = this.roamState.camera.convertCoords(this.pos.diff(0, 1).prod(this.roamState.tileSize));
        this.roamState.camera.ctx.translate(coords.x, coords.y);
        this.spritesheet.render(this.roamState.camera.ctx);
        this.roamState.camera.ctx.restore();
    }
    async takeStep(dir, bgp) {
        const increment = () => {
            this.pos.add(Direction.toVector(dir).quo(16));
        };
        this.spritesheet.coords.x++;
        this.spritesheet.coords.x %= 4;
        for (let i = 0; i < 4; i++) {
            increment();
            const ds = new DelayState(bgp.subStateStack, 1);
            await bgp.subStateStack.push(ds);
            await ds.waitForRemoval();
        }
    }
    canMove(dir) {
        if (this.walking)
            return false;
        const layer = this.walkingOnMapLayer();
        const ahead = this.getPosAhead(dir);
        const walkable = (value) => {
            if (typeof value === "boolean")
                return value;
            const parts = value.split("").map(s => s.toUpperCase());
            console.log(parts, Direction[this.direction][0]);
            if (parts.includes(Direction[Direction.invert(this.direction)][0]))
                return true;
            return false;
        };
        if (layer) {
            if (layer.partAt(ahead, (p) => p.type === "wall" && walkable(p.value))) {
                console.log("into wall");
                return false;
            }
            ;
        }
        if (ahead.x < 0 || ahead.y < 0 || ahead.x >= this.roamState.gameMap.size.x || ahead.y >= this.roamState.gameMap.size.y) {
            console.log("into outside map bounds");
            return false;
        }
        if (this.roamState.gameObjects.filter(go => !go.canBeWalkedThrough).find(go => go.getCoveredSquares().find(v => v.equals(ahead)))) {
            console.log("into game object");
            return false;
        }
        const walkers = this.allButThis();
        if (walkers.find((w) => w.walkingToward?.equals(ahead) || w.pos.equals(ahead))) {
            console.log("into walker");
            return false;
        }
        ;
        return true;
    }
    getPosAhead(dir = this.direction) {
        return this.pos.sum(Direction.toVector(dir));
    }
    all() {
        return [this.roamState.player, ...this.roamState.gameObjects.filter(x => x?.SIGNATURE === 'walker')];
    }
    allButThis() {
        return this.all().filter(w => w !== this);
    }
    async walk(dir = this.direction) {
        if (!this.walking)
            this.setDirection(dir);
        if (!this.canMove(dir))
            return;
        this.walking = true;
        this.walkingToward = this.pos.sum(Direction.toVector(dir));
        const originalPos = Vector.from(this.pos);
        const bgp = new BlankState(this.roamState.backgroundProcesses);
        await this.roamState.addBackgroundProcess(bgp);
        for (let i = 0; i < 4; i++) {
            await this.takeStep(dir, bgp);
        }
        this.pos.set(this.walkingToward);
        this.walking = false;
        this.evtHandler.dispatchEvent('walk', originalPos, this.walkingToward, this.direction);
        bgp.remove();
    }
    setDirection(direction) {
        this.direction = direction;
        if (direction === Direction.DOWN)
            this.spritesheet.coords.y = 0;
        if (direction === Direction.LEFT)
            this.spritesheet.coords.y = 1;
        if (direction === Direction.RIGHT)
            this.spritesheet.coords.y = 2;
        if (direction === Direction.UP)
            this.spritesheet.coords.y = 3;
    }
    async completeWalk() {
        if (!this.walking)
            return;
        return new Promise((res, rej) => {
            this.evtHandler.addEventListener('walk', () => {
                res();
            });
        });
    }
    walkingOnMapLayer() {
        return this.roamState?.gameMap.layers.find(layer => layer.zIndex === (this.zIndex - 1));
    }
}
Mixin.apply(Walker, [Preloadable, Renderable]);
export default Walker;
