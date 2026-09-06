/** The might levels a hero theme can sit at, in book order. */
export const THEMEBOOK_MIGHTS = ["origin", "adventure", "greatness"] as const;

export type ThemebookMight = (typeof THEMEBOOK_MIGHTS)[number];

/** The themebooks of Legend in the Mist, grouped by might level. */
export const THEMEBOOKS: Record<ThemebookMight, string[]> = {
	origin: [
		"Circumstance",
		"Devotion",
		"Past",
		"People",
		"Personality",
		"Skill or Trade",
		"Trait",
		"Companion",
		"Magic",
		"Possessions",
	],
	adventure: [
		"Duty",
		"Influence",
		"Knowledge",
		"Prodigious Ability",
		"Relic",
		"Uncanny Being",
		"Companion",
		"Magic",
		"Possessions",
	],
	greatness: [
		"Destiny",
		"Dominion",
		"Mastery",
		"Monstrosity",
		"Companion",
		"Magic",
		"Possessions",
	],
};

/** Every themebook name, whatever its might level, without duplicates. */
export const ALL_THEMEBOOKS: string[] = THEMEBOOK_MIGHTS.reduce<string[]>(
	(all, might) => {
		for (const themebook of THEMEBOOKS[might]) {
			if (all.indexOf(themebook) === -1) {
				all.push(themebook);
			}
		}

		return all;
	},
	[],
);

export interface RandomThemebook {
	might: ThemebookMight;
	themebook: string;
}

/** Seed an insertion template with a plausible themebook. */
export function pickRandomThemebook(): RandomThemebook {
	const might =
		THEMEBOOK_MIGHTS[Math.floor(Math.random() * THEMEBOOK_MIGHTS.length)];
	const themebooks = THEMEBOOKS[might];

	return {
		might,
		themebook: themebooks[Math.floor(Math.random() * themebooks.length)],
	};
}
