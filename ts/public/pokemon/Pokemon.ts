namespace Pokemon {
	export interface Stats {
		HP: number;
		Atk: number;
		Def: number;
		SpA: number;
		SpD: number;
		Spe: number;
	}
	export namespace Stats {
		export function empty() {
			return {
				HP: 0,
				Atk: 0,
				Def: 0,
				SpA: 0,
				SpD: 0,
				Spe: 0,
			} as Stats;
		}
	}


	export enum Type {
		NORMAL,
		FIRE,
		WATER,
		ELECTRIC,
		GRASS,
		ICE,
		FIGHTING,
		POISON,
		GROUND,
		FLYING,
		PSYCHIC,
		BUG,
		ROCK,
		GHOST,
		DRAGON,
		DARK,
		STEEL,
		FAIRY
	}
	export namespace Type {
		export type AsString = keyof Omit<typeof Type, "EffectivenessRelation" | "calcEffectiveness">;
		export enum EffectivenessRelation {
			NO_EFFECT = 0,
			NOT_VERY_EFFECTIVE = 0.5,
			NEUTRAL = 1,
			SUPER_EFFECTIVE = 2
		}
		const effectivenessTable: {
			[k in Type.AsString]: {
				[k in keyof typeof EffectivenessRelation]?: Type.AsString[]
			}
		} = {
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
		}
		export function calcEffectiveness(attacker: Type, defenderTypes: [Type, Type?]) {
			function calcOnSingleDefendingType(attacker: Type, defender: Type) {
				const effectiveness = effectivenessTable[Type[defender] as Type.AsString];
				console.log(effectiveness);
				// console.log(attacker, defender);

				let eff = EffectivenessRelation.NEUTRAL;
				(["NO_EFFECT", "NOT_VERY_EFFECTIVE", "SUPER_EFFECTIVE"] as const).forEach(relStr => {
					if (effectiveness?.[relStr]?.includes(Type[attacker] as Type.AsString)) {
						eff = EffectivenessRelation[relStr];
					}
				})

				return eff;

			}
			return defenderTypes.reduce((acc, curr) => calcOnSingleDefendingType(attacker, curr as any) * acc, 1);
		}
	}
}
export default Pokemon;