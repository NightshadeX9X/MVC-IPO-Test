var Party = /** @class */ (function () {
    function Party() {
        this.pokemon = [];
    }
    Object.defineProperty(Party.prototype, "head", {
        get: function () {
            return this.pokemon[0];
        },
        enumerable: false,
        configurable: true
    });
    return Party;
}());
export default Party;
