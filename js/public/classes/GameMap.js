import Vector from "./Vector.js";
export default class GameMap {
    constructor(name, roamState) {
        this.name = name;
        this.roamState = roamState;
        this.toUpdate = true;
        this.toRender = true;
        this.toPreload = true;
        this.json = null;
        this.image = null;
    }
    async preload(loader) {
        await this.load(loader);
    }
    async load(loader) {
        const promises = [
            loader.loadJSON(`/json/maps/${this.name}.json`),
            loader.loadImage(`/assets/images/maps/${this.name}.png`)
        ];
        const [raw, image] = await Promise.all(promises);
        this.json = pure;
        this.image = image;
    }
    init() {
        // console.table(this.collisionDataStr)
        // console.log(this.json?.tileDataGenerator.overrides)
    }
    update(input) {
    }
    render(ctx) {
        if (!this.image)
            return;
        const pos = this.roamState.player.camera.convertCoords(new Vector());
        this.roamState.player.camera.ctx.drawImage(this.image, pos.x, pos.y);
        /* this.collisionData?.forEach((cd, y) => {
            cd.forEach((val, x) => {
                if (val?.type === "wall") {
                    ctx.fillRect(x * 16, y * 16, 16, 16)
                }
            })
        }); */
    }
    get sizeInPx() {
        return (this.json?.sizeInTiles || new Vector).prod(this.roamState.tileSize);
    }
}
