export type JSON = Record<string, Exclude<any, Function>> | Exclude<any, Function>[];
export type Loadable = HTMLImageElement | HTMLAudioElement | JSON;
export default class Loader {
	private alreadyLoaded = new Map<string, Loadable>();

	constructor() {
		console.log("new loader")
	}

	public async loadJSON(src: string, name = src, dynamic = false) {
		const loaded = this.alreadyLoaded.get(name);
		if (loaded && !dynamic) return Promise.resolve(loaded as JSON);
		const res = await fetch(src);
		const json = res.json() as JSON;
		if (!dynamic)
			this.alreadyLoaded.set(name, json);
		return json;
	}

	public async loadImage(src: string, name = src, dynamic = false) {
		const loaded = this.alreadyLoaded.get(name);
		if (loaded && !dynamic) return Promise.resolve(loaded as HTMLImageElement);
		return new Promise<HTMLImageElement>((res, rej) => {
			const image = new Image();
			image.onload = () => {
				if (!dynamic)
					this.alreadyLoaded.set(name, image)
				res(image);
			}
			image.src = src;
		})
	}

	public async loadAudio(src: string, name = src, dynamic = false) {
		const loaded = this.alreadyLoaded.get(name);
		if (loaded && !dynamic) return loaded as HTMLAudioElement;
		const audio = new Audio(src);
		if (!dynamic)
			this.alreadyLoaded.set(name, audio)
		return audio;
	}

	public async loadJS<T = any>(path: string) {
		const imported = await import(path) as T;
		return imported;
	}
}