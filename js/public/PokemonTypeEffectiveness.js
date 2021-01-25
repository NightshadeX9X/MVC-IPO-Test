import { PokemonTypes } from "./classes/PokemonSpecies.js";
const typeEffectiveness = {
    NORMAL: {
        WEAK_TO: ["FIGHTING"],
        IMMUNE_TO: ["GHOST"]
    },
    FIGHTING: {
        WEAK_TO: ["PSYCHIC", "FLYING", "FAIRY"],
        RESISTS: ["BUG", "DARK", "ROCK"],
    },
    FIRE: {
        WEAK_TO: ["WATER", "GROUND", "ROCK"],
        RESISTS: ["FIRE", "GRASS", "ICE", "BUG", "FAIRY", "STEEL"]
    },
    WATER: {
        WEAK_TO: ["GRASS", "ELECTRIC"],
        RESISTS: ["FIRE", "WATER", "ICE", "STEEL"]
    },
    GRASS: {
        WEAK_TO: ["FIRE", "ICE", "BUG", "POISON", "FLYING"],
        RESISTS: ["GRASS", "WATER", "GROUND", "DARK"]
    },
    ELECTRIC: {
        WEAK_TO: ["GROUND"],
        RESISTS: ["FLYING", "ELECTRIC", "STEEL"]
    },
    ICE: {
        WEAK_TO: ["FIRE", "FIGHTING", "ROCK", "STEEL"],
        RESISTS: ["FLYING", "ELECTRIC", "STEEL"]
    },
    GROUND: {
        WEAK_TO: ["GRASS", "ICE", "WATER"],
        RESISTS: ["ROCK", "POISON"],
        IMMUNE_TO: ["ELECTRIC"]
    },
    POISON: {
        WEAK_TO: ["PSYCHIC", "GROUND"],
        RESISTS: ["GRASS", "BUG", "FIGHTING", "FAIRY", "POISON"],
    },
    FLYING: {
        WEAK_TO: ["ELECTRIC", "ICE", "ROCK"],
        RESISTS: ["GRASS", "BUG", "FIGHTING"],
        IMMUNE_TO: ["GROUND"]
    },
    PSYCHIC: {
        WEAK_TO: ["DARK", "GHOST", "BUG"],
        RESISTS: ["FIGHTING", "PSYCHIC"],
    },
    BUG: {
        WEAK_TO: ["FLYING", "FIRE", "ROCK"],
        RESISTS: ["GROUND", "GRASS", "FIGHTING"],
    },
    ROCK: {
        WEAK_TO: ["FIGHTING", "STEEL", "GROUND", "GRASS", "WATER"],
        RESISTS: ["NORMAL", "FIRE", "POISON", "FLYING"],
    },
    GHOST: {
        WEAK_TO: ["DARK", "GHOST"],
        RESISTS: ["BUG", "POISON", "FIRE"],
        IMMUNE_TO: ["NORMAL", "FIGHTING"]
    },
    DRAGON: {
        WEAK_TO: ["ICE", "DRAGON", "FAIRY"],
        RESISTS: ["FIRE", "WATER", "GRASS", "ELECTRIC"],
    },
    DARK: {
        WEAK_TO: ["FIGHTING", "BUG", "FAIRY"],
        RESISTS: ["GHOST", "DARK"],
        IMMUNE_TO: ["PSYCHIC"]
    },
    STEEL: {
        WEAK_TO: ["FIGHTING", "FIRE", "GROUND"],
        RESISTS: ["GRASS", "ICE", "NORMAL", "FLYING", "FAIRY", "DRAGON", "BUG", "STEEL", "ROCK", "PSYCHIC"],
        IMMUNE_TO: ["POISON"]
    },
    FAIRY: {
        WEAK_TO: ["POISON", "STEEL"],
        RESISTS: ["DARK", "FIGHTING", "BUG"],
        IMMUNE_TO: ["DRAGON"]
    },
};
export var TypeRelation;
(function (TypeRelation) {
    TypeRelation[TypeRelation["WEAK_TO"] = 2] = "WEAK_TO";
    TypeRelation[TypeRelation["NEUTRAL"] = 1] = "NEUTRAL";
    TypeRelation[TypeRelation["RESISTS"] = 0.5] = "RESISTS";
    TypeRelation[TypeRelation["IMMUNE_TO"] = 0] = "IMMUNE_TO";
})(TypeRelation || (TypeRelation = {}));
export function calcTypeEffectiveness(attacking, defender) {
    let multiplier = 1;
    let att = PokemonTypes[attacking];
    defender.forEach(d => {
        if (!d)
            return;
        const typeName = PokemonTypes[d];
        const eff = typeEffectiveness[typeName];
        if (eff) {
            if (eff.WEAK_TO?.includes(att))
                multiplier *= 2;
            if (eff.RESISTS?.includes(att))
                multiplier *= 0.5;
            if (eff.IMMUNE_TO?.includes(att))
                multiplier *= 0;
        }
    });
    return multiplier;
}
export default typeEffectiveness;
