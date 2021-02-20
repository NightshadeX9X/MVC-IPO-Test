import { Class } from "./types.js";

export namespace Mixin {
	export function apply<C>(child: Class<C, any[]>, parents: Class<any, any[]>[]) {
		copyProperties(child.prototype, parents.map(p => p.prototype), false)
	}
}
export function copyProperties(a: Record<keyof any, any>, bs: Record<keyof any, any>[], override = true) {
	function copyFromSingleObject(a: Record<keyof any, any>, b: Record<keyof any, any>) {
		Object.getOwnPropertyNames(b).forEach(name => {
			if (!override && a.hasOwnProperty(name)) return;
			a[name] = b[name];
		})
	}

	bs.forEach(b => copyFromSingleObject(a, b))
}

export function create<TInstance, TArgs extends any[]>(ctor: Class<TInstance, TArgs>, ...args: TArgs) {
	return ctor.construct.call(Object.create(ctor.prototype), ...args);
}