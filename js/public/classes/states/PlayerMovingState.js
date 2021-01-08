import State from './State.js';
import { directionToVector } from '../../Util.js';
import Vector from '../Vector.js';
import { chance } from '../../Util.js';
export default class PlayerMovingState extends State {
    constructor(stateStack, player, tilesToMovePlayer = 1) {
        super(stateStack);
        this.stateStack = stateStack;
        this.player = player;
        this.tilesToMovePlayer = tilesToMovePlayer;
        this.timesUpdated = 0;
        this.toMove = true;
        this.originalPos = new Vector(player.pos.x, player.pos.y);
        this.preload();
    }
    async preload() {
    }
    update(input) {
        if (!this.player.roamState.currentMap?.tileDataMapped)
            return;
        const inFront = directionToVector(this.player.facing).multiply(this.player.speed);
        const headedToTilePos = this.player.pos.add(inFront);
        const headedToRow = this.player.roamState.currentMap.tileDataMapped[headedToTilePos.y];
        const headedToTile = headedToRow?.[headedToTilePos.x];
        if (headedToTile?.type === "wall" || headedToTilePos.x <= -1 || headedToTilePos.y <= -1 || headedToTilePos.x > 40 || headedToTilePos.y > 25) {
            this.toMove = false;
            this.stateStack.pop();
            return;
        }
        if (!this.toMove)
            return;
        const fraction = this.tilesToMovePlayer / (this.player.roamState.currentMap?.tileSizeInPx || 16);
        if (this.timesUpdated < 15) {
            this.player.pos = this.player.pos.add(directionToVector(this.player.facing).multiply(fraction).multiply(this.player.speed));
        }
        else {
            this.player.pos = this.originalPos.add(directionToVector(this.player.facing).multiply(this.player.speed)).round();
            this.timesUpdated = 0;
            if (headedToTile?.type !== "portal")
                this.stateStack.pop();
        }
        if (this.timesUpdated === 0) {
            this.player.spriteSheetCords.x = 0;
        }
        else if (this.timesUpdated === 4) {
            this.player.spriteSheetCords.x = 1;
        }
        else if (this.timesUpdated === 8) {
            this.player.spriteSheetCords.x = 2;
        }
        else if (this.timesUpdated === 12) {
            this.player.spriteSheetCords.x = 3;
        }
        if (headedToTile?.type === "grass") {
            console.log("in grass");
            if (chance(1, 10)) {
                console.log("WILD ENCOUNTER!!");
            }
        }
        if (headedToTile?.type === "portal") {
            (async () => {
                this.player.roamState.gameMapName = headedToTile.to.mapName;
                await this.player.roamState.loadCurrentMap();
                this.player.pos = headedToTile.to.pos;
                if (headedToTile.to.direction) {
                    this.player.facing = headedToTile.to.direction;
                }
            })();
        }
        this.timesUpdated++;
    }
    render(renderer) {
    }
}
