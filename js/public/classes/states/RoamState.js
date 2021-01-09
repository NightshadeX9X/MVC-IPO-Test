import { generate2DArray } from "../../Util.js";
import GameMap from "../GameMap.js";
import Player from "../Player.js";
import Vector from "../Vector.js";
import State from "./State.js";
import { getSaveData } from '../../SaveData.js';
export default class RoamState extends State {
    constructor(stateStack, loader, gameMapName = getSaveData().currentMap) {
        super(stateStack);
        this.stateStack = stateStack;
        this.loader = loader;
        this.gameMapName = gameMapName;
        this.INITIAL_PLAYER_POS = getSaveData().pos;
        this.player = new Player(this, this.INITIAL_PLAYER_POS, new Vector(1, 2));
    }
    get currentMap() {
        return RoamState.gameMaps.get(this.gameMapName);
    }
    async preload(loader) {
        await this.loadCurrentMap();
        await this.player.preload(loader);
    }
    async loadCurrentMap() {
        console.group("RoamState.prototype.loadCurrentMap");
        const maps = await this.loader.json('/json/maps.json');
        const mapJson = maps.find(m => m.name === this.gameMapName);
        if (!mapJson)
            return;
        const args = mapJson.tileDataGeneratorArgs;
        const map = new GameMap(this, mapJson.name, mapJson.imageUrl, new Vector(mapJson.sizeInTiles.x, mapJson.sizeInTiles.y), mapJson.tileSizeInPx, generate2DArray(args.rows, args.columns, args.defaultString, args.overrides.map(o => ({ value: o.value, pos1: new Vector(o.pos1.x, o.pos1.y), pos2: new Vector(o.pos2.x, o.pos2.y) }))), (args.additionalTileDataMappings || {}));
        if (!map)
            return;
        RoamState.gameMaps.set(this.gameMapName, map);
        if (map.img)
            return;
        await map.preload(this.loader);
        console.groupEnd();
    }
    update(input) {
        this.player.update(input);
    }
    render(renderer) {
        renderer.clear();
        renderer.ctx.save();
        renderer.ctx.fillStyle = "#d7e3ff";
        renderer.ctx.fillRect(0, 0, 640, 400);
        renderer.ctx.restore();
        if (this.currentMap) {
            this.currentMap.render(renderer);
        }
        this.player.render(renderer);
    }
}
RoamState.gameMaps = new Map();
