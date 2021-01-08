export default class Interactable {
    constructor(pos, size, imgUrl) {
        this.pos = pos;
        this.size = size;
        this.imgUrl = imgUrl;
        this.image = null;
        this.onInteraction = [];
    }
    preload(loader) {
        throw new Error("Method not implemented.");
    }
    update(input) {
        throw new Error("Method not implemented.");
    }
    render(renderer) {
        throw new Error("Method not implemented.");
    }
}
