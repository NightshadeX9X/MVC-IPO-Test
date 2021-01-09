import Controller from "./classes/Controller.js";
import Loader from "./classes/Loader.js";
import Vector from "./classes/Vector.js";

export interface Entity {
	preload(loader: Loader): Promise<void>;
	init(): void;
	update(controller: Controller): void;
	render(ctx: CanvasRenderingContext2D): void;
}
export interface JSONVector {
	x: number;
	y: number;
}

export namespace GameMapJSON {
	export namespace Raw {
		export interface Data {
			name: string;
			imageUrl: string;
			sizeInTiles: JSONVector;
			tileDataGeneratorArgs: TileDataGeneratorArgs;
		}

		export interface TileDataGeneratorArgs {
			defaultString: string;
			overrides: Override[];
		}

		export interface Override {
			pos1: JSONVector;
			pos2: JSONVector;
			value: string;
		}

	}

	export namespace Pure {
		export interface Data {
			name: string;
			imageUrl: string;
			sizeInTiles: Vector;
			tileDataGeneratorArgs: TileDataGeneratorArgs;
		}

		export interface TileDataGeneratorArgs {
			defaultString: string;
			overrides: Override[];
		}

		export interface Override {
			pos1: Vector;
			pos2: Vector;
			value: string;
		}
	}

}