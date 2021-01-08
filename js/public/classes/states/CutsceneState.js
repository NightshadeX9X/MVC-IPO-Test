import { fps } from "../../index.js";
import { delay, Direction } from "../../Util.js";
import RoamState from "./RoamState.js";
import State from "./State.js";
export default class CutsceneState extends State {
    constructor(stateStack, roamState, activationMethods, steps) {
        super(stateStack);
        this.stateStack = stateStack;
        this.roamState = roamState;
        this.activationMethods = activationMethods;
        this.steps = steps;
        this.stepNumber = 0;
    }
    get completed() {
        return this.stepNumber >= this.steps.length;
    }
    async executeNextStep() {
        const step = this.steps[this.stepNumber];
        if (step.type === "delay") {
            if (step.delayMs)
                await delay(step.delayMs);
            if (step.delayFrames) {
                const ms = step.delayFrames / fps * 1000;
                await delay(Math.round(ms));
            }
        }
        else if (step.type === "push_state") {
            if (step.stateName === "RoamState") {
                // @ts-ignore
                this.stateStack.push(new RoamState(this.stateStack, ...step.params));
            }
        }
        else if (step.type === "move_player") {
            this.roamState.player.pos = step.coords;
            this.roamState.gameMapName = step.mapName;
            await this.roamState.loadCurrentMap();
        }
        this.stepNumber++;
    }
    async executeAllSteps() {
        for (const step of this.steps) {
            await this.executeNextStep();
        }
    }
    async preload(loader) {
    }
    get shouldActivate() {
        const methods = this.activationMethods;
        let answer = false;
        methods.forEach(method => {
            if (method.type === "move_to_tile") {
                let player = this.roamState.player;
                method.tiles.forEach(tile => {
                    tile.coords.forEach(coord => {
                        if (player.pos.x === coord.x - 1 && player.facing === Direction.RIGHT) {
                            answer = true;
                        }
                        if (player.pos.x === coord.x + 1 && player.facing === Direction.LEFT) {
                            answer = true;
                        }
                        if (player.pos.x === coord.y - 1 && player.facing === Direction.DOWN) {
                            answer = true;
                        }
                        if (player.pos.x === coord.y + 1 && player.facing === Direction.UP) {
                            answer = true;
                        }
                    });
                });
            }
        });
        return answer;
    }
    update(input) {
        if (this.completed) {
            this.stateStack.pop();
            return;
        }
        if (this.shouldActivate) {
            this.executeAllSteps();
        }
    }
    render(renderer) {
    }
}
