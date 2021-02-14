import Vector from '../util/Vector.js';
export default class GameMapLayer {
    constructor(gameMap, imageName, zIndex) {
        this.gameMap = gameMap;
        this.imageName = imageName;
        this.zIndex = zIndex;
        this.image = null;
        this.pos = new Vector;
    }
    async preload(loader) {
        this.image = await loader.loadImage(`/assets/images/maps/${this.gameMap.name}/${this.imageName}.png`);
    }
    render(ctx) {
        if (!this.image)
            return;
        ctx.drawImage(this.image, this.pos.x, this.pos.y);
    }
}
