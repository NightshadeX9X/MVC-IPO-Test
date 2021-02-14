import GameMapLayer from "./GameMapLayer.js";
export default class GameMap {
    constructor(roamState, name) {
        this.roamState = roamState;
        this.name = name;
        this.layers = [
            new GameMapLayer(this, '0', 0),
            new GameMapLayer(this, '1', 1),
            new GameMapLayer(this, '2', 2),
            new GameMapLayer(this, '3', 3),
            new GameMapLayer(this, '4', 4),
        ];
    }
    async preload(loader) {
        await Promise.all(this.layers.map(layer => layer.preload(loader)));
    }
}
