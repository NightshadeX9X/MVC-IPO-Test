import Vector from "../Vector.js";
import GameMapLayer from "../roam_state/GameMapLayer.js";
export class GrassLayer extends GameMapLayer {
    constructor(gameMap) {
        super(gameMap);
        this.images = new Map();
        this.zIndex = 0;
        this.data = this.getData();
        console.log("new grasslayer");
    }
    async preload(loader) {
        const promises = [
            loader.loadImage(`/assets/images/map_objects/grass.png`)
        ];
        const [regular] = await Promise.all(promises);
        this.images.set('regular', regular);
    }
    getData() {
        if (!this.gameMap.json?.layers?.grass)
            return [];
        const toReturn = [];
        const grassData = this.gameMap.json.layers.grass;
        const mapSize = Vector.fromString(this.gameMap.json.sizeInTiles);
        for (let y = 0; y < mapSize.y; y++) {
            if (!Array.isArray(toReturn[y]))
                toReturn[y] = [];
            for (let x = 0; x < mapSize.x; x++) {
                toReturn[y][x] = null;
            }
        }
        if (!grassData)
            return toReturn;
        grassData.forEach(wd => {
            if (!wd)
                return;
            wd.value.image ||= "regular";
            const [pos1, pos2] = wd.range.split("-").map(p => Vector.fromString(p));
            for (let y = pos1.y; y <= pos2.y; y++) {
                for (let x = pos1.x; x <= pos2.x; x++) {
                    toReturn[y][x] = wd.value;
                }
            }
        });
        return toReturn;
    }
    init() {
    }
    update(input) {
    }
    render(camera) {
        this.data.forEach((row, y) => {
            if (!row)
                return;
            row.forEach((tile, x) => {
                if (!tile?.image)
                    return;
                const coords = camera.convertCoords(new Vector(x, y).prod(this.gameMap.roamState.tileSize));
                if (tile.image !== "transparent") {
                    const image = this.images.get(tile.image);
                    if (!image)
                        return;
                    camera.ctx.drawImage(image, coords.x, coords.y, this.gameMap.roamState.tileSize.x, this.gameMap.roamState.tileSize.y);
                }
            });
        });
    }
}
