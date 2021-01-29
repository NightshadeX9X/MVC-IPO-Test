export default class GameMapLayer {
    constructor(gameMap) {
        this.gameMap = gameMap;
        this.cnv = document.createElement('canvas');
        this.ctx = this.cnv.getContext('2d');
        this.cnv.width = this.gameMap.sizeInPx.x;
        this.cnv.height = this.gameMap.sizeInPx.y;
    }
}
