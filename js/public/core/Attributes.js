import { New } from "../util/functions.js";
export class Updatable {
    constructor() {
        this.toUpdate = null;
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
        this.toRender = null;
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
        this.toPreload = null;
        return New(Preloadable);
    }
    static construct() {
        this.toPreload = null;
        return this;
    }
    async preload(loader) { }
    ;
}
