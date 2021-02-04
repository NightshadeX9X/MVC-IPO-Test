import GameEvent, { GameEventData, GameEventType } from "../../classes/game_events/GameEvent.js";
import DelayState from "../../classes/states/DelayState.js";
import FadeState from "../../classes/states/FadeState.js";
import TextBoxState from "../../classes/states/TextBoxState.js";
import Vector from "../../classes/Vector.js";
import { delay } from "../../Util.js";

export default {
	type: GameEventType.NPC,
	imageURL: `/assets/images/people/player.png`,
	async onInteract(this: GameEvent) {
		console.log(this.disabled)
		if (this.disabled || !this.roamState) return;
		this.disabled = true;

		const tbs = new TextBoxState(this.roamState.stateStack, `Hello there fellow trainer! You like a lot like me...\nInteresting... you know, just for that, I'll heal your pokemon. Yeah, really!`)
		this.roamState.stateStack.push(tbs);
		await tbs.pop();
		if (this.roamState.stateStack.game.party.isFullyHealed()) {
			const tbs2 = new TextBoxState(this.roamState.stateStack, `Wait a minute..! Your party is already healed! Get outta here!`)!
			this.roamState.stateStack.push(tbs2);
			await tbs2.pop();
			this.roamState.stateStack.push(new DelayState(this.roamState.stateStack, 30));
			await this.roamState.stateStack.fromTop().pop();
			await this.roamState.stateStack.push(new FadeState(this.roamState.stateStack));
			await delay(500);
			this.roamState.player.pos.add(2)
			this.roamState.player.camera.pos = Vector.from(this.roamState.player.pos.prod(this.roamState.tileSize));
			await this.roamState.stateStack.fromTop().pop();
		} else {

			this.roamState.stateStack.game.party.heal();
			this.roamState.stateStack.push(new DelayState(this.roamState.stateStack, 120));
			await this.roamState.stateStack.fromTop().pop()
			const tbs2 = new TextBoxState(this.roamState.stateStack, `Your pokemon have been healed!`)
			this.roamState.stateStack.push(tbs2);
			await tbs2.pop();
		}

		setTimeout(() => this.disabled = false, 3000);
	}
} as GameEventData