import { Mixin, New } from '../util/functions.js';
import { Preloadable, Renderable } from "../core/Attributes.js";
import Vector from "../util/Vector.js";
class GameMapLayer {
    constructor(...args) {
        return New(GameMapLayer, ...args);
    }
    static construct(gameMap, zIndex) {
        Preloadable.construct.call(this);
        Renderable.construct.call(this);
        this.gameMap = gameMap;
        this.zIndex = zIndex;
        this.imageName = `${this.zIndex}`;
        return this;
    }
    getParts() {
        const toReturn = [];
        const json = this.gameMap.json;
        if (!json)
            return;
        const layerData = json.layers.find(layer => layer.zIndex === this.zIndex);
        if (!layerData)
            return;
        const parts = layerData.parts;
        if (!parts)
            return;
        for (let y = 0; y < this.gameMap.size.y; y++) {
            toReturn[y] = [];
            for (let x = 0; x < this.gameMap.size.x; x++) {
                toReturn[y][x] = [];
            }
        }
        parts.forEach(part => {
            const [start, end] = Vector.fromStringRange(part.range);
            for (let y = start.y; y <= end.y; y++) {
                for (let x = start.x; x <= end.x; x++) {
                    const old = Array.from(toReturn[y][x]);
                    const priority = Number(part.priority);
                    toReturn[y][x] = [...old.filter(o => o.priority >= priority), part];
                }
            }
        });
        return toReturn;
    }
    async preload(loader) {
        this.image = await loader.loadImage(`/assets/images/maps/${this.gameMap.name}/${this.imageName}.png`);
        {
            const parts = this.getParts();
            if (parts)
                this.parts = parts;
        }
    }
    render(ctx) {
        const coords = this.gameMap.roamState.camera.convertCoords(new Vector);
        this.gameMap.roamState.camera.ctx.drawImage(this.image, coords.x, coords.y);
    }
    partAt(pos, fn) {
        const parts = this.parts?.[pos.y]?.[pos.x];
        if (!parts)
            return false;
        return parts.some((part) => fn(part));
    }
}
Mixin.apply(GameMapLayer, [Preloadable, Renderable]);
export default GameMapLayer;
