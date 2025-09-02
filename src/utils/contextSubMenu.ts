import { Menu, MenuItem, Editor } from "obsidian";

export function getOrCreateBrumesSubmenu(menu: Menu, editor: Editor): Menu {
	let brumesSubmenu: Menu | null = null;

	menu.addItem((item: MenuItem) => {
		item.setTitle("Brumes").setIcon("dices").setSection("selection");

		// @ts-ignore
		brumesSubmenu = item.setSubmenu();
	});

	return brumesSubmenu!;
}
