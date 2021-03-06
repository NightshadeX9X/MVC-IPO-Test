var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Direction from "../../../util/Direction.js";
import { Parents } from "../../../util/functions.js";
import GameObject from "../../GameObject.js";
import Walker from "../../Walker.js";
var NPC = /** @class */ (function () {
    function NPC(roamState) {
        var _this = this;
        this.roamState = roamState;
        this.facePlayerOnInteraction = true;
        GameObject.call(this, roamState);
        Walker.call(this, roamState, this.pos, "player");
        this.evtHandler.addEventListener('interact', function () {
            if (_this.facePlayerOnInteraction)
                _this.setDirection(Direction.invert(_this.roamState.player.direction));
        });
        this.evtHandler.addEventListener('walk', function () {
            console.log("walked");
        });
    }
    NPC = __decorate([
        Parents(GameObject, Walker)
    ], NPC);
    return NPC;
}());
export default NPC;
