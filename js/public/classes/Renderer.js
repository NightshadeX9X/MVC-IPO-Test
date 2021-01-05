import Vector from "./Vector.js";
export default class Renderer {
    constructor(cnv) {
        this.cnv = cnv;
        this.loadedImages = new Map();
        this.ctx = cnv.getContext('2d');
        this.size = new Vector(this.cnv.width, this.cnv.height);
    }
    rect(pos, size) {
        this.ctx.fillRect(pos.x - size.x / 2, pos.y - size.y / 2, size.x, size.y);
    }
    clear() {
        this.ctx.clearRect(0, 0, this.size.x, this.size.y);
    }
    async loadImage(name, src) {
        return new Promise((req, res) => {
            const image = new Image();
            image.addEventListener('load', () => {
                this.loadedImages.set(name, image);
                res(image);
            });
            image.src = src;
        });
    }
}
