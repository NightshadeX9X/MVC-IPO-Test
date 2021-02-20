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
}
export function create(ctor, ...args) {
    return ctor.construct.call(Object.create(ctor.prototype), ...args);
}
