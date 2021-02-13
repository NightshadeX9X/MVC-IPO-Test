import GameMapLayer from "./GameMapLayer.js";
export default class GameMap {
    constructor(roamState, name) {
        this.roamState = roamState;
        this.name = name;
        this.layers = [
            new GameMapLayer(this, '0', 0),
        ];
    }
    async preload(loader) {
        await Promise.all(this.layers.map(layer => layer.preload(loader)));
    }
}
