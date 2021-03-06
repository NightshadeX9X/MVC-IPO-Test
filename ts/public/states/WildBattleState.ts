import WildBattle from "../battle/WildBattle.js";
import Input from "../core/Input.js";
import Loader from "../core/Loader.js";
import State from "../core/State.js";
import StateStack from "../core/StateStack.js";
import { Parents } from "../util/functions.js";
import Vector from "../util/Vector.js";
import IntroState from "./wild_battle_state/IntroState.js";

interface WildBattleState extends State { }

@Parents(State)
class WildBattleState {
	images: Record<string, HTMLImageElement> = {};
	partyHeadImageSize: Vector;
	wildImageSize: Vector;
	partyHeadPos: Vector;
	wildPos: Vector;
	partyHeadTargetPos: Vector;
	wildTargetPos: Vector;
	battleBackground: HTMLImageElement = null as any;
	battleAudio: HTMLAudioElement = null as any;

	constructor(public stateStack: StateStack, public wildBattle: WildBattle, public battleBackgroundUrl = "meadow") {
		State.call(this, stateStack);
		this.partyHeadImageSize = new Vector(120);
		this.wildImageSize = this.partyHeadImageSize.prod(0.65);

		const cnv = this.stateStack.game.cnv;
		this.partyHeadPos = new Vector(-this.partyHeadImageSize.x - 20, cnv.height / 2 - this.partyHeadImageSize.y / 2 + 40)
		this.wildPos = new Vector(cnv.width + 20, cnv.height / 2 - this.wildImageSize.y / 2 - 20)

		this.partyHeadTargetPos = new Vector(45, cnv.height / 2 - this.partyHeadImageSize.y / 2 + 40);
		this.wildTargetPos = new Vector(cnv.width - this.wildImageSize.x - 15, cnv.height / 2 - this.wildImageSize.y / 2 - 20);
	}

	private get wildImage() {
		return this.images[this.wildBattle.wild.id];
	}
	private get partyHeadImage() {
		return this.images[this.wildBattle.party.head.id];
	}

	private async loadBattleSprites(loader: Loader) {
		const imageData = await Promise.all(this.wildBattle.allCreatures.map(async creature => {
			const image = await loader.loadImage(`assets/images/pokemon_battle_sprites/${creature.speciesName}.png`);
			return { image, id: creature.id }
		}));

		imageData.forEach(single => {
			this.images[single.id] = single.image;
		});

		console.log(this.images);
	}
	private async loadBattleBackground(loader: Loader) {
		this.battleBackground = await loader.loadImage(`/assets/images/battle_backgrounds/${this.battleBackgroundUrl}.png`)
	}
	private async loadBattleAudio(loader: Loader) {
		this.battleAudio = await loader.loadAudio(`/assets/sounds/battle_themes/wild.mp3`)
	}
	async preload(loader: Loader) {
		await Promise.all([
			this.loadBattleSprites(loader),
			this.loadBattleBackground(loader),
			this.loadBattleAudio(loader),
			this.wildBattle.loadAllRequiredSpecies(loader)
		]);
		this.init();
	}

	init() {
		this.battleAudio.loop = true;
		this.battleAudio.play();
		this.subStateStack.push(new IntroState(this.subStateStack))

	}

	update(input: Input) {
		this.subStateStack.update(input);
	}

	render(ctx: CanvasRenderingContext2D) {
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
	}
}

export default WildBattleState;