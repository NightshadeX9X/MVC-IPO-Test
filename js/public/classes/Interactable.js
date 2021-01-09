export default class Interactable {
    constructor(gameMap, pos, size, imgUrl) {
        this.gameMap = gameMap;
        this.pos = pos;
        this.size = size;
        this.imgUrl = imgUrl;
        this.image = null;
        this.onInteraction = [];
    }
    async preload(loader) {
        this.image = await loader.image(this.imgUrl);
        console.log(this.image);
    }
    update(input) {
        throw new Error("Method not implemented.");
    }
    render(renderer) {
        if (this.image) {
            const pos = this.pos.subtract(this.size.divide(2)).multiply(this.gameMap.tileSizeInPx);
            const size = this.size.multiply(this.gameMap.tileSizeInPx);
            renderer.ctx.drawImage(this.image, pos.x, pos.y, size.x, size.y);
        }
    }
}
