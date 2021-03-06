var Pokemon;
(function (Pokemon) {
    var Stats;
    (function (Stats) {
        function empty() {
            return {
                HP: 0,
                Atk: 0,
                Def: 0,
                SpA: 0,
                SpD: 0,
                Spe: 0,
            };
        }
        Stats.empty = empty;
    })(Stats = Pokemon.Stats || (Pokemon.Stats = {}));
    var Type;
    (function (Type) {
        Type[Type["NORMAL"] = 0] = "NORMAL";
        Type[Type["FIRE"] = 1] = "FIRE";
        Type[Type["WATER"] = 2] = "WATER";
        Type[Type["ELECTRIC"] = 3] = "ELECTRIC";
        Type[Type["GRASS"] = 4] = "GRASS";
        Type[Type["ICE"] = 5] = "ICE";
        Type[Type["FIGHTING"] = 6] = "FIGHTING";
        Type[Type["POISON"] = 7] = "POISON";
        Type[Type["GROUND"] = 8] = "GROUND";
        Type[Type["FLYING"] = 9] = "FLYING";
        Type[Type["PSYCHIC"] = 10] = "PSYCHIC";
        Type[Type["BUG"] = 11] = "BUG";
        Type[Type["ROCK"] = 12] = "ROCK";
        Type[Type["GHOST"] = 13] = "GHOST";
        Type[Type["DRAGON"] = 14] = "DRAGON";
        Type[Type["DARK"] = 15] = "DARK";
        Type[Type["STEEL"] = 16] = "STEEL";
        Type[Type["FAIRY"] = 17] = "FAIRY";
    })(Type = Pokemon.Type || (Pokemon.Type = {}));
    (function (Type) {
        var EffectivenessRelation;
        (function (EffectivenessRelation) {
            EffectivenessRelation[EffectivenessRelation["NO_EFFECT"] = 0] = "NO_EFFECT";
            EffectivenessRelation[EffectivenessRelation["NOT_VERY_EFFECTIVE"] = 0.5] = "NOT_VERY_EFFECTIVE";
            EffectivenessRelation[EffectivenessRelation["NEUTRAL"] = 1] = "NEUTRAL";
            EffectivenessRelation[EffectivenessRelation["SUPER_EFFECTIVE"] = 2] = "SUPER_EFFECTIVE";
        })(EffectivenessRelation = Type.EffectivenessRelation || (Type.EffectivenessRelation = {}));
        var effectivenessTable = {
            NORMAL: {
                NO_EFFECT: ["GHOST"],
                SUPER_EFFECTIVE: ["FIGHTING"],
            },
            FIRE: {
                NOT_VERY_EFFECTIVE: ["FIRE", "GRASS", "BUG", "ICE", "STEEL", "FAIRY"],
                SUPER_EFFECTIVE: ["WATER", "GROUND", "ROCK"],
            },
            WATER: {
                NOT_VERY_EFFECTIVE: ["FIRE", "WATER", "ICE", "STEEL"],
                SUPER_EFFECTIVE: ["GRASS", "ELECTRIC"],
            },
            ELECTRIC: {
                NOT_VERY_EFFECTIVE: ["ELECTRIC", "FLYING", "STEEL"],
                SUPER_EFFECTIVE: ["GROUND"],
            },
            GRASS: {
                NOT_VERY_EFFECTIVE: ["ELECTRIC", "GRASS", "WATER", "DARK"],
                SUPER_EFFECTIVE: ["FIRE", "BUG", "ICE", "POISON", "FLYING"],
            },
            ICE: {
                NOT_VERY_EFFECTIVE: ["ICE", "FAIRY"],
                SUPER_EFFECTIVE: ["FIRE", "STEEL", "ROCK", "FIGHTING"],
            },
            FIGHTING: {
                NOT_VERY_EFFECTIVE: ["DARK", "ROCK", "BUG"],
                SUPER_EFFECTIVE: ["FLYING", "PSYCHIC", "FAIRY"],
            },
            POISON: {
                NOT_VERY_EFFECTIVE: ["GRASS", "FAIRY", "FIGHTING", "BUG", "POISON"],
                SUPER_EFFECTIVE: ["GROUND", "PSYCHIC"],
            },
            GROUND: {
                NO_EFFECT: ["ELECTRIC"],
                NOT_VERY_EFFECTIVE: ["POISON", "ROCK"],
                SUPER_EFFECTIVE: ["WATER", "GRASS", "ICE"],
            },
            FLYING: {
                NO_EFFECT: ["GROUND"],
                NOT_VERY_EFFECTIVE: ["GRASS", "BUG", "FIGHTING"],
                SUPER_EFFECTIVE: ["ROCK", "ELECTRIC", "ICE"],
            },
            PSYCHIC: {
                NOT_VERY_EFFECTIVE: ["PSYCHIC", "FIGHTING"],
                SUPER_EFFECTIVE: ["DARK", "BUG", "GHOST"],
            },
            BUG: {
                NOT_VERY_EFFECTIVE: ["GRASS", "FIGHTING", "GROUND"],
                SUPER_EFFECTIVE: ["FIRE", "ROCK", "FLYING"],
            },
            ROCK: {
                NOT_VERY_EFFECTIVE: ["NORMAL", "FLYING", "POISON", "FIRE"],
                SUPER_EFFECTIVE: ["FIGHTING", "STEEL", "WATER", "GRASS"],
            },
            GHOST: {
                NO_EFFECT: ["NORMAL", "FIGHTING"],
                NOT_VERY_EFFECTIVE: ["BUG", "POISON", "FIRE"],
                SUPER_EFFECTIVE: ["DARK", "GHOST"],
            },
            DRAGON: {
                NOT_VERY_EFFECTIVE: ["FIRE", "WATER", "GRASS", "ELECTRIC"],
                SUPER_EFFECTIVE: ["ICE", "DRAGON", "FAIRY"],
            },
            DARK: {
                NO_EFFECT: ["PSYCHIC"],
                NOT_VERY_EFFECTIVE: ["DARK", "GHOST"],
                SUPER_EFFECTIVE: ["FIGHTING", "FAIRY", "BUG"],
            },
            STEEL: {
                NO_EFFECT: ["POISON"],
                NOT_VERY_EFFECTIVE: ["GRASS", "ROCK", "ICE", "FAIRY", "FLYING", "DRAGON", "BUG", "STEEL", "PSYCHIC", "NORMAL"],
                SUPER_EFFECTIVE: ["FIGHTING", "FIRE", "GROUND"],
            },
            FAIRY: {
                NO_EFFECT: ["DRAGON"],
                NOT_VERY_EFFECTIVE: ["FIGHTING", "DARK", "BUG"],
                SUPER_EFFECTIVE: ["STEEL", "POISON"],
            },
        };
        function calcEffectiveness(attacker, defenderTypes) {
            function calcOnSingleDefendingType(attacker, defender) {
                var effectiveness = effectivenessTable[Type[defender]];
                console.log(effectiveness);
                // console.log(attacker, defender);
                var eff = EffectivenessRelation.NEUTRAL;
                ["NO_EFFECT", "NOT_VERY_EFFECTIVE", "SUPER_EFFECTIVE"].forEach(function (relStr) {
                    var _a;
                    if ((_a = effectiveness === null || effectiveness === void 0 ? void 0 : effectiveness[relStr]) === null || _a === void 0 ? void 0 : _a.includes(Type[attacker])) {
                        eff = EffectivenessRelation[relStr];
                    }
                });
                return eff;
            }
            return defenderTypes.reduce(function (acc, curr) { return calcOnSingleDefendingType(attacker, curr) * acc; }, 1);
        }
        Type.calcEffectiveness = calcEffectiveness;
    })(Type = Pokemon.Type || (Pokemon.Type = {}));
})(Pokemon || (Pokemon = {}));
export default Pokemon;
