import { Direction, generate2DArray } from "../../Util.js";
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
        if (!RoamState.gameMapsSet) {
            RoamState.gameMaps.set('the_square', new GameMap(this, 'the_square', '../../../assets/images/maps/the-square.png', new Vector(40, 25), 16, generate2DArray(25, 40, "0", [
                {
                    pos1: new Vector(0, 0),
                    pos2: new Vector(15, 2),
                    value: "1"
                },
                {
                    pos1: new Vector(0, 3),
                    pos2: new Vector(3, 11),
                    value: "1"
                },
                {
                    pos1: new Vector(5, 4),
                    pos2: new Vector(15, 12),
                    value: "1"
                },
                {
                    pos1: new Vector(6, 3),
                    pos2: new Vector(14, 3),
                    value: "1"
                },
                {
                    pos1: new Vector(0, 16),
                    pos2: new Vector(3, 21),
                    value: "1"
                },
                {
                    pos1: new Vector(24, 0),
                    pos2: new Vector(39, 2),
                    value: "1"
                },
                {
                    pos1: new Vector(31, 3),
                    pos2: new Vector(39, 12),
                    value: "1"
                },
                {
                    pos1: new Vector(18, 12),
                    pos2: new Vector(22, 14),
                    value: "1"
                },
                {
                    pos1: new Vector(19, 11),
                    pos2: new Vector(21, 15),
                    value: "1"
                },
                {
                    pos1: new Vector(0, 13),
                    pos2: new Vector(17, 15),
                    value: "2"
                },
                {
                    pos1: new Vector(21, 17),
                    pos2: new Vector(28, 23),
                    value: "2"
                },
                {
                    pos1: new Vector(23, 15),
                    pos2: new Vector(24, 16),
                    value: "2"
                },
                {
                    pos1: new Vector(29, 17),
                    pos2: new Vector(30, 22),
                    value: "2"
                },
                {
                    pos1: new Vector(31, 17),
                    pos2: new Vector(32, 18),
                    value: "2"
                },
                {
                    pos1: new Vector(25, 8),
                    pos2: new Vector(28, 16),
                    value: "2"
                },
                {
                    pos1: new Vector(0, 24),
                    pos2: new Vector(39, 24),
                    value: "3"
                }
            ]), { ...GameMap.defaultTileDataMappings, "3": { type: 'portal', to: { mapName: 'test', pos: new Vector(10, 11), direction: Direction.UP }, delay: 3000 } }));
            RoamState.gameMaps.set('test', new GameMap(this, 'test', '../../../assets/images/maps/test.png', new Vector(40, 25), 16, generate2DArray(25, 40, "0", [
                {
                    pos1: new Vector(0, 0),
                    pos2: new Vector(0, 5),
                    value: "1"
                },
                {
                    pos1: new Vector(1, 5),
                    pos2: new Vector(5, 5),
                    value: "1"
                },
                {
                    pos1: new Vector(5, 6),
                    pos2: new Vector(5, 12),
                    value: "1"
                },
                {
                    pos1: new Vector(6, 12),
                    pos2: new Vector(10, 12),
                    value: "1"
                },
                {
                    pos1: new Vector(10, 8),
                    pos2: new Vector(10, 11),
                    value: "1"
                },
                {
                    pos1: new Vector(11, 8),
                    pos2: new Vector(16, 8),
                    value: "1"
                },
                {
                    pos1: new Vector(16, 9),
                    pos2: new Vector(16, 17),
                    value: "1"
                },
                {
                    pos1: new Vector(17, 17),
                    pos2: new Vector(22, 17),
                    value: "1"
                },
                {
                    pos1: new Vector(22, 18),
                    pos2: new Vector(28, 18),
                    value: "1"
                },
                {
                    pos1: new Vector(35, 0),
                    pos2: new Vector(35, 14),
                    value: "1"
                },
                {
                    pos1: new Vector(34, 14),
                    pos2: new Vector(34, 18),
                    value: "1"
                },
                {
                    pos1: new Vector(32, 1),
                    pos2: new Vector(33, 2),
                    value: "3"
                }
            ]), { ...GameMap.defaultTileDataMappings, "3": { type: 'portal', to: { mapName: 'test', pos: new Vector(1, 0) } } }));
            RoamState.gameMapsSet = true;
        }
    }
    get currentMap() {
        return RoamState.gameMaps.get(this.gameMapName);
    }
    async preload(loader) {
        await this.loadCurrentMap();
        await this.player.preload(loader);
    }
    async loadCurrentMap() {
        const map = this.currentMap;
        if (!map)
            return;
        if (map.img)
            return;
        map.preload(this.loader);
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
RoamState.gameMapsSet = false;
