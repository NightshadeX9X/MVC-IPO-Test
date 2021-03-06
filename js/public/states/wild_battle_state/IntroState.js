var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import State from "../../core/State.js";
import { Parents } from "../../util/functions.js";
var IntroState = /** @class */ (function () {
    function IntroState(stateStack) {
        this.pokemonIntroSpeed = 2.15;
        State.call(this, stateStack);
        this.partyHeadDistFromTarget = this.wildBattleState.partyHeadTargetPos.x - this.wildBattleState.partyHeadPos.x;
        this.wildDistFromTarget = this.wildBattleState.wildPos.x - this.wildBattleState.wildTargetPos.x;
    }
    Object.defineProperty(IntroState.prototype, "wildBattleState", {
        get: function () {
            return this.stateStack.parent;
        },
        enumerable: false,
        configurable: true
    });
    IntroState.prototype.update = function (input) {
        if (this.wildBattleState.partyHeadPos.x < this.wildBattleState.partyHeadTargetPos.x) {
            this.wildBattleState.partyHeadPos.add(this.partyHeadDistFromTarget * this.pokemonIntroSpeed / 360, 0);
        }
        if (this.wildBattleState.wildPos.x > this.wildBattleState.wildTargetPos.x) {
            this.wildBattleState.wildPos.sub(this.wildDistFromTarget * this.pokemonIntroSpeed / 360, 0);
        }
        if (this.wildBattleState.partyHeadPos.x >= this.wildBattleState.partyHeadTargetPos.x &&
            this.wildBattleState.wildPos.x <= this.wildBattleState.wildTargetPos.x) {
            // this.remove();
        }
    };
    IntroState = __decorate([
        Parents(State)
    ], IntroState);
    return IntroState;
}());
export default IntroState;
