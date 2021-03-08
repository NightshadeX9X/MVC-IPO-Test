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
import { Preloadable, Renderable } from "../core/Attributes.js";
import BlankState from "../states/BlankState.js";
import DelayState from "../states/DelayState.js";
import Direction from "../util/Direction.js";
import Spritesheet from "../util/Spritesheet.js";
import Vector from "../util/Vector.js";
var Walker = /** @class */ (function () {
    function Walker(roamState, pos, imageUrl) {
        this.roamState = roamState;
        this.pos = pos;
        this.imageUrl = imageUrl;
        this.SIGNATURE = 'walker';
        this.walkingToward = null;
        this.direction = Direction.DOWN;
        this.walking = false;
        this.zIndex = 1;
        this.spritesheet = null;
        this.image = null;
        this.walkingEnabled = true;
        Preloadable.call(this);
        Renderable.call(this);
    }
    Walker.prototype.preload = function (loader) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log(this.constructor.name + " preload started");
                        _a = this;
                        return [4 /*yield*/, loader.loadImage("/assets/images/characters/" + this.imageUrl + ".png")];
                    case 1:
                        _a.image = _b.sent();
                        this.spritesheet = new Spritesheet(this.image);
                        console.log(this.constructor.name + " preload ended");
                        console.log(this.spritesheet);
                        return [2 /*return*/];
                }
            });
        });
    };
    Walker.prototype.render = function (ctx) {
        if (!this.image || !this.spritesheet)
            return;
        this.roamState.camera.ctx.save();
        var coords = this.roamState.camera.convertCoords(this.pos.diff(0, 1).prod(this.roamState.tileSize));
        this.roamState.camera.ctx.translate(coords.x, coords.y);
        this.spritesheet.render(this.roamState.camera.ctx);
        this.roamState.camera.ctx.restore();
    };
    Walker.prototype.takeStep = function (dir, bgp) {
        return __awaiter(this, void 0, void 0, function () {
            var increment, i, ds;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        increment = function () {
                            _this.pos.add(Direction.toVector(dir).quo(16));
                        };
                        this.spritesheet.coords.x++;
                        this.spritesheet.coords.x %= 4;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < 4)) return [3 /*break*/, 5];
                        increment();
                        ds = new DelayState(bgp.subStateStack, 1);
                        return [4 /*yield*/, bgp.subStateStack.push(ds)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, ds.waitForRemoval()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Walker.prototype.canMove = function (dir) {
        var _this = this;
        if (!this.walkingEnabled)
            return false;
        if (this.walking)
            return false;
        var layer = this.walkingOnMapLayer();
        var ahead = this.getPosAhead(dir);
        var walkable = function (value) {
            if (typeof value === "boolean")
                return value;
            var parts = value.split("").map(function (s) { return s.toUpperCase(); });
            console.log(parts, Direction[_this.direction][0]);
            if (parts.includes(Direction[Direction.invert(_this.direction)][0]))
                return true;
            return false;
        };
        if (layer) {
            if (layer.partAt(ahead, function (p) { return p.type === "wall" && walkable(p.value); })) {
                return false;
            }
            ;
        }
        if (ahead.x < 0 || ahead.y < 0 || ahead.x >= this.roamState.gameMap.size.x || ahead.y >= this.roamState.gameMap.size.y) {
            return false;
        }
        if (this.roamState.gameObjects.filter(function (go) { return !go.canBeWalkedThrough; }).find(function (go) { return go.getCoveredSquares().find(function (v) { return v.equals(ahead); }); })) {
            return false;
        }
        var walkers = this.allButThis();
        if (walkers.find(function (w) { var _a; return ((_a = w.walkingToward) === null || _a === void 0 ? void 0 : _a.equals(ahead)) || w.pos.equals(ahead); })) {
            return false;
        }
        ;
        return true;
    };
    Walker.prototype.getPosAhead = function (dir) {
        if (dir === void 0) { dir = this.direction; }
        return this.pos.sum(Direction.toVector(dir));
    };
    Walker.prototype.all = function () {
        return __spreadArrays([this.roamState.player], this.roamState.gameObjects.filter(function (x) { var _a; return ((_a = x) === null || _a === void 0 ? void 0 : _a.SIGNATURE) === 'walker'; }));
    };
    Walker.prototype.allButThis = function () {
        var _this = this;
        return this.all().filter(function (w) { return w !== _this; });
    };
    Walker.prototype.walk = function (dir) {
        if (dir === void 0) { dir = this.direction; }
        return __awaiter(this, void 0, void 0, function () {
            var originalPos, bgp, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.walkingEnabled)
                            return [2 /*return*/];
                        if (!this.walking)
                            this.setDirection(dir);
                        if (!this.canMove(dir))
                            return [2 /*return*/];
                        this.walking = true;
                        this.walkingToward = this.pos.sum(Direction.toVector(dir));
                        originalPos = Vector.from(this.pos);
                        bgp = new BlankState(this.roamState.backgroundProcesses);
                        return [4 /*yield*/, this.roamState.addBackgroundProcess(bgp)];
                    case 1:
                        _a.sent();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < 4)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.takeStep(dir, bgp)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5:
                        this.pos.set(this.walkingToward);
                        this.walking = false;
                        this.evtHandler.dispatchEvent('walk', originalPos, this.walkingToward, this.direction);
                        bgp.remove();
                        return [2 /*return*/];
                }
            });
        });
    };
    Walker.prototype.setDirection = function (direction) {
        this.direction = direction;
        // if (!this.spritesheet) return;
        if (direction === Direction.DOWN)
            this.spritesheet.coords.y = 0;
        if (direction === Direction.LEFT)
            this.spritesheet.coords.y = 1;
        if (direction === Direction.RIGHT)
            this.spritesheet.coords.y = 2;
        if (direction === Direction.UP)
            this.spritesheet.coords.y = 3;
    };
    Walker.prototype.completeWalk = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!this.walking)
                    return [2 /*return*/];
                return [2 /*return*/, new Promise(function (res, rej) {
                        _this.evtHandler.addEventListener('walk', function () {
                            res();
                        });
                    })];
            });
        });
    };
    Walker.prototype.walkingOnMapLayer = function () {
        var _this = this;
        var _a;
        return (_a = this.roamState) === null || _a === void 0 ? void 0 : _a.gameMap.layers.find(function (layer) { return layer.zIndex === (_this.zIndex - 1); });
    };
    return Walker;
}());
export default Walker;
