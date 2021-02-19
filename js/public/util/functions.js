export function createCanvas(size) {
    const cnv = document.createElement('canvas');
    const ctx = cnv.getContext('2d');
    cnv.width = size.x;
    cnv.height = size.y;
    return { cnv, ctx };
}
/**  Helper function to copy properties from an array of objects (bs), into one object (a) */
export function copyProperties(a, bs, override = true) {
    function copyFromSingleObject(a, b) {
        Object.getOwnPropertyNames(b).forEach(name => {
            if (!override && a.hasOwnProperty(name))
                return;
            a[name] = b[name];
        });
    }
    bs.forEach(b => copyFromSingleObject(a, b));
}
export function applyMixins(base, mixins) {
    copyProperties(base.prototype, mixins.map(mixin => mixin.prototype), false);
}
export function omitKeys(key, obj) {
    const { [key]: omitted, ...rest } = obj;
    return rest;
}
export function random(min = 0, max = 1, whole = true) {
    if (whole)
        return Math.floor(Math.random() * (max - min + 1) + min);
    else
        return Math.random() * (max - min) + min;
}
