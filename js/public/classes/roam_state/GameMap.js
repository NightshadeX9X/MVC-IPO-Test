import Vector from "../Vector.js";
import GameMapLayer from "./GameMapLayer.js";
export default class GameMap {
    constructor(name, roamState) {
        this.name = name;
        this.roamState = roamState;
        this.toUpdate = true;
        this.toRender = true;
        this.toPreload = true;
        this.json = null;
        this.image = null;
        this.layers = [];
    }
    get size() {
        if (!this.json)
            return new Vector;
        const size = Vector.fromString(this.json.sizeInTiles);
        return size;
    }
    async preload(loader) {
        this.roamState.gameEvents = [];
        await this.loadJSONData(loader);
        this.json?.layers?.forEach(layer => {
            this.layers.push(new GameMapLayer(this, layer.src, layer.zIndex));
        });
        await Promise.all(this.layers.map(l => l.preload(loader)));
    }
    async loadJSONData(loader) {
        const promises = [
            loader.loadJSON(`/json/maps/${this.name}.json`),
        ];
        const [raw] = await Promise.all(promises);
        this.json = raw;
    }
    init() {
        this.layers.forEach(l => l.init());
    }
    update(input) {
    }
    render(ctx) {
    }
    get sizeInPx() {
        return this.size.prod(this.roamState.tileSize);
    }
}
