import ID from "./ID.js";
var Events;
(function (Events) {
    class Handler {
        constructor() {
            this.events = [];
            this.idGen = ID.Generator();
        }
        addEventListener(name, callback) {
            const id = this.idGen.next().value;
            this.events.push({
                name,
                id,
                callback
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
                    if (event.name !== nameOrId)
                        return;
                    this.events.splice(Number(index), 1);
                    removeCount++;
                }
                return removeCount;
            }
            const event = this.events.find(e => e.id === nameOrId);
            if (event) {
                this.events.splice(this.events.indexOf(event), 1);
                removeCount++;
                return removeCount;
            }
            return 0;
        }
        dispatchEvent(nameOrId, data = undefined) {
            let dispatchCount = 0;
            if (typeof nameOrId === "string") {
                const eventsWithName = this.events.filter(e => e.name === nameOrId);
                eventsWithName.forEach(eventWithName => {
                    eventWithName.callback(data);
                    dispatchCount++;
                });
                return dispatchCount;
            }
            const event = this.events.find(e => e.id === nameOrId);
            if (event) {
                event.callback(data);
                dispatchCount++;
                return dispatchCount;
            }
            return 0;
        }
    }
    Events.Handler = Handler;
})(Events || (Events = {}));
export default Events;
