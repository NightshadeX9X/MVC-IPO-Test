import Vector from "../Vector.js";
import GameMapLayer from "../roam_state/GameMapLayer.js";
export class WallLayer extends GameMapLayer {
    constructor(gameMap) {
        super(gameMap);
        this.gameMap = gameMap;
        this.zIndex = -1;
        this.drawn = [];
    }
    getData() {
        if (!this.gameMap.json?.layers?.walls)
            return [];
        const toReturn = [];
        const wallData = this.gameMap.json.layers.walls;
        const mapSize = Vector.fromString(this.gameMap.json.sizeInTiles);
        for (let y = 0; y <= mapSize.y; y++) {
            if (!Array.isArray(toReturn[y]))
                toReturn[y] = [];
            for (let x = 0; x <= mapSize.x; x++) {
                toReturn[y][x] = false;
            }
        }
        if (!wallData)
            return toReturn;
        wallData.forEach(wd => {
            const [pos1, pos2] = wd.range.split("-").map(p => Vector.fromString(p));
            for (let y = pos1.y; y <= pos2.y; y++) {
                for (let x = pos1.x; x <= pos2.x; x++) {
                    toReturn[y][x] = wd.value;
                }
            }
        });
        return toReturn;
    }
    async preload() {
    }
    init() {
    }
    update(input) {
    }
    render(camera) {
        const data = this.getData();
        const coords = camera.convertCoords(new Vector);
        camera.ctx.drawImage(this.cnv, coords.x, coords.y);
    }
}
