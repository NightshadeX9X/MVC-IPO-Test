import Vector from "../../Vector.js";
import GameMapLayer from "../GameMapLayer.js";
export class PortalLayer extends GameMapLayer {
    constructor(gameMap) {
        super(gameMap);
        this.gameMap = gameMap;
        this.zIndex = -3;
        this.data = this.getData();
    }
    getData() {
        if (!this.gameMap.json?.layers?.portals)
            return [];
        const toReturn = [];
        const portalData = this.gameMap.json.layers.portals;
        const mapSize = Vector.fromString(this.gameMap.json.sizeInTiles);
        for (let y = 0; y <= mapSize.y; y++) {
            if (!Array.isArray(toReturn[y]))
                toReturn[y] = [];
            for (let x = 0; x <= mapSize.x; x++) {
                toReturn[y][x] = null;
            }
        }
        if (!portalData)
            return toReturn;
        portalData.forEach(pd => {
            const [pos1, pos2] = pd.range.split("-").map(p => Vector.fromString(p));
            for (let y = pos1.y; y <= pos2.y; y++) {
                for (let x = pos1.x; x <= pos2.x; x++) {
                    toReturn[y][x] = pd.value;
                }
            }
        });
        console.log(toReturn);
        return toReturn;
    }
    async preload() {
    }
    init() {
    }
    update(input) {
    }
    render(camera) {
    }
}
