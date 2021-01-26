import State from "../State.js";
import WildBattle from "../WildBattle.js";
import { PARTY } from '../../index.js';
import Vector from "../Vector.js";
import IntroState from "./wild_battle/IntroState.js";
import { getHPBar } from "../../UI.js";
import FadeState from "./FadeState.js";
import EncounterTable from "../../JSONConversions/EncounterTable.js";
export default class WildBattleState extends State {
    constructor(stateStack, battleBgName, tableId) {
        super(stateStack);
        this.stateStack = stateStack;
        this.battleBgName = battleBgName;
        this.tableId = tableId;
        this.battleBg = null;
        this.partyHeadImage = null;
        this.wildImage = null;
        this.audio = null;
        this.hpBarImage = null;
        this.toClearCanvas = true;
        this.battle = null;
        this.pokemonHeight = 100;
        this.partyHeadPos = new Vector(-90, 150);
        this.table = null;
        this.onPop = () => {
            this.audio?.pause();
            this.stateStack.push(new FadeState(this.stateStack));
            return this.substates.fromTop()?.onPop();
        };
    }
    async preload(loader) {
        const promises = [
            loader.loadImage(`/assets/images/battle_backgrounds/${this.battleBgName}.png`),
            this.stateStack.loader.loadAudio('/assets/sounds/battle_themes/wild.mp3'),
            loader.loadImage('/assets/images/UI/HPBar.png'),
            loader.loadJSON(`/json/encounter_tables/${this.tableId}.json`),
        ];
        let table;
        [this.battleBg, this.audio, this.hpBarImage, table,] = await Promise.all(promises);
        this.table = EncounterTable.purify(table);
        if (this.table)
            this.battle = new WildBattle(PARTY, this.table);
        await this.substates.preload();
        await this.substates.push(new IntroState(this.substates, this));
    }
    async loadPartyHeadImage(loader) {
        console.log(`/assets/images/pokemon/${this.partyHead?.species?.name}.png`);
        return await loader.loadImage(`/assets/images/pokemon/${this.partyHead?.species?.name}.png`);
    }
    init() {
        if (this.audio) {
            this.audio.currentTime = 0;
            this.audio.loop = true;
            this.audio?.play();
        }
    }
    getHpBarPositions(ctx) {
        const pos1 = this.partyHeadPos.sum(50, 120);
        const pos2 = new Vector(ctx.canvas.width, ctx.canvas.height).diff(pos1).sum(0, 35);
        return { pos1, pos2 };
    }
    drawHPBars(ctx) {
        if (!this.hpBarImage || !this.battle || !this.partyHead)
            return;
        const hpBar1 = getHPBar(this.hpBarImage, this.partyHead.stats.HP / this.partyHead.maxHP);
        const hpBar2 = getHPBar(this.hpBarImage, this.battle.wild.stats.HP / this.battle.wild.maxHP);
        const { pos1, pos2 } = this.getHpBarPositions(ctx);
        ctx.drawImage(hpBar1, pos1.x - hpBar1.width / 2, pos1.y - hpBar1.height / 2 + 20);
        ctx.drawImage(hpBar2, pos2.x - hpBar2.width / 2, pos2.y - hpBar2.height / 2);
    }
    drawLevels(ctx) {
        if (!this.battle || !this.partyHead || !this.partyHeadImage)
            return;
        const partyHeadLevel = this.partyHead.level;
        const wildLevel = this.battle.wild.level;
        const rectSize = new Vector(64, 16);
        const { pos1: bar1, pos2: bar2 } = this.getHpBarPositions(ctx);
        const textPos1 = new Vector(25 + rectSize.x / 2, bar1.y - rectSize.y / 2 + 10);
        const textPos2 = new Vector(ctx.canvas.width - 25 - rectSize.x / 2, bar2.y - rectSize.y / 2 - 10);
        ctx.save();
        ctx.font = "12px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = 'middle';
        ctx.fillRect(textPos1.x - rectSize.x / 2, textPos1.y - rectSize.y / 2, rectSize.x, rectSize.y);
        ctx.fillRect(textPos2.x - rectSize.x / 2, textPos2.y - rectSize.y / 2, rectSize.x, rectSize.y);
        ctx.fillStyle = "white";
        ctx.fillText(`Level ${partyHeadLevel}`, textPos1.x, textPos1.y);
        ctx.fillText(`Level ${wildLevel}`, textPos2.x, textPos2.y);
        ctx.restore();
    }
    drawNicknames(ctx) {
        const image1 = this.partyHeadImage;
        if (!image1 || !this.partyHead || !this.battle)
            return;
        let pos1 = new Vector(this.partyHeadPos.x + 50, this.partyHeadPos.y - 15);
        let pos2 = new Vector(ctx.canvas.width - 70, 37);
        ctx.save();
        ctx.font = "13px monospace";
        ctx.lineWidth = 4;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "white";
        ctx.fillRect(pos1.x - 45, pos1.y - 12, 90, 24);
        ctx.fillStyle = "black";
        ctx.strokeStyle = "black";
        ctx.fillText(this.partyHead.nickname, pos1.x, pos1.y);
        ctx.lineWidth = 5;
        ctx.strokeRect(pos1.x - 47, pos1.y - 15, 93, 26);
        ctx.fillStyle = "white";
        ctx.fillRect(pos2.x - 45, pos2.y - 12, 90, 24);
        ctx.fillStyle = "black";
        ctx.strokeStyle = "black";
        ctx.fillText(this.battle.wild.nickname, pos2.x, pos2.y);
        ctx.lineWidth = 5;
        ctx.strokeRect(pos2.x - 47, pos2.y - 15, 93, 26);
        ctx.restore();
    }
    drawBattleGraphics(ctx) {
        this.drawPokemon(ctx);
        this.drawHPBars(ctx);
        this.drawLevels(ctx);
        this.drawNicknames(ctx);
    }
    get partyHead() {
        return this.battle?.party?.[0];
    }
    get shouldEnd() {
        if (!this.battle)
            return true;
        return !this.battle.wild.canBattle() || !this.battle.party.some(p => p.canBattle());
    }
    update(input) {
        if (!this.battle || !this.partyHead)
            return;
        this.substates.update(input);
    }
    drawPokemon(ctx) {
        if (this.partyHeadImage) {
            // const pokemonWidth = (this.partyHeadImage.width / this.partyHeadImage.height) * this.pokemonHeight;
            ctx.drawImage(this.partyHeadImage, this.partyHeadPos.x, this.partyHeadPos.y, 100, 100);
        }
        if (this.wildImage) {
            // const pokemonWidth = (this.wildImage.width / this.wildImage.height) * this.pokemonHeight;
            ctx.drawImage(this.wildImage, ctx.canvas.width - this.partyHeadPos.x - 64, ctx.canvas.height - this.partyHeadPos.y - 64, 70, 70);
        }
    }
    render(ctx) {
        if (this.toClearCanvas) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            this.toClearCanvas = false;
        }
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        if (this.battleBg) {
            const width = ctx.canvas.width;
            const height = (this.battleBg.height / this.battleBg.width) * width;
            const y = (ctx.canvas.height - height) / 2;
            ctx.drawImage(this.battleBg, 0, y, width, height);
        }
        this.substates.render(ctx);
    }
}
