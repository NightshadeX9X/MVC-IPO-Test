export default class Party {
    constructor() {
        this.pokemon = [];
    }
    get head() {
        return this.pokemon[0];
    }
    set head(value) {
        const pokemon = Array.from(this.pokemon);
        const index = this.pokemon.indexOf(value);
        if (index === -1)
            return;
        const creature = this.pokemon[index];
        pokemon.splice(index, 1);
        this.pokemon = [creature, ...pokemon];
    }
    heal() {
        this.pokemon.forEach(p => {
            p.heal();
        });
    }
    usable() {
        return this.pokemon.some(p => p.canBattle());
    }
    onlyUsable() {
        let p = new Party();
        p.pokemon = this.pokemon.filter(p => p.canBattle());
        return p;
    }
    isFullyHealed() {
        return this.pokemon.every(p => p.stats.HP === p.maxHP);
    }
}
