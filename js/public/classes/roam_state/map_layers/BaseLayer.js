import GameMapLayer from "../GameMapLayer.js";
import Vector from "../../Vector.js";
export class BaseLayer extends GameMapLayer {
    constructor(gameMap) {
        super(gameMap);
        this.gameMap = gameMap;
        this.zIndex = -2;
        this.data = this.getData();
    }
    getData() {
        let data = [];
        for (let y = 0; y <= this.gameMap.size.y; y++) {
            if (!data[y])
                data[y] = [];
            for (let x = 0; x <= this.gameMap.size.x; x++) {
                data[y][x] = true;
            }
        }
        return data;
    }
    async preload(loader) {
        const promises = [
            loader.loadImage(`/assets/images/maps/${this.gameMap.name}.png`)
        ];
        const [image] = await Promise.all(promises);
        this.gameMap.image = image;
    }
    init() {
    }
    update(input) {
    }
    render(camera) {
        if (!this.gameMap.image)
            return;
        this.ctx.drawImage(this.gameMap.image, 0, 0);
        const coords = camera.convertCoords(new Vector);
        camera.ctx.drawImage(this.cnv, coords.x, coords.y);
    }
}
