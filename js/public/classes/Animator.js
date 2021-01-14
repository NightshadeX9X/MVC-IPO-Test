export default class Animator {
    constructor(spritesheet) {
        this.spritesheet = spritesheet;
        this.animations = new Map();
    }
    register(name, initialCoord, coordTweakList) {
        this.animations.set(name, { coordTweakList, iteration: 0, initialCoord });
    }
    play(name) {
        const animation = this.animations.get(name);
        if (!animation)
            return;
        if (animation.iteration === 0)
            this.spritesheet.coords = animation.initialCoord;
        const vec = animation.coordTweakList[animation.iteration % animation.coordTweakList.length];
        this.spritesheet.coords.add(vec);
        this.spritesheet.coords.x %= this.spritesheet.spriteCount.x;
        this.spritesheet.coords.y %= this.spritesheet.spriteCount.y;
        animation.iteration++;
    }
}
