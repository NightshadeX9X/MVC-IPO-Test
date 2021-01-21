export default class PokemonMove {
    constructor(type, damage) {
        this.type = type;
        this.damage = damage;
    }
    getDamageDoneTo(attacker, defender) {
        return this.damage + attacker.stats.Atk - defender.stats.Def;
    }
}
