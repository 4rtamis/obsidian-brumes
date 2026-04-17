import type BrumesPlugin from "../../BrumesPlugin";
import { parseStoryTheme } from "./parser";
import { renderStoryTheme } from "./renderer";
import { logScope } from "../../utils/logger";

const log = logScope("StoryTheme");

export function loadStoryThemesFeature(plugin: BrumesPlugin) {
	plugin.registerMarkdownCodeBlockProcessor(
		"story-theme",
		async (source, el, ctx) => {
			if (
				plugin.settings.mode !== "legend-in-the-mist" ||
				!plugin.settings.features.storyThemeParser
			) {
				const pre = document.createElement("pre");
				const code = document.createElement("code");
				code.className = "language-story-theme";
				code.textContent = source;
				pre.appendChild(code);
				el.appendChild(pre);
				return;
			}

			const parsed = parseStoryTheme(source);

			if (!parsed) {
				log.warn("Invalid story theme block in file", ctx.sourcePath);
				const error = document.createElement("pre");
				error.textContent = "Invalid story-theme block.";
				el.appendChild(error);
				return;
			}

			log.debug("Rendering story theme:", parsed);
			const rendered = renderStoryTheme(parsed);
			el.appendChild(rendered);
		},
	);
}
