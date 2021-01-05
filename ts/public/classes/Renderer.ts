import Vector from "./Vector.js";

export default class Renderer {
	public ctx: CanvasRenderingContext2D;
	public loadedImages = new Map<string, HTMLImageElement>();
	size: Vector;
	constructor(private cnv: HTMLCanvasElement) {
		this.ctx = cnv.getContext('2d') as CanvasRenderingContext2D;
		this.size = new Vector(this.cnv.width, this.cnv.height);
	}

	rect(pos: Vector, size: Vector) {
		this.ctx.fillRect(pos.x - size.x / 2, pos.y - size.y / 2, size.x, size.y);
	}

	clear() {
		this.ctx.clearRect(0, 0, this.size.x, this.size.y);
	}

	async loadImage(name: string, src: string) {
		return new Promise<HTMLImageElement>((req, res) => {
			const image = new Image();
			image.addEventListener('load', () => {
				this.loadedImages.set(name, image);
				res(image);
			})
			image.src = src;
		})
	}
}