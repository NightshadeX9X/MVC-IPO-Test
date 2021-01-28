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
    get wallData() {
        if (!this.json)
            return null;
        if (!Array.isArray(this.json.walls))
            return null;
        const arr = [];
        this.json.walls.forEach(wall => {
            const [pos1, pos2] = wall.range;
            for (let y = pos1.y; y <= pos2.y; y++) {
                if (typeof arr[y] === "undefined")
                    arr[y] = [];
                for (let x = pos1.x; x <= pos2.x; x++) {
                    arr[y][x] = wall.value;
                }
            }
        });
        return arr;
    }
    get portalData() {
        if (!this.json)
            return null;
        if (!Array.isArray(this.json.portals))
            return null;
        const arr = [];
        this.json.portals.forEach(portal => {
            const [pos1, pos2] = portal.range;
            for (let y = pos1.y; y <= pos2.y; y++) {
                if (typeof arr[y] === "undefined")
                    arr[y] = [];
                for (let x = pos1.x; x <= pos2.x; x++) {
                    arr[y][x] = portal.to;
                }
            }
        });
        return arr;
    }
    get grassData() {
        if (!this.json)
            return null;
        if (!Array.isArray(this.json.grass))
            return null;
        const arr = [];
        this.json.grass.forEach(grass => {
            const [pos1, pos2] = grass.range;
            for (let y = pos1.y; y <= pos2.y; y++) {
                if (typeof arr[y] === "undefined")
                    arr[y] = [];
                for (let x = pos1.x; x <= pos2.x; x++) {
                    arr[y][x] = grass;
                }
            }
        });
        return arr;
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
        return [pos1, pos2];
    }
    JSONGameMap.strRangeToVec = strRangeToVec;
    function getCoordInMap(str) {
        const arr = str.split(" ");
        const map = arr[0];
        const pos = strToVec(arr[1]);
        return {
            map,
            pos
        };
    }
    JSONGameMap.getCoordInMap = getCoordInMap;
    function purify(raw) {
        let pure = { ...raw };
        pure.sizeInTiles = strToVec(pure.sizeInTiles);
        pure.walls = pure.walls.map((wall) => {
            const [pos1, pos2] = strRangeToVec(wall.range);
            return {
                value: wall.value,
                range: [pos1, pos2]
            };
        });
        pure.portals = pure.portals.map((portal) => {
            const range = strRangeToVec(portal.range);
            const to = getCoordInMap(portal.to);
            return {
                range, to
            };
        });
        pure.grass = pure.grass.map((grass) => {
            const range = strRangeToVec(grass.range);
            return { range, table: grass.table };
        });
        return pure;
    }
    JSONGameMap.purify = purify;
})(JSONGameMap || (JSONGameMap = {}));
