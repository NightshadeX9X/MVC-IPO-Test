import State from "../State.js";
import WildBattle from "../WildBattle.js";
import { PARTY, WILD } from '../../index.js';
import Vector from "../Vector.js";
import IntroState from "./wild_battle/IntroState.js";
export default class WildBattleState extends State {
    constructor(stateStack, battleBgName) {
        super(stateStack);
        this.stateStack = stateStack;
        this.battleBgName = battleBgName;
        this.battleBg = null;
        this.partyHeadImage = null;
        this.wildImage = null;
        this.audio = null;
        this.toClearCanvas = true;
        this.pokemonHeight = 100;
        this.partyHeadPos = new Vector(-90, 150);
        this.battle = new WildBattle(PARTY, WILD);
        this.substates.push(new IntroState(this.substates, this));
        this.onPop = () => {
            this.audio?.pause();
            return this.substates.fromTop()?.onPop();
        };
    }
    async preload(loader) {
        const promises = [
            loader.loadImage(`/assets/images/battle_backgrounds/${this.battleBgName}.png`),
            this.stateStack.loader.loadAudio('/assets/sounds/battle_themes/wild.mp3'),
            this.substates.preload()
        ];
        [this.battleBg, this.audio] = await Promise.all(promises);
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
    pop() {
        this.stateStack.pop();
    }
    get partyHead() {
        return this.battle.party[0];
    }
    update(input) {
        if (input.keyIsDown("Enter")) {
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
        this.substates.render(ctx);
    }
}
