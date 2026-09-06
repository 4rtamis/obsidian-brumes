import { BrumesBlock } from "../blocks/types";
import { pickRandomThemebook } from "../blocks/themebooks";
import { StoryThemeData, parseStoryTheme } from "./parser";
import { renderStoryTheme } from "./renderer";

function storyThemeTemplate(): string {
	const { might, themebook } = pickRandomThemebook();

	return [
		"```story-theme",
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

export const storyThemeBlock: BrumesBlock<StoryThemeData> = {
	id: "story-theme",
	mode: "legend-in-the-mist",
	flag: "storyThemeParser",
	label: "Story theme",
	icon: "file-plus",
	parse: parseStoryTheme,
	render: renderStoryTheme,
	template: storyThemeTemplate,
};
