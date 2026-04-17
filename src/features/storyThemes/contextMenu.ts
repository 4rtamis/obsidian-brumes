import { Menu, Editor, MenuItem } from "obsidian";
import { BrumesSettings } from "../../settings/types";

export function hasStoryThemeInsertion(settings: BrumesSettings): boolean {
	return (
		settings.mode === "legend-in-the-mist" &&
		settings.features.storyThemeParser
	);
}

export function contributeStoryTheme(
	menu: Menu,
	editor: Editor,
	settings: BrumesSettings,
): number {
	if (!hasStoryThemeInsertion(settings)) {
		return 0;
	}

	menu.addItem((item: MenuItem) =>
		item
			.setTitle("Story theme")
			.setIcon("file-plus")
			.onClick(() => insertStoryThemeTemplate(editor)),
	);

	return 1;
}

const THEMEBOOKS: Record<string, string[]> = {
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

export function insertStoryThemeTemplate(editor: Editor) {
	const mights = ["origin", "adventure", "greatness"] as const;
	const randomMight = mights[Math.floor(Math.random() * mights.length)];

	const themes = THEMEBOOKS[randomMight];
	const randomTheme = themes[Math.floor(Math.random() * themes.length)];

	const template = [
		"```story-theme",
		randomMight,
		randomTheme.toLowerCase(),
		"{Title Tag}",
		"{power tag}",
		"{power tag}",
		"{!weakness tag}",
		"```",
		"",
	].join("\n");

	editor.replaceRange(template, editor.getCursor());
}
