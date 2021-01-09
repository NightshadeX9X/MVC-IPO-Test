export default class Loader {
    constructor() {
        this.loaded = new Map();
    }
    loadImage(src, dynamic = false) {
        if (!dynamic) {
            const old = this.loaded.get(src);
            if (old)
                return Promise.resolve(old);
        }
        return new Promise((res, rej) => {
            const img = new Image();
            img.addEventListener('load', () => {
                this.loaded.set(src, img);
                res(img);
            });
            img.src = src;
        });
    }
    loadAudio(src, dynamic = false) {
        if (!dynamic) {
            const old = this.loaded.get(src);
            if (old)
                return Promise.resolve(old);
        }
        const audio = new Audio(src);
        return Promise.resolve(audio);
    }
    async loadJSON(src, dynamic = false) {
        if (!dynamic) {
            const old = this.loaded.get(src);
            if (old)
                return old;
        }
        const res = await fetch(src);
        const json = await res.json();
        this.loaded.set(src, json);
        return json;
    }
}
