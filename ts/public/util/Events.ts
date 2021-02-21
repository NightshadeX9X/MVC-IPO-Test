import { New } from "./functions.js";
import UIDGen from "./UIDGen.js";

namespace Events {
	export interface Transmission<TTransmission = any> {
		name: string;
		id: number;
		data: TTransmission;
	}
	export interface Reception<TReception extends any[] = any[]> {
		name: string;
		id: string;
		callback(...data: TReception): void;
		priority: number;
	}

	export class Handler {
		private events: Reception[] = [];
		private idGen = New(UIDGen);

		constructor() {
			return New(Handler);
		}

		static construct(this: Handler) {
			this.events = [];
			this.idGen = New(UIDGen);
			this.idGen.prefix = "EVT";

			return this;
		}

		addEventListener(name: string, callback: Reception["callback"], priority = 0) {
			const id = this.idGen.generate();
			this.events.push({
				name,
				id,
				callback,
				priority
			});

			return id;
		}

		removeEventListener(name: string): number;
		removeEventListener(nameOrId: string) {
			let removeCount = 0;
			if (typeof nameOrId === "string") {
				for (let index = this.events.length - 1; index >= 0; index--) {
					const event = this.events[index];
					if (!event) continue;

					if (event.name !== nameOrId && event.id !== nameOrId) return removeCount;
					this.events.splice(Number(index), 1);
					removeCount++;
				}
			}
			return removeCount;

		}

		dispatchEvent(name: string, ...data: any[]): number;
		dispatchEvent(id: number, ...data: any[]): number;
		dispatchEvent(nameOrId: string | number, ...data: any[]) {
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
}

export default Events;