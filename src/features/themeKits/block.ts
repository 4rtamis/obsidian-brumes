import { BrumesBlock } from "../blocks/types";
import { pickRandomThemebook } from "../blocks/themebooks";
import { ThemeKitData, parseThemeKit } from "./parser";
import { renderThemeKit } from "./renderer";

function themeKitTemplate(): string {
	const { themebook } = pickRandomThemebook();

	return [
		"```litm-theme-kit",
		themebook,
		"Kit name",
		"{power tag} {power tag} {power tag}",
		"{!weakness tag} {!weakness tag}",
		"quest: What the hero is after.",
		"improvement: Improvement name > What it grants.",
		"```",
		"",
	].join("\n");
}

export const themeKitBlock: BrumesBlock<ThemeKitData> = {
	id: "litm-theme-kit",
	mode: "legend-in-the-mist",
	flag: "themeKitParser",
	label: "Theme kit",
	icon: "book-open",
	parse: parseThemeKit,
	render: renderThemeKit,
	template: themeKitTemplate,
};
