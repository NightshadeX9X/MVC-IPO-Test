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
            return Promise.resolve(this.alreadyLoaded.get(src));
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
}
Loader.instance = null;
