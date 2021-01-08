import Vector from "../Vector.js";
import State from "./State.js";
import RoamState from './RoamState.js';
export default class StartScreenState extends State {
    constructor() {
        super(...arguments);
        this.image = null;
        this.music = null;
        this.buttonPos = new Vector(320, 340);
        this.frameCount = 0;
        this.increaseButtonYBy = 0.6;
    }
    async preload(loader) {
        const [image, music] = await Promise.all([
            loader.image(StartScreenState.imageUrl),
            loader.audio(StartScreenState.musicUrl),
        ]);
        this.music = music;
        this.image = image;
        this.music.play();
    }
    update(input) {
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
        if (this.frameCount % 20 === 0)
            this.increaseButtonYBy = -this.increaseButtonYBy;
    }
    render(renderer) {
        const { ctx } = renderer;
        ctx.drawImage(this.image, 0, 0, 640, 400);
        ctx.save();
        ctx.fillStyle = "#ff8700";
        renderer.rect(this.buttonPos, new Vector(150, 40));
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        const textPos = this.buttonPos.add(new Vector(-70, 10));
        ctx.fillText("PRESS ENTER", textPos.x, textPos.y, 140);
        // MAKE TEXT AND RECT MOVE WITH BUTTONX PROPERTIES OF STATE
    }
}
StartScreenState.imageUrl = '/assets/images/IntroScreen.png';
StartScreenState.musicUrl = '/assets/sounds/IntroMusic.mp3';
