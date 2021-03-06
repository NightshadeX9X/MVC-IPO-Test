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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import State from "../core/State.js";
import StateStack from "../core/StateStack.js";
import Camera from "../roam_state/Camera.js";
import GameMap from "../roam_state/GameMap.js";
import Player from "../roam_state/Player.js";
import { Parents } from "../util/functions.js";
import Vector from "../util/Vector.js";
var RoamState = /** @class */ (function () {
    function RoamState(stateStack) {
        var _this = this;
        this.stateStack = stateStack;
        this.tileSize = 16;
        this.player = new Player(this);
        this.backgroundProcesses = new StateStack(this.stateStack.game, this);
        this.gameMap = new GameMap(this, 'route5');
        this.camera = new Camera(this, new Vector(480, 320));
        this.gameObjects = [];
        State.call(this, stateStack);
        this.backgroundProcesses.insert = function (state, index) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        state.blocking = false;
                        state.toUpdate = true;
                        return [4 /*yield*/, StateStack.prototype.insert.call(this.backgroundProcesses, state, index)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.stateStack.game.input.evtHandler.addEventListener('keypress', function (e) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this === this.stateStack.fromTop())
                    if (e.key === "t") {
                        // const battle = new WildBattle(this.stateStack.game.party, new PokemonCreature("pikachu"))
                        // await this.stateStack.push(new WildBattleState(this.stateStack, battle));
                    }
                return [2 /*return*/];
            });
        }); });
    }
    RoamState_1 = RoamState;
    RoamState.prototype.loadGameObjects = function (loader) {
        return __awaiter(this, void 0, void 0, function () {
            var fetched, gameObjectClasses;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.gameObjects = [];
                        return [4 /*yield*/, Promise.all(this.gameMap.json.gameObjects.map(function (s) { return loader.loadJSDefault("/js/roam_state/game_objects/definitions/" + s + ".js"); }))];
                    case 1:
                        fetched = _a.sent();
                        gameObjectClasses = fetched.map(function (m) { return m.default; });
                        gameObjectClasses.forEach(function (ctor) {
                            _this.gameObjects.push(new ctor(_this));
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    RoamState.prototype.preload = function (loader) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            this.player.preload(loader),
                            this.gameMap.preload(loader),
                        ])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.loadGameObjects(loader)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, Promise.all(this.gameObjects.map(function (go) { return go.preload(loader); }))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    RoamState.prototype.update = function (input) {
        this.player.update(input);
        this.gameObjects.forEach(function (go) { return go.update(input); });
        this.camera.update();
        this.subStateStack.update(input);
        this.backgroundProcesses.update(input);
    };
    RoamState.prototype.addBackgroundProcess = function (s) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        s.toUpdate = true;
                        s.blocking = false;
                        return [4 /*yield*/, this.backgroundProcesses.push(s)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(RoamState.prototype, "nodesToRender", {
        get: function () {
            return __spreadArrays([this.player], this.gameMap.layers, this.gameObjects);
        },
        enumerable: false,
        configurable: true
    });
    RoamState.getNodePriority = function (node) {
        if (node instanceof GameMap.Layer)
            return 0;
        return 1;
    };
    RoamState.nodeSorter = function (a, b) {
        if (a.zIndex !== b.zIndex) {
            return a.zIndex - b.zIndex;
        }
        var priorities = [a, b].map(function (n) { return RoamState_1.getNodePriority(n); });
        if (priorities[0] !== priorities[1]) {
            return priorities[0] - priorities[1];
        }
        var positions = [a, b].map(function (n) { return n.pos || new Vector; });
        return positions[0].y - positions[1].y;
    };
    RoamState.prototype.renderNodes = function (ctx) {
        this.nodesToRender.sort(function (a, b) { return RoamState_1.nodeSorter(a, b); }).forEach(function (node) {
            node.render(ctx);
        });
    };
    RoamState.prototype.render = function (ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.renderNodes(ctx);
        this.backgroundProcesses.render(ctx);
        this.subStateStack.render(ctx);
        this.camera.render(ctx);
    };
    var RoamState_1;
    RoamState = RoamState_1 = __decorate([
        Parents(State)
    ], RoamState);
    return RoamState;
}());
(function (RoamState) {
    var a = null;
})(RoamState || (RoamState = {}));
export default RoamState;
