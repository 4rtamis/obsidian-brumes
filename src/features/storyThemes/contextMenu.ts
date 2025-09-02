import { Menu, Editor, MenuItem } from "obsidian";

export function contributeStoryTheme(menu: Menu, editor: Editor) {
	menu.addItem((item: MenuItem) =>
		item
			.setTitle("Story theme")
			.setIcon("file-plus")
			.onClick(() => insertStoryThemeTemplate(editor)),
	);
}

// Full themebook list by Might
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
