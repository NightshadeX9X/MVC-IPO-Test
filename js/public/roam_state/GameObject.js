import Events from "../util/Events.js";
import Vector from "../util/Vector.js";
import NPC_Type from "./game_object_types/NPC.js";
class GameObject {
    constructor(roamState) {
        this.roamState = roamState;
        this.pos = new Vector;
        this.size = new Vector(1);
        this.passable = true;
        this.evtHandler = new Events.Handler();
    }
    async preload(loader) {
    }
    update(input) {
    }
    render() {
    }
    get coveredSquares() {
        return this.pos.rangeTo(this.pos.sum(this.size));
    }
}
(function (GameObject) {
    let Types;
    (function (Types) {
        Types.NPC = NPC_Type;
    })(Types = GameObject.Types || (GameObject.Types = {}));
})(GameObject || (GameObject = {}));
export default GameObject;
