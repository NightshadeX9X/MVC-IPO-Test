import State from "../core/State.js";
class FadeState extends State {
    constructor(stateStack, color = "white", speed = 4) {
        super(stateStack);
        this.stateStack = stateStack;
        this.color = color;
        this.speed = speed;
        this.section = FadeState.Section.ASCENDING;
        this.alpha = 0;
    }
    resume() {
        if (this.section === FadeState.Section.WAITING)
            this.section = FadeState.Section.DESCENDING;
    }
    update(input) {
        if (this.section === FadeState.Section.ASCENDING) {
            this.alpha += this.speed;
            if (this.alpha >= 255) {
                this.switch(FadeState.Section.WAITING);
            }
        }
        else if (this.section === FadeState.Section.DESCENDING) {
            this.alpha -= this.speed;
            if (this.alpha <= 0) {
                this.switch(FadeState.Section.ENDED);
            }
        }
        else if (this.section === FadeState.Section.ENDED) {
            this.stateStack.pop();
        }
    }
    switch(section) {
        this.section = section;
        this.evtHandler.dispatchEvent('state switch', this.section);
    }
    render(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha / 255;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.restore();
    }
    async reach(section) {
        return new Promise((res, rej) => {
            this.evtHandler.addEventListener('state switch', (to) => {
                if (to === section)
                    res();
            });
        });
    }
}
(function (FadeState) {
    let Section;
    (function (Section) {
        Section[Section["ASCENDING"] = 0] = "ASCENDING";
        Section[Section["WAITING"] = 1] = "WAITING";
        Section[Section["DESCENDING"] = 2] = "DESCENDING";
        Section[Section["ENDED"] = 3] = "ENDED";
    })(Section = FadeState.Section || (FadeState.Section = {}));
})(FadeState || (FadeState = {}));
export default FadeState;
