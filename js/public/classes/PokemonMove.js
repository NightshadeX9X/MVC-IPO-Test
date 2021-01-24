import { calcTypeEffectiveness } from '../PokemonTypeEffectiveness.js';
import { random } from '../Util.js';
export default class PokemonMove {
    constructor(name, displayName, type, damage) {
        this.name = name;
        this.displayName = displayName;
        this.type = type;
        this.damage = damage;
        this.priority = 0;
        if (this.name === "thunderbolt")
            this.priority = 2;
        PokemonMove.list.set(name, this);
    }
    getDamageDoneTo(attacker, defender) {
        let multiplier = random(85, 100, false) / 100;
        let typeEff = calcTypeEffectiveness(this.type, defender.species.types);
        let amount = Math.ceil((this.damage + attacker.stats.Atk - defender.stats.Def) * multiplier * attacker.level / defender.level * typeEff);
        return amount > 1 ? amount : 1;
    }
}
PokemonMove.list = new Map();
