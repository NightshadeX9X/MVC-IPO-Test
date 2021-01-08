export default class Loader {
    constructor() {
        this.alreadyLoaded = new Map();
        if (Loader.instance === null)
            Loader.instance = this;
        else
            return Loader.instance;
    }
    image(src, giveName = src) {
        if (this.alreadyLoaded.has(src)) {
            return Promise.resolve(this.alreadyLoaded.get(giveName));
        }
        return new Promise((res, rej) => {
            const image = new Image();
            image.addEventListener('load', e => {
                try {
                    res(image);
                    this.alreadyLoaded.set(giveName, image);
                }
                catch (e) {
                    rej(image);
                }
            });
            image.src = src;
        });
    }
    audio(src, giveName = src) {
        if (this.alreadyLoaded.has(src)) {
            return Promise.resolve(this.alreadyLoaded.get(giveName));
        }
        const audio = new Audio(src);
        return Promise.resolve(audio);
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
}
Loader.instance = null;
