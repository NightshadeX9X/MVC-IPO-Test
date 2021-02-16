import Vector from '../util/Vector.js';
import { omitKeys } from "../util/functions.js";
export default class GameMapLayer {
    constructor(gameMap, imageName, zIndex) {
        this.gameMap = gameMap;
        this.imageName = imageName;
        this.zIndex = zIndex;
        this.image = null;
        this.pos = new Vector;
        this.parts = this.parseParts() || [];
    }
    async preload(loader) {
        this.image = await loader.loadImage(`/assets/images/maps/${this.gameMap.name}/${this.imageName}.png`);
    }
    render(ctx) {
        if (!this.image)
            return;
        const coords = this.gameMap.roamState.camera.convertCoords(this.pos);
        this.gameMap.roamState.camera.ctx.drawImage(this.image, coords.x, coords.y);
    }
    getParts() {
        const layers = this.gameMap.json?.layers;
        if (!layers)
            return;
        const jsonLayer = layers.find(layer => layer.zIndex === this.zIndex && layer.src === this.imageName);
        if (!jsonLayer)
            return;
        const parts = jsonLayer.parts;
        return parts;
    }
    parseParts() {
        const parts = this.getParts();
        if (!parts)
            return;
        const arr2 = [];
        for (let y = 0; y < this.gameMap.size.y; y++) {
            arr2[y] = [];
            for (let x = 0; x < this.gameMap.size.y; x++) {
                arr2[y][x] = [];
            }
        }
        parts.forEach(part => {
            const rangeRemoved = omitKeys("range", part);
            const [start, end] = Vector.fromStringRange(part.range);
            for (let y = start.y; y <= end.y; y++) {
                for (let x = start.x; x <= end.x; x++) {
                    let el = arr2?.[y]?.[x];
                    if (el) {
                        if (el.find(e => e.override) && !part.override)
                            return;
                        if (part.override)
                            arr2[y][x] = [rangeRemoved];
                        else
                            el.push(rangeRemoved);
                    }
                }
            }
        });
        return arr2;
    }
    partsAt(vec) {
        return this.parts[vec.y]?.[vec.x];
    }
    wallAt(vec) {
        const partsAt = this.partsAt(vec);
        if (!partsAt)
            return false;
        let value = false;
        const found = partsAt.find(p => p.type === "wall");
        if (found)
            value = found.value;
        return value;
    }
}
