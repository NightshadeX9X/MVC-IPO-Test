import State from "../core/State.js";
class BlankState extends State {
    constructor(stateStack) {
        super(stateStack);
    }
    update(input) {
        this.subStateStack.update(input);
    }
    render(ctx) {
        this.subStateStack.render(ctx);
    }
}
(function (BlankState) {
    async function create(stateStack, customUpdate = (input) => { }) {
        const bs = new BlankState(stateStack);
        bs.update = (input) => {
            customUpdate(input);
            BlankState.prototype.update.call(bs, input);
        };
        await stateStack.push(bs);
        return bs;
    }
    BlankState.create = create;
})(BlankState || (BlankState = {}));
export default BlankState;
