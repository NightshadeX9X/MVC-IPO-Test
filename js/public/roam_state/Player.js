var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Updatable } from "../core/Attributes.js";
import Vector from "../util/Vector.js";
import Walker from "./Walker.js";
import Direction from "../util/Direction.js";
import Events from "../util/Events.js";
import { Parents } from "../util/functions.js";
var Player = /** @class */ (function () {
    function Player(roamState) {
        var _this = this;
        this.roamState = roamState;
        this.lastInteraction = 0;
        this.evtHandler = new Events.Handler();
        this.canInteract = true;
        Walker.call(this, roamState, new Vector(), 'player');
        Updatable.call(this);
        this.evtHandler.addEventListener('walk', function (oldPos, newPos, direction) {
            var gameObjects = _this.roamState.gameObjects.filter(function (go) { return go.getCoveredSquares().find(function (v) { return v.equals(newPos); }); });
            gameObjects.forEach(function (gameObject) {
                gameObject.evtHandler.dispatchEvent('playertouch');
            });
        });
        this.pos = new Vector(4, 20);
    }
    Player.prototype.update = function (input) {
        for (var key in input.directionKeyStates) {
            var dirStr = key;
            if (input.directionKeyStates[dirStr]) {
                this.walk(Direction[dirStr]);
                break;
            }
        }
        if (this.walking) {
            for (var key in input.directionKeyStates) {
                var dirStr = key;
                if (input.directionKeyStates[dirStr]) {
                    break;
                }
            }
        }
        if (this.lastInteraction > 20 && !this.walking && input.interactionKey && this.canInteract) {
            this.lastInteraction = 0;
            var ahead_1 = this.getPosAhead();
            var gameObject = this.roamState.gameObjects.find(function (go) { return go.pos.equals(ahead_1); });
            if (gameObject) {
                gameObject.evtHandler.dispatchEvent('interact', gameObject);
            }
        }
        this.lastInteraction++;
    };
    Player = __decorate([
        Parents(Walker, Updatable)
    ], Player);
    return Player;
}());
export default Player;
