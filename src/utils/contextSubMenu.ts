import { Menu, MenuItem } from "obsidian";

type MenuItemWithSubmenu = MenuItem & {
	setSubmenu(): Menu;
};

function hasSubmenu(item: MenuItem): item is MenuItemWithSubmenu {
	return typeof (item as Partial<MenuItemWithSubmenu>).setSubmenu === "function";
}

function createSubmenu(item: MenuItem): Menu {
	if (!hasSubmenu(item)) {
		throw new Error("Brumes submenu API is not available in this Obsidian build.");
	}

	return item.setSubmenu();
}

export function getOrCreateBrumesSubmenu(menu: Menu): Menu {
	let brumesSubmenu: Menu | null = null;

	menu.addItem((item: MenuItem) => {
		item.setTitle("Brumes").setIcon("dices").setSection("selection");
		brumesSubmenu = createSubmenu(item);
	});

	if (!brumesSubmenu) {
		throw new Error("Failed to create the Brumes submenu.");
	}

	return brumesSubmenu;
}
