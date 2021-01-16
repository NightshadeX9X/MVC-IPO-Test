import Vector from "./Vector.js";
import { generate2DArray } from '../Util.js';
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
    get collisionDataStr() {
        if (!this.json)
            return null;
        const strData = generate2DArray(this.json.sizeInTiles.y, this.json.sizeInTiles.x, this.json.tileDataGenerator.defaultString, this.json.tileDataGenerator.overrides.map(x => ({ pos1: x.start, pos2: x.end, value: x.value })));
        return strData;
    }
    get collisionData() {
        const collisionDataStr = this.collisionDataStr;
        if (!collisionDataStr)
            return null;
        return collisionDataStr.map(row => {
            return row.map(str => {
                if (!this.json)
                    return null;
                for (let i in this.json.tileDataGenerator.overrideMappings) {
                    if (i === str) {
                        return this.json.tileDataGenerator.overrideMappings[i];
                    }
                }
                return null;
            });
        });
    }
}
export var JSONGameMap;
(function (JSONGameMap) {
    function strToVec(str) {
        const arr = str.split("x");
        const [x, y] = arr.map(n => Number(n));
        return new Vector(x, y);
    }
    JSONGameMap.strToVec = strToVec;
    function strRangeToVec(str) {
        const arr = str.split("-");
        const [pos1, pos2] = arr.map(p => strToVec(p));
        return {
            start: pos1,
            end: pos2
        };
    }
    JSONGameMap.strRangeToVec = strRangeToVec;
    function purify(raw) {
        let pure = { ...raw };
        pure.sizeInTiles = strToVec(pure.sizeInTiles);
        pure.tileDataGenerator.overrides = pure.tileDataGenerator.overrides.map((o) => {
            const { start, end } = strRangeToVec(o.range);
            return {
                value: o.value,
                start,
                end
            };
        });
        return pure;
    }
    JSONGameMap.purify = purify;
})(JSONGameMap || (JSONGameMap = {}));
