export type BrumesMode =
	| "city-of-mist"
	| "otherscape"
	| "legend-in-the-mist";

export type LogLevel = "none" | "error" | "warn" | "info" | "debug";

export interface BrumesFeatureSettings {
	tagsSyntax: boolean;
	lanternIntegration: boolean;
	storyThemeParser: boolean;
	challengeParser: boolean;
}

export interface CityOfMistCalloutAliases {
	note: string[];
	move: string[];
	description: string[];
	clue: string[];
	redClue: string[];
}

export interface LegendInTheMistCalloutAliases {
	note: string[];
	readAloud: string[];
}

export interface BrumesCalloutAliasesSettings {
	cityOfMist: CityOfMistCalloutAliases;
	legendInTheMist: LegendInTheMistCalloutAliases;
}

export interface BrumesSettings {
	mode: BrumesMode;
	logLevel: LogLevel;
	lanternUrl: string;
	features: BrumesFeatureSettings;
	calloutAliases: BrumesCalloutAliasesSettings;
}

export const DEFAULT_CITY_OF_MIST_CALLOUT_ALIASES: CityOfMistCalloutAliases = {
	note: ["note", "aside"],
	move: ["move"],
	description: ["description", "read-aloud"],
	clue: ["clue"],
	redClue: ["red-clue"],
};

export const DEFAULT_LEGEND_IN_THE_MIST_CALLOUT_ALIASES: LegendInTheMistCalloutAliases =
	{
		note: ["note"],
		readAloud: ["read-aloud"],
	};

export const DEFAULT_SETTINGS: BrumesSettings = {
	mode: "city-of-mist",
	logLevel: "error",
	lanternUrl: "https://lantern.ravenloft.fr",
	features: {
		tagsSyntax: true,
		lanternIntegration: true,
		storyThemeParser: true,
		challengeParser: true,
	},
	calloutAliases: {
		cityOfMist: DEFAULT_CITY_OF_MIST_CALLOUT_ALIASES,
		legendInTheMist: DEFAULT_LEGEND_IN_THE_MIST_CALLOUT_ALIASES,
	},
};

const LOG_LEVELS: LogLevel[] = ["none", "error", "warn", "info", "debug"];

export function sanitizeAlias(alias: string): string {
	return alias
		.trim()
		.toLowerCase()
		.replace(/^\[!?\s*/, "")
		.replace(/\]\s*$/, "")
		.replace(/^!\s*/, "")
		.replace(/\s+/g, "-");
}

export function sanitizeAliases(aliases: string[]): string[] {
	const unique = new Set<string>();

	for (const alias of aliases) {
		const sanitized = sanitizeAlias(alias);
		if (!sanitized) {
			continue;
		}

		unique.add(sanitized);
	}

	return Array.from(unique);
}

export function normalizeMode(mode: unknown): BrumesMode {
	if (mode === ":otherscape" || mode === "otherscape") {
		return "otherscape";
	}

	if (
		mode === "city-of-mist" ||
		mode === "legend-in-the-mist"
	) {
		return mode;
	}

	return DEFAULT_SETTINGS.mode;
}

function normalizeLogLevel(level: unknown): LogLevel {
	if (typeof level === "string" && LOG_LEVELS.includes(level as LogLevel)) {
		return level as LogLevel;
	}

	return DEFAULT_SETTINGS.logLevel;
}

function normalizeAliasList(
	value: unknown,
	fallback: string[],
): string[] {
	if (!Array.isArray(value)) {
		return [...fallback];
	}

	return sanitizeAliases(value.map(String));
}

/**
 * Keep every declared feature flag, defaulting the ones the saved data misses.
 * Adding a flag to `BrumesFeatureSettings` and `DEFAULT_SETTINGS` is enough.
 */
function normalizeFeatures(
	features: Partial<BrumesFeatureSettings>,
): BrumesFeatureSettings {
	const normalized = { ...DEFAULT_SETTINGS.features };
	const keys = Object.keys(normalized) as (keyof BrumesFeatureSettings)[];

	for (const key of keys) {
		const value = features[key];

		if (typeof value === "boolean") {
			normalized[key] = value;
		}
	}

	return normalized;
}

export function normalizeSettings(
	data: Partial<BrumesSettings> | null | undefined,
): BrumesSettings {
	const source = data ?? {};
	const features: Partial<BrumesFeatureSettings> = source.features ?? {};
	const calloutAliases: Partial<BrumesCalloutAliasesSettings> =
		source.calloutAliases ?? {};
	const cityOfMist: Partial<CityOfMistCalloutAliases> =
		calloutAliases.cityOfMist ?? {};
	const legendInTheMist: Partial<LegendInTheMistCalloutAliases> =
		calloutAliases.legendInTheMist ?? {};

	return {
		mode: normalizeMode(source.mode),
		logLevel: normalizeLogLevel(source.logLevel),
		lanternUrl:
			typeof source.lanternUrl === "string"
				? source.lanternUrl.trim() || DEFAULT_SETTINGS.lanternUrl
				: DEFAULT_SETTINGS.lanternUrl,
		features: normalizeFeatures(features),
		calloutAliases: {
			cityOfMist: {
				note: normalizeAliasList(
					cityOfMist.note,
					DEFAULT_CITY_OF_MIST_CALLOUT_ALIASES.note,
				),
				move: normalizeAliasList(
					cityOfMist.move,
					DEFAULT_CITY_OF_MIST_CALLOUT_ALIASES.move,
				),
				description: normalizeAliasList(
					cityOfMist.description,
					DEFAULT_CITY_OF_MIST_CALLOUT_ALIASES.description,
				),
				clue: normalizeAliasList(
					cityOfMist.clue,
					DEFAULT_CITY_OF_MIST_CALLOUT_ALIASES.clue,
				),
				redClue: normalizeAliasList(
					cityOfMist.redClue,
					DEFAULT_CITY_OF_MIST_CALLOUT_ALIASES.redClue,
				),
			},
			legendInTheMist: {
				note: normalizeAliasList(
					legendInTheMist.note,
					DEFAULT_LEGEND_IN_THE_MIST_CALLOUT_ALIASES.note,
				),
				readAloud: normalizeAliasList(
					legendInTheMist.readAloud,
					DEFAULT_LEGEND_IN_THE_MIST_CALLOUT_ALIASES.readAloud,
				),
			},
		},
	};
}
