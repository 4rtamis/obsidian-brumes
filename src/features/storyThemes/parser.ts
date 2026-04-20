export type StoryThemeLevel = "origin" | "adventure" | "greatness" | "standard";

export interface StoryThemeData {
	level: StoryThemeLevel;
	category?: string;
	titleTag: string;
	powerTags: string[];
	weaknessTags: string[];
	rawLines: string[];
}

const VALID_LEVELS = ["origin", "adventure", "greatness"];

/**
 * Parse the content of a ```story-theme code block
 */
export function parseStoryTheme(source: string): StoryThemeData | null {
	const lines = source
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line.length > 0);

	if (lines.length === 0) return null;

	let level: StoryThemeLevel = "standard";
	let category: string | undefined;
	let tagStartIndex = 0;

	// Detect level
	if (VALID_LEVELS.includes(lines[0].toLowerCase())) {
		level = lines[0].toLowerCase() as StoryThemeLevel;
		tagStartIndex = 1;
	}

	// Detect category
	if (lines[tagStartIndex] && !lines[tagStartIndex].startsWith("{")) {
		category = lines[tagStartIndex];
		tagStartIndex++;
	}

	const tagLines = lines.slice(tagStartIndex);
	const powerTags: string[] = [];
	const weaknessTags: string[] = [];

	let titleTag: string | undefined;

	for (const line of tagLines) {
		if (line.startsWith("{!") && line.endsWith("}")) {
			weaknessTags.push(line.slice(2, -1).trim());
		} else if (line.startsWith("{") && line.endsWith("}")) {
			const tag = line.slice(1, -1).trim();
			if (!titleTag) {
				titleTag = tag;
			} else {
				powerTags.push(tag);
			}
		}
	}

	if (!titleTag) return null;

	return {
		level,
		category,
		titleTag,
		powerTags,
		weaknessTags,
		rawLines: lines,
	};
}
