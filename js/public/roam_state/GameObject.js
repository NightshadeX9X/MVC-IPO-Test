import Dictionairy from "../util/Dictionairy.js";
import Events from "../util/Events.js";
import Vector from "../util/Vector.js";
class GameObject {
    constructor(roamState) {
        this.roamState = roamState;
        this.pos = new Vector;
        this.size = new Vector(1);
        this.passable = true;
        this.evtHandler = new Events.Handler();
        this.variables = new Dictionairy();
        this.zIndex = 1;
        this.evtHandler.addEventListener('activation', (type) => {
            if (type === GameObject.ActivationMethod.PLAYER_TOUCH)
                this.onPlayerTouch();
            else if (type === GameObject.ActivationMethod.INTERACTION)
                this.onInteraction();
            else if (type === GameObject.ActivationMethod.MAP_ENTER)
                this.onMapEnter();
        });
    }
    onPlayerTouch() {
    }
    onInteraction() {
    }
    onMapEnter() {
    }
    async preload(loader) {
    }
    update(input) {
    }
    render(ctx) {
    }
    get coveredSquares() {
        return this.pos.rangeTo(this.pos.sum(this.size));
    }
}
(function (GameObject) {
    let ActivationMethod;
    (function (ActivationMethod) {
        ActivationMethod[ActivationMethod["INTERACTION"] = 0] = "INTERACTION";
        ActivationMethod[ActivationMethod["PLAYER_TOUCH"] = 1] = "PLAYER_TOUCH";
        ActivationMethod[ActivationMethod["MAP_ENTER"] = 2] = "MAP_ENTER";
    })(ActivationMethod = GameObject.ActivationMethod || (GameObject.ActivationMethod = {}));
})(GameObject || (GameObject = {}));
export default GameObject;
