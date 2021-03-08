var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import DelayState from "../states/DelayState.js";
import InputState from "../states/InputState.js";
import TextBoxState from "../states/TextBoxState.js";
import { Parents } from "./functions.js";
var CommandSuite;
(function (CommandSuite) {
    var GameObjects = /** @class */ (function () {
        function GameObjects(go, stateStack) {
            this.go = go;
            if (!stateStack)
                stateStack = this.go.roamState.stateStack;
            this.stateStack = stateStack;
        }
        GameObjects.prototype.showText = function (text) {
            return __awaiter(this, void 0, void 0, function () {
                var tbs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            tbs = new TextBoxState(this.stateStack, text);
                            return [4 /*yield*/, this.stateStack.push(tbs)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, tbs.waitForRemoval()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        GameObjects.prototype.collectUserInput = function (question, regex) {
            if (regex === void 0) { regex = /^.+$/i; }
            return __awaiter(this, void 0, void 0, function () {
                var input;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            input = new InputState(this.stateStack, question, regex);
                            return [4 /*yield*/, this.stateStack.push(input)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, input.waitForRemoval()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, input];
                    }
                });
            });
        };
        GameObjects.prototype.delay = function (frames) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, DelayState.create(this.stateStack, frames)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        GameObjects.prototype.preparePlayer = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, DelayState.create(this.stateStack, 10)];
                        case 1:
                            _a.sent();
                            this.go.roamState.player.walkingEnabled = false;
                            this.go.roamState.player.canInteract = false;
                            return [2 /*return*/];
                    }
                });
            });
        };
        GameObjects.prototype.unpreparePlayer = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, DelayState.create(this.stateStack, 10)];
                        case 1:
                            _a.sent();
                            this.go.roamState.player.walkingEnabled = true;
                            this.go.roamState.player.canInteract = true;
                            return [2 /*return*/];
                    }
                });
            });
        };
        return GameObjects;
    }());
    CommandSuite.GameObjects = GameObjects;
    var NPCs = /** @class */ (function () {
        function NPCs(go, stateStack) {
            this.go = go;
            GameObjects.call(this, go, stateStack);
        }
        NPCs.prototype.walk = function (direction, amount) {
            if (amount === void 0) { amount = 1; }
            return __awaiter(this, void 0, void 0, function () {
                var i;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            i = 0;
                            _a.label = 1;
                        case 1:
                            if (!(i < amount)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.go.walk(direction)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        NPCs = __decorate([
            Parents(GameObjects)
        ], NPCs);
        return NPCs;
    }());
    CommandSuite.NPCs = NPCs;
})(CommandSuite || (CommandSuite = {}));
export default CommandSuite;
