import Vector from "./classes/Vector.js";
export const SAVE_DATA_STORAGE_KEY = 'savedata';
export function getSaveData() {
    const gottenSaveDataStr = localStorage.getItem(SAVE_DATA_STORAGE_KEY);
    if (!gottenSaveDataStr) {
        const saveData = getInitialSaveData();
        setSaveData(saveData);
        return saveData;
    }
    const gottenSaveData = JSON.parse(gottenSaveDataStr);
    return handleGottenSaveData(gottenSaveData);
}
export function setSaveData(saveData) {
    localStorage.setItem(SAVE_DATA_STORAGE_KEY, JSON.stringify(saveData));
}
function handleGottenSaveData(gottenSaveData) {
    return {
        ...gottenSaveData,
        pos: new Vector(gottenSaveData.pos.x, gottenSaveData.pos.y)
    };
}
export function getInitialSaveData() {
    return {
        playerName: "Player",
        currentMap: "the-square",
        pos: new Vector(18, 0),
    };
}
