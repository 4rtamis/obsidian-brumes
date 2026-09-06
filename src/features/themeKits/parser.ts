import { ALL_THEMEBOOKS } from "../blocks/themebooks";

export interface ThemeKitImprovement {
	name: string;
	effect?: string;
}

export interface ThemeKitData {
	category?: string;
	name: string;
	powerTags: string[];
	weaknessTags: string[];
	quest?: string;
	improvement?: ThemeKitImprovement;
}

const QUEST_PREFIX = "quest:";
const IMPROVEMENT_PREFIX = "improvement:";
const EFFECT_SEPARATOR = " > ";
const TAG_PATTERN = /\{(!?)([^}]*)\}/g;

/** A themebook name, whatever its casing, opens the kit. */
function readCategory(line: string): string | undefined {
	const candidate = line.trim().toLowerCase();

	for (const themebook of ALL_THEMEBOOKS) {
		if (themebook.toLowerCase() === candidate) {
			return themebook;
		}
	}

	return undefined;
}

function collectTags(
	line: string,
	powerTags: string[],
	weaknessTags: string[],
): void {
	TAG_PATTERN.lastIndex = 0;
	let match = TAG_PATTERN.exec(line);

	while (match !== null) {
		const tag = match[2].trim();

		if (tag) {
			if (match[1] === "!") {
				weaknessTags.push(tag);
			} else {
				powerTags.push(tag);
			}
		}

		match = TAG_PATTERN.exec(line);
	}
}

export function parseThemeKit(source: string): ThemeKitData | null {
	const lines = source
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line.length > 0);

	if (lines.length === 0) {
		return null;
	}

	const category = readCategory(lines[0]);
	const rest = category === undefined ? lines : lines.slice(1);
	const powerTags: string[] = [];
	const weaknessTags: string[] = [];

	let name: string | undefined;
	let quest: string | undefined;
	let improvement: ThemeKitImprovement | undefined;

	for (const line of rest) {
		const lowered = line.toLowerCase();

		if (lowered.startsWith(QUEST_PREFIX)) {
			quest = line.slice(QUEST_PREFIX.length).trim();
			continue;
		}

		if (lowered.startsWith(IMPROVEMENT_PREFIX)) {
			const body = line.slice(IMPROVEMENT_PREFIX.length).trim();
			const index = body.indexOf(EFFECT_SEPARATOR);

			improvement =
				index === -1
					? { name: body }
					: {
							name: body.slice(0, index).trim(),
							effect: body
								.slice(index + EFFECT_SEPARATOR.length)
								.trim(),
						};
			continue;
		}

		if (line.indexOf("{") !== -1) {
			collectTags(line, powerTags, weaknessTags);
			continue;
		}

		// The first plain line left is the kit name.
		if (name === undefined) {
			name = line;
		}
	}

	if (name === undefined || powerTags.length === 0) {
		return null;
	}

	return { category, name, powerTags, weaknessTags, quest, improvement };
}
