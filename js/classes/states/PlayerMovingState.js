import State from './State.js';
import { Direction } from '../../Util.js';
import Vector from '../Vector.js';
export default class PlayerMovingState extends State {
    constructor(stateStack, player, tilesToMovePlayer = 1) {
        super(stateStack);
        this.stateStack = stateStack;
        this.player = player;
        this.tilesToMovePlayer = tilesToMovePlayer;
        this.timesUpdated = 0;
        this.originalPos = new Vector(player.pos.x, player.pos.y);
    }
    async preload() { }
    update(input) {
        const fraction = this.tilesToMovePlayer / (this.player.roamState.currentMap?.tileSizeInPx || 16);
        if (this.timesUpdated < 15) {
            if (this.player.facing === Direction.LEFT) {
                this.player.pos = this.player.pos.add(new Vector(-fraction, 0).multiply(this.player.speed));
            }
            else if (this.player.facing === Direction.UP) {
                this.player.pos = this.player.pos.add(new Vector(0, -fraction).multiply(this.player.speed));
            }
            else if (this.player.facing === Direction.RIGHT) {
                this.player.pos = this.player.pos.add(new Vector(fraction, 0).multiply(this.player.speed));
            }
            else if (this.player.facing === Direction.DOWN) {
                this.player.pos = this.player.pos.add(new Vector(0, fraction).multiply(this.player.speed));
            }
        }
        else {
            if (this.player.facing === Direction.LEFT) {
                this.player.pos = this.originalPos.add(new Vector(-this.player.speed.x, 0));
            }
            else if (this.player.facing === Direction.UP) {
                this.player.pos = this.originalPos.add(new Vector(0, -this.player.speed.y));
            }
            else if (this.player.facing === Direction.RIGHT) {
                this.player.pos = this.originalPos.add(new Vector(this.player.speed.x, 0));
            }
            else if (this.player.facing === Direction.DOWN) {
                this.player.pos = this.originalPos.add(new Vector(0, this.player.speed.y));
            }
            this.stateStack.pop();
        }
        this.timesUpdated++;
    }
    render(renderer) {
    }
}
