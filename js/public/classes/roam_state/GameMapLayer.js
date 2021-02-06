import { cloneObject } from "../../Util.js";
import Vector from "../Vector.js";
export default class GameMapLayer {
    constructor(gameMap, imageUrl, zIndex) {
        this.gameMap = gameMap;
        this.imageUrl = imageUrl;
        this.zIndex = zIndex;
        this.image = null;
        this.parts = [];
    }
    partsAt(x, y) {
        return this.parts?.[y]?.[x] || [];
    }
    initParts() {
        const layer = this.gameMap.json?.layers.find(l => l.zIndex === this.zIndex);
        if (!layer?.parts)
            return;
        const data = [];
        for (let y = 0; y < this.gameMap.size.y; y++) {
            if (!Array.isArray(data[y]))
                data[y] = [];
            for (let x = 0; x < this.gameMap.size.x; x++) {
                if (!Array.isArray(data[y][x]))
                    data[y][x] = [];
            }
        }
        layer.parts.forEach(_part => {
            const part = cloneObject(_part);
            const [vec1, vec2] = part.range.split("-").map(Vector.fromString);
            for (let y = vec1.y; y <= vec2.y; y++) {
                for (let x = vec1.x; x <= vec2.x; x++) {
                    // @ts-expect-error
                    delete part.range;
                    data[y][x].push(part);
                }
            }
        });
        this.parts = data;
    }
    init() {
        this.initParts();
    }
    async preload(loader) {
        this.image = await loader.loadImage(this.imageUrl);
    }
    render(camera) {
        if (!this.image)
            return;
        const coords = camera.convertCoords(new Vector);
        camera.ctx.drawImage(this.image, coords.x, coords.y);
    }
}
