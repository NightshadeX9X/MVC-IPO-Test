import GameMap from "../GameMap.js";
import Player from "../Player.js";
import Vector from "../Vector.js";
import State from "./State.js";
export default class RoamState extends State {
    constructor(stateStack) {
        super(stateStack);
        this.stateStack = stateStack;
        this.gameMapName = "test";
        this.INITIAL_PLAYER_POS = new Vector(0.5, 1);
        this.player = new Player(this, this.INITIAL_PLAYER_POS, new Vector(1, 2));
    }
    get currentMap() {
        return RoamState.gameMaps.get(this.gameMapName);
    }
    async preload() {
        await this.loadCurrentMap();
    }
    async loadCurrentMap() {
        const map = this.currentMap;
        if (!map)
            return;
        if (map.img)
            return;
        map.preload();
    }
    update(input) {
        this.player.update(input);
    }
    render(renderer) {
        renderer.clear();
        if (this.currentMap) {
            this.currentMap.render(renderer);
        }
        this.player.render(renderer);
    }
}
RoamState.gameMaps = new Map();
RoamState.gameMaps.set('test', new GameMap('test', '../../../assets/images/maps/test.png', new Vector(40, 25)));
