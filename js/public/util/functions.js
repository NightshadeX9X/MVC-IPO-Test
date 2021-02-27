export var Mixin;
(function (Mixin) {
    function apply(child, parents) {
        copyProperties(child.prototype, parents.map(p => p.prototype), false);
    }
    Mixin.apply = apply;
})(Mixin || (Mixin = {}));
export function copyProperties(a, bs, override = true) {
    function copyFromSingleObject(a, b) {
        Object.getOwnPropertyNames(b).forEach(name => {
            if (!override && a.hasOwnProperty(name))
                return;
            a[name] = b[name];
        });
    }
    bs.forEach(b => copyFromSingleObject(a, b));
    return a;
}
export function New(ctor, ...args) {
    // @ts-ignore
    return ctor.construct.call(Object.create(ctor.prototype), ...args);
}
export function random(min = 0, max = 1, whole = true) {
    return whole ? Math.floor(Math.random() * (max - min + 1) + min) : Math.random() * (max - min) + min;
}
export function insertIntoArray(array, index, values) {
    return [...array.slice(0, index), ...values, ...array.slice(index)];
}
export function createCanvas(size) {
    const cnv = document.createElement('canvas');
    const ctx = cnv.getContext('2d');
    cnv.width = size.x;
    cnv.height = size.y;
    return { cnv, ctx };
}
