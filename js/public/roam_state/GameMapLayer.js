export default class GameMapLayer {
    constructor(gameMap, imageName, zIndex) {
        this.gameMap = gameMap;
        this.imageName = imageName;
        this.zIndex = zIndex;
        this.image = null;
    }
    async preload(loader) {
        this.image = await loader.loadImage(`/assets/images/maps/${this.gameMap.name}/${this.imageName}.png`);
    }
    render(ctx) {
        if (!this.image)
            return;
        ctx.drawImage(this.image, 0, 0);
    }
}
