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
        const pure = JSONGameMap.purify(raw);
        this.json = pure;
        this.image = image;
    }
    init() {
    }
    update(input) {
    }
    render(ctx) {
        if (!this.image)
            return;
        ctx.drawImage(this.image, 0, 0);
    }
}
export var JSONGameMap;
(function (JSONGameMap) {
    function strToVec(str) {
        const arr = str.split("x");
        const [x, y] = arr.map(n => Number(n));
        return new Vector(x, y);
    }
    function strRangeToVec(str) {
        const arr = str.split("-");
        const [pos1, pos2] = arr.map(p => strToVec(p));
        return {
            start: pos1,
            end: pos2
        };
    }
    function purify(raw) {
        let pure = { ...raw };
        pure.sizeInTiles = strToVec(pure.sizeInTiles);
        pure.tileDataGenerator.overrides.forEach((o) => {
            const { start, end } = strRangeToVec(o.range);
            return {
                ...o,
                start,
                end
            };
        });
        return pure;
    }
    JSONGameMap.purify = purify;
})(JSONGameMap || (JSONGameMap = {}));
