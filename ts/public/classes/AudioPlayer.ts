import Loader from "./Loader.js";

export class AudioPlayer {
	private tracks = new Map<string, HTMLAudioElement>();

	play(track: string, audio: HTMLAudioElement, volume: number) {
		const gotten = this.tracks.get(track);
		if (gotten && gotten.src === audio.src && gotten.volume === volume) {
			gotten.volume = volume;
			gotten.play();
			return;
		}

		this.tracks.set(track, audio);

		audio.play();
	}

	pause(track: string) {
		const gotten = this.tracks.get(track);
		if (gotten) {
			gotten.pause();
		}
	}

	async loadAndPlay(loader: Loader, src: string, track: string, volume = 1) {
		const audio = await loader.loadAudio(src);
		this.play(track, audio, volume);
	}
}