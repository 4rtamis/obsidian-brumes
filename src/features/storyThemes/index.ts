import { Plugin } from "obsidian";
import { parseStoryTheme } from "./parser";
import { renderStoryTheme } from "./renderer";
import { logScope } from "../../utils/logger";

const log = logScope("StoryTheme");

export function loadStoryThemesFeature(plugin: Plugin) {
	plugin.registerMarkdownCodeBlockProcessor(
		"story-theme",
		async (source, el, ctx) => {
			const parsed = parseStoryTheme(source);

			if (!parsed) {
				log.warn("Invalid story theme block in file", ctx.sourcePath);
				const error = document.createElement("pre");
				error.textContent = "⚠️ Invalid story-theme block.";
				el.appendChild(error);
				return;
			}

			log.debug("Rendering story theme:", parsed);
			const rendered = renderStoryTheme(parsed);
			el.appendChild(rendered);
		},
	);
}
