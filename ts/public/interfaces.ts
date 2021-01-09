export default interface Entity {
	preload(): Promise<void>;
	init(): void;
	update(): void;
	render(): void;
}