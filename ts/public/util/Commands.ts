import StateStack from "../core/StateStack.js";
import GameObject from "../roam_state/GameObject.js";
import NPC from "../roam_state/game_objects/types/NPC.js";
import Walker from "../roam_state/Walker.js";
import DelayState from "../states/DelayState.js";
import InputState from "../states/InputState.js";
import TextBoxState from "../states/TextBoxState.js";
import Direction from "./Direction.js";
import { Parents } from "./functions.js";
import { ArgsType } from "./types.js";

namespace CommandSuite {
	export class GameObjects {
		protected stateStack: StateStack;
		constructor(protected go: GameObject, stateStack?: StateStack) {
			if (!stateStack) stateStack = this.go.roamState.stateStack;
			this.stateStack = stateStack;
		}
		async showText(text: string) {
			const tbs = new TextBoxState(this.stateStack, text);
			await this.stateStack.push(tbs);
			await tbs.waitForRemoval();
		}
		async collectUserInput(question: string, regex = /^.+$/i) {
			const input = new InputState(this.stateStack, question, regex);
			await this.stateStack.push(input);
			await input.waitForRemoval();
			return input;
		}
		async delay(frames: number) {
			await DelayState.create(this.stateStack, frames);
		}
		async preparePlayer() {
			await DelayState.create(this.stateStack, 10);
			this.go.roamState.player.walkingEnabled = false;
			this.go.roamState.player.canInteract = false;
		}
		async unpreparePlayer() {
			await DelayState.create(this.stateStack, 10);
			this.go.roamState.player.walkingEnabled = true;
			this.go.roamState.player.canInteract = true;
		}
	}

	export interface NPCs extends GameObjects { }
	@Parents(GameObjects)
	export class NPCs {
		constructor(protected go: NPC, stateStack?: StateStack) {
			GameObjects.call(this, go, stateStack);
		}

		async walk(direction: Direction, amount = 1) {
			for (let i = 0; i < amount; i++) await this.go.walk(direction);
		}
	}
}


export default CommandSuite;