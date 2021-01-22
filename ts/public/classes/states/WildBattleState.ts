import Input from "../Input.js";
import Loader from "../Loader.js";
import State from "../State.js";
import StateStack from "../StateStack.js";
import WildBattle from "../WildBattle.js";
import { PARTY, WILD } from '../../index.js';
import Vector from "../Vector.js";
import IntroState from "./wild_battle/IntroState.js";

export default class WildBattleState extends State {
	private battleBg: HTMLImageElement | null = null;
	public partyHeadImage: HTMLImageElement | null = null;
	public wildImage: HTMLImageElement | null = null;
	private audio: HTMLAudioElement | null = null;
	private toClearCanvas = true;
	public battle: WildBattle;
	public pokemonHeight = 100;
	public partyHeadPos = new Vector(-90, 150);
	constructor(public stateStack: StateStack, public battleBgName: string) {
		super(stateStack);
		this.battle = new WildBattle(PARTY, WILD);
		this.substates.push(new IntroState(this.substates, this));

		this.onPop = () => {
			this.audio?.pause();

			return this.substates.fromTop()?.onPop();
		}
	}
	async preload(loader: Loader) {
		const promises = [
			loader.loadImage(`/assets/images/battle_backgrounds/${this.battleBgName}.png`),
			this.stateStack.loader.loadAudio('/assets/sounds/battle_themes/wild.mp3'),
			this.substates.preload()
		] as
			[Promise<HTMLImageElement>, Promise<HTMLAudioElement>, Promise<void>];

		[this.battleBg, this.audio] = await Promise.all(promises);
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
	private pop() {
		this.stateStack.pop();

	}


	public get partyHead() {
		return this.battle.party[0];
	}
	update(input: Input): void {
		if (input.keyIsDown("Enter")) {
			this.stateStack.pop();
		}

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