import Vector from "./Vector.js";

export function createCanvas(size: Vector) {
	const cnv = document.createElement('canvas');
	const ctx = cnv.getContext('2d') as CanvasRenderingContext2D;
	cnv.width = size.x;
	cnv.height = size.y;
	return { cnv, ctx };
}