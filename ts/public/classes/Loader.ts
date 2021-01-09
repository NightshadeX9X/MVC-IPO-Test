export default class Loader {
	private static instance: Loader | null = null;
	public alreadyLoaded = new Map<string, HTMLImageElement | HTMLAudioElement>();
	constructor() {
		if (Loader.instance === null) Loader.instance = this;
		else return Loader.instance;
	}

	image(src: string, giveName = src) {
		if (this.alreadyLoaded.has(src)) {
			return Promise.resolve(this.alreadyLoaded.get(giveName) as HTMLImageElement)
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

	audio(src: string, giveName = src) {
		if (this.alreadyLoaded.has(src)) {
			return Promise.resolve(this.alreadyLoaded.get(giveName) as HTMLAudioElement)
		}
		const audio = new Audio(src);
		return Promise.resolve(audio)
		/* return new Promise<HTMLAudioElement>((res, rej) => {
			const audio = new Audio();
			audio.addEventListener('load', e => {
				try {

					res(audio);
					this.alreadyLoaded.set(giveName, audio);
				} catch (e) {
					rej(audio);
				}
			})
			audio.src = src;
		}) */
	}
	async json(url: string) {
		const res = await fetch(url)
		const json = await res.json() as Record<string, any>;

		return json;
	}
}