export abstract class Updatable {
	toUpdate: boolean | null = null as any;
	static construct(this: Updatable) {
		this.toUpdate = null;
	}

	abstract update(): void;
}

export abstract class Renderable {
	toRender: boolean | null = null as any;
	static construct(this: Renderable) {
		this.toRender = null;
	}

	abstract render(): void;
}