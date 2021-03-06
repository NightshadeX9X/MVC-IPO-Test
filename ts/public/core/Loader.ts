import { New } from '../util/functions.js';
import { JSON } from '../util/types.js';

interface Loader { }
class Loader {
	private alreadyLoaded = new Map<string, Loader.Loadable>();
	constructor() {

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

	public async loadJSModule<T = any>(path: string) {
		const imported = await import(path) as T;
		return imported;
	}

	public async loadJSDefault<T = any>(path: string) {
		return await this.loadJSModule<{ default: T }>(path);
	}
}

namespace Loader {
	export type Loadable = HTMLImageElement | HTMLAudioElement | JSON;
}

export default Loader;