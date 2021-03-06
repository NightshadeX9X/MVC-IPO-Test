var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Preloadable, Renderable, Updatable } from "../core/Attributes.js";
import Events from "../util/Events.js";
import { Parents } from "../util/functions.js";
import UIDGen from "../util/UIDGen.js";
import Vector from "../util/Vector.js";
var GameObject = /** @class */ (function () {
    function GameObject(roamState) {
        this.roamState = roamState;
        this.evtHandler = new Events.Handler();
        this.variables = new Map();
        this.pos = new Vector();
        this.zIndex = 1;
        this.size = new Vector(1);
        this.canBeWalkedThrough = false;
        this.id = GameObject_1.IDGen.generate();
        Preloadable.call(this);
        Updatable.call(this);
        Renderable.call(this);
        this.initEvtListeners();
    }
    GameObject_1 = GameObject;
    GameObject.prototype.initEvtListeners = function () {
        var _this = this;
        this.evtHandler.addEventListener('interact', function () {
            _this.onInteract();
        });
        this.evtHandler.addEventListener('playertouch', function () {
            _this.onPlayerTouch();
        });
        this.roamState.player.evtHandler.addEventListener('mapenter', function () {
            _this.onMapEnter();
        });
    };
    GameObject.prototype.onInteract = function () { };
    GameObject.prototype.onPlayerTouch = function () { };
    GameObject.prototype.onMapEnter = function () { };
    GameObject.prototype.update = function (input) { };
    GameObject.prototype.render = function (ctx) { };
    GameObject.prototype.getCoveredSquares = function () {
        return this.pos.rangeTo(this.pos.sum(this.size));
    };
    var GameObject_1;
    GameObject.IDGen = new UIDGen("GameObject");
    GameObject = GameObject_1 = __decorate([
        Parents(Preloadable, Updatable, Renderable)
    ], GameObject);
    return GameObject;
}());
export default GameObject;
