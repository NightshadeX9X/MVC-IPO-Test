import { Direction, directionToVector } from "../../Util.js";
import State from "../State.js";
import Vector from "../Vector.js";
export default class PlayerMovingState extends State {
    constructor(stateStack, roamState, direction) {
        super(stateStack);
        this.stateStack = stateStack;
        this.roamState = roamState;
        this.direction = direction;
        this.frames = 0;
        this.playerOriginalPos = new Vector();
    }
    async preload(loader) {
    }
    init() {
        this.playerOriginalPos = Vector.from(this.roamState.player.pos);
        if (this.roamState.player.spritesheet) {
            if (this.direction === Direction.DOWN)
                this.roamState.player.spritesheet.coords.y = 0;
            else if (this.direction === Direction.LEFT)
                this.roamState.player.spritesheet.coords.y = 1;
            else if (this.direction === Direction.RIGHT)
                this.roamState.player.spritesheet.coords.y = 2;
            else if (this.direction === Direction.UP)
                this.roamState.player.spritesheet.coords.y = 3;
        }
    }
    get vec() {
        return directionToVector(this.direction).quo(this.roamState.tileSize);
    }
    get targetCoords() {
        return this.playerOriginalPos.sum(directionToVector(this.direction));
    }
    update(input) {
        const spritesheet = this.roamState.player.spritesheet;
        if (this.frames < 16) {
            if (spritesheet && this.frames % 4 === 0) {
                spritesheet.coords.x = (spritesheet.coords.x + 1) % (spritesheet.spriteCount.x * spritesheet.size.x);
            }
            this.roamState.player.spritesheet?.coords;
            this.roamState.player.pos.add(this.vec);
        }
        else {
            this.roamState.player.pos = this.targetCoords;
            console.log(this.roamState.player.pos);
            this.stateStack.pop();
            return;
        }
        this.frames++;
    }
    render(ctx) {
    }
}
