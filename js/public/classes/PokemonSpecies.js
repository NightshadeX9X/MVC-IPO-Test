export default class PokemonSpecies {
    constructor(name, typeComb, imageUrl, baseStats) {
        this.name = name;
        this.typeComb = typeComb;
        this.imageUrl = imageUrl;
        this.baseStats = baseStats;
        this.image = null;
    }
    async loadImage(loader) {
        this.image = await loader.image(this.imageUrl);
        return this.image;
    }
}
PokemonSpecies.list = [];
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
    PokemonType[PokemonType["FLYING"] = 8] = "FLYING";
    PokemonType[PokemonType["BUG"] = 9] = "BUG";
    PokemonType[PokemonType["ROCK"] = 10] = "ROCK";
    PokemonType[PokemonType["POISON"] = 11] = "POISON";
    PokemonType[PokemonType["PSYCHIC"] = 12] = "PSYCHIC";
    PokemonType[PokemonType["STEEL"] = 13] = "STEEL";
    PokemonType[PokemonType["GHOST"] = 14] = "GHOST";
    PokemonType[PokemonType["DRAGON"] = 15] = "DRAGON";
    PokemonType[PokemonType["FAIRY"] = 16] = "FAIRY";
    PokemonType[PokemonType["DARK"] = 17] = "DARK";
})(PokemonType || (PokemonType = {}));
