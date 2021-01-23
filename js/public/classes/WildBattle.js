export default class WildBattle {
    constructor(party, wild) {
        this.party = party;
        this.wild = wild;
        this.wild.stats.HP = this.wild.maxHP;
    }
}
