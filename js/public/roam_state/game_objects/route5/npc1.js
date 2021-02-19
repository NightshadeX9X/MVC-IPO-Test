import BlankState from "../../../states/BlankState.js";
import DelayState from "../../../states/DelayState.js";
import Direction from "../../../util/Direction.js";
import Vector from "../../../util/Vector.js";
import NPC from "../../game_object_types/NPC.js";
export default class npc1 extends NPC {
    constructor(roamState) {
        super(roamState);
        this.pos = new Vector(7, 25);
        this.active = true;
        this.pos = new Vector(7, 25);
        this.variables.set('count', 0);
    }
    async preload(loader) {
        await NPC.prototype.preload.call(this, loader);
        this.init();
    }
    async init() {
        const bs = new BlankState(this.roamState.stateStack);
        bs.toUpdate = true;
        bs.blocking = false;
        bs.link(this.roamState);
        await this.roamState.stateStack.push(bs);
        while (this.active) {
            const dir = Direction.getRandom();
            await this.walk(dir, bs.subStateStack);
            await DelayState.create(bs.subStateStack, 60);
            console.log(this.roamState.stateStack);
        }
        this.roamState.stateStack.pop();
    }
    async onInteraction() {
    }
}
