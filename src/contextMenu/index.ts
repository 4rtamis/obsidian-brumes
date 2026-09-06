import { Editor, EventRef, Menu } from "obsidian";
import type BrumesPlugin from "../BrumesPlugin";
import {
	contributeBlockInsertions,
	hasBlockInsertions,
} from "../features/blocks/registry";
import {
	contributeTagInsertion,
	hasTagInsertion,
} from "../features/tags/contextMenu";
import {
	contributeCalloutInsertions,
	getAvailableCalloutInsertions,
} from "../features/callouts/contextMenu";
import { getOrCreateBrumesSubmenu } from "../utils/contextSubMenu";

export function registerBrumesContextMenu(plugin: BrumesPlugin): EventRef {
	return plugin.app.workspace.on(
		"editor-menu",
		(menu: Menu, editor: Editor) => {
			const hasAnyItems =
				hasTagInsertion(plugin.settings) ||
				getAvailableCalloutInsertions(plugin.settings).length > 0 ||
				hasBlockInsertions(plugin.settings);

			if (!hasAnyItems) {
				return;
			}

			const submenu = getOrCreateBrumesSubmenu(menu);
			let hasItems = false;

			const tagItems = contributeTagInsertion(
				submenu,
				editor,
				plugin.settings,
			);
			hasItems = tagItems > 0;

			if (getAvailableCalloutInsertions(plugin.settings).length > 0 && hasItems) {
				submenu.addSeparator();
			}
			const calloutItems = contributeCalloutInsertions(
				submenu,
				editor,
				plugin.settings,
			);
			hasItems = hasItems || calloutItems > 0;

			if (hasBlockInsertions(plugin.settings) && hasItems) {
				submenu.addSeparator();
			}
			hasItems =
				contributeBlockInsertions(submenu, editor, plugin.settings) > 0 ||
				hasItems;
		},
	);
}
