import Input from "../Input.js";
import Loader from "../Loader.js";
import Renderer from "../Renderer.js";
import Vector from "../Vector.js";
import State from "./State.js";
import RoamState from './RoamState.js';

export default class StartScreenState extends State {
	private static imageUrl = '/assets/images/IntroScreen.png';
	private static musicUrl = '/assets/sounds/IntroMusic.mp3';
	private image: HTMLImageElement = null as any;
	private music: HTMLAudioElement = null as any;
	private buttonPos = new Vector(320, 340);
	private frameCount = 0;
	private increaseButtonYBy = 0.6;
	async preload(loader: Loader) {
		const [image, music] = await Promise.all([
			loader.image(StartScreenState.imageUrl),
			loader.audio(StartScreenState.musicUrl),
		]);

		this.music = music;
		this.image = image;

		this.music.play();
	}
	update(input: Input): void {
		this.frameCount++;
		this.updateButton();

		if (input.keyIsDown('Enter')) {
			this.music.pause();
			let roamState = new RoamState(this.stateStack, this.stateStack.loader);
			this.stateStack.pop();
			this.stateStack.push(roamState);



		}

	}
	updateButton() {
		this.buttonPos.y += this.increaseButtonYBy;
		if (this.frameCount % 20 === 0) this.increaseButtonYBy = -this.increaseButtonYBy;
	}
	render(renderer: Renderer): void {
		const { ctx } = renderer;
		ctx.drawImage(this.image, 0, 0, 640, 400);
		ctx.save();
		ctx.fillStyle = "#ff8700";
		renderer.rect(this.buttonPos, new Vector(150, 40));
		ctx.fillStyle = "black";
		ctx.font = "30px Arial"
		const textPos = this.buttonPos.add(new Vector(-70, 10));
		ctx.fillText("PRESS ENTER", textPos.x, textPos.y, 140);

		// MAKE TEXT AND RECT MOVE WITH BUTTONX PROPERTIES OF STATE

	}

}