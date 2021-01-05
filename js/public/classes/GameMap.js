/**
GameMaps will have an imgUrl, width, height, tileData, and interactable. An interactable is an interface that a player can interact with, like a note on a table.

Interactables will have activation points, from where they can be activated. An activation point includes an pos Vector and directions that the player must face to activate the Interactables. Interactables will also have the text that will be displayed upon interaction.
*/
export default class GameMap {
    constructor(roamState, name, imgUrl, sizeInTiles, tileSizeInPx, tileData, tileDataMappings = { "0": { type: 'empty' }, "1": { type: "wall" }, "2": { type: "grass" } }) {
        this.roamState = roamState;
        this.name = name;
        this.imgUrl = imgUrl;
        this.sizeInTiles = sizeInTiles;
        this.tileSizeInPx = tileSizeInPx;
        this.tileData = tileData;
        this.tileDataMappings = tileDataMappings;
        this.img = undefined;
        this.tileDataMapped = [];
        this.tileDataMapped = tileData.map(row => row.map(val => tileDataMappings[val]));
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
        const cameraSize = this.roamState.player.cameraSize;
        const cameraPos = this.roamState.player.pos.multiply(16);
        // console.log(cameraSize, cameraPos)
        renderer.ctx.drawImage(this.img, cameraPos.x - cameraSize.x / 2, cameraPos.y - cameraSize.y / 2, cameraSize.x, cameraSize.y, 0, 0, cameraSize.x, cameraSize.y);
    }
}
