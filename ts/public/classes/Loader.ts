export type Loadable = Record<string, any> | HTMLImageElement | HTMLAudioElement;
export default class Loader {
	private loaded = new Map<string, Loadable>();

	loadImage(src: string, dynamic = false): Promise<HTMLImageElement> {
		if (!dynamic) {
			const old = this.loaded.get(src);
			if (old) return Promise.resolve(old as HTMLImageElement);
		}

		return new Promise((res, rej) => {
			const img = new Image();
			img.addEventListener('load', () => {
				this.loaded.set(src, img);
				res(img);
			})
			img.src = src;
		})
	}

	loadAudio(src: string, dynamic = false) {
		if (!dynamic) {
			const old = this.loaded.get(src);
			if (old) return Promise.resolve(old as HTMLAudioElement);
		}

		const audio = new Audio(src);
		return Promise.resolve(audio)
	}

	async loadJSON(src: string, dynamic = false) {
		if (!dynamic) {
			const old = this.loaded.get(src);
			if (old) return old as Record<string, any>;
		}

		const res = await fetch(src);
		const json = await res.json() as Record<string, any>;
		this.loaded.set(src, json);
		return json;
	}
}
