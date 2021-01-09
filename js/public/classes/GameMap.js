import Interactable from "./Interactable.js";
import Vector from "./Vector.js";
/**
GameMaps will have an imgUrl, width, height, tileData, and interactable. An interactable is an interface that a player can interact with, like a note on a table.

Interactables will have activation points, from where they can be activated. An activation point includes an pos Vector and directions that the player must face to activate the Interactables. Interactables will also have the text that will be displayed upon interaction.
*/
export default class GameMap {
    constructor(roamState, name, imgUrl, sizeInTiles, tileSizeInPx, tileData, additionaltileDataMappings = {}) {
        this.roamState = roamState;
        this.name = name;
        this.imgUrl = imgUrl;
        this.sizeInTiles = sizeInTiles;
        this.tileSizeInPx = tileSizeInPx;
        this.tileData = tileData;
        this.img = undefined;
        this.interactables = [new Interactable(this, new Vector(20), new Vector(2), '/assets/images/maps/test.png')];
        this.tileDataMapped = [];
        this.tileDataMappings = { ...GameMap.defaultTileDataMappings, ...additionaltileDataMappings };
        this.tileDataMapped = tileData.map(row => row.map(val => this.tileDataMappings[val]));
    }
    get sizeInPixels() {
        return this.sizeInTiles.multiply(this.tileSizeInPx);
    }
    async preload(loader) {
        const image = await loader.image(this.imgUrl);
        this.img = image;
        for (const i of this.interactables) {
            await i.preload(loader);
        }
    }
    update() {
    }
    render(renderer) {
        if (!this.img)
            return;
        /* const cameraSize = this.roamState.player.cameraSize;
        const cameraPos = this.roamState.player.pos.multiply(16);
        const size = this.sizeInTiles.multiply(this.tileSizeInPx);
        // console.log(cameraSize, cameraPos)
        renderer.ctx.drawImage(this.img, 0, 0, size.x, size.y);
        // renderer.ctx.drawImage(this.img, cameraPos.x - cameraSize.x / 2, cameraPos.y - cameraSize.y / 2, cameraSize.x, cameraSize.y, 0, 0, cameraSize.x, cameraSize.y); */
        this.roamState.player.camera.render(renderer).image(this.img, new Vector(), this.sizeInPixels);
        // this.interactables.forEach(i => i.render(renderer))
    }
}
GameMap.defaultTileDataMappings = { "0": { type: 'empty' }, "1": { type: "wall" }, "2": { type: "grass" } };
