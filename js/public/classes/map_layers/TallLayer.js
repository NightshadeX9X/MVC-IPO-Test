// For tiles that are "high up" like top of buildings etc. These should appear above the player but slightly transparent.
import GameMapLayer from "../roam_state/GameMapLayer.js";
import Vector from "../Vector.js";
export class TallLayer extends GameMapLayer {
    constructor(gameMap) {
        super(gameMap);
        this.gameMap = gameMap;
        this.zIndex = 32;
        this.preloaded = false;
        this.data = this.getData();
        this.renderedFrames = 0;
    }
    getData() {
        if (!this.gameMap.json?.layers?.tall)
            return [];
        const toReturn = [];
        const tallData = this.gameMap.json.layers.tall;
        const mapSize = Vector.fromString(this.gameMap.json.sizeInTiles);
        for (let y = 0; y <= mapSize.y; y++) {
            if (!Array.isArray(toReturn[y]))
                toReturn[y] = [];
            for (let x = 0; x <= mapSize.x; x++) {
                toReturn[y][x] = false;
            }
        }
        if (!tallData)
            return toReturn;
        tallData.forEach(td => {
            const [pos1, pos2] = td.range.split("-").map(p => Vector.fromString(p));
            for (let y = pos1.y; y <= pos2.y; y++) {
                for (let x = pos1.x; x <= pos2.x; x++) {
                    toReturn[y][x] = td.value;
                }
            }
        });
        return toReturn;
    }
    async preload(loader) {
        this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height);
        this.preloaded = true;
    }
    init() {
    }
    update(input) {
    }
    render(camera) {
        if (!this.preloaded)
            return;
        if (this.renderedFrames === 0) {
            this.takeFromBase();
        }
        this.renderedFrames++;
        const coords = camera.convertCoords(new Vector);
        camera.ctx.globalAlpha = 0.7;
        camera.ctx.drawImage(this.cnv, coords.x, coords.y);
        camera.ctx.globalAlpha = 1;
    }
    takeFromBase() {
        const base = this.gameMap.layers.get('base');
        if (!base)
            return;
        this.data.forEach((row, y) => {
            if (!row)
                return;
            row.forEach((tall, x) => {
                if (!tall)
                    return;
                this.ctx.drawImage(base.cnv, x * 16, y * 16, 16, 16, x * 16, y * 16, 16, 16);
            });
        });
    }
}
