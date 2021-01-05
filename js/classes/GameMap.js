/**
GameMaps will have an imgUrl, width, height, tileData, and interactable. An interactable is an interface that a player can interact with, like a note on a table.

Interactables will have activation points, from where they can be activated. An activation point includes an pos Vector and directions that the player must face to activate the Interactables. Interactables will also have the text that will be displayed upon interaction.
*/
export default class GameMap {
    constructor(name, imgUrl, sizeInTiles, tileSizeInPx = 16) {
        this.name = name;
        this.imgUrl = imgUrl;
        this.sizeInTiles = sizeInTiles;
        this.tileSizeInPx = tileSizeInPx;
        this.img = undefined;
    }
    async preload() {
        return new Promise((res) => {
            const image = new Image();
            image.addEventListener('load', e => {
                this.img = image;
                res(image);
            });
            image.src = this.imgUrl;
        });
    }
    update() {
    }
    render(renderer) {
        if (!this.img)
            return;
        renderer.ctx.drawImage(this.img, 0, 0);
    }
}
