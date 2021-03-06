var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
export function Parents() {
    var parents = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        parents[_i] = arguments[_i];
    }
    return function (child) {
        // @ts-ignore
        child.parents = parents;
        var parentMethodCollection = {};
        function copyFromParent(parent) {
            var _a;
            // @ts-ignore;
            (_a = parent.parents) === null || _a === void 0 ? void 0 : _a.forEach(function (grandParent) {
                copyProperties(parentMethodCollection, [grandParent.prototype]);
            });
            copyProperties(parentMethodCollection, [parent.prototype]);
        }
        parents.forEach(function (parent) {
            copyFromParent(parent);
        });
        Object.setPrototypeOf(child.prototype, parentMethodCollection);
        child.prototype.constructor = child;
    };
}
export function copyProperties(a, bs, override) {
    if (override === void 0) { override = true; }
    function copyFromSingleObject(a, b) {
        Object.getOwnPropertyNames(b).forEach(function (name) {
            if (!override && a.hasOwnProperty(name))
                return;
            a[name] = b[name];
        });
    }
    bs.forEach(function (b) { return copyFromSingleObject(a, b); });
    return a;
}
export function New(ctor) {
    var _a;
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    // @ts-ignore
    return (_a = ctor.construct).call.apply(_a, __spreadArrays([Object.create(ctor.prototype)], args));
}
export function random(min, max, whole) {
    if (min === void 0) { min = 0; }
    if (max === void 0) { max = 1; }
    if (whole === void 0) { whole = true; }
    return whole ? Math.floor(Math.random() * (max - min + 1) + min) : Math.random() * (max - min) + min;
}
export function chance(x, outOfY) {
    if (x === void 0) { x = 1; }
    if (outOfY === void 0) { outOfY = 100; }
    if (x >= outOfY)
        return true;
    var num = random(1, outOfY, true);
    return num <= x;
}
export function insertIntoArray(array, index, values) {
    return __spreadArrays(array.slice(0, index), values, array.slice(index));
}
export function createCanvas(size) {
    var cnv = document.createElement('canvas');
    var ctx = cnv.getContext('2d');
    cnv.width = size.x;
    cnv.height = size.y;
    return { cnv: cnv, ctx: ctx };
}
