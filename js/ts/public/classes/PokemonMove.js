import { calcTypeEffectiveness } from '../PokemonTypeEffectiveness.js';
import { random } from '../Util.js';
export default class PokemonMove {
    constructor(name, displayName, type, damage, category = MoveCategory.PHYSICAL) {
        this.name = name;
        this.displayName = displayName;
        this.type = type;
        this.damage = damage;
        this.category = category;
        this.priority = 0;
        PokemonMove.list.set(name, this);
    }
    static async load(loader, name) {
        const imp = await loader.loadJS(`/js/moves/${name}.js`);
        const moveData = imp.default;
        const move = new PokemonMove(moveData.name, moveData.displayName, moveData.type, moveData.damage);
        move.priority = Number(moveData.priority);
        move.category = moveData.category;
        console.log(moveData);
    }
    getDamageDoneTo(attacker, defender) {
        if (this.category === MoveCategory.STATUS)
            return 0;
        const attackingStat = this.category === MoveCategory.PHYSICAL ? attacker.stats.Atk : attacker.stats.SpA;
        const defendingStat = this.category === MoveCategory.PHYSICAL ? defender.stats.Def : defender.stats.SpD;
        let damage = ((2 * attacker.level / 5 + 2) * this.damage * attackingStat / defendingStat / 50 + 2);
        let te = calcTypeEffectiveness(this.type, defender.species.types);
        let rand = random(85, 100) / 100;
        let STAB = attacker.species.types.includes(this.type) ? 1.5 : 1;
        let multiplier = te * rand * STAB;
        return Math.floor(damage * multiplier);
    }
}
PokemonMove.list = new Map();
export var MoveCategory;
(function (MoveCategory) {
    MoveCategory[MoveCategory["PHYSICAL"] = 0] = "PHYSICAL";
    MoveCategory[MoveCategory["SPECIAL"] = 1] = "SPECIAL";
    MoveCategory[MoveCategory["STATUS"] = 2] = "STATUS";
})(MoveCategory || (MoveCategory = {}));
