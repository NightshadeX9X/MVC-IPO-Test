import Vector from "./Vector.js";
export class GameMap {
    constructor(roamState, jsonFileUrl) {
        this.roamState = roamState;
        this.jsonFileUrl = jsonFileUrl;
        this.data = null;
        this.image = null;
    }
    static purifyRawData(rawData) {
        let rd = rawData;
        rd.sizeInTiles = Vector.from(rd.sizeInTiles);
        rd.tileDataGeneratorArgs.overrides.forEach(o => {
            o.pos1 = Vector.from(o.pos1);
            o.pos2 = Vector.from(o.pos2);
        });
        return rd;
    }
    async preload(loader) {
        const json = await loader.loadJSON(this.jsonFileUrl);
        this.data = GameMap.purifyRawData(json);
        const imgUrl = json.imageUrl;
        const img = await loader.loadImage(imgUrl);
        this.image = img;
    }
    init() {
        throw new Error("Method not implemented.");
    }
    update(controller) {
        throw new Error("Method not implemented.");
    }
    render(ctx) {
        if (!this.image || !this.data)
            return;
        this.roamState.player.camera.drawImage(this.image, new Vector(), this.data.sizeInTiles);
    }
}
