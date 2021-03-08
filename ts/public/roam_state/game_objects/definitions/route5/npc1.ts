import Loader from "../../../../core/Loader.js";
import BlankState from "../../../../states/BlankState.js";
import DelayState from "../../../../states/DelayState.js";
import InputState from "../../../../states/InputState.js";
import RoamState from "../../../../states/RoamState.js";
import TextBoxState from "../../../../states/TextBoxState.js";
import CommandSuite from "../../../../util/Commands.js";
import Direction from "../../../../util/Direction.js";
import { Parents, random } from "../../../../util/functions.js";
import { ArgsType } from "../../../../util/types.js";
import Vector from "../../../../util/Vector.js";
import NPC from "../../types/NPC.js";


interface npc1 extends NPC {

}
@Parents(NPC)
class npc1 {
	variables = {
		interactionCount: 0
	}
	constructor(public roamState: RoamState) {
		NPC.call(this, roamState);
		this.pos = new Vector(7, 20);


	}
	async onInteract() {
		const cmds = new CommandSuite.NPCs(this);

		await cmds.preparePlayer();

		if (this.variables.interactionCount >= 1) {
			await cmds.showText("I'm sorry, but you can only take the survey once.");
			await cmds.unpreparePlayer();
			return;
		}

		await cmds.showText("%%Hello %%there ]! Would you %%like to take part in a %%survey ]?");
		const confirmPartake = await cmds.collectUserInput("Would you like to take part in a survey?", /^(yes|y|no|n)$/i)
		let willPartake = (confirmPartake.answer?.startsWith("y"));

		if (!willPartake) {
			await cmds.showText("Oh... That's too bad.");
			await cmds.unpreparePlayer();
			return;
		}
		await cmds.showText("Great!");
		await cmds.showText("Just hold on while I go and get my papers!");

		await cmds.walk(Direction.RIGHT, 4);
		await cmds.walk(Direction.UP, 11);

		await cmds.delay(120);

		await cmds.walk(Direction.DOWN, 11);
		await cmds.walk(Direction.LEFT, 4);

		this.faceWalker();

		await cmds.showText("Alright, let's begin!");

		const dogOrCat = await cmds.collectUserInput("Do you prefer dogs or cats?", /^(dog|cat)s?$/i);
		const rowletOrLitten = await cmds.collectUserInput("Do you prefer rowlets or littens?", /^(rowlet|litten)s?$/i);
		const color = await cmds.collectUserInput("What is your favorite color?");
		const movie = await cmds.collectUserInput("What is your favorite movie?");

		await cmds.showText(`Thank you! Your answers were ${dogOrCat.answer}, ${rowletOrLitten.answer}, ${color.answer} and ${movie.answer}`);

		this.variables.interactionCount++;

		await cmds.unpreparePlayer();
	}
}


export default npc1;