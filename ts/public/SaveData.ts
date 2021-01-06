import Vector from "./classes/Vector.js";
import Player from './classes/Player';

export const SAVE_DATA_STORAGE_KEY = 'savedata';

export default interface SaveData {
	playerName: string;
	currentMap: string;
	pos: Vector;
}
export function getSaveData() {
	const gottenSaveDataStr = localStorage.getItem(SAVE_DATA_STORAGE_KEY);
	if (!gottenSaveDataStr) {
		const saveData = getInitialSaveData();
		setSaveData(saveData)
		return saveData;
	}
	const gottenSaveData = JSON.parse(gottenSaveDataStr);
	return handleGottenSaveData(gottenSaveData)
}

export function setSaveData(saveData: SaveData) {
	localStorage.setItem(SAVE_DATA_STORAGE_KEY, JSON.stringify(saveData));
}

function handleGottenSaveData(gottenSaveData: any): SaveData {
	return {
		...gottenSaveData,
		pos: new Vector(gottenSaveData.pos.x, gottenSaveData.pos.y)
	}
}

export function getInitialSaveData(): SaveData {
	return {
		playerName: "Player",
		currentMap: "the_square",
		pos: new Vector(18, 0),
		// pos: new Vector(5, 15),
	}
}
