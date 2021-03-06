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
import State from "../core/State.js";
import { Parents } from "../util/functions.js";
import Vector from "../util/Vector.js";
import IntroState from "./wild_battle_state/IntroState.js";
var WildBattleState = /** @class */ (function () {
    function WildBattleState(stateStack, wildBattle, battleBackgroundUrl) {
        if (battleBackgroundUrl === void 0) { battleBackgroundUrl = "meadow"; }
        this.stateStack = stateStack;
        this.wildBattle = wildBattle;
        this.battleBackgroundUrl = battleBackgroundUrl;
        this.images = {};
        this.battleBackground = null;
        this.battleAudio = null;
        State.call(this, stateStack);
        this.partyHeadImageSize = new Vector(120);
        this.wildImageSize = this.partyHeadImageSize.prod(0.65);
        var cnv = this.stateStack.game.cnv;
        this.partyHeadPos = new Vector(-this.partyHeadImageSize.x - 20, cnv.height / 2 - this.partyHeadImageSize.y / 2 + 40);
        this.wildPos = new Vector(cnv.width + 20, cnv.height / 2 - this.wildImageSize.y / 2 - 20);
        this.partyHeadTargetPos = new Vector(45, cnv.height / 2 - this.partyHeadImageSize.y / 2 + 40);
        this.wildTargetPos = new Vector(cnv.width - this.wildImageSize.x - 15, cnv.height / 2 - this.wildImageSize.y / 2 - 20);
    }
    Object.defineProperty(WildBattleState.prototype, "wildImage", {
        get: function () {
            return this.images[this.wildBattle.wild.id];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WildBattleState.prototype, "partyHeadImage", {
        get: function () {
            return this.images[this.wildBattle.party.head.id];
        },
        enumerable: false,
        configurable: true
    });
    WildBattleState.prototype.loadBattleSprites = function (loader) {
        return __awaiter(this, void 0, void 0, function () {
            var imageData;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(this.wildBattle.allCreatures.map(function (creature) { return __awaiter(_this, void 0, void 0, function () {
                            var image;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, loader.loadImage("assets/images/pokemon_battle_sprites/" + creature.speciesName + ".png")];
                                    case 1:
                                        image = _a.sent();
                                        return [2 /*return*/, { image: image, id: creature.id }];
                                }
                            });
                        }); }))];
                    case 1:
                        imageData = _a.sent();
                        imageData.forEach(function (single) {
                            _this.images[single.id] = single.image;
                        });
                        console.log(this.images);
                        return [2 /*return*/];
                }
            });
        });
    };
    WildBattleState.prototype.loadBattleBackground = function (loader) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, loader.loadImage("/assets/images/battle_backgrounds/" + this.battleBackgroundUrl + ".png")];
                    case 1:
                        _a.battleBackground = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    WildBattleState.prototype.loadBattleAudio = function (loader) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, loader.loadAudio("/assets/sounds/battle_themes/wild.mp3")];
                    case 1:
                        _a.battleAudio = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    WildBattleState.prototype.preload = function (loader) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            this.loadBattleSprites(loader),
                            this.loadBattleBackground(loader),
                            this.loadBattleAudio(loader),
                            this.wildBattle.loadAllRequiredSpecies(loader)
                        ])];
                    case 1:
                        _a.sent();
                        this.init();
                        return [2 /*return*/];
                }
            });
        });
    };
    WildBattleState.prototype.init = function () {
        this.battleAudio.loop = true;
        this.battleAudio.play();
        this.subStateStack.push(new IntroState(this.subStateStack));
    };
    WildBattleState.prototype.update = function (input) {
        this.subStateStack.update(input);
    };
    WildBattleState.prototype.render = function (ctx) {
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        if (this.battleBackground) {
            ctx.drawImage(this.battleBackground, 0, 0, ctx.canvas.width, ctx.canvas.height);
        }
        if (this.partyHeadImage) {
            ctx.drawImage(this.partyHeadImage, this.partyHeadPos.x, this.partyHeadPos.y, this.partyHeadImageSize.x, this.partyHeadImageSize.y);
        }
        if (this.wildImage) {
            ctx.drawImage(this.wildImage, this.wildPos.x, this.wildPos.y, this.wildImageSize.x, this.wildImageSize.y);
        }
        this.subStateStack.render(ctx);
    };
    WildBattleState = __decorate([
        Parents(State)
    ], WildBattleState);
    return WildBattleState;
}());
export default WildBattleState;
