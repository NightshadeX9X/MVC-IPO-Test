import Input from "../Input.js";
import Loader, { JSON } from "../Loader.js";
import State from "../State.js";
import StateStack from "../StateStack.js";
import WildBattle from "../WildBattle.js";
import { PARTY, WILD } from '../../index.js';
import Vector from "../Vector.js";
import IntroState from "./wild_battle/IntroState.js";
import { getHPBar } from "../../UI.js";
import { round } from "../../Util.js";
import FadeState from "./FadeState.js";
import EncounterTable from "../../JSONConversions/EncounterTable.js";

export default class WildBattleState extends State {
	private battleBg: HTMLImageElement | null = null;
	public partyHeadImage: HTMLImageElement | null = null;
	public wildImage: HTMLImageElement | null = null;
	private audio: HTMLAudioElement | null = null;
	public hpBarImage: HTMLImageElement | null = null;
	private toClearCanvas = true;
	public battle: WildBattle | null = null;
	public pokemonHeight = 100;
	public partyHeadPos = new Vector(-90, 150);
	private table: EncounterTable.Pure | null = null;

	constructor(public stateStack: StateStack, public battleBgName: string, public tableId: string) {
		super(stateStack);

		this.onPop = () => {
			this.audio?.pause();
			this.stateStack.push(new FadeState(this.stateStack))
			return this.substates.fromTop()?.onPop();
		}
	}
	async preload(loader: Loader) {
		// @ts-expect-error
		const promises = [
			loader.loadImage(`/assets/images/battle_backgrounds/${this.battleBgName}.png`),
			this.stateStack.loader.loadAudio('/assets/sounds/battle_themes/wild.mp3'),
			loader.loadImage('/assets/images/UI/HPBar.png'),
			loader.loadJSON(`/json/encounter_tables/${this.tableId}.json`)
		] as
			[Promise<HTMLImageElement>, Promise<HTMLAudioElement>, Promise<HTMLImageElement>, EncounterTable.Raw];
		let table: EncounterTable.Raw;
		[this.battleBg, this.audio, this.hpBarImage, table] = await Promise.all(promises);
		this.table = EncounterTable.purify(table);

		if (this.table)
			this.battle = new WildBattle(PARTY, this.table)

		await this.substates.push(new IntroState(this.substates, this));

	}

	private async loadPartyHeadImage(loader: Loader) {
		if (this.partyHead) {
			return await loader.loadImage(`/assets/images/pokemon/${this.partyHead.species?.name}.png`)
		}
	}
	init(): void {

		if (this.audio) {
			this.audio.currentTime = 0;
			this.audio.loop = true;
			this.audio?.play();
		}

	}

	private getHpBarPositions(ctx: CanvasRenderingContext2D) {
		const pos1 = this.partyHeadPos.sum(Number(this.partyHeadImage?.width) / 2, 90);
		const pos2 = new Vector(ctx.canvas.width, ctx.canvas.height).diff(pos1)
		return { pos1, pos2 }
	}

	public drawHPBars(ctx: CanvasRenderingContext2D) {
		if (!this.hpBarImage || !this.battle || !this.partyHead) return;
		const hpBar1 = getHPBar(this.hpBarImage, this.partyHead.stats.HP / this.partyHead.maxHP);
		const hpBar2 = getHPBar(this.hpBarImage, this.battle.wild.stats.HP / this.battle.wild.maxHP);
		const { pos1, pos2 } = this.getHpBarPositions(ctx);
		ctx.drawImage(hpBar1, pos1.x - hpBar1.width / 2, pos1.y - hpBar1.height / 2 + 20);
		ctx.drawImage(hpBar2, pos2.x - hpBar2.width / 2, pos2.y - hpBar2.height / 2);
	}

	public drawLevels(ctx: CanvasRenderingContext2D) {
		if (!this.battle || !this.partyHead || !this.partyHeadImage) return;

		const partyHeadLevel = this.partyHead.level;
		const wildLevel = this.battle.wild.level;
		const rectSize = new Vector(64, 16)
		const { pos1: bar1, pos2: bar2 } = this.getHpBarPositions(ctx);
		const textPos1 = new Vector(10 + rectSize.x / 2, bar1.y - rectSize.y / 2 + 10);
		const textPos2 = new Vector(ctx.canvas.width - 10 - rectSize.x / 2, bar2.y - rectSize.y / 2 - 10);
		ctx.save();
		ctx.font = "12px monospace";
		ctx.textAlign = "center";
		ctx.textBaseline = 'middle';
		ctx.fillRect(textPos1.x - rectSize.x / 2, textPos1.y - rectSize.y / 2, rectSize.x, rectSize.y)
		ctx.fillRect(textPos2.x - rectSize.x / 2, textPos2.y - rectSize.y / 2, rectSize.x, rectSize.y)
		ctx.fillStyle = "white";
		ctx.fillText(`Level ${partyHeadLevel}`, textPos1.x, textPos1.y)
		ctx.fillText(`Level ${wildLevel}`, textPos2.x, textPos2.y)
		ctx.restore();
	}

	public drawNicknames(ctx: CanvasRenderingContext2D) {
		const image1 = this.partyHeadImage;
		if (!image1 || !this.partyHead || !this.battle) return;
		let pos1 = new Vector(this.partyHeadPos.x + image1.height / 2 + 10, this.partyHeadPos.y - 10);
		let pos2 = new Vector(ctx.canvas.width - 70, 37);
		ctx.save();
		ctx.font = "20px Nunito";
		ctx.lineWidth = 4;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle"
		ctx.fillStyle = "white"

		ctx.fillRect(pos1.x - 45, pos1.y - 12, 90, 24)

		ctx.fillStyle = "black"
		ctx.strokeStyle = "black"
		ctx.fillText(this.partyHead.nickname, pos1.x, pos1.y)

		ctx.lineWidth = 5;
		ctx.strokeRect(pos1.x - 47, pos1.y - 15, 93, 26)



		ctx.fillStyle = "white"

		ctx.fillRect(pos2.x - 45, pos2.y - 12, 90, 24)

		ctx.fillStyle = "black"
		ctx.strokeStyle = "black"
		ctx.fillText(this.battle.wild.nickname, pos2.x, pos2.y)

		ctx.lineWidth = 5;
		ctx.strokeRect(pos2.x - 47, pos2.y - 15, 93, 26)

		ctx.restore();
	}

	public drawBattleGraphics(ctx: CanvasRenderingContext2D) {
		this.drawPokemon(ctx);
		this.drawHPBars(ctx);
		this.drawLevels(ctx);
		this.drawNicknames(ctx);
	}

	public get partyHead() {
		return this.battle?.party?.[0];
	}
	public get shouldEnd() {
		if (!this.battle) return true;
		return !this.battle.wild.canBattle() || !this.battle.party.some(p => p.canBattle());
	}
	update(input: Input): void {

		if (!this.battle || !this.partyHead) return;

		this.substates.update(input);


	}
	public drawPokemon(ctx: CanvasRenderingContext2D) {
		if (this.partyHeadImage) {
			const pokemonWidth = (this.partyHeadImage.width / this.partyHeadImage.height) * this.pokemonHeight;
			ctx.drawImage(this.partyHeadImage, this.partyHeadPos.x, this.partyHeadPos.y, pokemonWidth, this.pokemonHeight)
		}
		if (this.wildImage) {
			const pokemonWidth = (this.wildImage.width / this.wildImage.height) * this.pokemonHeight;
			ctx.drawImage(this.wildImage, ctx.canvas.width - this.partyHeadPos.x - this.wildImage.width, ctx.canvas.height - this.partyHeadPos.y - this.wildImage.height, pokemonWidth * 0.7, this.pokemonHeight * 0.7)
		}
	}
	render(ctx: CanvasRenderingContext2D): void {
		if (this.toClearCanvas) {
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			this.toClearCanvas = false;
		}
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
		if (this.battleBg) {
			const width = ctx.canvas.width;
			const height = (this.battleBg.height / this.battleBg.width) * width;
			const y = (ctx.canvas.height - height) / 2;
			ctx.drawImage(this.battleBg, 0, y, width, height);

		}

		this.substates.render(ctx);
	}

}