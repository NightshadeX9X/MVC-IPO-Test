import Vector from "./Vector.js";

export function createCanvas(size: Vector) {
	const cnv = document.createElement('canvas');
	const ctx = cnv.getContext('2d') as CanvasRenderingContext2D;
	cnv.width = size.x;
	cnv.height = size.y;
	return { cnv, ctx };
}

/**  Helper function to copy properties from an array of objects (bs), into one object (a) */
export function copyProperties(a: Record<keyof any, any>, bs: Record<keyof any, any>[], override = true) {
	function copyFromSingleObject(a: Record<keyof any, any>, b: Record<keyof any, any>) {
		Object.getOwnPropertyNames(b).forEach(name => {
			if (!override && a.hasOwnProperty(name)) return;
			a[name] = b[name];
		})
	}

	bs.forEach(b => copyFromSingleObject(a, b))
}
export function applyMixins(base: Constructor, mixins: Mixin[]) {
	copyProperties(base.prototype, mixins.map(mixin => mixin.prototype), false);
}

export type Constructor<TInstance = {}, TArgs extends any[] = any[]> = new (...args: TArgs) => TInstance;
export type Mixin<TInstance = {}, TArgs extends any[] = any[]> = Constructor<{}, []> & { construct(...args: TArgs): void }

export function omitKeys<T extends Record<string, any>, K extends keyof T>(key: K, obj: T) {
	const { [key]: omitted, ...rest } = obj;
	return rest as Omit<T, K>;
}

export function random(min = 0, max = 1, whole = true) {
	if (whole) return Math.floor(Math.random() * (max - min + 1) + min);
	else return Math.random() * (max - min) + min;
}

export type ChildClass<TParent extends Constructor, TArgs extends any[] = any[]> = new (...args: TArgs) => InstanceType<TParent>