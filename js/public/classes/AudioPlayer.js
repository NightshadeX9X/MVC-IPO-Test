export class AudioPlayer {
    constructor() {
        this.tracks = new Map();
    }
    play(track, audio, volume) {
        const gotten = this.tracks.get(track);
        if (gotten && gotten.src === audio.src && gotten.volume === volume) {
            gotten.volume = volume;
            gotten.play();
            return;
        }
        this.tracks.set(track, audio);
        audio.play();
    }
    pause(track) {
        const gotten = this.tracks.get(track);
        if (gotten) {
            gotten.pause();
        }
    }
    async loadAndPlay(loader, src, track, volume = 1) {
        const audio = await loader.loadAudio(src);
        this.play(track, audio, volume);
    }
}
