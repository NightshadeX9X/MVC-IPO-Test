export default class Loader {
    constructor() {
        this.alreadyLoaded = new Map();
        console.log("new loader");
    }
    async loadJSON(src, name = src, dynamic = false) {
        const loaded = this.alreadyLoaded.get(name);
        if (loaded && !dynamic)
            return Promise.resolve(loaded);
        const res = await fetch(src);
        const json = res.json();
        if (!dynamic)
            this.alreadyLoaded.set(name, json);
        return json;
    }
    loadImage(src, name = src, dynamic = false) {
        const loaded = this.alreadyLoaded.get(name);
        if (loaded && !dynamic)
            return Promise.resolve(loaded);
        return new Promise((res, rej) => {
            const image = new Image();
            image.onload = () => {
                if (!dynamic)
                    this.alreadyLoaded.set(name, image);
                res(image);
            };
            image.src = src;
        });
    }
    async loadAudio(src, name = src, dynamic = false) {
        const loaded = this.alreadyLoaded.get(name);
        if (loaded && !dynamic)
            return loaded;
        const audio = new Audio(src);
        if (!dynamic)
            this.alreadyLoaded.set(name, audio);
        return audio;
    }
    async loadJS(path) {
        const imported = await import(path);
        return imported;
    }
}
