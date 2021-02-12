namespace ID {

	export function* Generator() {
		let i = 0;
		while (true) yield i++;
	}

	export function get(generator: ReturnType<typeof Generator>) {
		return generator.next().value as number;
	}
}
export default ID;