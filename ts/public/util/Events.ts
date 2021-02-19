import ID from "./ID.js";

namespace Events {

	export interface Transmission<TTransmission = any> {
		name: string;
		id: number;
		data: TTransmission;
	}
	export interface Reception<TReception extends any[] = any[]> {
		name: string;
		id: number;
		callback(...data: TReception): void;
		priority: number;
	}

	export class Handler {
		private events: Reception[] = [];
		private idGen = ID.Generator();

		addEventListener(name: string, callback: Reception["callback"], priority = 0) {
			const id = this.idGen.next().value as number;
			this.events.push({
				name,
				id,
				callback,
				priority
			});

			return id;
		}

		removeEventListener(name: string): number;
		removeEventListener(id: number): number;
		removeEventListener(nameOrId: string | number) {
			let removeCount = 0;
			if (typeof nameOrId === "string") {
				for (let index = this.events.length - 1; index >= 0; index--) {
					const event = this.events[index];
					if (!event) continue;

					if (event.name !== nameOrId) return;
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

		dispatchEvent(name: string, ...data: any[]): number;
		dispatchEvent(id: number, ...data: any[]): number;
		dispatchEvent(nameOrId: string | number, ...data: any[]) {
			let dispatchCount = 0;
			if (typeof nameOrId === "string") {
				const eventsWithName = this.events.filter(e => e.name === nameOrId);
				eventsWithName.sort((a, b) => b.priority - a.priority).forEach(eventWithName => {
					eventWithName.callback(...data);
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
}

export default Events;