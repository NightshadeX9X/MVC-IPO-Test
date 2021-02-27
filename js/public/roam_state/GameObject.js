import { Preloadable, Renderable, Updatable } from "../core/Attributes.js";
import Events from "../util/Events.js";
import { Mixin, New } from "../util/functions.js";
import Vector from "../util/Vector.js";
class GameObject {
    constructor(...args) {
        return New(GameObject, ...args);
    }
    static construct(roamState) {
        Preloadable.construct.call(this);
        Updatable.construct.call(this);
        Renderable.construct.call(this);
        this.roamState = roamState;
        this.evtHandler = new Events.Handler();
        this.variables = new Map();
        this.pos = new Vector();
        this.zIndex = 1;
        this.size = new Vector(1);
        this.canBeWalkedThrough = false;
        this.initEvtListeners();
        return this;
    }
    initEvtListeners() {
        this.evtHandler.addEventListener('interact', () => {
            this.onInteract();
        });
        this.evtHandler.addEventListener('playertouch', () => {
            this.onPlayerTouch();
        });
        this.roamState.player.evtHandler.addEventListener('mapenter', () => {
            this.onMapEnter();
        });
    }
    onInteract() { }
    onPlayerTouch() { }
    onMapEnter() { }
    update(input) { }
    render(ctx) { }
    getCoveredSquares() {
        return this.pos.rangeTo(this.pos.sum(this.size));
    }
}
Mixin.apply(GameObject, [Preloadable, Renderable, Updatable]);
export default GameObject;
