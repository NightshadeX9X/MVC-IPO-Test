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
import CommandSuite from "../../../../util/Commands.js";
import Direction from "../../../../util/Direction.js";
import { Parents } from "../../../../util/functions.js";
import Vector from "../../../../util/Vector.js";
import NPC from "../../types/NPC.js";
var npc1 = /** @class */ (function () {
    function npc1(roamState) {
        this.roamState = roamState;
        this.variables = {
            interactionCount: 0
        };
        NPC.call(this, roamState);
        this.pos = new Vector(7, 20);
    }
    npc1.prototype.onInteract = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var cmds, confirmPartake, willPartake, dogOrCat, rowletOrLitten, color, movie;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        cmds = new CommandSuite.NPCs(this);
                        return [4 /*yield*/, cmds.preparePlayer()];
                    case 1:
                        _b.sent();
                        if (!(this.variables.interactionCount >= 1)) return [3 /*break*/, 4];
                        return [4 /*yield*/, cmds.showText("I'm sorry, but you can only take the survey once.")];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, cmds.unpreparePlayer()];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                    case 4: return [4 /*yield*/, cmds.showText("%%Hello %%there ]! Would you %%like to take part in a %%survey ]?")];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, cmds.collectUserInput("Would you like to take part in a survey?", /^(yes|y|no|n)$/i)];
                    case 6:
                        confirmPartake = _b.sent();
                        willPartake = ((_a = confirmPartake.answer) === null || _a === void 0 ? void 0 : _a.startsWith("y"));
                        if (!!willPartake) return [3 /*break*/, 9];
                        return [4 /*yield*/, cmds.showText("Oh... That's too bad.")];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, cmds.unpreparePlayer()];
                    case 8:
                        _b.sent();
                        return [2 /*return*/];
                    case 9: return [4 /*yield*/, cmds.showText("Great!")];
                    case 10:
                        _b.sent();
                        return [4 /*yield*/, cmds.showText("Just hold on while I go and get my papers!")];
                    case 11:
                        _b.sent();
                        return [4 /*yield*/, cmds.walk(Direction.RIGHT, 4)];
                    case 12:
                        _b.sent();
                        return [4 /*yield*/, cmds.walk(Direction.UP, 11)];
                    case 13:
                        _b.sent();
                        return [4 /*yield*/, cmds.delay(120)];
                    case 14:
                        _b.sent();
                        return [4 /*yield*/, cmds.walk(Direction.DOWN, 11)];
                    case 15:
                        _b.sent();
                        return [4 /*yield*/, cmds.walk(Direction.LEFT, 4)];
                    case 16:
                        _b.sent();
                        this.faceWalker();
                        return [4 /*yield*/, cmds.showText("Alright, let's begin!")];
                    case 17:
                        _b.sent();
                        return [4 /*yield*/, cmds.collectUserInput("Do you prefer dogs or cats?", /^(dog|cat)s?$/i)];
                    case 18:
                        dogOrCat = _b.sent();
                        return [4 /*yield*/, cmds.collectUserInput("Do you prefer rowlets or littens?", /^(rowlet|litten)s?$/i)];
                    case 19:
                        rowletOrLitten = _b.sent();
                        return [4 /*yield*/, cmds.collectUserInput("What is your favorite color?")];
                    case 20:
                        color = _b.sent();
                        return [4 /*yield*/, cmds.collectUserInput("What is your favorite movie?")];
                    case 21:
                        movie = _b.sent();
                        return [4 /*yield*/, cmds.showText("Thank you! Your answers were " + dogOrCat.answer + ", " + rowletOrLitten.answer + ", " + color.answer + " and " + movie.answer)];
                    case 22:
                        _b.sent();
                        this.variables.interactionCount++;
                        return [4 /*yield*/, cmds.unpreparePlayer()];
                    case 23:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    npc1 = __decorate([
        Parents(NPC)
    ], npc1);
    return npc1;
}());
export default npc1;
