import Game from "./Game.js";
import State from "./State.js";
abstract class StateStack<TParent extends StateStack.Parent = StateStack.Parent> {
	game: Game = null as any;
	parent: TParent = null as any;
	states: State[] = null as any;
	static construct<TParent extends StateStack.Parent = StateStack.Parent>(this: StateStack, game: Game, parent: TParent) {
		this.game = game;
		this.parent = parent;
		this.states = [];
		return this;
	}
}

namespace StateStack {
	export type Parent = Game | State;
}

export default StateStack;