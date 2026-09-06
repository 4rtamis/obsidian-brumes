import { Editor, Menu, MenuItem } from "obsidian";
import type BrumesPlugin from "../../BrumesPlugin";
import { BrumesSettings } from "../../settings/types";
import { logScope } from "../../utils/logger";
import { renderRawBlock } from "./fallback";
import { BrumesBlock, blockIds, isBlockEnabled } from "./types";
import { challengeBlock } from "../challenges/block";
import { journeyBlock } from "../journeys/block";
import { storyThemeBlock } from "../storyThemes/block";

const log = logScope("Blocks");

/** Every fenced block Brumes knows. Adding a format means adding a line here. */
export const BRUMES_BLOCKS: BrumesBlock<unknown>[] = [
	storyThemeBlock,
	challengeBlock,
	journeyBlock,
];

/** Deprecated ids already reported, so an alias warns once per session. */
const warnedAliases = new Set<string>();

export function loadBrumesBlocks(plugin: BrumesPlugin): void {
	for (const block of BRUMES_BLOCKS) {
		for (const id of blockIds(block)) {
			plugin.registerMarkdownCodeBlockProcessor(id, (source, el, ctx) => {
				if (id !== block.id && !warnedAliases.has(id)) {
					warnedAliases.add(id);
					log.warn(
						`The "${id}" block is deprecated, use "${block.id}" instead.`,
					);
				}

				if (!isBlockEnabled(block, plugin.settings)) {
					renderRawBlock(source, el, id);
					return;
				}

				const parsed = block.parse(source);

				if (parsed === null) {
					log.warn(`Invalid ${id} block in file`, ctx.sourcePath);
					const error = el.doc.createElement("pre");
					error.textContent = `Invalid ${id} block.`;
					el.appendChild(error);
					return;
				}

				log.debug(`Rendering ${id}:`, parsed);
				el.appendChild(block.render(parsed, el.doc));
			});
		}
	}
}

export function hasBlockInsertions(settings: BrumesSettings): boolean {
	return BRUMES_BLOCKS.some((block) => isBlockEnabled(block, settings));
}

export function contributeBlockInsertions(
	menu: Menu,
	editor: Editor,
	settings: BrumesSettings,
): number {
	let added = 0;

	for (const block of BRUMES_BLOCKS) {
		if (!isBlockEnabled(block, settings)) {
			continue;
		}

		menu.addItem((item: MenuItem) =>
			item
				.setTitle(block.label)
				.setIcon(block.icon)
				.onClick(() =>
					editor.replaceRange(block.template(), editor.getCursor()),
				),
		);
		added++;
	}

	return added;
}
