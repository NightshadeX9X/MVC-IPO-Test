export default class PokemonSpecies {
    constructor(name, displayName, types) {
        this.name = name;
        this.displayName = displayName;
        this.types = types;
        this.stats = generateEmptyStats();
        PokemonSpecies.list.set(name, this);
    }
    static async load(loader, name) {
        const json = await loader.loadJSON(`/json/species/${name}.json`);
        const types = json.types.map(t => {
            if (t === undefined)
                return t;
            return PokemonTypes[t];
        });
        const species = new PokemonSpecies(json.name, json.displayName, types);
        species.stats = json.stats;
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
export var PokemonTypes;
(function (PokemonTypes) {
    PokemonTypes[PokemonTypes["NORMAL"] = 0] = "NORMAL";
    PokemonTypes[PokemonTypes["FIGHTING"] = 1] = "FIGHTING";
    PokemonTypes[PokemonTypes["FIRE"] = 2] = "FIRE";
    PokemonTypes[PokemonTypes["WATER"] = 3] = "WATER";
    PokemonTypes[PokemonTypes["GRASS"] = 4] = "GRASS";
    PokemonTypes[PokemonTypes["ELECTRIC"] = 5] = "ELECTRIC";
    PokemonTypes[PokemonTypes["ICE"] = 6] = "ICE";
    PokemonTypes[PokemonTypes["GROUND"] = 7] = "GROUND";
    PokemonTypes[PokemonTypes["ROCK"] = 8] = "ROCK";
    PokemonTypes[PokemonTypes["STEEL"] = 9] = "STEEL";
    PokemonTypes[PokemonTypes["FAIRY"] = 10] = "FAIRY";
    PokemonTypes[PokemonTypes["DRAGON"] = 11] = "DRAGON";
    PokemonTypes[PokemonTypes["DARK"] = 12] = "DARK";
    PokemonTypes[PokemonTypes["GHOST"] = 13] = "GHOST";
    PokemonTypes[PokemonTypes["BUG"] = 14] = "BUG";
    PokemonTypes[PokemonTypes["POISON"] = 15] = "POISON";
    PokemonTypes[PokemonTypes["FLYING"] = 16] = "FLYING";
    PokemonTypes[PokemonTypes["PSYCHIC"] = 17] = "PSYCHIC";
})(PokemonTypes || (PokemonTypes = {}));
export var PokemonStat;
(function (PokemonStat) {
    PokemonStat[PokemonStat["HP"] = 0] = "HP";
    PokemonStat[PokemonStat["Atk"] = 1] = "Atk";
    PokemonStat[PokemonStat["Def"] = 2] = "Def";
    PokemonStat[PokemonStat["SpA"] = 3] = "SpA";
    PokemonStat[PokemonStat["SpD"] = 4] = "SpD";
    PokemonStat[PokemonStat["Spe"] = 5] = "Spe";
})(PokemonStat || (PokemonStat = {}));
