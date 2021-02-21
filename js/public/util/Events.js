import { New } from "./functions.js";
import UIDGen from "./UIDGen.js";
var Events;
(function (Events) {
    class Handler {
        constructor() {
            this.events = [];
            this.idGen = New(UIDGen);
            return New(Handler);
        }
        static construct() {
            this.events = [];
            this.idGen = New(UIDGen);
            this.idGen.prefix = "EVT";
            return this;
        }
        addEventListener(name, callback, priority = 0) {
            const id = this.idGen.generate();
            this.events.push({
                name,
                id,
                callback,
                priority
            });
            return id;
        }
        removeEventListener(nameOrId) {
            let removeCount = 0;
            if (typeof nameOrId === "string") {
                for (let index = this.events.length - 1; index >= 0; index--) {
                    const event = this.events[index];
                    if (!event)
                        continue;
                    if (event.name !== nameOrId && event.id !== nameOrId)
                        return;
                    this.events.splice(Number(index), 1);
                    removeCount++;
                }
                return removeCount;
            }
            return 0;
        }
        dispatchEvent(nameOrId, ...data) {
            let dispatchCount = 0;
            if (typeof nameOrId === "string") {
                const eventsWithName = this.events.filter(e => e.name === nameOrId || e.id === nameOrId);
                eventsWithName.sort((a, b) => b.priority - a.priority).forEach(eventWithName => {
                    eventWithName.callback(...data);
                    dispatchCount++;
                });
                return dispatchCount;
            }
            return 0;
        }
    }
    Events.Handler = Handler;
})(Events || (Events = {}));
export default Events;
