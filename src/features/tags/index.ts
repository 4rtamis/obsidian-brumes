import { Plugin } from "obsidian";
import { brumesPostProcessor } from "./postProcessor";
import { brumesEditorExtension } from "./editorExtension";

/**
 * Registers tag highlighting and decoration features.
 */
export function loadTagFeature(plugin: Plugin) {
	plugin.registerEditorExtension(brumesEditorExtension());
	plugin.registerMarkdownPostProcessor(brumesPostProcessor);
}
