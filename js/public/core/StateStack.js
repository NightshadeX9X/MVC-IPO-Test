class StateStack {
    constructor() {
        this.game = null;
        this.parent = null;
        this.states = null;
    }
    static construct(game, parent) {
        this.game = game;
        this.parent = parent;
        this.states = [];
        return this;
    }
}
export default StateStack;
