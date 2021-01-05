import Player from "../Player.js";
import Vector from "../Vector.js";
import State from "./State.js";
export default class RoamState extends State {
    constructor() {
        super();
        this.gameMapName = "test";
        this.INITIAL_PLAYER_POS = new Vector(50, 50);
        this.player = new Player(this, this.INITIAL_PLAYER_POS, new Vector(30, 20));
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
        map.load();
    }
    update() {
        this.player.update();
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
/*
GameMaps will have an imgUrl, width, height, tileData, and interactable. An interactable is an interface that a player can interact with, like a note on a table.

Interactables will have activation points, from where they can be activated. An activation point includes an pos Vector and directions that the player must face to activate the Interactables. Interactables will also have the text that will be displayed upon interaction.
*/
export class GameMap {
    constructor(name, imgUrl, sizeInTiles, tileSizeInPx = 16) {
        this.name = name;
        this.imgUrl = imgUrl;
        this.sizeInTiles = sizeInTiles;
        this.tileSizeInPx = tileSizeInPx;
        this.img = undefined;
    }
    async load() {
        return new Promise((res) => {
            const image = new Image();
            image.addEventListener('load', e => {
                this.img = image;
                res(image);
            });
            image.src = this.imgUrl;
        });
    }
    render(renderer) {
        if (!this.img)
            return;
        renderer.ctx.drawImage(this.img, 0, 0);
    }
}
RoamState.gameMaps.set('test', new GameMap('test', '../../../assets/images/maps/test.png', new Vector(40, 25)));
