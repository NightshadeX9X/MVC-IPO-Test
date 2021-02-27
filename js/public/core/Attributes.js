import { New } from "../util/functions.js";
export class Updatable {
    constructor() {
        return New(Updatable);
    }
    static construct() {
        this.toUpdate = null;
        return this;
    }
    update(input) { }
    ;
}
export class Renderable {
    constructor() {
        return New(Renderable);
    }
    static construct() {
        this.toRender = null;
        return this;
    }
    render(ctx) { }
    ;
}
export class Preloadable {
    constructor() {
        return New(Preloadable);
    }
    static construct() {
        this.toPreload = null;
        return this;
    }
    async preload(loader) { }
    ;
}
