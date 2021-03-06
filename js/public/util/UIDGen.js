var UIDGen = /** @class */ (function () {
    function UIDGen(prefix) {
        if (prefix === void 0) { prefix = ""; }
        this.prefix = prefix;
        this.count = 0;
    }
    UIDGen.prototype.generate = function () {
        return this.prefix + ":" + this.count++;
    };
    return UIDGen;
}());
export default UIDGen;
