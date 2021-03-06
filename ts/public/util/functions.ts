import { Class, Constructor } from "./types.js";
import Vector from "./Vector.js";

export function Parents(...parents: Constructor[]) {
	return function (child: Constructor) {
		// @ts-ignore
		child.parents = parents;
		const parentMethodCollection: any = {};
		function copyFromParent(parent: Constructor) {
			// @ts-ignore;
			parent.parents?.forEach(grandParent => {
				copyProperties(parentMethodCollection, [grandParent.prototype]);
			})
			copyProperties(parentMethodCollection, [parent.prototype]);
		}
		parents.forEach(parent => {
			copyFromParent(parent);
		});
		Object.setPrototypeOf(child.prototype, parentMethodCollection);
		child.prototype.constructor = child;
	}
}
export function copyProperties(a: Record<keyof any, any>, bs: Record<keyof any, any>[], override = true) {
	function copyFromSingleObject(a: Record<keyof any, any>, b: Record<keyof any, any>) {
		Object.getOwnPropertyNames(b).forEach(name => {
			if (!override && a.hasOwnProperty(name)) return;
			a[name] = b[name];
		})
	}

	bs.forEach(b => copyFromSingleObject(a, b));
	return a;
}

export function New<TInstance, TArgs extends any[]>(ctor: Class<TInstance, TArgs>, ...args: TArgs) {
	// @ts-ignore
	return ctor.construct.call(Object.create(ctor.prototype), ...args);
}

export function random(min = 0, max = 1, whole = true) {
	return whole ? Math.floor(Math.random() * (max - min + 1) + min) : Math.random() * (max - min) + min;
}

export function chance(x = 1, outOfY = 100) {
	if (x >= outOfY) return true;
	const num = random(1, outOfY, true);
	return num <= x;
}

export function insertIntoArray<T>(array: T[], index: number, values: T[]) {
	return [...array.slice(0, index), ...values, ...array.slice(index)]
}

export function createCanvas(size: Vector) {
	const cnv = document.createElement('canvas');
	const ctx = cnv.getContext('2d') as CanvasRenderingContext2D;
	cnv.width = size.x;
	cnv.height = size.y;
	return { cnv, ctx }
}