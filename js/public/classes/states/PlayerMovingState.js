import { Direction, directionToVector } from "../../Util.js";
import State from "../State.js";
import Vector from "../Vector.js";
import WildBattleState from "./WildBattleState.js";
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
        this.roamState.toUpdate = true;
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
        let wd = this.roamState.gameMap.wallData;
        if (wd && this.roamState.gameMap.json) {
            if (wd[this.targetCoords.y]?.[this.targetCoords.x] === true ||
                this.targetCoords.x < 0 ||
                this.targetCoords.x >= this.roamState.gameMap.json.sizeInTiles.x ||
                this.targetCoords.y < 0 ||
                this.targetCoords.y >= this.roamState.gameMap.json.sizeInTiles.y) {
                this.stateStack.pop();
                return;
            }
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
            (async () => {
                this.roamState.player.pos = this.targetCoords;
                if (this.roamState.gameMap.portalData) {
                    const portalTo = this.roamState.gameMap.portalData?.[this.targetCoords.y]?.[this.targetCoords.x];
                    if (portalTo) {
                        this.roamState.gameMap.name = portalTo.map;
                        this.roamState.gameMap.load(this.stateStack.loader);
                        this.roamState.player.pos = portalTo.pos;
                    }
                }
                let toPushWildBattle = false;
                if (this.roamState.gameMap.grassData) {
                    const grassTo = this.roamState.gameMap.grassData?.[this.targetCoords.y]?.[this.targetCoords.x];
                    if (grassTo) {
                        console.log("in grass");
                        toPushWildBattle = true;
                    }
                }
                // console.log(this.roamState.player.pos)
                this.roamState.toUpdate = null;
                this.stateStack.pop();
                if (toPushWildBattle) {
                    this.stateStack.pop();
                    this.stateStack.push(new WildBattleState(this.stateStack, "meadow"));
                }
            })();
        }
        this.frames++;
    }
    render(ctx) {
    }
}
