import Vector from "./Vector.js";
import { WallLayer } from './map_layers/WallLayer.js';
import { BaseLayer } from "./map_layers/BaseLayer.js";
import { GrassLayer } from "./map_layers/GrassLayer.js";
import { TallLayer } from "./map_layers/TallLayer.js";
import { PortalLayer } from "./map_layers/PortalLayer.js";
export default class GameMap {
    constructor(name, roamState) {
        this.name = name;
        this.roamState = roamState;
        this.toUpdate = true;
        this.toRender = true;
        this.toPreload = true;
        this.json = null;
        this.image = null;
        this.layers = new Map();
    }
    get size() {
        if (!this.json)
            return new Vector;
        const size = Vector.fromString(this.json.sizeInTiles);
        return size;
    }
    async preload(loader) {
        this.layers.clear();
        for (const entry of this.layers) {
            const [key, layer] = entry;
            layer.ctx.clearRect(0, 0, layer.cnv.width, layer.cnv.height);
        }
        await this.loadJSONData(loader);
        this.setLayers();
        for (const entry of this.layers) {
            const [key, layer] = entry;
            await layer.preload(loader);
        }
    }
    setLayers() {
        this.layers.set('base', new BaseLayer(this));
        this.layers.set('wall', new WallLayer(this));
        this.layers.set('grass', new GrassLayer(this));
        this.layers.set('tall', new TallLayer(this));
        this.layers.set('portal', new PortalLayer(this));
    }
    async loadJSONData(loader) {
        const promises = [
            loader.loadJSON(`/json/maps/${this.name}.json`),
        ];
        const [raw] = await Promise.all(promises);
        this.json = raw;
    }
    init() {
        this.layers.forEach(layer => {
            layer.init();
        });
    }
    update(input) {
    }
    render(ctx) {
    }
    get sizeInPx() {
        return this.size.prod(this.roamState.tileSize);
    }
}
