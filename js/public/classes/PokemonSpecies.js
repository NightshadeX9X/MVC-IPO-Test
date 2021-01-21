export default class PokemonSpecies {
    constructor(name, types) {
        this.name = name;
        this.types = types;
        this.stats = generateEmptyStats();
        PokemonSpecies.list.set(name, this);
    }
    async sprite() {
    }
}
PokemonSpecies.list = new Map();
export function generateEmptyStats() {
    let stats = {
        HP: 0,
        Atk: 0,
        Def: 0,
        SpA: 0,
        SpD: 0,
        Spe: 0
    };
    return stats;
}
export var PokemonType;
(function (PokemonType) {
    PokemonType[PokemonType["NORMAL"] = 0] = "NORMAL";
    PokemonType[PokemonType["FIGHTING"] = 1] = "FIGHTING";
    PokemonType[PokemonType["FIRE"] = 2] = "FIRE";
    PokemonType[PokemonType["WATER"] = 3] = "WATER";
    PokemonType[PokemonType["GRASS"] = 4] = "GRASS";
    PokemonType[PokemonType["ELECTRIC"] = 5] = "ELECTRIC";
    PokemonType[PokemonType["ICE"] = 6] = "ICE";
    PokemonType[PokemonType["GROUND"] = 7] = "GROUND";
    PokemonType[PokemonType["ROCK"] = 8] = "ROCK";
    PokemonType[PokemonType["STEEL"] = 9] = "STEEL";
    PokemonType[PokemonType["FAIRY"] = 10] = "FAIRY";
    PokemonType[PokemonType["DRAGON"] = 11] = "DRAGON";
    PokemonType[PokemonType["DARK"] = 12] = "DARK";
    PokemonType[PokemonType["GHOST"] = 13] = "GHOST";
    PokemonType[PokemonType["BUG"] = 14] = "BUG";
    PokemonType[PokemonType["POISON"] = 15] = "POISON";
    PokemonType[PokemonType["FLYING"] = 16] = "FLYING";
    PokemonType[PokemonType["PSYCHIC"] = 17] = "PSYCHIC";
})(PokemonType || (PokemonType = {}));
export var PokemonStat;
(function (PokemonStat) {
    PokemonStat[PokemonStat["HP"] = 0] = "HP";
    PokemonStat[PokemonStat["Atk"] = 1] = "Atk";
    PokemonStat[PokemonStat["Def"] = 2] = "Def";
    PokemonStat[PokemonStat["SpA"] = 3] = "SpA";
    PokemonStat[PokemonStat["SpD"] = 4] = "SpD";
    PokemonStat[PokemonStat["Spe"] = 5] = "Spe";
})(PokemonStat || (PokemonStat = {}));
