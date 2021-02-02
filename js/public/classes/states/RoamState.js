import { delay } from "../../Util.js";
import GameEvent, { GameEventTrigger } from "../GameEvent.js";
import GameMap from "../GameMap.js";
import Player from "../Player.js";
import Spritesheet from "../Spritesheet.js";
import State from "../State.js";
import Vector from "../Vector.js";
import DelayState from "./DelayState.js";
import FadeState from "./FadeState.js";
import TextBoxState from "./TextBoxState.js";
export default class RoamState extends State {
    constructor(stateStack) {
        super(stateStack);
        this.stateStack = stateStack;
        this.timeOfDay = TimeOfDay.NIGHT;
        this.gameMap = new GameMap('the_square', this);
        this.player = new Player(this);
        this.tileSize = new Vector(16);
        this.gameEvents = [];
    }
    async preload(loader) {
        await Promise.all([
            this.gameMap.preload(loader),
            this.player.preload(loader)
        ]);
        const image = await loader.loadImage(`/assets/images/people/player.png`);
        const spritesheet = new Spritesheet(image, new Vector(16, 32), new Vector(4));
        console.log(spritesheet);
        this.gameEvents.push(new GameEvent(this, {
            spritesheet,
            pos: this.player.pos.sum(4, 1),
            renderOffset: new Vector(0, -1),
            renderSize: new Vector(2, 1),
            size: new Vector(1),
        }));
        const evt = this.gameEvents[0];
        evt.roamState = this;
        evt.evtManager.addEventListener('interact', async () => {
            if (evt.disabled)
                return;
            evt.disabled = true;
            const tbs = new TextBoxState(this.stateStack, `Hello there fellow trainer! You like a lot like me...\nInteresting... you know, just for that, I'll heal your pokemon. Yeah, really!`);
            this.stateStack.push(tbs);
            await tbs.pop();
            if (this.stateStack.game.party.isFullyHealed()) {
                const tbs2 = new TextBoxState(this.stateStack, `Wait a minute..! Your party is already healed! Get outta here!`);
                this.stateStack.push(tbs2);
                await tbs2.pop();
                this.stateStack.push(new DelayState(this.stateStack, 30));
                await this.stateStack.fromTop().pop();
                await this.stateStack.push(new FadeState(this.stateStack));
                await delay(500);
                this.player.pos.add(2);
                this.player.camera.pos = Vector.from(this.player.pos.prod(this.tileSize));
                await this.stateStack.fromTop().pop();
            }
            else {
                this.stateStack.game.party.heal();
                this.stateStack.push(new DelayState(this.stateStack, 120));
                await this.stateStack.fromTop().pop();
                const tbs2 = new TextBoxState(this.stateStack, `Your pokemon have been healed!`);
                this.stateStack.push(tbs2);
                await tbs2.pop();
            }
            setTimeout(() => evt.disabled = false, 3000);
        });
    }
    init() {
        this.gameMap.init();
        this.player.init();
    }
    update(input) {
        this.player.update(input);
        const evt = this.gameEvents
            .filter(g => g.data.trigger === GameEventTrigger.INTERACTION_KEY)
            .filter(g => g.isAheadOfPlayer())[0];
        if (input.interactionKey)
            if (!evt.disabled) {
                evt?.
                    evtManager.dispatchEvent(GameEvent.interactEvt);
            }
        /* this.gameEvents.forEach(e => {
            e.cooldown++;
        }) */
    }
    render(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.player.camera.clear();
        const entries = [...this.gameMap.layers, ...this.gameEvents, this.player];
        const sorted = entries.sort((a, b) => {
            let va = Array.isArray(a) ? a[1] : a;
            let vb = Array.isArray(b) ? b[1] : b;
            return va.zIndex - vb.zIndex;
        });
        for (const entry of sorted) {
            const entity = Array.isArray(entry) ? entry[1] : entry;
            entity.render(this.player.camera);
        }
        this.player.camera.render(ctx);
    }
}
var TimeOfDay;
(function (TimeOfDay) {
    TimeOfDay[TimeOfDay["NIGHT"] = 0] = "NIGHT";
    TimeOfDay[TimeOfDay["DAY"] = 1] = "DAY";
})(TimeOfDay || (TimeOfDay = {}));
