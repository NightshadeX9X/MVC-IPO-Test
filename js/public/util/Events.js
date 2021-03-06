import UIDGen from "./UIDGen.js";
var Events;
(function (Events) {
    var Handler = /** @class */ (function () {
        function Handler() {
            this.events = [];
            this.idGen = new UIDGen();
            this.idGen.prefix = "EVT";
        }
        Handler.prototype.addEventListener = function (name, callback, priority) {
            if (priority === void 0) { priority = 0; }
            var id = this.idGen.generate();
            this.events.push({
                name: name,
                id: id,
                callback: callback,
                priority: priority
            });
            return id;
        };
        Handler.prototype.removeEventListener = function (nameOrId) {
            var removeCount = 0;
            if (typeof nameOrId === "string") {
                for (var index = this.events.length - 1; index >= 0; index--) {
                    var event_1 = this.events[index];
                    if (!event_1)
                        continue;
                    if (event_1.name !== nameOrId && event_1.id !== nameOrId)
                        return removeCount;
                    this.events.splice(Number(index), 1);
                    removeCount++;
                }
            }
            return removeCount;
        };
        Handler.prototype.dispatchEvent = function (nameOrId) {
            var data = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                data[_i - 1] = arguments[_i];
            }
            var dispatchCount = 0;
            if (typeof nameOrId === "string") {
                var eventsWithName = this.events.filter(function (e) { return e.name === nameOrId || e.id === nameOrId; });
                eventsWithName.sort(function (a, b) { return b.priority - a.priority; }).forEach(function (eventWithName) {
                    eventWithName.callback.apply(eventWithName, data);
                    dispatchCount++;
                });
                return dispatchCount;
            }
            return 0;
        };
        return Handler;
    }());
    Events.Handler = Handler;
})(Events || (Events = {}));
export default Events;
