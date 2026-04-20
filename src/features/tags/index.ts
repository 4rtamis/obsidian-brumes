import type BrumesPlugin from "../../BrumesPlugin";
import { brumesPostProcessor } from "./postProcessor";
import { brumesEditorExtension } from "./editorExtension";

/**
 * Registers tag highlighting and decoration features.
 */
export function loadTagFeature(plugin: BrumesPlugin) {
	plugin.registerEditorExtension(
		brumesEditorExtension(() => plugin.settings.features.tagsSyntax),
	);
	plugin.registerMarkdownPostProcessor(
		brumesPostProcessor(() => plugin.settings.features.tagsSyntax),
	);
}
