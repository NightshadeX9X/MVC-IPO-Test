export default class Animator {
    constructor(spritesheet) {
        this.spritesheet = spritesheet;
        this.animations = new Map();
    }
    register(name, initialCoord, coordTweakList) {
        this.animations.set(name, { coordTweakList, iteration: 0, initialCoord, active: false });
    }
    play(name) {
        const animation = this.animations.get(name);
        if (!animation)
            return;
        if (!animation.active) {
            this.spritesheet.coords = animation.initialCoord;
            animation.active = true;
        }
        ;
        const vec = animation.coordTweakList[animation.iteration % animation.coordTweakList.length];
        this.spritesheet.coords.add(vec);
        this.spritesheet.coords.x %= this.spritesheet.spriteCount.x;
        this.spritesheet.coords.y %= this.spritesheet.spriteCount.y;
        animation.iteration++;
    }
    end(name) {
        const animation = this.animations.get(name);
        if (!animation)
            return;
        animation.active = false;
    }
}
