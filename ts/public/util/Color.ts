type HexColor = `#${string}`;
type RGBAColor = [number, number, number, number?];
type NamedColor = "red" | "blue" | "green" | "cyan" | "purple" | "yellow" | "black" | "white";

type Color = HexColor | RGBAColor;

export default Color;