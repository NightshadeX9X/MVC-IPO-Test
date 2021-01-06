export default class Loader {
	private static instance: Loader | null = null;
	public alreadyLoaded = new Map<string, HTMLImageElement>();
	constructor() {
		if (Loader.instance === null) Loader.instance = this;
		else return Loader.instance;
	}

	image(src: string, giveName = src) {
		if (this.alreadyLoaded.has(src)) {
			return Promise.resolve(this.alreadyLoaded.get(src)) as Promise<HTMLImageElement>
		}
		return new Promise<HTMLImageElement>((res, rej) => {
			const image = new Image();
			image.addEventListener('load', e => {
				try {

					res(image);
					this.alreadyLoaded.set(giveName, image);
				} catch (e) {
					rej(image);
				}
			})
			image.src = src;
		})
	}
}