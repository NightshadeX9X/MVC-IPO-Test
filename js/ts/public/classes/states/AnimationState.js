import { filterUnwantedFromObj } from "../../Util.js";
import Spritesheet from "../Spritesheet.js";
import State from "../State.js";
import Vector from "../Vector.js";
export default class AnimationState extends State {
    constructor(stateStack, imageUrl, data) {
        super(stateStack);
        this.stateStack = stateStack;
        this.imageUrl = imageUrl;
        this.image = null;
        this.spritesheet = null;
        this.frames = 0;
        this.data = {
            singleImageSize: new Vector(16),
            amountOfImages: 1,
            drawPos: new Vector,
            interval: 0,
            popFramesBefore: 0,
            scale: 1,
            ...filterUnwantedFromObj(data)
        };
    }
    async preload(loader) {
        this.image = await loader.loadImage(this.imageUrl);
        if (this.image)
            this.spritesheet = new Spritesheet(this.image, this.data.singleImageSize, new Vector(this.data.amountOfImages, 1));
    }
    init() {
        console.log(this);
    }
    update(input) {
        if (!this.spritesheet)
            return;
        if (this.frames >= this.data.interval) {
            this.spritesheet.coords.x++;
            this.frames = -1;
        }
        if (this.spritesheet.coords.x > this.data.amountOfImages - this.data.popFramesBefore)
            this.stateStack.pop();
        this.frames++;
    }
    ctxAdjustments(ctx) {
    }
    render(ctx) {
        if (!this.spritesheet)
            return;
        ctx.save();
        ctx.scale(this.data.scale, this.data.scale);
        this.ctxAdjustments(ctx);
        this.spritesheet.render(ctx, this.data.drawPos);
        ctx.restore();
    }
    static exclamation(roamState) {
        const coords = roamState.player.camera.convertCoords(roamState.player.pos.prod(roamState.tileSize)).diff(8, 50);
        const as = new AnimationState(roamState.stateStack, '/assets/images/animations/exclamation.png', {
            singleImageSize: new Vector(32),
            drawPos: coords,
            popFramesBefore: 1,
            amountOfImages: 27
        });
        roamState.stateStack.push(as);
        return as;
    }
    static async getFromJSON(loader, path, stateStack) {
        const promises = [
            loader.loadJSON(`/json/animations/${path}.json`),
        ];
        const [json,] = await Promise.all(promises);
        const as = new AnimationState(stateStack, `/assets/images/animations/${path}.png`, {
            singleImageSize: Vector.fromString(json.singleImageSize),
            drawPos: Vector.fromString(json.drawPos),
            amountOfImages: json.frames,
            interval: json.interval,
            popFramesBefore: json.popFramesBefore,
            scale: json.scale
        });
        return as;
    }
}
