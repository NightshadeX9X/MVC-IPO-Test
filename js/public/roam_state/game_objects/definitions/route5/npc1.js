import BlankState from "../../../../states/BlankState.js";
import DelayState from "../../../../states/DelayState.js";
import Direction from "../../../../util/Direction.js";
import { Mixin, New } from "../../../../util/functions.js";
import Vector from "../../../../util/Vector.js";
import NPC from "../../types/NPC.js";
class npc1 {
    constructor(...args) {
        return New(npc1, ...args);
    }
    static construct(roamState) {
        NPC.construct.call(this, roamState);
        this.pos = new Vector(7, 20);
        this.variables.set('active', true);
        return this;
    }
    async preload(loader) {
        await NPC.prototype.preload.call(this, loader);
        const top = new BlankState(this.roamState.backgroundProcesses);
        const bs = new BlankState(top.subStateStack);
        bs.preload = async () => {
            while (true) {
                console.log("ehe");
                if (this.variables.get('active')) {
                    const dir = Direction.routeTo(this.roamState.player.pos.diff(this.pos)).find(d => this.canMove(d));
                    await this.walk(dir);
                }
                await DelayState.create(top.subStateStack, 20);
            }
        };
        top.subStateStack.push(bs);
        this.roamState.addBackgroundProcess(top);
    }
    async onInteract() {
        this.variables.set('active', !this.variables.get('active'));
    }
}
Mixin.apply(npc1, [NPC]);
export default npc1;
