import State from "../State.js";
import WildBattle from "../WildBattle.js";
import { PARTY, WILD } from '../../index.js';
import Vector from "../Vector.js";
import IntroState from "./wild_battle/IntroState.js";
import { getHPBar } from "../../UI.js";
import { round } from "../../Util.js";
import FadeState from "./FadeState.js";
export default class WildBattleState extends State {
    constructor(stateStack, battleBgName) {
        super(stateStack);
        this.stateStack = stateStack;
        this.battleBgName = battleBgName;
        this.battleBg = null;
        this.partyHeadImage = null;
        this.wildImage = null;
        this.audio = null;
        this.hpBarImage = null;
        this.toClearCanvas = true;
        this.pokemonHeight = 100;
        this.partyHeadPos = new Vector(-90, 150);
        this.battle = new WildBattle(PARTY, WILD);
        this.substates.push(new IntroState(this.substates, this));
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
            this.substates.preload(),
            loader.loadImage('/assets/images/UI/HPBar.png')
        ];
        [this.battleBg, this.audio, , this.hpBarImage] = await Promise.all(promises);
    }
    async loadPartyHeadImage(loader) {
        if (this.partyHead) {
            return await loader.loadImage(`/assets/images/pokemon/${this.partyHead.species?.name}.png`);
        }
    }
    init() {
        if (this.audio) {
            this.audio.currentTime = 0;
            this.audio.loop = true;
            this.audio?.play();
        }
    }
    drawHPBars(ctx) {
        if (!this.hpBarImage)
            return;
        const hpBar1 = getHPBar(this.hpBarImage, this.partyHead.stats.HP / this.partyHead.maxHP);
        const hpBar2 = getHPBar(this.hpBarImage, this.battle.wild.stats.HP / this.battle.wild.maxHP);
        const pos1 = this.partyHeadPos.sum(Number(this.partyHeadImage?.width) / 2, 90);
        const pos2 = new Vector(ctx.canvas.width, ctx.canvas.height).diff(pos1);
        ctx.drawImage(hpBar1, pos1.x - hpBar1.width / 2, pos1.y - hpBar1.height / 2 + 20);
        ctx.drawImage(hpBar2, pos2.x - hpBar2.width / 2, pos2.y - hpBar2.height / 2);
    }
    get partyHead() {
        return this.battle.party[0];
    }
    update(input) {
        if (input.keyIsDown("Enter")) {
            this.stateStack.pop();
        }
        if (this.battle.wild.stats.HP >= 0.02) {
            this.battle.wild.stats.HP -= 0.02;
            this.battle.wild.stats.HP = round(this.battle.wild.stats.HP, 2);
        }
        if (this.partyHead.stats.HP >= 0.005) {
            this.partyHead.stats.HP -= 0.005;
            this.partyHead.stats.HP = round(this.partyHead.stats.HP, 3);
        }
        if (this.battle.wild.stats.HP <= 0) {
            this.stateStack.pop();
        }
        this.substates.update(input);
    }
    drawPokemon(ctx) {
        if (this.partyHeadImage) {
            const pokemonWidth = (this.partyHeadImage.width / this.partyHeadImage.height) * this.pokemonHeight;
            ctx.drawImage(this.partyHeadImage, this.partyHeadPos.x, this.partyHeadPos.y, pokemonWidth, this.pokemonHeight);
        }
        if (this.wildImage) {
            const pokemonWidth = (this.wildImage.width / this.wildImage.height) * this.pokemonHeight;
            ctx.drawImage(this.wildImage, ctx.canvas.width - this.partyHeadPos.x - this.wildImage.width, ctx.canvas.height - this.partyHeadPos.y - this.wildImage.height, pokemonWidth * 0.7, this.pokemonHeight * 0.7);
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
        ctx.save();
        ctx.font = "12px Courier Prime";
        ctx.fillStyle = "black";
        ctx.fillText("Hello World", 40, 40);
        ctx.restore();
        this.substates.render(ctx);
    }
}
