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
import { Preloadable, Renderable } from "../core/Attributes.js";
import Vector from "../util/Vector.js";
import { Parents } from "../util/functions.js";
var GameMapLayer = /** @class */ (function () {
    function GameMapLayer(gameMap, zIndex) {
        this.gameMap = gameMap;
        this.zIndex = zIndex;
        this.imageName = "" + this.zIndex;
        this.image = null;
        this.parts = [];
        Preloadable.call(this);
        Renderable.call(this);
    }
    GameMapLayer.prototype.getParts = function () {
        var _this = this;
        var toReturn = [];
        var json = this.gameMap.json;
        if (!json)
            return;
        var layerData = json.layers.find(function (layer) { return layer.zIndex === _this.zIndex; });
        if (!layerData)
            return;
        var parts = layerData.parts;
        if (!parts)
            return;
        for (var y = 0; y < this.gameMap.size.y; y++) {
            toReturn[y] = [];
            for (var x = 0; x < this.gameMap.size.x; x++) {
                toReturn[y][x] = [];
            }
        }
        parts.forEach(function (part) {
            var _a = Vector.fromStringRange(part.range), start = _a[0], end = _a[1];
            for (var y = start.y; y <= end.y; y++) {
                var _loop_1 = function (x) {
                    var old = Array.from(toReturn[y][x]);
                    var priority = Number(part.priority);
                    toReturn[y][x] = __spreadArrays(old.filter(function (o) { return (o.priority || 0) >= priority; }), [part]);
                };
                for (var x = start.x; x <= end.x; x++) {
                    _loop_1(x);
                }
            }
        });
        return toReturn;
    };
    GameMapLayer.prototype.preload = function (loader) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, parts;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, loader.loadImage("/assets/images/maps/" + this.gameMap.name + "/" + this.imageName + ".png")];
                    case 1:
                        _a.image = _b.sent();
                        {
                            parts = this.getParts();
                            if (parts)
                                this.parts = parts;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    GameMapLayer.prototype.render = function (ctx) {
        var coords = this.gameMap.roamState.camera.convertCoords(new Vector);
        this.gameMap.roamState.camera.ctx.drawImage(this.image, coords.x, coords.y);
    };
    GameMapLayer.prototype.partAt = function (pos, fn) {
        var _a, _b;
        var parts = (_b = (_a = this.parts) === null || _a === void 0 ? void 0 : _a[pos.y]) === null || _b === void 0 ? void 0 : _b[pos.x];
        if (!parts)
            return false;
        return parts.some(function (part) { return fn(part); });
    };
    GameMapLayer = __decorate([
        Parents(Preloadable, Renderable)
    ], GameMapLayer);
    return GameMapLayer;
}());
export default GameMapLayer;
