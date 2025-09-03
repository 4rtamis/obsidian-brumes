import { App, Menu, Editor, MenuItem, MarkdownView } from "obsidian";
import { contributeStoryTheme } from "../features/storyThemes/contextMenu";
import { contributeTagInsertion } from "../features/tags/contextMenu";
import { contributeCalloutInsertions } from "../features/callouts/contextMenu";

export function registerBrumesContextMenu(app: App) {
	app.workspace.on(
		"editor-menu",
		(menu: Menu, editor: Editor, view: MarkdownView) => {
			menu.addItem((subMenuItem: MenuItem) => {
				subMenuItem
					.setTitle("Brumes")
					.setIcon("dices")
					.setSection("selection");

				// @ts-ignore - setSubmenu is not typed
				const submenu = subMenuItem.setSubmenu();

				contributeTagInsertion(submenu, editor);
				contributeCalloutInsertions(submenu, editor);
				contributeStoryTheme(submenu, editor);
			});
		},
	);
}
