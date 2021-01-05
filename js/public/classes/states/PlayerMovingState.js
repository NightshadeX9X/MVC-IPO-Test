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
        // console.log({ x: inFront.x, y: inFront.y })
        if (headedToTile?.type === "wall") {
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
            this.player.pos = this.originalPos.add(directionToVector(this.player.facing).multiply(this.player.speed));
            this.timesUpdated = 0;
            // console.log(this.player.pos)
            this.stateStack.pop();
        }
        if (headedToTile?.type === "grass") {
            console.log("in grass");
            if (chance(1, 10)) {
                console.log("WILD ENCOUNTER!!");
            }
        }
        this.timesUpdated++;
    }
    render(renderer) {
    }
}
