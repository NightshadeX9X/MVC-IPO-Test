import GameEvent, { GameEventTrigger, GameEventType } from "../game_events/GameEvent.js";
import GameMap from "../roam_state/GameMap.js";
import Player from "../roam_state/Player.js";
import Spritesheet from "../Spritesheet.js";
import State from "../State.js";
import Vector from "../Vector.js";
export default class RoamState extends State {
    constructor(stateStack) {
        super(stateStack);
        this.stateStack = stateStack;
        this.timeOfDay = TimeOfDay.NIGHT;
        this.gameMap = new GameMap('route5', this);
        this.player = new Player(this);
        this.tileSize = new Vector(16);
        this.gameEvents = [];
    }
    async loadGameEvents(loader) {
        if (!this.gameMap.json?.gameEvents)
            return;
        const gameEventsToLoad = this.gameMap.json.gameEvents.map(async (ge) => {
            return (await loader.loadJS(`/js/game_events/${this.gameMap.name}/${ge}.js`)).default;
        });
        const gameEventsLoaded = await Promise.all(gameEventsToLoad);
        console.log(gameEventsLoaded);
        for (const gameEventLoaded of gameEventsLoaded) {
            if (gameEventLoaded.type === GameEventType.NPC && gameEventLoaded.imageURL) {
                const image = await loader.loadImage(gameEventLoaded.imageURL);
                const spritesheet = new Spritesheet(image, new Vector(16, 32), new Vector(4));
                const gameEvent = new GameEvent(gameEventLoaded.type, this, {
                    spritesheet,
                    pos: this.player.pos.sum(4, 1),
                    renderOffset: new Vector(0, -1),
                    renderSize: new Vector(2, 1),
                    size: new Vector(1),
                });
                gameEvent.roamState = this;
                gameEvent.evtManager.addEventListener('interact', async () => {
                    await gameEventLoaded.onInteract.call(gameEvent);
                });
                this.gameEvents.push(gameEvent);
            }
        }
    }
    async preload(loader) {
        await Promise.all([
            this.gameMap.preload(loader),
            this.player.preload(loader)
        ]);
        console.log(this.gameMap.json);
        await this.loadGameEvents(loader);
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
        if (evt && input.interactionKey)
            if (!evt.disabled) {
                evt.
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
