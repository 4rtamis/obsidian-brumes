import { BrumesBlock } from "../blocks/types";
import { pickRandomThemebook } from "../blocks/themebooks";
import { ThemeCardData, parseThemeCard } from "./parser";
import { renderThemeCard } from "./renderer";

function themeCardTemplate(): string {
	const { might, themebook } = pickRandomThemebook();

	return [
		"```theme-card",
		might,
		themebook.toLowerCase(),
		"{Title Tag}",
		"{power tag}",
		"{power tag}",
		"{!weakness tag}",
		"```",
		"",
	].join("\n");
}

export const themeCardBlock: BrumesBlock<ThemeCardData> = {
	id: "theme-card",
	aliases: ["story-theme"],
	mode: "legend-in-the-mist",
	flag: "storyThemeParser",
	label: "Theme card",
	icon: "file-plus",
	parse: parseThemeCard,
	render: renderThemeCard,
	template: themeCardTemplate,
};
