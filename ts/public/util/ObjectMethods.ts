import { random } from "./functions.js";

export namespace ArrayUtil {
	export function randomElement<T>(arr: T[]): T | undefined {
		return arr[random(0, arr.length)];
	}
	export function limit<T>(array: T[], limit: number): T[] {
		let copy = [...array];
		/*
			let arr = [1, 2, 3, 4, 5, 6, 7];
			limitArray(arr, 2) --> [1, 2]
		
		*/
		for (let i = limit; i < copy.length; i++) {
			copy.splice(i, 1);
		}
		return copy;
	}
	export function last<T>(array: T[]) {
		return array[array.length - 1]
	}
	export function invert<T>(array: T[]) {
		const output: T[] = [];
		array.forEach((item, index) => {
			output[array.length - index - 1] = item;
		});
		return output;
	}
}